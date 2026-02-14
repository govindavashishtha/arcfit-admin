import { useQuery } from '@tanstack/react-query';
import { getMarketingContent } from '../../api/marketingApi';

export const marketingKeys = {
  all: ['marketing'] as const,
  lists: () => [...marketingKeys.all, 'list'] as const,
  list: (societyId: string) => [...marketingKeys.lists(), societyId] as const,
};

export const useMarketingQuery = (societyId: string | null) => {
  return useQuery({
    queryKey: marketingKeys.list(societyId || ''),
    queryFn: async () => {
      if (!societyId) {
        throw new Error('Society ID is required');
      }
      const response = await getMarketingContent(societyId);
      if (!response.success) {
        throw new Error('Failed to fetch marketing content');
      }
      return response.data.data;
    },
    enabled: !!societyId,
    staleTime: 5 * 60 * 1000,
  });
};
