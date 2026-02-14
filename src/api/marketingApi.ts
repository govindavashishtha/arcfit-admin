import api from './authApi';
import { MarketingResponse, CreateMarketingContent, CreateMarketingResponse } from '../types/marketing';

export const getMarketingContent = async (societyId: string): Promise<MarketingResponse> => {
  const response = await api.get<MarketingResponse>(`/api/marketing?center_id=${societyId}`);
  return response.data;
};

export const createMarketingContent = async (data: CreateMarketingContent): Promise<CreateMarketingResponse> => {
  const formData = new FormData();
  formData.append('center_id', data.center_id);
  formData.append('title', data.title);
  formData.append('description', data.description);
  if (data.link) formData.append('link', data.link);
  if (data.markdown) formData.append('markdown', data.markdown);
  formData.append('bg_image', data.bg_image);

  const response = await api.post<CreateMarketingResponse>('/api/marketing', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteMarketingContent = async (id: string): Promise<{ success: boolean }> => {
  const response = await api.delete(`/api/marketing/${id}`);
  return response.data;
};
