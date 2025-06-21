import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Trainer, CreateTrainerData, UpdateTrainerData } from '../../api/trainersApi';
import { 
  getAllTrainers, 
  getTrainerById, 
  createTrainer, 
  updateTrainer, 
  deleteTrainer 
} from '../../api/trainersApi';

// Query Keys
export const trainerKeys = {
  all: ['trainers'] as const,
  lists: () => [...trainerKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...trainerKeys.lists(), { filters }] as const,
  details: () => [...trainerKeys.all, 'detail'] as const,
  detail: (id: string) => [...trainerKeys.details(), id] as const,
};

// Get All Trainers Query
export const useTrainersQuery = (filters?: Record<string, any>) => {
  return useQuery({
    queryKey: trainerKeys.list(filters || {}),
    queryFn: async () => {
      const response = await getAllTrainers();
      if (!response.success) {
        throw new Error('Failed to fetch trainers');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get Trainer by ID Query
export const useTrainerQuery = (id: string) => {
  return useQuery({
    queryKey: trainerKeys.detail(id),
    queryFn: async () => {
      const response = await getTrainerById(id);
      if (!response.success) {
        throw new Error('Failed to fetch trainer');
      }
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create Trainer Mutation
export const useCreateTrainerMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateTrainerData) => {
      const response = await createTrainer(data);
      if (!response.success) {
        throw new Error('Failed to create trainer');
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch trainers list
      queryClient.invalidateQueries({ queryKey: trainerKeys.lists() });
    },
    onError: (error) => {
      console.error('Create trainer error:', error);
    },
  });
};

// Update Trainer Mutation
export const useUpdateTrainerMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: UpdateTrainerData) => {
      const response = await updateTrainer(data);
      if (!response.success) {
        throw new Error('Failed to update trainer');
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Update the specific trainer in cache
      queryClient.setQueryData(trainerKeys.detail(variables.id), data);
      
      // Invalidate and refetch trainers list
      queryClient.invalidateQueries({ queryKey: trainerKeys.lists() });
    },
    onError: (error) => {
      console.error('Update trainer error:', error);
    },
  });
};

// Delete Trainer Mutation
export const useDeleteTrainerMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await deleteTrainer(id);
      return id;
    },
    onSuccess: (deletedId) => {
      // Remove the deleted trainer from cache
      queryClient.removeQueries({ queryKey: trainerKeys.detail(deletedId) });
      
      // Invalidate and refetch trainers list
      queryClient.invalidateQueries({ queryKey: trainerKeys.lists() });
    },
    onError: (error) => {
      console.error('Delete trainer error:', error);
    },
  });
};