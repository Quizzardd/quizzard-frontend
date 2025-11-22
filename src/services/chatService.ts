import type { IChatResponse, ISendMessagePayload, IChatHistoryResponse } from '@/types';
import apiClient from '@/config/axiosConfig';

export const chatService = {
  // Send a message to AI (creates new session if sessionId not provided)
  sendMessage: async (payload: ISendMessagePayload): Promise<IChatResponse> => {
    const res = await apiClient.post(
      '/agent/chat',
      {
        message: payload.message,
        userId: payload.userId,
        ...(payload.sessionId && { sessionId: payload.sessionId }),
        ...(payload.groupId && { groupId: payload.groupId }),
        ...(payload.educatorName && { educatorName: payload.educatorName }),
        ...(payload.selectedModules && { selectedModules: payload.selectedModules }),
      },
      {
        timeout: 60000, // 60 seconds timeout for AI requests
      },
    );
    return res.data;
  },

  /**
   * {
  "message": "Hello can you hear me?",
  "userId": "bahaa",
  "groupId": "grp_456",
  "groupName": "CS201 - Spring 2025",
  "educatorName": "Dr. Ada Lovelace",
  "selectedModules": [
    { "id": "mod_oop_001", "name": "Object-Oriented Programming" },
    { "id": "mod_ds_002", "name": "Data Structures & Algorithms" }
  ]
}
   * 
   */

  // Get chat history for a session
  getChatHistory: async (_sessionId: string, userId: string): Promise<IChatHistoryResponse> => {
    const res = await apiClient.get(`/agent/sessions/${userId}?expand=true`);
    console.log('response', res);
    return res.data;
  },

  // Get all conversations for the current user (placeholder - implement if backend supports)
};
