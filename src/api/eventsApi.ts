import api from './authApi';
import { ApiResponse } from '../types/auth';

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