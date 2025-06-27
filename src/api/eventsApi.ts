import api from './authApi';
import { ApiResponse } from '../types/auth';
import { Event, PaginatedEventsResponse, EventQueryParams } from '../types/event';

export const getAllEvents = async (params?: EventQueryParams): Promise<ApiResponse<PaginatedEventsResponse>> => {
  const queryParams = new URLSearchParams();
  
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.society_id) queryParams.append('society_id', params.society_id);
  if (params?.type) queryParams.append('type', params.type);
  if (params?.status) queryParams.append('status', params.status);
  if (params?.from_date) queryParams.append('from_date', params.from_date);
  if (params?.to_date) queryParams.append('to_date', params.to_date);

  const response = await api.get<ApiResponse<PaginatedEventsResponse>>(`/api/events?${queryParams.toString()}`);
  return response.data;
};

export const getEventById = async (id: string): Promise<ApiResponse<Event>> => {
  const response = await api.get<ApiResponse<Event>>(`/api/events/${id}`);
  return response.data;
};

export const uploadBulkEvents = async (societyId: string, csvFile: File): Promise<ApiResponse<any>> => {
  const formData = new FormData();
  formData.append('society_id', societyId);
  formData.append('events_csv', csvFile);

  const response = await api.post<ApiResponse<any>>('/api/events/bulk/csv', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const cancelEvent = async (eventId: string): Promise<ApiResponse<Event>> => {
  const response = await api.patch<ApiResponse<Event>>(`/api/events/${eventId}/status`, {
    status: 'cancelled'
  });
  return response.data;
};