import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Center, CreateCenterData, UpdateCenterData } from '../../types/center';
import { 
  getAllCenters, 
  getCenterById, 
  createCenter, 
  updateCenter, 
  deleteCenter 
} from '../../api/centerApi';

// Query Keys
export const centerKeys = {
  all: ['centers'] as const,
  lists: () => [...centerKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...centerKeys.lists(), { filters }] as const,
  details: () => [...centerKeys.all, 'detail'] as const,
  detail: (id: string) => [...centerKeys.details(), id] as const,
};

// Get All Centers Query
export const useCentersQuery = (filters?: Record<string, any>) => {
  return useQuery({
    queryKey: centerKeys.list(filters || {}),
    queryFn: async () => {
      const response = await getAllCenters();
      if (!response.success) {
        throw new Error('Failed to fetch centers');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get Center by ID Query
export const useCenterQuery = (id: string) => {
  return useQuery({
    queryKey: centerKeys.detail(id),
    queryFn: async () => {
      const response = await getCenterById(id);
      if (!response.success) {
        throw new Error('Failed to fetch center');
      }
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create Center Mutation
export const useCreateCenterMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateCenterData) => {
      const response = await createCenter(data);
      if (!response.success) {
        throw new Error('Failed to create center');
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch centers list
      queryClient.invalidateQueries({ queryKey: centerKeys.lists() });
    },
    onError: (error) => {
      console.error('Create center error:', error);
    },
  });
};

// Update Center Mutation
export const useUpdateCenterMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: UpdateCenterData) => {
      const response = await updateCenter(data);
      if (!response.success) {
        throw new Error('Failed to update center');
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Update the specific center in cache
      queryClient.setQueryData(centerKeys.detail(variables.center_id), data);
      
      // Invalidate and refetch centers list
      queryClient.invalidateQueries({ queryKey: centerKeys.lists() });
    },
    onError: (error) => {
      console.error('Update center error:', error);
    },
  });
};

// Delete Center Mutation
export const useDeleteCenterMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await deleteCenter(id);
      return id;
    },
    onSuccess: (deletedId) => {
      // Remove the deleted center from cache
      queryClient.removeQueries({ queryKey: centerKeys.detail(deletedId) });
      
      // Invalidate and refetch centers list
      queryClient.invalidateQueries({ queryKey: centerKeys.lists() });
    },
    onError: (error) => {
      console.error('Delete center error:', error);
    },
  });
};