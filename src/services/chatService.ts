import axios from 'axios';
import type { IChatResponse, ISendMessagePayload, IChatHistoryResponse } from '@/types';

// Create a separate axios instance for the AI chat backend
const aiChatClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 30000, // 30 seconds for AI responses
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
aiChatClient.interceptors.request.use(
  (config) => {
    console.log('🚀 Sending chat request:', config.url, config.data);
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  },
);

// Add response interceptor for debugging
aiChatClient.interceptors.response.use(
  (response) => {
    console.log('✅ Chatresponse  received:', response.data);
    return response;
  },
  (error) => {
    console.error('❌ Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  },
);

export const chatService = {
  // Send a message to AI (creates new session if sessionId not provided)
  sendMessage: async (payload: ISendMessagePayload): Promise<IChatResponse> => {
    const res = await aiChatClient.post('/chat', {
      message: payload.message,
      userId: payload.userId,
      ...(payload.sessionId && { sessionId: payload.sessionId }),
    });
    return res.data;
  },

  // Get chat history for a session
  getChatHistory: async (sessionId: string, userId: string): Promise<IChatHistoryResponse> => {
    const res = await aiChatClient.get(`/sessions/${userId}/${sessionId}?compact=true`);
    return res.data;
  },

  // Get all conversations for the current user (placeholder - implement if backend supports)
};
