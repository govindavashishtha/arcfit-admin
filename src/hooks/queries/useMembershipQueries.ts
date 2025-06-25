import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  Membership, 
  CreateMembershipData, 
  MembershipQueryParams 
} from '../../types/membership';
import { 
  getAllMemberships,
  getMembershipsBySociety, 
  getMembershipById, 
  createMembership, 
  updateMembership, 
  deleteMembership 
} from '../../api/membershipsApi';

// Query Keys
export const membershipKeys = {
  all: ['memberships'] as const,
  lists: () => [...membershipKeys.all, 'list'] as const,
  list: (params: MembershipQueryParams) => [...membershipKeys.lists(), params] as const,
  societyLists: () => [...membershipKeys.all, 'society-list'] as const,
  societyList: (societyId: string, params: MembershipQueryParams) => [...membershipKeys.societyLists(), societyId, params] as const,
  details: () => [...membershipKeys.all, 'detail'] as const,
  detail: (id: string) => [...membershipKeys.details(), id] as const,
};

// Get All Memberships Query with Pagination and Filters
export const useMembershipsQuery = (params?: MembershipQueryParams) => {
  return useQuery({
    queryKey: membershipKeys.list(params || {}),
    queryFn: async () => {
      const response = await getAllMemberships(params);
      if (!response.success) {
        throw new Error('Failed to fetch memberships');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get Memberships by Society Query with Pagination and Filters
export const useMembershipsBySocietyQuery = (societyId: string, params?: MembershipQueryParams) => {
  return useQuery({
    queryKey: membershipKeys.societyList(societyId, params || {}),
    queryFn: async () => {
      const response = await getMembershipsBySociety(societyId, params);
      if (!response.success) {
        throw new Error('Failed to fetch memberships');
      }
      return response.data;
    },
    enabled: !!societyId, // Only fetch when society is selected
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get Membership by ID Query
export const useMembershipQuery = (id: string) => {
  return useQuery({
    queryKey: membershipKeys.detail(id),
    queryFn: async () => {
      const response = await getMembershipById(id);
      if (!response.success) {
        throw new Error('Failed to fetch membership');
      }
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create Membership Mutation
export const useCreateMembershipMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateMembershipData) => {
      const response = await createMembership(data);
      if (!response.success) {
        throw new Error('Failed to create membership');
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch memberships list
      queryClient.invalidateQueries({ queryKey: membershipKeys.lists() });
      queryClient.invalidateQueries({ queryKey: membershipKeys.societyLists() });
    },
    onError: (error) => {
      console.error('Create membership error:', error);
    },
  });
};

// Update Membership Mutation
export const useUpdateMembershipMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateMembershipData> }) => {
      const response = await updateMembership(id, data);
      if (!response.success) {
        throw new Error('Failed to update membership');
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Update the specific membership in cache
      queryClient.setQueryData(membershipKeys.detail(variables.id), data);
      
      // Invalidate and refetch memberships list
      queryClient.invalidateQueries({ queryKey: membershipKeys.lists() });
      queryClient.invalidateQueries({ queryKey: membershipKeys.societyLists() });
    },
    onError: (error) => {
      console.error('Update membership error:', error);
    },
  });
};

// Delete Membership Mutation
export const useDeleteMembershipMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await deleteMembership(id);
      return id;
    },
    onSuccess: (deletedId) => {
      // Remove the deleted membership from cache
      queryClient.removeQueries({ queryKey: membershipKeys.detail(deletedId) });
      
      // Invalidate and refetch memberships list
      queryClient.invalidateQueries({ queryKey: membershipKeys.lists() });
      queryClient.invalidateQueries({ queryKey: membershipKeys.societyLists() });
    },
    onError: (error) => {
      console.error('Delete membership error:', error);
    },
  });
};