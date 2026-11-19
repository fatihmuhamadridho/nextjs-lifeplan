'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { GoalController } from '../domain/goal.controller';
import type { GoalInput, GoalListParams, GoalUpdateInput, MilestoneInput } from '../domain/goal.interface';
import { fetchAllPages } from '@services/api-pagination.service';

const controller = new GoalController();
const keys = {
  all: ['goals'] as const,
  list: (params?: GoalListParams) => ['goals', 'list', params] as const,
  detail: (id: string) => ['goals', 'detail', id] as const,
  milestones: (goalId: string) => ['goals', goalId, 'milestones'] as const,
};

export function useListGoals(params?: GoalListParams) {
  return useQuery({
    queryKey: keys.list(params),
    queryFn: () => fetchAllPages((page, limit) => controller.list({ ...params, page, limit })),
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  });
}

export function useGetGoal(id: string) {
  return useQuery({
    queryKey: keys.detail(id),
    queryFn: () => controller.get(id),
    enabled: Boolean(id),
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  });
}

export function useListMilestones(goalId: string) {
  return useQuery({
    queryKey: keys.milestones(goalId),
    queryFn: () => controller.listMilestones(goalId),
    enabled: Boolean(goalId),
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  });
}

export function useCreateGoal() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: GoalInput) => controller.create(input),
    onSuccess: () => Promise.all([client.invalidateQueries({ queryKey: keys.all }), client.invalidateQueries({ queryKey: ['reports'] })]),
  });
}

export function useUpdateGoal() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: GoalUpdateInput }) => controller.update(id, input),
    onSuccess: (_data, variables) =>
      Promise.all([
        client.invalidateQueries({ queryKey: keys.all }),
        client.invalidateQueries({ queryKey: keys.detail(variables.id) }),
        client.invalidateQueries({ queryKey: ['plans'] }),
        client.invalidateQueries({ queryKey: ['reports'] }),
      ]),
  });
}

export function useDeleteGoal() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => controller.delete(id),
    onSuccess: () => Promise.all([client.invalidateQueries({ queryKey: keys.all }), client.invalidateQueries({ queryKey: ['reports'] })]),
  });
}

export function useCreateMilestone() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ goalId, input }: { goalId: string; input: MilestoneInput }) => controller.createMilestone(goalId, input),
    onSuccess: (_data, variables) => client.invalidateQueries({ queryKey: keys.milestones(variables.goalId) }),
  });
}

export function useUpdateMilestone() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ goalId, id, input }: { goalId: string; id: string; input: Partial<MilestoneInput> }) =>
      controller.updateMilestone(goalId, id, input),
    onSuccess: (_data, variables) => client.invalidateQueries({ queryKey: keys.milestones(variables.goalId) }),
  });
}

export function useDeleteMilestone() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ goalId, id }: { goalId: string; id: string }) => controller.deleteMilestone(goalId, id),
    onSuccess: (_data, variables) => client.invalidateQueries({ queryKey: keys.milestones(variables.goalId) }),
  });
}
