import { useState, useCallback, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService } from '@/services/chatService';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';
import type { 
  ISendMessagePayload, 
  IChatResponse, 
  IChatHistoryResponse,
  IChatTurn 
} from '@/types';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface ChatMessage {
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface SendMessageOptions {
  resetSession?: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const SESSION_STORAGE_KEY = 'chatSessionId';
const POLL_INTERVAL_MS = 3000;
const MAX_POLL_ATTEMPTS = 15;
const POLL_TIMEOUT_MS = 45000;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Parse user message content - handles both string and object formats
 */
function parseUserContent(text: string | { message: string }): string {
  if (typeof text === 'string') return text;
  if (text && typeof text === 'object' && 'message' in text) {
    return text.message;
  }
  return JSON.stringify(text);
}

/**
 * Convert backend turns into frontend messages
 */
function turnsToMessages(turns: IChatTurn[]): ChatMessage[] {
  const messages: ChatMessage[] = [];

  for (const turn of turns) {
    // Add user message if exists
    if (turn.user) {
      messages.push({
        content: parseUserContent(turn.user.text),
        sender: 'user',
        timestamp: new Date(turn.user.timestamp * 1000),
      });
    }

    // Add agent message if exists
    if (turn.agent) {
      messages.push({
        content: turn.agent.text,
        sender: 'bot',
        timestamp: new Date(turn.agent.timestamp * 1000),
      });
    }
  }

  return messages;
}

/**
 * Safe localStorage operations
 */
const storage = {
  get(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (err) {
      console.error('Failed to save to localStorage:', err);
    }
  },
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.error('Failed to remove from localStorage:', err);
    }
  },
};

// ============================================================================
// MAIN HOOK
// ============================================================================

export function useChat() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // ============================================================================
  // STATE
  // ============================================================================

  const [sessionId, setSessionId] = useState<string | undefined>(() => 
    storage.get(SESSION_STORAGE_KEY) || undefined
  );

  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [latestQuizId, setLatestQuizId] = useState<string | null>(null);
  const onQuizDetectedRef = useRef<((quizId: string) => void) | null>(null);
  const pollingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollCountRef = useRef(0);

  // ============================================================================
  // SYNC SESSION ID WITH LOCALSTORAGE
  // ============================================================================

  useEffect(() => {
    if (sessionId) {
      storage.set(SESSION_STORAGE_KEY, sessionId);
      console.log('💾 Session saved:', sessionId);
    } else {
      storage.remove(SESSION_STORAGE_KEY);
      console.log('🗑️ Session cleared from storage');
    }
  }, [sessionId]);

  // ============================================================================
  // FETCH CHAT HISTORY
  // ============================================================================

  const {
    data: historyData,
    isLoading: isLoadingHistory,
    error: historyError,
  } = useQuery<IChatHistoryResponse>({
    queryKey: ['chatHistory', sessionId, user?._id],
    queryFn: async () => {
      console.log('📡 Fetching history for session:', sessionId);
      const result = await chatService.getChatHistory(sessionId!, user!._id);
      console.log('📥 History received:', result.sessions?.length, 'sessions');
      return result;
    },
    enabled: !!sessionId && !!user?._id,
    staleTime: 0, // Always fetch fresh
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    retry: false,
  });

  // ============================================================================
  // DERIVE MESSAGES FROM HISTORY
  // ============================================================================

  const messages: ChatMessage[] = (() => {
    const baseMessages: ChatMessage[] = [];

    // Get messages from backend if available
    if (historyData?.success && historyData.sessions?.length > 0) {
      const session = historyData.sessions[0];
      if (session && session.id === sessionId && session.turns) {
        const backendMessages = turnsToMessages(session.turns);
        baseMessages.push(...backendMessages);
        console.log('📥 Loaded', backendMessages.length, 'messages from backend');
      }
    }

    // Add pending message for optimistic UI (if not already in backend data)
    if (pendingMessage) {
      // Check if this message is already in backend messages
      const isDuplicate = baseMessages.some(
        msg => msg.sender === 'user' && msg.content === pendingMessage
      );
      
      if (!isDuplicate) {
        baseMessages.push({
          content: pendingMessage,
          sender: 'user',
          timestamp: new Date(),
        });
        console.log('✨ Showing pending message optimistically');
      } else {
        console.log('⏭️ Skipping pending - already in backend');
      }
    }

    console.log('💬 Displaying', baseMessages.length, 'messages');
    return baseMessages;
  })();

  // ============================================================================
  // POLLING MECHANISM
  // ============================================================================

  useEffect(() => {
    if (!isPolling || !sessionId || !user?._id) {
      return;
    }

    console.log('🔄 Starting polling for session:', sessionId);
    pollCountRef.current = 0;

    // Poll function
    const poll = () => {
      pollCountRef.current += 1;
      console.log(`🔄 Poll #${pollCountRef.current}/${MAX_POLL_ATTEMPTS}`);

      queryClient.invalidateQueries({
        queryKey: ['chatHistory', sessionId, user._id],
      });

      // Stop if max polls reached
      if (pollCountRef.current >= MAX_POLL_ATTEMPTS) {
        console.log('⏹️ Max polls reached, stopping');
        setIsPolling(false);
      }
    };

    // Start interval
    pollingIntervalRef.current = setInterval(poll, POLL_INTERVAL_MS);

    // Set timeout to stop polling
    pollingTimeoutRef.current = setTimeout(() => {
      console.log('⏰ Polling timeout, stopping');
      setIsPolling(false);
    }, POLL_TIMEOUT_MS);

    // Cleanup
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current);
        pollingTimeoutRef.current = null;
      }
    };
  }, [isPolling, sessionId, user?._id, queryClient]);

  // Stop polling when bot messages arrive
  useEffect(() => {
    if (isPolling && messages.length > 0) {
      const hasBotMessage = messages.some(msg => msg.sender === 'bot');
      if (hasBotMessage) {
        console.log('✅ Bot message received, stopping poll');
        setIsPolling(false);
      }
    }
  }, [isPolling, messages]);

  // ============================================================================
  // SEND MESSAGE MUTATION
  // ============================================================================

  const sendMessageMutation = useMutation({
    mutationFn: (payload: ISendMessagePayload) => {
      console.log('📤 Sending message:', {
        sessionId: payload.sessionId,
        messagePreview: payload.message.substring(0, 50),
      });
      return chatService.sendMessage(payload);
    },

    onMutate: (variables) => {
      // Show message optimistically
      setPendingMessage(variables.message);
      console.log('✨ Set pending message for optimistic UI');
    },

    onSuccess: (response: IChatResponse) => {
      // Log the full response for debugging
      console.log('📨 Full chat response:', {
        hasQuizId: !!response.quizId,
        quizId: response.quizId,
        quizAction: response.quizAction,
        quizUpdatedAt: response.quizUpdatedAt,
        sessionId: response.sessionId
      });
      
      // Update session ID if new session was created
      if (response.sessionId && response.sessionId !== sessionId) {
        console.log('🆕 New session created:', response.sessionId);
        setSessionId(response.sessionId);
      }

      // Check for quizId in response (non-empty string)
      if (response.quizId && response.quizId.trim() !== '') {
        const action = response.quizAction || 'created';
        const timestamp = response.quizUpdatedAt || Date.now();
        
        console.log('🎯 Quiz detected in response:', response.quizId);
        console.log('🎬 Quiz action:', action);
        console.log('⏰ Quiz timestamp:', timestamp);
        setLatestQuizId(response.quizId);
        
        // Store in sessionStorage for cross-component access
        try {
          sessionStorage.setItem('latestQuizId', response.quizId);
          sessionStorage.setItem('latestQuizAction', action);
          sessionStorage.setItem('latestQuizTimestamp', String(timestamp));
          console.log('💾 Stored quiz data in sessionStorage');
        } catch (err) {
          console.error('Failed to store quiz data in sessionStorage:', err);
        }
        
        // Trigger callback if registered
        if (onQuizDetectedRef.current) {
          console.log('📢 Calling quiz detected callback with quizId:', response.quizId);
          onQuizDetectedRef.current(response.quizId);
        } else {
          console.warn('⚠️ Quiz detected but no callback registered (this is OK - using state instead)');
        }
      } else {
        console.log('ℹ️ No quizId in response (empty or not set)');
        console.log('🔍 Will check for newly created quizzes via polling...');
        // MCP agent creates quiz but doesn't send sessionId, so we poll for it
      }

      // Clear pending message and start polling
      const targetSessionId = response.sessionId || sessionId;
      if (targetSessionId && user?._id) {
        console.log('🔄 Invalidating cache and starting poll');
        console.log('🧹 Clearing pending message');
        setPendingMessage(null);
        
        queryClient.invalidateQueries({
          queryKey: ['chatHistory', targetSessionId, user._id],
        });
        
        // Invalidate AI credits to update token count in navbar
        queryClient.invalidateQueries({
          queryKey: ['ai-credits-remaining'],
        });
        console.log('💰 Invalidated AI credits cache for real-time update');
        
        setIsPolling(true);
      }
    },

    onError: (error: Error) => {
      console.error('❌ Send message failed:', error);
      setPendingMessage(null);
      toast.error('Failed to send message. Please try again.');
    },
  });

  // ============================================================================
  // PUBLIC API - SEND MESSAGE
  // ============================================================================

  const sendMessage = useCallback(
    (
      message: string,
      groupId?: string,
      educatorName?: string,
      selectedModules?: Array<{ id: string; title: string }>,
      options?: SendMessageOptions,
    ) => {
      // Validation
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
        console.log('🔄 Resetting session');
        setSessionId(undefined);
        setIsPolling(false);
        queryClient.removeQueries({ queryKey: ['chatHistory'] });
        // Note: Don't clear pendingMessage here - it will be set by onMutate
      }

      // Determine session ID
      const targetSessionId = options?.resetSession ? undefined : sessionId;

      // Build payload
      const payload: ISendMessagePayload = {
        message: message.trim(),
        userId: user._id,
        sessionId: targetSessionId,
        ...(groupId && { groupId }),
        ...(educatorName && { educatorName }),
        ...(selectedModules && { selectedModules }),
      };

      console.log('📤 Sending message with payload:', {
        hasSessionId: !!targetSessionId,
        sessionId: targetSessionId,
        resetSession: options?.resetSession,
      });

      sendMessageMutation.mutate(payload);
    },
    [user, sessionId, queryClient, sendMessageMutation],
  );

  // ============================================================================
  // PUBLIC API - QUIZ DETECTION
  // ============================================================================

  const setOnQuizDetected = useCallback((callback: ((quizId: string) => void) | null) => {
    console.log('🎯 Setting quiz detected callback:', callback ? 'registered' : 'cleared');
    onQuizDetectedRef.current = callback;
  }, []);

  // ============================================================================
  // PUBLIC API - START NEW CONVERSATION
  // ============================================================================

  const startNewConversation = useCallback(() => {
    console.log('🆕 Starting new conversation');
    setSessionId(undefined);
    setPendingMessage(null);
    setIsPolling(false);
    setLatestQuizId(null);
    queryClient.removeQueries({ queryKey: ['chatHistory'] });
    toast.success('New conversation started');
  }, [queryClient]);

  // ============================================================================
  // RETURN PUBLIC API
  // ============================================================================

  return {
    // Data
    messages,
    sessionId,
    latestQuizId,

    // Actions
    sendMessage,
    startNewConversation,
    setOnQuizDetected,

    // Loading states
    isSendingMessage: sendMessageMutation.isPending,
    isLoadingHistory,

    // Errors
    error: historyError,

    // Legacy compatibility (empty arrays for backward compatibility)
    conversations: [],
    totalConversations: 0,
    isLoadingConversations: false,
    conversationsError: null,
  };
}
