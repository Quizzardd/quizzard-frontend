import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getApiErrorMessage } from '@/lib/apiError';
import type { IQuiz } from '@/types/quizzes';
import {
  generateQuizWithAI,
  createQuizFromDetails,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  checkQuizTaken,
  type GenerateQuizPayload,
  type QuizDetailsPayload,
  type UpdateQuizPayload,
} from '@/services/quizService';

// -------------------- GENERATE QUIZ WITH AI -------------------
export const useGenerateQuizWithAI = () => {
  return useMutation({
    mutationFn: (payload: GenerateQuizPayload) => generateQuizWithAI(payload),
    onError: (err: unknown) => {
      toast.error(getApiErrorMessage(err, 'Failed to generate quiz'));
    },
  });
};

// -------------------- CREATE QUIZ FROM DETAILS -------------------
export const useCreateQuizFromDetails = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: QuizDetailsPayload) => createQuizFromDetails(payload),
    onSuccess: (newQuiz) => {
      toast.success('Quiz created successfully!');
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });

      // Optimistically add to cache if we have a group context
      if (typeof newQuiz.group === 'string') {
        queryClient.invalidateQueries({ queryKey: ['quizzes', 'group', newQuiz.group] });
      }
    },
    onError: (err: unknown) => {
      toast.error(getApiErrorMessage(err, 'Failed to create quiz'));
    },
  });
};

// -------------------- GET ALL QUIZZES -------------------
export const useQuizzes = () => {
  return useQuery({
    queryKey: ['quizzes'],
    queryFn: getAllQuizzes,
  });
};

// -------------------- GET QUIZ BY ID -------------------
export const useQuizById = (quizId: string) => {
  return useQuery({
    queryKey: ['quiz', quizId],
    queryFn: () => getQuizById(quizId),
    enabled: !!quizId,
  });
};

// -------------------- UPDATE QUIZ -------------------
export const useUpdateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ quizId, payload }: { quizId: string; payload: UpdateQuizPayload }) =>
      updateQuiz(quizId, payload),
    onMutate: async ({ quizId, payload }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['quiz', quizId] });
      await queryClient.cancelQueries({ queryKey: ['quizzes'] });

      // Snapshot previous values
      const previousQuiz = queryClient.getQueryData<IQuiz>(['quiz', quizId]);
      const previousQuizzes = queryClient.getQueryData<IQuiz[]>(['quizzes']);

      // Optimistically update single quiz
      if (previousQuiz) {
        queryClient.setQueryData<IQuiz>(['quiz', quizId], {
          ...previousQuiz,
          ...payload,
        });
      }

      // Optimistically update quizzes list
      if (previousQuizzes) {
        queryClient.setQueryData<IQuiz[]>(
          ['quizzes'],
          previousQuizzes.map((quiz) => (quiz._id === quizId ? { ...quiz, ...payload } : quiz)),
        );
      }

      return { previousQuiz, previousQuizzes };
    },
    onError: (err: unknown, _variables, context) => {
      toast.error(getApiErrorMessage(err, 'Failed to update quiz'));

      // Rollback on error
      if (context?.previousQuiz) {
        queryClient.setQueryData(['quiz', _variables.quizId], context.previousQuiz);
      }
      if (context?.previousQuizzes) {
        queryClient.setQueryData(['quizzes'], context.previousQuizzes);
      }
    },
    onSuccess: (updatedQuiz) => {
      toast.success('Quiz updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['quiz', updatedQuiz._id] });
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
    },
  });
};

// -------------------- DELETE QUIZ -------------------
export const useDeleteQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteQuiz,
    onMutate: async (quizId: string) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['quizzes'] });

      // Snapshot previous value
      const previousQuizzes = queryClient.getQueryData<IQuiz[]>(['quizzes']);

      // Optimistically remove from list
      if (previousQuizzes) {
        queryClient.setQueryData<IQuiz[]>(
          ['quizzes'],
          previousQuizzes.filter((quiz) => quiz._id !== quizId),
        );
      }

      return { previousQuizzes };
    },
    onError: (err: unknown, _quizId, context) => {
      toast.error(getApiErrorMessage(err, 'Failed to delete quiz'));

      // Rollback on error
      if (context?.previousQuizzes) {
        queryClient.setQueryData(['quizzes'], context.previousQuizzes);
      }
    },
    onSuccess: () => {
      toast.success('Quiz deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
    },
  });
};

// -------------------- CHECK QUIZ TAKEN STATUS -------------------
export const useCheckQuizTaken = (userId: string, quizId: string) => {
  return useQuery({
    queryKey: ['quiz-taken', userId, quizId],
    queryFn: () => checkQuizTaken(userId, quizId),
    enabled: !!userId && !!quizId,
  });
};
