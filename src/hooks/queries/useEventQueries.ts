import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Event, EventQueryParams } from '../../types/event';
import { getAllEvents, getEventById, uploadBulkEvents, cancelEvent } from '../../api/eventsApi';

// Query Keys
export const eventKeys = {
  all: ['events'] as const,
  lists: () => [...eventKeys.all, 'list'] as const,
  list: (params: EventQueryParams) => [...eventKeys.lists(), params] as const,
  details: () => [...eventKeys.all, 'detail'] as const,
  detail: (id: string) => [...eventKeys.details(), id] as const,
  bulk: () => [...eventKeys.all, 'bulk'] as const,
};

// Get All Events Query with Pagination and Filters
export const useEventsQuery = (params?: EventQueryParams) => {
  return useQuery({
    queryKey: eventKeys.list(params || {}),
    queryFn: async () => {
      const response = await getAllEvents(params);
      if (!response.success) {
        throw new Error('Failed to fetch events');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get Event by ID Query
export const useEventQuery = (id: string) => {
  return useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: async () => {
      const response = await getEventById(id);
      if (!response.success) {
        throw new Error('Failed to fetch event');
      }
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Upload Bulk Events Mutation
export const useUploadBulkEventsMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ centerId, csvFile }: { centerId: string; csvFile: File }) => {
      const response = await uploadBulkEvents(centerId, csvFile);
      if (!response.success) {
        throw new Error('Failed to upload events');
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch events if we have event lists
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
    },
    onError: (error) => {
      console.error('Upload bulk events error:', error);
    },
  });
};

// Cancel Event Mutation
export const useCancelEventMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (eventId: string) => {
      const response = await cancelEvent(eventId);
      if (!response.success) {
        throw new Error('Failed to cancel event');
      }
      return response.data;
    },
    onSuccess: (data, eventId) => {
      // Update the specific event in cache
      queryClient.setQueryData(eventKeys.detail(eventId), data);
      
      // Invalidate and refetch events list
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
    },
    onError: (error) => {
      console.error('Cancel event error:', error);
    },
  });
};