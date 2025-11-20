import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { chatService } from '@/services/chatService';
import type { ISendMessagePayload, IChatResponse } from '@/types';
import { toast } from 'sonner';
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

  // Fetch chat history when sessionId exists
  const { data: historyData, isLoading: isLoadingHistory } = useQuery({
    queryKey: ['chatHistory', sessionId, user?._id],
    queryFn: () => chatService.getChatHistory(sessionId!, user!._id),
    enabled: !!sessionId && !!user?._id,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
  });

  // Derive messages from query data instead of managing separate state
  const messages = useMemo<IChatMessage[]>(() => {
    if (!historyData?.success || !historyData.session) {
      return [];
    }

    const loadedMessages: IChatMessage[] = [];

    historyData.session.turns.forEach((turn) => {
      // Add user message if exists
      if (turn.user) {
        loadedMessages.push({
          content: turn.user.text,
          sender: 'user',
          timestamp: new Date(turn.user.timestamp),
        });
      }

      // Add agent/bot message if exists
      if (turn.agent) {
        loadedMessages.push({
          content: turn.agent.text,
          sender: 'bot',
          timestamp: new Date(turn.agent.timestamp),
        });
      }
    });

    return loadedMessages;
  }, [historyData]);

  // Send message mutation with optimistic updates
  const sendMessageMutation = useMutation({
    mutationFn: (payload: ISendMessagePayload) => chatService.sendMessage(payload),

    // Optimistically add user message to UI
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ['chatHistory', sessionId, user?._id],
      });

      // Snapshot the previous value
      const previousHistory = queryClient.getQueryData(['chatHistory', sessionId, user?._id]);

      // Optimistically update to the new value
      if (sessionId) {
        queryClient.setQueryData(['chatHistory', sessionId, user?._id], (old: any) => {
          if (!old?.session) return old;

          return {
            ...old,
            session: {
              ...old.session,
              turns: [
                ...old.session.turns,
                {
                  user: {
                    text: variables.message,
                    timestamp: new Date().toISOString(),
                  },
                },
              ],
            },
          };
        });
      }

      // Return context with snapshot
      return { previousHistory };
    },

    onSuccess: (data: IChatResponse, variables, context) => {
      console.log('✅ Response received:', data);
      console.log('📦 Full response object:', JSON.stringify(data, null, 2));

      // Store sessionId for new conversations
      if (data.sessionId && !sessionId) {
        setSessionId(data.sessionId);
        localStorage.setItem('chatSessionId', data.sessionId);
      }

      // Extract bot response
      let botContent: string;
      let botTimestamp: Date;

      if (typeof data.response === 'string') {
        botContent = data.response;
        botTimestamp = new Date(data.timestamp || Date.now());
      } else {
        botContent = data.response.content;
        botTimestamp = new Date(data.response.timestamp || data.timestamp || Date.now());
      }

      console.log('🤖 Bot content:', botContent);

      // Update cache with bot response
      const targetSessionId = data.sessionId || sessionId;

      console.log('🔑 Updating cache for sessionId:', targetSessionId);
      console.log('👤 User ID:', user?._id);

      queryClient.setQueryData(['chatHistory', targetSessionId, user?._id], (old: any) => {
        console.log('📝 Old cache data:', JSON.stringify(old, null, 2));

        if (!old?.session) {
          // Create new session structure if it doesn't exist
          const newData = {
            success: true,
            session: {
              turns: [
                {
                  user: {
                    text: variables.message,
                    timestamp: new Date().toISOString(),
                  },
                  agent: {
                    text: botContent,
                    timestamp: botTimestamp.toISOString(),
                  },
                },
              ],
            },
          };
          console.log('✨ Creating new cache data:', JSON.stringify(newData, null, 2));
          return newData;
        }

        // Add bot response to the last turn
        const updatedTurns = [...old.session.turns];
        const lastTurn = updatedTurns[updatedTurns.length - 1];

        if (lastTurn && !lastTurn.agent) {
          lastTurn.agent = {
            text: botContent,
            timestamp: botTimestamp.toISOString(),
          };
          console.log('✏️ Updated last turn with agent response');
        } else {
          updatedTurns.push({
            agent: {
              text: botContent,
              timestamp: botTimestamp.toISOString(),
            },
          });
          console.log('➕ Added new turn with agent response');
        }

        const updatedData = {
          ...old,
          session: {
            ...old.session,
            turns: updatedTurns,
          },
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
        queryClient.setQueryData(['chatHistory', sessionId, user?._id], context.previousHistory);
      }

      toast.error('Failed to send message', {
        description: error.message || 'Please try again',
      });
    },
  });

  const sendMessage = useCallback(
    (content: string) => {
      if (!user?._id) {
        console.error('❌ User not authenticated');
        toast.error('User not authenticated');
        return;
      }

      // Build payload
      const payload: ISendMessagePayload = {
        message: content,
        userId: user._id, // Use actual user ID
        ...(sessionId && { sessionId }),
      };

      sendMessageMutation.mutate(payload);
    },
    [sessionId, user?._id, sendMessageMutation],
  );

  const startNewConversation = useCallback(() => {
    // Clear session
    setSessionId(undefined);
    localStorage.removeItem('chatSessionId');

    // Invalidate queries
    queryClient.invalidateQueries({ queryKey: ['chatHistory'] });

    toast.success('New conversation started');
  }, [queryClient]);

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
