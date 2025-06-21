import api from './authApi';
import { ApiResponse } from '../types/auth';

export interface Trainer {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  specialty: string;
  rating: number;
  status: 'active' | 'inactive';
  member_count: number;
  join_date: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTrainerData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  specialty: string;
  status: 'active' | 'inactive';
}

export interface UpdateTrainerData extends Partial<CreateTrainerData> {
  id: string;
}

export const getAllTrainers = async (): Promise<ApiResponse<Trainer[]>> => {
  const response = await api.get<ApiResponse<Trainer[]>>('/api/trainers');
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
  const response = await api.put<ApiResponse<Trainer>>(`/api/trainers/${id}`, updateData);
  return response.data;
};

export const deleteTrainer = async (id: string): Promise<void> => {
  await api.delete(`/api/trainers/${id}`);
};