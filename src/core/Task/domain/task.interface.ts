import type { DataResponse, PaginatedResponse } from '@interfaces/api.interface';

export type TaskPriority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'To Do' | 'In Progress' | 'Completed' | 'Failed';
export type Task = {
  id: string;
  title: string;
  plan: string;
  due?: string | null;
  priority: TaskPriority;
  current: number;
  target: number;
  successThreshold: number;
  week?: string | null;
  manualStatus?: TaskStatus | null;
  effectiveDue?: string | null;
  status?: TaskStatus;
  reachedAt: string | null;
  createdAt: string;
  updatedAt: string;
};
export type TaskInput = Pick<Task, 'title' | 'plan' | 'priority' | 'current' | 'target' | 'successThreshold'> &
  Partial<Pick<Task, 'due' | 'week' | 'manualStatus'>>;
export type TaskListParams = { page?: number; limit?: number; plan?: string; week?: string };
export type TaskListResponse = PaginatedResponse<Task>;
export type TaskResponse = DataResponse<Task>;
