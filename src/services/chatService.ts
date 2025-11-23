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
  getChatHistory: async (sessionId: string, userId: string): Promise<IChatHistoryResponse> => {
    if (!sessionId) {
      console.log('⚠️ No sessionId provided, returning empty');
      return { success: true, userId, sessions: [] };
    }

    // Fetch all sessions first
    const res = await apiClient.get(`/agent/sessions/${userId}?compact=true`);
    console.log('📥 Chat history response:', {
      totalSessions: res.data.sessions?.length || 0,
      requestedSessionId: sessionId,
      sessionIds: res.data.sessions?.map((s: any) => s.id)
    });
    
    // Filter to only include the requested session
    if (res.data.sessions && sessionId) {
      const filteredSessions = res.data.sessions.filter((s: any) => s.id === sessionId);
      console.log('✂️ Filtered to session:', sessionId, '- found:', filteredSessions.length > 0);
      
      if (filteredSessions.length === 0) {
        console.log('⚠️ Session not found in response, it may not exist yet');
      }
      
      return {
        ...res.data,
        sessions: filteredSessions
      };
    }
    
    return res.data;
  },

  // Get specific session details
  getSessionDetails: async (sessionId: string, userId: string): Promise<ISingleSessionResponse> => {
    const res = await apiClient.get(`/agent/sessions/${userId}/${sessionId}?compact=true`);
    console.log('📥 Session details response:', res.data);
    return res.data;
  },

  // Get all conversations for the current user (placeholder - implement if backend supports)
};
