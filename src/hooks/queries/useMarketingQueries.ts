import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMarketingContent, createMarketingContent, deleteMarketingContent } from '../../api/marketingApi';
import { CreateMarketingContent } from '../../types/marketing';

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

export const useCreateMarketingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateMarketingContent) => {
      const response = await createMarketingContent(data);
      if (!response.success) {
        throw new Error('Failed to create marketing content');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: marketingKeys.lists() });
    },
    onError: (error) => {
      console.error('Create marketing content error:', error);
    },
  });
};

export const useDeleteMarketingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteMarketingContent(id);
      if (!response.success) {
        throw new Error('Failed to delete marketing content');
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: marketingKeys.lists() });
    },
    onError: (error) => {
      console.error('Delete marketing content error:', error);
    },
  });
};
