'use client';

import { useCallback, useMemo } from 'react';
import { useCreateTask, useDeleteTask, useListTasks, useUpdateTask } from '@core/Task/infrastructure/task.hook';
import type { TaskInput } from '@core/Task/domain/task.interface';
import type { Task } from './tasks';

export function useTasks() {
  const query = useListTasks();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const tasks = useMemo(() => (query.data?.data ?? []) as Task[], [query.data?.data]);

  const setTasks = useCallback(
    (update: Task[] | ((current: Task[]) => Task[])) => {
      const next = typeof update === 'function' ? update(tasks) : update;
      const existingIds = new Set(tasks.map((task) => task.id));
      const nextIds = new Set(next.map((task) => task.id));

      tasks.filter((task) => !nextIds.has(task.id)).forEach((task) => deleteTask.mutate(String(task.id)));
      next.forEach((task) => {
        const previous = tasks.find((item) => item.id === task.id);
        const input: TaskInput = {
          title: task.title,
          plan: task.plan,
          due: task.due,
          priority: task.priority as TaskInput['priority'],
          current: task.current,
          target: task.target,
          successThreshold: task.successThreshold,
          week: task.week ?? null,
          ...(task.manualStatus !== previous?.manualStatus ? { manualStatus: task.manualStatus ?? null } : {}),
        };
        if (!existingIds.has(task.id)) createTask.mutate(input);
        else if (previous && JSON.stringify(previous) !== JSON.stringify(task)) {
          updateTask.mutate({ id: String(task.id), input });
        }
      });
    },
    [createTask, deleteTask, tasks, updateTask]
  );

  return [tasks, setTasks, query] as const;
}
