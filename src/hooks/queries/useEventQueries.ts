import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadBulkEvents } from '../../api/eventsApi';

// Query Keys
export const eventKeys = {
  all: ['events'] as const,
  bulk: () => [...eventKeys.all, 'bulk'] as const,
};

// Upload Bulk Events Mutation
export const useUploadBulkEventsMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ societyId, csvFile }: { societyId: string; csvFile: File }) => {
      const response = await uploadBulkEvents(societyId, csvFile);
      if (!response.success) {
        throw new Error('Failed to upload events');
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch events if we have event lists
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
    },
    onError: (error) => {
      console.error('Upload bulk events error:', error);
    },
  });
};