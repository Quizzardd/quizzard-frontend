import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { chatService } from '@/services/chatService';
import type { ISendMessagePayload, IChatResponse } from '@/types';
import toast from 'react-hot-toast';
import { useState, useCallback, useMemo } from 'react';
import { useAuth } from './useAuth';

interface IChatMessage {
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const useChat = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Session ID state (could also be persisted via React Query)
  const [sessionId, setSessionId] = useState<string | undefined>(() => {
    return localStorage.getItem('chatSessionId') || undefined;
  });

  const clearSessionState = useCallback(() => {
    setSessionId(undefined);
    localStorage.removeItem('chatSessionId');
    queryClient.removeQueries({ queryKey: ['chatHistory'] });
  }, [queryClient]);

  // Fetch chat history when sessionId exists
  const { data: historyData, isLoading: isLoadingHistory } = useQuery({
    queryKey: ['chatHistory', sessionId, user?._id],
    queryFn: () => chatService.getChatHistory(sessionId!, user!._id),
    enabled: !!sessionId && !!user?._id,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
    retry: false, // Don't retry if session doesn't exist yet
  });

  // Derive messages from query data instead of managing separate state
  const messages = useMemo<IChatMessage[]>(() => {
    // Try to get the latest sessionId (could be in state or just set in cache)
    const currentSessionId = sessionId || localStorage.getItem('chatSessionId') || undefined;

    console.log('🔍 Computing messages for sessionId:', currentSessionId);
    console.log('📊 History data exists:', !!historyData);
    console.log('📊 History data sessions:', historyData?.sessions?.length);

    if (!currentSessionId) {
      console.log('⚠️ No sessionId available yet');
      return [];
    }

    // If we don't have query data yet, try to get it from the cache directly
    let sessionsData = historyData;
    if (!sessionsData?.success || !sessionsData.sessions) {
      console.log('🔄 No query data, checking cache directly...');
      const cachedData = queryClient.getQueryData(['chatHistory', currentSessionId, user?._id]);
      console.log('💾 Cached data:', JSON.stringify(cachedData, null, 2));
      sessionsData = cachedData as typeof historyData;
    }

    if (!sessionsData?.success || !sessionsData.sessions) {
      console.log('⚠️ No sessions data available');
      return [];
    }

    // Find the current session from the sessions array
    const currentSession = sessionsData.sessions.find((s) => s.id === currentSessionId);

    if (!currentSession) {
      console.log('⚠️ Session not found in data, searching all sessions...');
      console.log(
        'Available sessions:',
        sessionsData.sessions.map((s) => s.id),
      );
      return [];
    }

    console.log('✅ Found session with', currentSession.turns.length, 'turns');

    const loadedMessages: IChatMessage[] = [];

    currentSession.turns.forEach((turn) => {
      // Add user message if exists
      if (turn.user) {
        // Handle both string and object text formats
        const userContent =
          typeof turn.user.text === 'string'
            ? turn.user.text
            : turn.user.text.message || JSON.stringify(turn.user.text);

        loadedMessages.push({
          content: userContent,
          sender: 'user',
          timestamp: new Date(turn.user.timestamp * 1000), // Convert seconds to milliseconds
        });
      }

      // Add agent/bot message if exists
      if (turn.agent) {
        loadedMessages.push({
          content: turn.agent.text,
          sender: 'bot',
          timestamp: new Date(turn.agent.timestamp * 1000), // Convert seconds to milliseconds
        });
      }
    });

    console.log('💬 Total messages:', loadedMessages.length);
    return loadedMessages;
  }, [historyData, sessionId, user?._id, historyData?.sessions, isLoadingHistory]);

  // Send message mutation with optimistic updates
  const sendMessageMutation = useMutation({
    mutationFn: (payload: ISendMessagePayload) => chatService.sendMessage(payload),

    // Optimistically add user message to UI
    onMutate: async (variables) => {
      const hasSessionInVariables = Object.prototype.hasOwnProperty.call(variables, 'sessionId');
      const targetSessionId = hasSessionInVariables ? variables.sessionId : sessionId;

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ['chatHistory', targetSessionId, user?._id],
      });

      // Snapshot the previous value
      const previousHistory = queryClient.getQueryData(['chatHistory', targetSessionId, user?._id]);

      // Only do optimistic update if we have an existing session
      // For new sessions, wait for the server response to avoid duplicates
      if (targetSessionId) {
        queryClient.setQueryData(['chatHistory', targetSessionId, user?._id], (old: any) => {
          if (!old?.sessions) return old;

          // Find and update the current session
          const updatedSessions = old.sessions.map((session: any) => {
            if (session.id === targetSessionId) {
              return {
                ...session,
                turns: [
                  ...session.turns,
                  {
                    user: {
                      text: variables.message,
                      timestamp: Date.now() / 1000, // Convert to seconds
                    },
                  },
                ],
              };
            }
            return session;
          });

          return {
            ...old,
            sessions: updatedSessions,
          };
        });
      }

      // Return context with snapshot
      return { previousHistory };
    },

    onSuccess: (data: IChatResponse, variables) => {
      console.log('✅ Response received:', data);
      console.log('📦 Full response object:', JSON.stringify(data, null, 2));

      // Check if response is an error
      if (
        typeof data.response === 'object' &&
        'code' in data.response &&
        'message' in data.response
      ) {
        console.error('❌ Backend returned error:', data.response);

        // If session doesn't belong to user, clear it and start fresh
        if (data.response.code === 498) {
          setSessionId(undefined);
          localStorage.removeItem('chatSessionId');
          toast.error('Session expired. Please try again.');
          return;
        }

        const errorMessage =
          typeof data.response.message === 'string' ? data.response.message : 'An error occurred';
        toast.error(errorMessage);
        return;
      }

      // IMPORTANT: Store sessionId FIRST before updating cache
      // This ensures the messages useMemo can find it when recomputing
      if (data.sessionId) {
        console.log('🆕 New session created:', data.sessionId);
        localStorage.setItem('chatSessionId', data.sessionId);
        setSessionId(data.sessionId);
      }

      // Extract bot response
      let botContent: string;
      let botTimestamp: Date;

      if (typeof data.response === 'string') {
        botContent = data.response;
        botTimestamp = new Date(data.timestamp || Date.now());
      } else if ('content' in data.response) {
        botContent = data.response.content;
        botTimestamp = new Date(data.response.timestamp || data.timestamp || Date.now());
      } else {
        console.error('❌ Unexpected response format:', data.response);
        return;
      }

      console.log('🤖 Bot content:', botContent);

      // Update cache with bot response
      const targetSessionId = data.sessionId || variables.sessionId || sessionId;

      console.log('🔑 Updating cache for sessionId:', targetSessionId);
      console.log('👤 User ID:', user?._id);

      queryClient.setQueryData(['chatHistory', targetSessionId, user?._id], (old: any) => {
        console.log('📝 Old cache data:', JSON.stringify(old, null, 2));

        if (!old?.sessions) {
          // Create new sessions array structure if it doesn't exist
          // For new sessions, only add the agent response since user message is handled by optimistic update
          const newData = {
            success: true,
            userId: user?._id || '',
            sessions: [
              {
                id: targetSessionId,
                lastUpdateTime: Date.now() / 1000,
                turns: [
                  {
                    user: {
                      text: typeof variables.message === 'string' ? variables.message : variables,
                      timestamp: Date.now() / 1000,
                    },
                    agent: {
                      text: botContent,
                      timestamp: botTimestamp.getTime() / 1000,
                    },
                  },
                ],
              },
            ],
          };
          console.log('✨ Creating new cache data:', JSON.stringify(newData, null, 2));
          return newData;
        }

        // Find the current session or create it
        const sessionIndex = old.sessions.findIndex((s: any) => s.id === targetSessionId);

        if (sessionIndex === -1) {
          // Add new session - this happens when backend creates a new session
          // Only add the complete turn since there was no optimistic update for new sessions
          const updatedData = {
            ...old,
            sessions: [
              ...old.sessions,
              {
                id: targetSessionId,
                lastUpdateTime: Date.now() / 1000,
                turns: [
                  {
                    user: {
                      text: typeof variables.message === 'string' ? variables.message : variables,
                      timestamp: Date.now() / 1000,
                    },
                    agent: {
                      text: botContent,
                      timestamp: botTimestamp.getTime() / 1000,
                    },
                  },
                ],
              },
            ],
          };
          console.log('➕ Added new session:', JSON.stringify(updatedData, null, 2));
          return updatedData;
        }

        // Update existing session - user message should already be there from optimistic update
        const updatedSessions = [...old.sessions];
        const currentSession = { ...updatedSessions[sessionIndex] };
        const updatedTurns = [...currentSession.turns];
        const lastTurn = updatedTurns[updatedTurns.length - 1];

        // Check if the last turn already has the user message from optimistic update
        if (lastTurn && lastTurn.user && !lastTurn.agent) {
          // Just add the agent response to the existing turn
          lastTurn.agent = {
            text: botContent,
            timestamp: botTimestamp.getTime() / 1000,
          };
          console.log('✏️ Updated last turn with agent response');
        } else {
          // This shouldn't happen normally, but handle it just in case
          updatedTurns.push({
            agent: {
              text: botContent,
              timestamp: botTimestamp.getTime() / 1000,
            },
          });
          console.log('➕ Added new turn with agent response only');
        }

        currentSession.turns = updatedTurns;
        currentSession.lastUpdateTime = Date.now() / 1000;
        updatedSessions[sessionIndex] = currentSession;

        const updatedData = {
          ...old,
          sessions: updatedSessions,
        };

        console.log('✅ Updated cache data:', JSON.stringify(updatedData, null, 2));
        return updatedData;
      });

      // Force a re-render by invalidating the query
      queryClient.invalidateQueries({
        queryKey: ['chatHistory', targetSessionId, user?._id],
      });
    },

    onError: (error: Error, variables, context) => {
      console.error('❌ Mutation error:', error);

      // Rollback on error
      if (context?.previousHistory) {
        queryClient.setQueryData(
          ['chatHistory', variables.sessionId ?? sessionId, user?._id],
          context.previousHistory,
        );
      }

      toast.error('Failed to send message', {
        description: error.message || 'Please try again',
      });
    },
  });

  /**
   * 
   * {
    "message": "10",
    "selectedModules": [
        {
            "id": "691fa62959731e84b70ee6dd",
            "title": "Module 1"
        }
    ],
    "userId": "691fa23caf8b1a472014834f",
    "groupId": "691fa454af8b1a4720148360",
    "educatorName": "Dr/ Peter Joseph"
}
   */

  const sendMessage = useCallback(
    (
      message: string,
      groupId?: string,
      educatorName?: string,
      selectedModules?: Array<{ id: string; title: string }>,
      options?: { resetSession?: boolean },
    ) => {
      if (!user?._id) {
        console.error('❌ User not authenticated');
        toast.error('User not authenticated');
        return;
      }

      const shouldResetSession = options?.resetSession === true;

      if (shouldResetSession) {
        clearSessionState();
      }

      // Get latest sessionId from localStorage to ensure it's always included
      const storedSessionId = localStorage.getItem('chatSessionId') || undefined;
      const currentSessionId = shouldResetSession ? undefined : sessionId || storedSessionId;

      console.log('📤 Sending message with sessionId:', currentSessionId);
      console.log('📦 Payload extras:', { message, groupId, educatorName, selectedModules });

      // Build payload
      const payload: ISendMessagePayload = {
        message,
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

  const startNewConversation = useCallback(() => {
    clearSessionState();
    toast.success('New conversation started');
  }, [clearSessionState]);

  // Debug: log whenever messages, sessionId, or historyData changes
  console.log('🔄 useChat return values:', {
    messagesCount: messages.length,
    sessionId,
    hasHistoryData: !!historyData,
    isLoadingHistory,
  });

  return {
    messages,
    sessionId,
    sendMessage,
    isSendingMessage: sendMessageMutation.isPending,
    isLoadingHistory,
    startNewConversation,
    // Legacy compatibility
    conversations: [],
    totalConversations: 0,
    isLoadingConversations: false,
    conversationsError: null,
  };
};
