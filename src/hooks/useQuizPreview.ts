import { useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from '@/config/axiosConfig';

interface QuizQuestion {
  _id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  point: number;
}

interface Quiz {
  _id: string;
  title: string;
  description?: string;
  totalMarks: number;
  durationMinutes: number;
  startAt?: string;
  endAt?: string;
  questions: QuizQuestion[];
  createdAt: string;
  updatedAt: string;
}

export function useQuizPreview() {
  const queryClient = useQueryClient();
  const [quizId, setQuizId] = useState<string | null>(null);
  const [quizAction, setQuizAction] = useState<'created' | 'updated' | null>(null);

  // Fetch quiz data
  const {
    data: quiz,
    isLoading,
    error,
    refetch,
  } = useQuery<Quiz>({
    queryKey: ['quiz', quizId],
    queryFn: async () => {
      console.log('📚 Fetching quiz:', quizId);
      const response = await axios.get(`/quizzes/${quizId}`);
      console.log('✅ Quiz loaded:', response.data);
      return response.data.data; // Unwrap the data from {success: true, data: quiz}
    },
    enabled: !!quizId,
    staleTime: 0, // Always fetch fresh
    refetchOnWindowFocus: false,
  });

  // Update quiz ID when detected from chat
  const updateQuizId = useCallback((newQuizId: string, action: 'created' | 'updated') => {
    console.log(`🎯🎯🎯 useQuizPreview.updateQuizId called with:`, { newQuizId, action });
    console.log('📊 Current state:', { currentQuizId: quizId, currentAction: quizAction });
    setQuizId(newQuizId);
    setQuizAction(action);
    console.log('✅ State updated, React Query should fetch now...');
    
    // If updating existing quiz, invalidate cache and refetch
    if (action === 'updated') {
      console.log('🔄 Quiz updated, invalidating cache and refetching...');
      queryClient.invalidateQueries({ queryKey: ['quiz', newQuizId] });
      setTimeout(() => {
        refetch();
      }, 100);
    }
  }, [quizId, quizAction, refetch, queryClient]);

  // Clear quiz
  const clearQuiz = useCallback(() => {
    console.log('🗑️ Clearing quiz preview');
    setQuizId(null);
    setQuizAction(null);
  }, []);

  // Force refetch
  const refreshQuiz = useCallback(() => {
    if (quizId) {
      console.log('🔄 Manually refreshing quiz');
      refetch();
    }
  }, [quizId, refetch]);

  return {
    quiz,
    quizId,
    quizAction,
    isLoading,
    error,
    updateQuizId,
    clearQuiz,
    refreshQuiz,
    hasQuiz: !!quiz,
  };
}
