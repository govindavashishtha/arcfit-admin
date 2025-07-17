import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  SubscriptionPlan, 
  SubscriptionPlanQueryParams,
  CreateSubscriptionPlanData,
  UpdateSubscriptionPlanData
} from '../../types/subscriptionPlan';
import { 
  getAllSubscriptionPlans, 
  getSubscriptionPlanById,
  createSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan
} from '../../api/subscriptionPlansApi';

// Query Keys
export const subscriptionPlanKeys = {
  all: ['subscriptionPlans'] as const,
  lists: () => [...subscriptionPlanKeys.all, 'list'] as const,
  list: (params: SubscriptionPlanQueryParams) => [...subscriptionPlanKeys.lists(), params] as const,
  details: () => [...subscriptionPlanKeys.all, 'detail'] as const,
  detail: (id: string) => [...subscriptionPlanKeys.details(), id] as const,
};

// Get All Subscription Plans Query with Pagination and Filters
export const useSubscriptionPlansQuery = (params?: SubscriptionPlanQueryParams) => {
  return useQuery({
    queryKey: subscriptionPlanKeys.list(params || {}),
    queryFn: async () => {
      const response = await getAllSubscriptionPlans(params);
      if (!response.success) {
        throw new Error('Failed to fetch subscription plans');
      }
      return response.data;
    },
    enabled: !!params?.society_id, // Only fetch when society is selected
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get Subscription Plan by ID Query
export const useSubscriptionPlanQuery = (id: string) => {
  return useQuery({
    queryKey: subscriptionPlanKeys.detail(id),
    queryFn: async () => {
      const response = await getSubscriptionPlanById(id);
      if (!response.success) {
        throw new Error('Failed to fetch subscription plan');
      }
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create Subscription Plan Mutation
export const useCreateSubscriptionPlanMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateSubscriptionPlanData) => {
      const response = await createSubscriptionPlan(data);
      if (!response.success) {
        throw new Error('Failed to create subscription plan');
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch subscription plans list
      queryClient.invalidateQueries({ queryKey: subscriptionPlanKeys.lists() });
    },
    onError: (error) => {
      console.error('Create subscription plan error:', error);
    },
  });
};

// Update Subscription Plan Mutation
export const useUpdateSubscriptionPlanMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: UpdateSubscriptionPlanData) => {
      const response = await updateSubscriptionPlan(data);
      if (!response.success) {
        throw new Error('Failed to update subscription plan');
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Update the specific subscription plan in cache
      queryClient.setQueryData(subscriptionPlanKeys.detail(variables.id), data);
      
      // Invalidate and refetch subscription plans list
      queryClient.invalidateQueries({ queryKey: subscriptionPlanKeys.lists() });
    },
    onError: (error) => {
      console.error('Update subscription plan error:', error);
    },
  });
};

// Delete Subscription Plan Mutation
export const useDeleteSubscriptionPlanMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await deleteSubscriptionPlan(id);
      return id;
    },
    onSuccess: (deletedId) => {
      // Remove the deleted subscription plan from cache
      queryClient.removeQueries({ queryKey: subscriptionPlanKeys.detail(deletedId) });
      
      // Invalidate and refetch subscription plans list
      queryClient.invalidateQueries({ queryKey: subscriptionPlanKeys.lists() });
    },
    onError: (error) => {
      console.error('Delete subscription plan error:', error);
    },
  });
};