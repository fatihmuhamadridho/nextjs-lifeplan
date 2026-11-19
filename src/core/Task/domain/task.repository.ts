import type { TaskInput, TaskListParams, TaskListResponse, TaskResponse } from './task.interface';

export abstract class TaskRepository {
  abstract list(params?: TaskListParams): Promise<TaskListResponse>;
  abstract get(id: string): Promise<TaskResponse>;
  abstract create(input: TaskInput): Promise<TaskResponse>;
  abstract update(id: string, input: Partial<TaskInput>): Promise<TaskResponse>;
  abstract delete(id: string): Promise<void>;
}
