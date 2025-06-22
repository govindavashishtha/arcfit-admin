import api from './authApi';
import { ApiResponse } from '../types/auth';
import { 
  Membership, 
  CreateMembershipData, 
  PaginatedMembershipsResponse, 
  MembershipQueryParams 
} from '../types/membership';

export const getAllMemberships = async (params?: MembershipQueryParams): Promise<ApiResponse<PaginatedMembershipsResponse>> => {
  const queryParams = new URLSearchParams();
  
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.society_id) queryParams.append('society_id', params.society_id);
  if (params?.type) queryParams.append('type', params.type);
  if (params?.status) queryParams.append('status', params.status);
  if (params?.search) queryParams.append('search', params.search);

  const response = await api.get<ApiResponse<PaginatedMembershipsResponse>>(`/api/memberships?${queryParams.toString()}`);
  return response.data;
};

export const getMembershipById = async (id: string): Promise<ApiResponse<Membership>> => {
  const response = await api.get<ApiResponse<Membership>>(`/api/memberships/${id}`);
  return response.data;
};

export const createMembership = async (data: CreateMembershipData): Promise<ApiResponse<Membership>> => {
  const response = await api.post<ApiResponse<Membership>>('/api/memberships', data);
  return response.data;
};

export const updateMembership = async (id: string, data: Partial<CreateMembershipData>): Promise<ApiResponse<Membership>> => {
  const response = await api.put<ApiResponse<Membership>>(`/api/memberships/${id}`, data);
  return response.data;
};

export const deleteMembership = async (id: string): Promise<void> => {
  await api.delete(`/api/memberships/${id}`);
};