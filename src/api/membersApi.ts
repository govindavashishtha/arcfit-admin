import api from './authApi';
import { ApiResponse } from '../types/auth';

export interface Member {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  membership_type: string;
  status: 'active' | 'inactive' | 'pending';
  join_date: string;
  created_at: string;
  updated_at: string;
}

export interface CreateMemberData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  membership_type: string;
  status: 'active' | 'inactive' | 'pending';
}

export interface UpdateMemberData extends Partial<CreateMemberData> {
  id: string;
}

export const getAllMembers = async (): Promise<ApiResponse<Member[]>> => {
  const response = await api.get<ApiResponse<Member[]>>('/api/members');
  return response.data;
};

export const getMemberById = async (id: string): Promise<ApiResponse<Member>> => {
  const response = await api.get<ApiResponse<Member>>(`/api/members/${id}`);
  return response.data;
};

export const createMember = async (data: CreateMemberData): Promise<ApiResponse<Member>> => {
  const response = await api.post<ApiResponse<Member>>('/api/members', data);
  return response.data;
};

export const updateMember = async (data: UpdateMemberData): Promise<ApiResponse<Member>> => {
  const { id, ...updateData } = data;
  const response = await api.put<ApiResponse<Member>>(`/api/members/${id}`, updateData);
  return response.data;
};

export const deleteMember = async (id: string): Promise<void> => {
  await api.delete(`/api/members/${id}`);
};