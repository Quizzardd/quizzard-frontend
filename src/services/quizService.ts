import apiClient from '@/config/axiosConfig';
import type { IQuiz } from '@/types/quizzes';

// ----------- GENERATE QUIZ WITH AI -------------------
export interface GenerateQuizPayload {
  message: string;
  userId: string;
  groupId: string;
  groupName: string;
  educatorName: string;
  selectedModules: Array<{ id: string; title: string }>;
  sessionId?: string;
}

export interface GeneratedQuizResponse {
  questions: Array<{
    text: string;
    options: string[];
    correctIndex: number;
    points: number;
  }>;
  title: string;
  description: string;
}

export const generateQuizWithAI = async (
  payload: GenerateQuizPayload,
): Promise<GeneratedQuizResponse> => {
  // This would call your AI endpoint
  // For now, returning mock data structure
  const res = await apiClient.post('/agent/chat', {
    ...payload,
  });
  return res.data.data;
};

// ----------- CREATE QUIZ FROM DETAILS -------------------
export interface QuizDetailsPayload {
  title: string;
  description?: string;
  totalMarks?: number;
  durationMinutes?: number;
  startAt?: Date;
  endAt?: Date;
  questions: Array<{
    text: string;
    options: string[];
    correctOptionIndex: number;
    point: number;
  }>;
  module_ids: string[];
}

export const createQuizFromDetails = async (payload: QuizDetailsPayload): Promise<IQuiz> => {
  const res = await apiClient.post('/quizzes/from-details', {
    quiz_details: payload,
  });
  return res.data.data;
};

// ----------- GET ALL QUIZZES -------------------
export const getAllQuizzes = async (): Promise<IQuiz[]> => {
  const res = await apiClient.get('/quizzes');
  return res.data.data;
};

// ----------- GET QUIZ BY ID -------------------
export const getQuizById = async (quizId: string): Promise<IQuiz> => {
  const res = await apiClient.get(`/quizzes/${quizId}`);
  return res.data.data;
};

// ----------- UPDATE QUIZ -------------------
export interface UpdateQuizPayload {
  title?: string;
  description?: string;
  totalMarks?: number;
  durationMinutes?: number;
  startAt?: Date;
  endAt?: Date;
  questions?: string[];
}

export const updateQuiz = async (quizId: string, payload: UpdateQuizPayload): Promise<IQuiz> => {
  const res = await apiClient.put(`/quizzes/${quizId}`, payload);
  return res.data.data;
};

// ----------- DELETE QUIZ -------------------
export const deleteQuiz = async (quizId: string): Promise<void> => {
  const res = await apiClient.delete(`/quizzes/${quizId}`);
  return res.data;
};
