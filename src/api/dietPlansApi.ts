import api from './authApi';
import { ApiResponse } from '../types/auth';
import { DietPlanResponse, CreateDietPlanData } from '../types/dietPlan';

export const getDietPlansByUser = async (userId: string): Promise<ApiResponse<DietPlanResponse>> => {
  const response = await api.get<ApiResponse<DietPlanResponse>>(`/api/diet-plans/user/${userId}`);
  return response.data;
};

export const createDietPlan = async (data: CreateDietPlanData): Promise<ApiResponse<any>> => {
  const formData = new FormData();
  formData.append('user_id', data.user_id);
  formData.append('start_date', data.start_date);
  formData.append('end_date', data.end_date);
  formData.append('diet_pdf', data.diet_pdf);

  const response = await api.post<ApiResponse<any>>('/api/diet-plans', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteDietPlan = async (dietPlanId: string): Promise<void> => {
  await api.delete(`/api/diet-plans/${dietPlanId}`);
};