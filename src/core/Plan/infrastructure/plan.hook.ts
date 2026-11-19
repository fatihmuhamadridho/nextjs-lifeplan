'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PlanController } from '../domain/plan.controller';
import type { PlanInput, PlanListParams, WeekInput, WeekListParams } from '../domain/plan.interface';
import { fetchAllPages } from '@services/api-pagination.service';

const controller = new PlanController();
const planKeys = {
  all: ['plans'] as const,
  list: (params?: PlanListParams) => ['plans', 'list', params] as const,
  detail: (id: string) => ['plans', 'detail', id] as const,
};
const weekKeys = {
  all: ['weeks'] as const,
  list: (params?: WeekListParams) => ['weeks', 'list', params] as const,
  detail: (id: string) => ['weeks', 'detail', id] as const,
};

export function useListPlans(params?: PlanListParams) {
  return useQuery({
    queryKey: planKeys.list(params),
    queryFn: () => fetchAllPages((page, limit) => controller.listPlans({ ...params, page, limit })),
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  });
}
export function useGetPlan(id: string) {
  return useQuery({
    queryKey: planKeys.detail(id),
    queryFn: () => controller.getPlan(id),
    enabled: Boolean(id),
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  });
}
export function useListWeeks(params?: WeekListParams, enabled = true) {
  return useQuery({
    queryKey: weekKeys.list(params),
    enabled,
    queryFn: () => fetchAllPages((page, limit) => controller.listWeeks({ ...params, page, limit })),
  });
}
export function useGetWeek(id: string) {
  return useQuery({ queryKey: weekKeys.detail(id), queryFn: () => controller.getWeek(id), enabled: Boolean(id) });
}
export function useCreatePlan() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: PlanInput) => controller.createPlan(input),
    onSuccess: () =>
      Promise.all([
        client.invalidateQueries({ queryKey: planKeys.all }),
        client.invalidateQueries({ queryKey: ['goals'] }),
        client.invalidateQueries({ queryKey: ['reports'] }),
      ]),
  });
}
export function useUpdatePlan() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<PlanInput> }) => controller.updatePlan(id, input),
    onSuccess: (_data, variables) =>
      Promise.all([
        client.invalidateQueries({ queryKey: planKeys.all }),
        client.invalidateQueries({ queryKey: planKeys.detail(variables.id) }),
        client.invalidateQueries({ queryKey: ['tasks'] }),
        client.invalidateQueries({ queryKey: ['goals'] }),
        client.invalidateQueries({ queryKey: ['reports'] }),
      ]),
  });
}
export function useDeletePlan() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => controller.deletePlan(id),
    onSuccess: () =>
      Promise.all([
        client.invalidateQueries({ queryKey: planKeys.all }),
        client.invalidateQueries({ queryKey: ['tasks'] }),
        client.invalidateQueries({ queryKey: ['goals'] }),
        client.invalidateQueries({ queryKey: ['reports'] }),
      ]),
  });
}
export function useCreateWeek() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: WeekInput) => controller.createWeek(input),
    onSuccess: () =>
      Promise.all([
        client.invalidateQueries({ queryKey: weekKeys.all }),
        client.invalidateQueries({ queryKey: ['tasks'] }),
        client.invalidateQueries({ queryKey: ['plans'] }),
        client.invalidateQueries({ queryKey: ['goals'] }),
        client.invalidateQueries({ queryKey: ['reports'] }),
      ]),
  });
}
export function useUpdateWeek() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<WeekInput> }) => controller.updateWeek(id, input),
    onSuccess: (_data, variables) =>
      Promise.all([
        client.invalidateQueries({ queryKey: weekKeys.all }),
        client.invalidateQueries({ queryKey: weekKeys.detail(variables.id) }),
        client.invalidateQueries({ queryKey: ['tasks'] }),
        client.invalidateQueries({ queryKey: ['plans'] }),
        client.invalidateQueries({ queryKey: ['goals'] }),
        client.invalidateQueries({ queryKey: ['reports'] }),
      ]),
  });
}
export function useDuplicateWeek() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: WeekInput }) => controller.duplicateWeek(id, input),
    onSuccess: () =>
      Promise.all([
        client.invalidateQueries({ queryKey: weekKeys.all }),
        client.invalidateQueries({ queryKey: ['tasks'] }),
        client.invalidateQueries({ queryKey: ['plans'] }),
        client.invalidateQueries({ queryKey: ['goals'] }),
        client.invalidateQueries({ queryKey: ['reports'] }),
      ]),
  });
}
export function useDeleteWeek() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => controller.deleteWeek(id),
    onSuccess: () =>
      Promise.all([
        client.invalidateQueries({ queryKey: weekKeys.all }),
        client.invalidateQueries({ queryKey: ['tasks'] }),
        client.invalidateQueries({ queryKey: ['plans'] }),
        client.invalidateQueries({ queryKey: ['goals'] }),
        client.invalidateQueries({ queryKey: ['reports'] }),
      ]),
  });
}
