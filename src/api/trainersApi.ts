import api from './authApi';
import { ApiResponse } from '../types/auth';
import { 
  Trainer, 
  PaginatedTrainersResponse, 
  TrainerQueryParams, 
  CreateTrainerData, 
  UpdateTrainerData 
} from '../types/trainer';

export const getAllTrainers = async (params?: TrainerQueryParams): Promise<ApiResponse<PaginatedTrainersResponse>> => {
  const queryParams = new URLSearchParams();
  
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.specialization) queryParams.append('specialization', params.specialization);
  if (params?.status) queryParams.append('status', params.status);
  if (params?.center_id) queryParams.append('center_id', params.center_id);
  if (params?.search) queryParams.append('search', params.search);

  const response = await api.get<ApiResponse<PaginatedTrainersResponse>>(`/api/trainers?${queryParams.toString()}`);
  return response.data;
};

export const getTrainerById = async (id: string): Promise<ApiResponse<Trainer>> => {
  const response = await api.get<ApiResponse<Trainer>>(`/api/trainers/${id}`);
  return response.data;
};

export const createTrainer = async (data: CreateTrainerData): Promise<ApiResponse<Trainer>> => {
  const response = await api.post<ApiResponse<Trainer>>('/api/trainers', data);
  return response.data;
};

export const updateTrainer = async (data: UpdateTrainerData): Promise<ApiResponse<Trainer>> => {
  const { id, ...updateData } = data;
  const response = await api.patch<ApiResponse<Trainer>>(`/api/trainers/${id}`, updateData);
  return response.data;
};

export const deleteTrainer = async (id: string): Promise<void> => {
  await api.delete(`/api/trainers/${id}`);
};