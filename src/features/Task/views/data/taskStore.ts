'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { initialTasks, type Task } from './tasks';

const key = 'lifeplan-tasks-v2';
let tasks = initialTasks;
let loaded = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
export function useTasks() {
  const snapshot = useSyncExternalStore(
    subscribe,
    () => tasks,
    () => initialTasks
  );
  useEffect(() => {
    if (!loaded) {
      loaded = true;
      try {
        const saved: unknown = JSON.parse(localStorage.getItem(key) ?? 'null');
        if (
          Array.isArray(saved) &&
          saved.every(
            (task) =>
              typeof task.id === 'number' &&
              typeof task.title === 'string' &&
              typeof task.plan === 'string' &&
              typeof task.priority === 'string' &&
              (task.due === null || typeof task.due === 'string') &&
              Number.isFinite(task.current) &&
              task.current >= 0 &&
              Number.isFinite(task.target) &&
              task.target > 0 &&
              Number.isFinite(task.successThreshold) &&
              task.successThreshold > 0 &&
              task.successThreshold <= 100 &&
              (task.reachedAt === null || typeof task.reachedAt === 'string')
          )
        )
          tasks = saved;
      } catch {
        /* Keep initial data when browser storage is unavailable. */
      }
      emit();
    }
    const timer = window.setInterval(() => {
      tasks = [...tasks];
      emit();
    }, 60000);
    return () => window.clearInterval(timer);
  }, []);
  const setTasks = (update: Task[] | ((current: Task[]) => Task[])) => {
    tasks = typeof update === 'function' ? update(tasks) : update;
    try {
      localStorage.setItem(key, JSON.stringify(tasks));
    } catch {
      /* Updates remain available for this session. */
    }
    emit();
  };
  return [snapshot, setTasks] as const;
}
