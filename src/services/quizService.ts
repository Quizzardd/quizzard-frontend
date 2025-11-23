import apiClient from '@/config/axiosConfig';
import type { IQuiz } from '@/types/quizzes';
import type { ISubmission } from '@/types/submissions';

interface QuizResponse {
  success: boolean;
  data: IQuiz;
}

interface QuizzesResponse {
  success: boolean;
  data: IQuiz[];
}

export interface GenerateQuizPayload {
  groupId: string;
  materialIds: string[];
  numberOfQuestions: number;
  difficulty?: string;
}

export interface QuizDetailsPayload {
  title: string;
  description?: string;
  group: string;
  week?: string;
  questions: {
    text: string;
    options?: string[];
    correctIndex?: number;
    point: number;
    type?: 'MCQ' | 'SHORT';
  }[];
  totalMarks?: number;
  durationMinutes?: number;
  startAt?: Date;
  endAt?: Date;
}

export interface UpdateQuizPayload {
  title?: string;
  description?: string;
  totalMarks?: number;
  durationMinutes?: number;
  startAt?: Date;
  endAt?: Date;
  state?: 'draft' | 'published' | 'closed';
}

interface SubmissionPayload {
  quiz: string;
  answers: {
    question: string;
    selectedIndex: number;
  }[];
  startedAt: string;
}

interface SubmissionResponse {
  success: boolean;
  message: string;
  data?: ISubmission;
}

interface CheckQuizTakenPayload {
  userId: string;
  quizId: string;
}

interface CheckQuizTakenResponse {
  success: boolean;
  data: {
    isTaken: boolean;
    submission: ISubmission | null;
  };
}

interface QuizResultResponse {
  success: boolean;
  message: string;
  data: ISubmission;
}

/**
 * Generate quiz with AI
 */
export const generateQuizWithAI = async (payload: GenerateQuizPayload): Promise<IQuiz> => {
  const response = await apiClient.post<QuizResponse>('/quizzes/generate', payload);
  return response.data.data;
};

/**
 * Create quiz from details
 */
export const createQuizFromDetails = async (payload: QuizDetailsPayload): Promise<IQuiz> => {
  const response = await apiClient.post<QuizResponse>('/quizzes', payload);
  return response.data.data;
};

/**
 * Get all quizzes
 */
export const getAllQuizzes = async (): Promise<IQuiz[]> => {
  const response = await apiClient.get<QuizzesResponse>('/quizzes');
  return response.data.data;
};

/**
 * Fetch quiz by ID
 */
export const getQuizById = async (quizId: string): Promise<IQuiz> => {
  const response = await apiClient.get<QuizResponse>(`/quizzes/${quizId}`);
  return response.data.data;
};

/**
 * Submit quiz answers
 */
export const submitQuizAnswers = async (
  quizId: string,
  answers: Record<string, number>,
  allQuestionIds: string[],
  startedAt: Date,
): Promise<SubmissionResponse> => {
  // Transform answers to include all questions, using -1 for unanswered
  const answersArray = allQuestionIds.map((questionId) => ({
    question: questionId,
    selectedIndex: answers[questionId] !== undefined ? answers[questionId] : -1,
  }));

  const payload: SubmissionPayload = {
    quiz: quizId,
    answers: answersArray,
    startedAt: startedAt.toISOString(),
  };

  const response = await apiClient.post<SubmissionResponse>('/submissions', payload);
  console.log(response.data);
  return response.data;
};

/**
 * Update quiz
 */
export const updateQuiz = async (quizId: string, payload: UpdateQuizPayload): Promise<IQuiz> => {
  const response = await apiClient.patch<QuizResponse>(`/quizzes/${quizId}`, payload);
  return response.data.data;
};

/**
 * Delete quiz
 */
export const deleteQuiz = async (quizId: string): Promise<void> => {
  await apiClient.delete(`/quizzes/${quizId}`);
};

/**
 * Check if a quiz has been taken by a user
 */
export const checkQuizTaken = async (
  userId: string,
  quizId: string,
): Promise<CheckQuizTakenResponse> => {
  const payload: CheckQuizTakenPayload = { userId, quizId };
  const response = await apiClient.post<CheckQuizTakenResponse>(
    '/submissions/check-taken',
    payload,
  );
  return response.data;
};

/**
 * Get quiz result/submission for a student
 */
export const getQuizResult = async (quizId: string): Promise<ISubmission> => {
  const response = await apiClient.get<QuizResultResponse>(`/submissions/quiz/${quizId}/result`);
  return response.data.data;
};
