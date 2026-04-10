'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

export function useLeads(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) {
  return useQuery({
    queryKey: ['leads', params],
    queryFn: async () => {
      const { data } = await api.get('/leads', { params });
      return data;
    },
  });
}

export function useLead(id: string) {
  return useQuery({
    queryKey: ['lead', id],
    queryFn: async () => {
      const { data } = await api.get(`/leads/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useLeadActivity(id: string) {
  return useQuery({
    queryKey: ['lead-activity', id],
    queryFn: async () => {
      const { data } = await api.get(`/leads/${id}/activity`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: Record<string, unknown>) => api.post('/leads', dto).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }),
  });
}

export function useUpdateLeadStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, remarks }: { id: string; status: string; remarks?: string }) =>
      api.patch(`/leads/${id}/status`, { status, remarks }).then((r) => r.data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['leads'] });
      qc.invalidateQueries({ queryKey: ['lead', id] });
    },
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data } = await api.get('/leads/dashboard/stats');
      return data;
    },
  });
}
