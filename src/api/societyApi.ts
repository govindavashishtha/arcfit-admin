import api from './authApi';
import { Society, CreateSocietyData, UpdateSocietyData } from '../types/society';
import { ApiResponse } from '../types/auth';

export const getAllSocieties = async (): Promise<ApiResponse<Society[]>> => {
  const response = await api.get<ApiResponse<Society[]>>('/api/societies');
  return response.data;
};

export const getSocietyById = async (id: string): Promise<ApiResponse<Society>> => {
  const response = await api.get<ApiResponse<Society>>(`/api/societies/${id}`);
  return response.data;
};

export const createSociety = async (data: CreateSocietyData): Promise<ApiResponse<Society>> => {
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

  const response = await api.post<ApiResponse<Society>>('/api/societies', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateSociety = async (data: UpdateSocietyData): Promise<ApiResponse<Society>> => {
  const { society_id, ...updateData } = data;
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

  const response = await api.put<ApiResponse<Society>>(`/api/societies/${society_id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteSociety = async (id: string): Promise<void> => {
  await api.delete(`/api/societies/${id}`);
};