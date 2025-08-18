import api from './authApi';
import { Center, CreateCenterData, UpdateCenterData } from '../types/center';
import { ApiResponse } from '../types/auth';

export const getAllCenters = async (): Promise<ApiResponse<Center[]>> => {
  const response = await api.get<ApiResponse<Center[]>>('/api/centers');
  return response.data;
};

export const getCenterById = async (id: string): Promise<ApiResponse<Center>> => {
  const response = await api.get<ApiResponse<Center>>(`/api/centers/${id}`);
  return response.data;
};

export const createCenter = async (data: CreateCenterData): Promise<ApiResponse<Center>> => {
  const formData = new FormData();
  
  // Add all text fields
  Object.entries(data).forEach(([key, value]) => {
    if (key !== 'detail_files' && key !== 'listing_files') {
      formData.append(key, value);
    }
  });

  // Add files if they exist
  if (data.detail_files) {
    data.detail_files.forEach(file => {
      formData.append('detail_files', file);
    });
  }

  if (data.listing_files) {
    data.listing_files.forEach(file => {
      formData.append('listing_files', file);
    });
  }

  const response = await api.post<ApiResponse<Center>>('/api/centers', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateCenter = async (data: UpdateCenterData): Promise<ApiResponse<Center>> => {
  const { center_id, ...updateData } = data;
  const formData = new FormData();
  
  // Add all text fields
  Object.entries(updateData).forEach(([key, value]) => {
    if (value !== undefined && key !== 'detail_files' && key !== 'listing_files') {
      formData.append(key, value);
    }
  });

  // Add files if they exist
  if (data.detail_files) {
    data.detail_files.forEach(file => {
      formData.append('detail_files', file);
    });
  }

  if (data.listing_files) {
    data.listing_files.forEach(file => {
      formData.append('listing_files', file);
    });
  }

  const response = await api.put<ApiResponse<Center>>(`/api/centers/${center_id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteCenter = async (id: string): Promise<void> => {
  await api.delete(`/api/centers/${id}`);
};