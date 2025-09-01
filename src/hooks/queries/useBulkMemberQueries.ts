import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BulkMemberUploadData } from '../../types/bulkMember';
import { uploadBulkMembers } from '../../api/bulkMembersApi';
import { memberKeys } from './useMemberQueries';

// Upload Bulk Members Mutation
export const useUploadBulkMembersMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: BulkMemberUploadData) => {
      const response = await uploadBulkMembers(data);
      if (!response.success) {
        throw new Error('Failed to upload members');
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch members list
      queryClient.invalidateQueries({ queryKey: memberKeys.lists() });
    },
    onError: (error) => {
      console.error('Upload bulk members error:', error);
    },
  });
};