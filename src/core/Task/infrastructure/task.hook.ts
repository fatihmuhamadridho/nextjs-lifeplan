'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { TaskController } from '../domain/task.controller';
import type { TaskInput, TaskListParams } from '../domain/task.interface';
import { fetchAllPages } from '@services/api-pagination.service';

const controller = new TaskController();
const keys = {
  all: ['tasks'] as const,
  list: (params?: TaskListParams) => ['tasks', 'list', params] as const,
  detail: (id: string) => ['tasks', 'detail', id] as const,
};

function invalidateTaskProgress(client: ReturnType<typeof useQueryClient>) {
  return Promise.all([keys.all, ['plans'], ['goals'], ['reports']].map((queryKey) => client.invalidateQueries({ queryKey })));
}

export function useListTasks(params?: TaskListParams) {
  return useQuery({
    queryKey: keys.list(params),
    queryFn: () => fetchAllPages((page, limit) => controller.list({ ...params, page, limit })),
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  });
}
export function useGetTask(id: string) {
  return useQuery({
    queryKey: keys.detail(id),
    queryFn: () => controller.get(id),
    enabled: Boolean(id),
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  });
}
export function useCreateTask() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: TaskInput) => controller.create(input),
    onSuccess: () => invalidateTaskProgress(client),
  });
}
export function useUpdateTask() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<TaskInput> }) => controller.update(id, input),
    onSuccess: (_data, variables) => Promise.all([invalidateTaskProgress(client), client.invalidateQueries({ queryKey: keys.detail(variables.id) })]),
  });
}
export function useDeleteTask() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => controller.delete(id),
    onSuccess: () => invalidateTaskProgress(client),
  });
}
