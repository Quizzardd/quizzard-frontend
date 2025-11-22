import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { chatService } from '@/services/chatService';
import type { ISendMessagePayload, IChatResponse } from '@/types';
import toast from 'react-hot-toast';
import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useAuth } from './useAuth';

interface IChatMessage {
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatTurn {
  user?: {
    text: string | { message: string };
    timestamp: number;
  };
  agent?: {
    text: string;
    timestamp: number;
  };
}

interface ChatSession {
  id: string;
  lastUpdateTime: number;
  turns: ChatTurn[];
}

interface ChatHistoryResponse {
  success: boolean;
  userId: string;
  sessions: ChatSession[];
}

// Constants
const CHAT_SESSION_KEY = 'chatSessionId';
const STALE_TIME = 5 * 60 * 1000; // 5 minutes
const GC_TIME = 30 * 60 * 1000; // 30 minutes

// Helper: Safe localStorage operations
const storage = {
  get: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('localStorage.setItem failed:', error);
    }
  },
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('localStorage.removeItem failed:', error);
    }
  },
};

// Helper: Parse user message content
const parseUserContent = (text: string | { message: string }): string => {
  if (typeof text === 'string') return text;
  return text.message || JSON.stringify(text);
};

// Helper: Convert turns to messages
const turnsToMessages = (turns: ChatTurn[]): IChatMessage[] => {
  const messages: IChatMessage[] = [];

  turns.forEach((turn) => {
    if (turn.user) {
      messages.push({
        content: parseUserContent(turn.user.text),
        sender: 'user',
        timestamp: new Date(turn.user.timestamp * 1000),
      });
    }

    if (turn.agent) {
      messages.push({
        content: turn.agent.text,
        sender: 'bot',
        timestamp: new Date(turn.agent.timestamp * 1000),
      });
    }
  });

  return messages;
};

export const useChat = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Single source of truth for sessionId
  const [sessionId, setSessionId] = useState<string | undefined>(
    () => storage.get(CHAT_SESSION_KEY) || undefined,
  );

  // Track pending messages for optimistic UI (for new sessions)
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

  // Track if we're initializing to prevent race conditions
  const isInitializing = useRef(false);

  // Sync sessionId with localStorage
  useEffect(() => {
    if (sessionId) {
      storage.set(CHAT_SESSION_KEY, sessionId);
    } else {
      storage.remove(CHAT_SESSION_KEY);
    }
  }, [sessionId]);

  // Clear session state
  const clearSessionState = useCallback(() => {
    setSessionId(undefined);
    setPendingMessage(null);
    storage.remove(CHAT_SESSION_KEY);
    queryClient.removeQueries({ queryKey: ['chatHistory'] });
  }, [queryClient]);

  // Fetch chat history
  const {
    data: historyData,
    isLoading: isLoadingHistory,
    error: historyError,
  } = useQuery<ChatHistoryResponse>({
    queryKey: ['chatHistory', sessionId, user?._id],
    queryFn: () => chatService.getChatHistory(sessionId!, user!._id),
    enabled: !!sessionId && !!user?._id,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    retry: false,
  });

  // Derive messages from history data + pending message
  const messages = useMemo<IChatMessage[]>(() => {
    const baseMessages: IChatMessage[] = [];

    // Get messages from history if available
    if (sessionId && historyData?.success && historyData.sessions) {
      const currentSession = historyData.sessions.find((s) => s.id === sessionId);

      if (currentSession) {
        baseMessages.push(...turnsToMessages(currentSession.turns));
      }
    }

    // Add pending message for new sessions (optimistic UI)
    if (pendingMessage && !sessionId) {
      baseMessages.push({
        content: pendingMessage,
        sender: 'user',
        timestamp: new Date(),
      });
    }

    return baseMessages;
  }, [historyData, sessionId, pendingMessage]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: (payload: ISendMessagePayload) => chatService.sendMessage(payload),

    onMutate: async (variables) => {
      // Prevent multiple simultaneous initializations
      if (!variables.sessionId && isInitializing.current) {
        throw new Error('Message already being sent');
      }

      if (!variables.sessionId) {
        isInitializing.current = true;
        // Set pending message for optimistic UI
        setPendingMessage(variables.message);
      }

      const targetSessionId = variables.sessionId || sessionId;

      // Only do cache optimistic update for existing sessions
      if (targetSessionId) {
        await queryClient.cancelQueries({
          queryKey: ['chatHistory', targetSessionId, user?._id],
        });

        const previousHistory = queryClient.getQueryData<ChatHistoryResponse>([
          'chatHistory',
          targetSessionId,
          user?._id,
        ]);

        // Optimistically add user message to cache
        queryClient.setQueryData<ChatHistoryResponse>(
          ['chatHistory', targetSessionId, user?._id],
          (old) => {
            if (!old?.sessions) return old;

            return {
              ...old,
              sessions: old.sessions.map((session) =>
                session.id === targetSessionId
                  ? {
                      ...session,
                      turns: [
                        ...session.turns,
                        {
                          user: {
                            text: variables.message,
                            timestamp: Date.now() / 1000,
                          },
                        },
                      ],
                    }
                  : session,
              ),
            };
          },
        );

        return { previousHistory, targetSessionId };
      }

      return { previousHistory: undefined, targetSessionId: undefined };
    },

    onSuccess: (data: IChatResponse, variables, context) => {
      isInitializing.current = false;

      // Handle error responses
      if (
        typeof data.response === 'object' &&
        'code' in data.response &&
        'message' in data.response
      ) {
        console.error('Backend error:', data.response);

        // Clear pending message on error
        setPendingMessage(null);

        // Session expired or invalid
        if (data.response.code === 498) {
          clearSessionState();
          toast.error('Session expired. Starting new conversation.');
          return;
        }

        const errorMessage =
          typeof data.response.message === 'string' ? data.response.message : 'An error occurred';
        toast.error(errorMessage);
        return;
      }

      // Extract bot response
      let botContent: string;
      let botTimestamp: number;

      if (typeof data.response === 'string') {
        botContent = data.response;
        botTimestamp = data.timestamp ? data.timestamp * 1000 : Date.now();
      } else if ('content' in data.response) {
        botContent = data.response.content;
        botTimestamp = (data.response.timestamp || data.timestamp || Date.now() / 1000) * 1000;
      } else {
        console.error('Unexpected response format:', data.response);
        toast.error('Invalid response format from server');
        setPendingMessage(null);
        return;
      }

      const newSessionId = data.sessionId || context?.targetSessionId || sessionId;

      // CRITICAL: Update sessionId state BEFORE updating cache
      // This ensures the useMemo recomputes with the correct sessionId
      if (data.sessionId && data.sessionId !== sessionId) {
        console.log('✅ Setting new sessionId:', data.sessionId);
        setSessionId(data.sessionId);
      }

      // Clear pending message
      setPendingMessage(null);

      // Update cache with complete conversation turn
      // Use the NEW sessionId for the cache key
      const cacheKey = ['chatHistory', newSessionId, user?._id];

      queryClient.setQueryData<ChatHistoryResponse>(cacheKey, (old) => {
        const timestamp = Date.now() / 1000;

        // Create new session structure if needed
        if (!old?.sessions) {
          const newData: ChatHistoryResponse = {
            success: true,
            userId: user?._id || '',
            sessions: [
              {
                id: newSessionId!,
                lastUpdateTime: timestamp,
                turns: [
                  {
                    user: {
                      text: variables.message,
                      timestamp,
                    },
                    agent: {
                      text: botContent,
                      timestamp: botTimestamp / 1000,
                    },
                  },
                ],
              },
            ],
          };
          console.log('✨ Created new cache structure:', newData);
          return newData;
        }

        // Find or create session
        const sessionIndex = old.sessions.findIndex((s) => s.id === newSessionId);

        if (sessionIndex === -1) {
          // Add new session
          console.log('➕ Adding new session to cache');
          return {
            ...old,
            sessions: [
              ...old.sessions,
              {
                id: newSessionId!,
                lastUpdateTime: timestamp,
                turns: [
                  {
                    user: {
                      text: variables.message,
                      timestamp,
                    },
                    agent: {
                      text: botContent,
                      timestamp: botTimestamp / 1000,
                    },
                  },
                ],
              },
            ],
          };
        }

        // Update existing session
        const updatedSessions = [...old.sessions];
        const currentSession = { ...updatedSessions[sessionIndex] };
        const turns = [...currentSession.turns];
        const lastTurn = turns[turns.length - 1];

        // Complete the last turn with agent response
        if (lastTurn?.user && !lastTurn.agent) {
          console.log('✏️ Completing existing turn with agent response');
          lastTurn.agent = {
            text: botContent,
            timestamp: botTimestamp / 1000,
          };
        } else {
          // Fallback: create new turn with both messages
          console.log('➕ Creating new complete turn');
          turns.push({
            user: {
              text: variables.message,
              timestamp,
            },
            agent: {
              text: botContent,
              timestamp: botTimestamp / 1000,
            },
          });
        }

        currentSession.turns = turns;
        currentSession.lastUpdateTime = timestamp;
        updatedSessions[sessionIndex] = currentSession;

        return {
          ...old,
          sessions: updatedSessions,
        };
      });

      console.log('💾 Cache updated successfully for session:', newSessionId);
    },

    onError: (error: Error, variables, context) => {
      isInitializing.current = false;
      setPendingMessage(null);
      console.error('Send message error:', error);

      // Rollback optimistic update
      if (context?.previousHistory && context.targetSessionId) {
        queryClient.setQueryData(
          ['chatHistory', context.targetSessionId, user?._id],
          context.previousHistory,
        );
      }

      toast.error('Failed to send message', {
        description: error.message || 'Please try again',
      });
    },
  });

  // Send message function
  const sendMessage = useCallback(
    (
      message: string,
      groupId?: string,
      educatorName?: string,
      selectedModules?: Array<{ id: string; title: string }>,
      options?: { resetSession?: boolean },
    ) => {
      if (!user?._id) {
        toast.error('Please sign in to continue');
        return;
      }

      if (!message.trim()) {
        toast.error('Message cannot be empty');
        return;
      }

      // Reset session if requested
      if (options?.resetSession) {
        clearSessionState();
      }

      // Determine sessionId to use
      const currentSessionId = options?.resetSession ? undefined : sessionId;

      console.log('📤 Sending message:', {
        hasSession: !!currentSessionId,
        sessionId: currentSessionId,
        message: message.substring(0, 50) + '...',
      });

      const payload: ISendMessagePayload = {
        message: message.trim(),
        userId: user._id,
        sessionId: currentSessionId,
        ...(groupId && { groupId }),
        ...(educatorName && { educatorName }),
        ...(selectedModules && { selectedModules }),
      };

      sendMessageMutation.mutate(payload);
    },
    [sessionId, user?._id, sendMessageMutation, clearSessionState],
  );

  // Start new conversation
  const startNewConversation = useCallback(() => {
    clearSessionState();
    toast.success('New conversation started');
  }, [clearSessionState]);

  return {
    // Core state
    messages,
    sessionId,

    // Actions
    sendMessage,
    startNewConversation,

    // Loading states
    isSendingMessage: sendMessageMutation.isPending,
    isLoadingHistory,

    // Errors
    error: historyError,

    // Legacy compatibility
    conversations: [],
    totalConversations: 0,
    isLoadingConversations: false,
    conversationsError: null,
  };
};
