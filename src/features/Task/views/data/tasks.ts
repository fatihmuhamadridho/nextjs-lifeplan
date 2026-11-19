import type { Task, TaskStatus } from '@core/Task/domain/task.interface';

export type { Task, TaskStatus };
export const taskStatuses: TaskStatus[] = ['To Do', 'In Progress', 'Completed', 'Failed'];
export const taskStatusColors = { 'To Do': 'gray', 'In Progress': 'blue', Completed: 'teal', Failed: 'red' };

export function taskProgress(task: Task) {
  return task.target > 0 ? (task.current / task.target) * 100 : 0;
}

export function taskStatus(task: Task, now = new Date()): TaskStatus {
  if (task.status) return task.status;
  if (task.manualStatus === 'Completed') return 'Completed';
  const due = task.effectiveDue ?? task.due;
  const deadline = due ? new Date(`${due}T23:59:59.999Z`).getTime() : Infinity;
  const reached = task.target > 0 && taskProgress(task) >= task.successThreshold;
  if (now.getTime() > deadline) return reached ? 'Completed' : 'Failed';
  if (task.manualStatus) return task.manualStatus;
  if (reached) return 'Completed';
  return task.current > 0 ? 'In Progress' : 'To Do';
}

export function updateTaskProgress(task: Task, patch: Partial<Task>): Task {
  return { ...task, ...patch };
}
