import api from './authApi';
import { ApiResponse } from '../types/auth';
import { Member, PaginatedMembersResponse, MemberQueryParams } from '../types/member';

export const getAllMembers = async (params?: MemberQueryParams): Promise<ApiResponse<PaginatedMembersResponse>> => {
  const queryParams = new URLSearchParams();
  
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.center_id) queryParams.append('center_id', params.center_id);
  if (params?.status) queryParams.append('status', params.status);
  if (params?.gender) queryParams.append('gender', params.gender);
  if (params?.verification_status) queryParams.append('verification_status', params.verification_status);
  if (params?.search) queryParams.append('search', params.search);

  const response = await api.get<ApiResponse<PaginatedMembersResponse>>(`/api/members?${queryParams.toString()}`);
  return response.data;
};

export const getMemberById = async (id: string): Promise<ApiResponse<Member>> => {
  const response = await api.get<ApiResponse<Member>>(`/api/members/${id}`);
  return response.data;
};

export const createMember = async (data: Partial<Member>): Promise<ApiResponse<Member>> => {
  const response = await api.post<ApiResponse<Member>>('/api/members', data);
  return response.data;
};

export const updateMember = async (id: string, data: Partial<Member>): Promise<ApiResponse<Member>> => {
  const response = await api.put<ApiResponse<Member>>(`/api/members/${id}`, data);
  return response.data;
};

export const deleteMember = async (id: string): Promise<void> => {
  await api.delete(`/api/members/${id}`);
};