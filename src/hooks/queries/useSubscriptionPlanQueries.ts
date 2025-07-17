import { useQuery } from '@tanstack/react-query';
import { 
  SubscriptionPlan, 
  SubscriptionPlanQueryParams 
} from '../../types/subscriptionPlan';
import { 
  getAllSubscriptionPlans, 
  getSubscriptionPlanById 
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