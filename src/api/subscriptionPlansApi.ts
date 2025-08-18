import api from './authApi';
import { ApiResponse } from '../types/auth';
import { 
  SubscriptionPlan, 
  PaginatedSubscriptionPlansResponse, 
  SubscriptionPlanQueryParams,
  CreateSubscriptionPlanData,
  UpdateSubscriptionPlanData
} from '../types/subscriptionPlan';

export const getAllSubscriptionPlans = async (params?: SubscriptionPlanQueryParams): Promise<ApiResponse<PaginatedSubscriptionPlansResponse>> => {
  const queryParams = new URLSearchParams();
  
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.center_id) queryParams.append('center_id', params.center_id);

  const response = await api.get<ApiResponse<PaginatedSubscriptionPlansResponse>>(`/api/subscription-plans?${queryParams.toString()}`);
  return response.data;
};

export const getSubscriptionPlanById = async (id: string): Promise<ApiResponse<SubscriptionPlan>> => {
  const response = await api.get<ApiResponse<SubscriptionPlan>>(`/api/subscription-plans/${id}`);
  return response.data;
};

export const createSubscriptionPlan = async (data: CreateSubscriptionPlanData): Promise<ApiResponse<SubscriptionPlan>> => {
  const response = await api.post<ApiResponse<SubscriptionPlan>>('/api/subscription-plans', data);
  return response.data;
};

export const updateSubscriptionPlan = async (data: UpdateSubscriptionPlanData): Promise<ApiResponse<SubscriptionPlan>> => {
  const { id, ...updateData } = data;
  const response = await api.put<ApiResponse<SubscriptionPlan>>(`/api/subscription-plans/${id}`, updateData);
  return response.data;
};

export const deleteSubscriptionPlan = async (id: string): Promise<void> => {
  await api.delete(`/api/subscription-plans/${id}`);
};