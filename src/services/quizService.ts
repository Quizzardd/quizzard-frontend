import apiClient from '@/config/axiosConfig';
import type { IQuiz } from '@/types/quizzes';
import type { ISubmission } from '@/types/submissions';

interface QuizResponse {
  success: boolean;
  data: IQuiz;
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
