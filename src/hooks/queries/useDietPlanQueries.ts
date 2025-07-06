import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DietPlan, CreateDietPlanData } from '../../types/dietPlan';
import { getDietPlansByUser, createDietPlan, deleteDietPlan } from '../../api/dietPlansApi';

// Query Keys
export const dietPlanKeys = {
  all: ['dietPlans'] as const,
  lists: () => [...dietPlanKeys.all, 'list'] as const,
  userPlans: (userId: string) => [...dietPlanKeys.lists(), 'user', userId] as const,
};

// Get Diet Plans by User Query
export const useDietPlansByUserQuery = (userId: string) => {
  return useQuery({
    queryKey: dietPlanKeys.userPlans(userId),
    queryFn: async () => {
      const response = await getDietPlansByUser(userId);
      if (!response.success) {
        throw new Error('Failed to fetch diet plans');
      }
      return response.data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create Diet Plan Mutation
export const useCreateDietPlanMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateDietPlanData) => {
      const response = await createDietPlan(data);
      if (!response.success) {
        throw new Error('Failed to create diet plan');
      }
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch diet plans for the specific user
      queryClient.invalidateQueries({ queryKey: dietPlanKeys.userPlans(variables.user_id) });
    },
    onError: (error) => {
      console.error('Create diet plan error:', error);
    },
  });
};

// Delete Diet Plan Mutation
export const useDeleteDietPlanMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ dietPlanId, userId }: { dietPlanId: string; userId: string }) => {
      await deleteDietPlan(dietPlanId);
      return { dietPlanId, userId };
    },
    onSuccess: (data) => {
      // Invalidate and refetch diet plans for the specific user
      queryClient.invalidateQueries({ queryKey: dietPlanKeys.userPlans(data.userId) });
    },
    onError: (error) => {
      console.error('Delete diet plan error:', error);
    },
  });
};