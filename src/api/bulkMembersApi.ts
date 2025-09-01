import api from './authApi';
import { ApiResponse } from '../types/auth';
import { BulkMemberUploadResponse, BulkMemberUploadData } from '../types/bulkMember';

export const uploadBulkMembers = async (data: BulkMemberUploadData): Promise<ApiResponse<BulkMemberUploadResponse>> => {
  const formData = new FormData();
  formData.append('center_id', data.center_id);
  formData.append('csv_file', data.csv_file);

  const response = await api.post<ApiResponse<BulkMemberUploadResponse>>('/api/members/bulk/csv', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};