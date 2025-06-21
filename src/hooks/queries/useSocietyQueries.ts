import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Society, CreateSocietyData, UpdateSocietyData } from '../../types/society';
import { 
  getAllSocieties, 
  getSocietyById, 
  createSociety, 
  updateSociety, 
  deleteSociety 
} from '../../api/societyApi';

// Query Keys
export const societyKeys = {
  all: ['societies'] as const,
  lists: () => [...societyKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...societyKeys.lists(), { filters }] as const,
  details: () => [...societyKeys.all, 'detail'] as const,
  detail: (id: string) => [...societyKeys.details(), id] as const,
};

// Get All Societies Query
export const useSocietiesQuery = (filters?: Record<string, any>) => {
  return useQuery({
    queryKey: societyKeys.list(filters || {}),
    queryFn: async () => {
      const response = await getAllSocieties();
      if (!response.success) {
        throw new Error('Failed to fetch societies');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get Society by ID Query
export const useSocietyQuery = (id: string) => {
  return useQuery({
    queryKey: societyKeys.detail(id),
    queryFn: async () => {
      const response = await getSocietyById(id);
      if (!response.success) {
        throw new Error('Failed to fetch society');
      }
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create Society Mutation
export const useCreateSocietyMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateSocietyData) => {
      const response = await createSociety(data);
      if (!response.success) {
        throw new Error('Failed to create society');
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch societies list
      queryClient.invalidateQueries({ queryKey: societyKeys.lists() });
    },
    onError: (error) => {
      console.error('Create society error:', error);
    },
  });
};

// Update Society Mutation
export const useUpdateSocietyMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: UpdateSocietyData) => {
      const response = await updateSociety(data);
      if (!response.success) {
        throw new Error('Failed to update society');
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Update the specific society in cache
      queryClient.setQueryData(societyKeys.detail(variables.society_id), data);
      
      // Invalidate and refetch societies list
      queryClient.invalidateQueries({ queryKey: societyKeys.lists() });
    },
    onError: (error) => {
      console.error('Update society error:', error);
    },
  });
};

// Delete Society Mutation
export const useDeleteSocietyMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await deleteSociety(id);
      return id;
    },
    onSuccess: (deletedId) => {
      // Remove the deleted society from cache
      queryClient.removeQueries({ queryKey: societyKeys.detail(deletedId) });
      
      // Invalidate and refetch societies list
      queryClient.invalidateQueries({ queryKey: societyKeys.lists() });
    },
    onError: (error) => {
      console.error('Delete society error:', error);
    },
  });
};