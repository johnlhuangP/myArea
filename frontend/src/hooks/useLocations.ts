import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { CreateLocationRequest } from '@/types';

export function useLocations(city?: string, category?: string) {
    return useQuery({
        queryKey: ['locations', city, category],
        queryFn: () => apiClient.getLocations(city, category),
    });
}

export function useLocation(id: string) {
    return useQuery({
        queryKey: ['location', id],
        queryFn: () => apiClient.getLocation(id),
        enabled: !!id,
    });
}

export function useCreateLocation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateLocationRequest) => apiClient.createLocation(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['locations'] });
        },
    });
}

export function useUpdateLocation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<CreateLocationRequest> }) =>
            apiClient.updateLocation(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['locations'] });
            queryClient.invalidateQueries({ queryKey: ['location', id] });
        },
    });
}

export function useDeleteLocation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => apiClient.deleteLocation(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['locations'] });
        },
    });
}

export function useUserLocations(username: string) {
    return useQuery({
        queryKey: ['userLocations', username],
        queryFn: () => apiClient.getUserLocations(username),
        enabled: !!username,
    });
} 