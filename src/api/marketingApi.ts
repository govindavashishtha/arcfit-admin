import api from './authApi';
import { MarketingResponse } from '../types/marketing';

export const getMarketingContent = async (societyId: string): Promise<MarketingResponse> => {
  const response = await api.get<MarketingResponse>(`/api/marketing?center_id=${societyId}`);
  return response.data;
};
