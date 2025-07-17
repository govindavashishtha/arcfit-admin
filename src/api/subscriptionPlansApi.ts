import api from './authApi';
import { ApiResponse } from '../types/auth';
import { 
  SubscriptionPlan, 
  PaginatedSubscriptionPlansResponse, 
  SubscriptionPlanQueryParams 
} from '../types/subscriptionPlan';

export const getAllSubscriptionPlans = async (params?: SubscriptionPlanQueryParams): Promise<ApiResponse<PaginatedSubscriptionPlansResponse>> => {
  const queryParams = new URLSearchParams();
  
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.society_id) queryParams.append('society_id', params.society_id);

  const response = await api.get<ApiResponse<PaginatedSubscriptionPlansResponse>>(`/api/subscription-plans?${queryParams.toString()}`);
  return response.data;
};

export const getSubscriptionPlanById = async (id: string): Promise<ApiResponse<SubscriptionPlan>> => {
  const response = await api.get<ApiResponse<SubscriptionPlan>>(`/api/subscription-plans/${id}`);
  return response.data;
};