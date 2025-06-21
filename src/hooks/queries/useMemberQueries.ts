import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Member, CreateMemberData, UpdateMemberData } from '../../api/membersApi';
import { 
  getAllMembers, 
  getMemberById, 
  createMember, 
  updateMember, 
  deleteMember 
} from '../../api/membersApi';

// Query Keys
export const memberKeys = {
  all: ['members'] as const,
  lists: () => [...memberKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...memberKeys.lists(), { filters }] as const,
  details: () => [...memberKeys.all, 'detail'] as const,
  detail: (id: string) => [...memberKeys.details(), id] as const,
};

// Get All Members Query
export const useMembersQuery = (filters?: Record<string, any>) => {
  return useQuery({
    queryKey: memberKeys.list(filters || {}),
    queryFn: async () => {
      const response = await getAllMembers();
      if (!response.success) {
        throw new Error('Failed to fetch members');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get Member by ID Query
export const useMemberQuery = (id: string) => {
  return useQuery({
    queryKey: memberKeys.detail(id),
    queryFn: async () => {
      const response = await getMemberById(id);
      if (!response.success) {
        throw new Error('Failed to fetch member');
      }
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create Member Mutation
export const useCreateMemberMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateMemberData) => {
      const response = await createMember(data);
      if (!response.success) {
        throw new Error('Failed to create member');
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch members list
      queryClient.invalidateQueries({ queryKey: memberKeys.lists() });
    },
    onError: (error) => {
      console.error('Create member error:', error);
    },
  });
};

// Update Member Mutation
export const useUpdateMemberMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: UpdateMemberData) => {
      const response = await updateMember(data);
      if (!response.success) {
        throw new Error('Failed to update member');
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Update the specific member in cache
      queryClient.setQueryData(memberKeys.detail(variables.id), data);
      
      // Invalidate and refetch members list
      queryClient.invalidateQueries({ queryKey: memberKeys.lists() });
    },
    onError: (error) => {
      console.error('Update member error:', error);
    },
  });
};

// Delete Member Mutation
export const useDeleteMemberMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await deleteMember(id);
      return id;
    },
    onSuccess: (deletedId) => {
      // Remove the deleted member from cache
      queryClient.removeQueries({ queryKey: memberKeys.detail(deletedId) });
      
      // Invalidate and refetch members list
      queryClient.invalidateQueries({ queryKey: memberKeys.lists() });
    },
    onError: (error) => {
      console.error('Delete member error:', error);
    },
  });
};