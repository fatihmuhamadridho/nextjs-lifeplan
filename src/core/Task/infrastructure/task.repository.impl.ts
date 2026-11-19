import { lifePlanApi } from '@services/axios.service';
import type { TaskInput, TaskListParams, TaskListResponse, TaskResponse } from '../domain/task.interface';
import { TaskRepository } from '../domain/task.repository';

export class TaskRepositoryImpl extends TaskRepository {
  list(params?: TaskListParams) {
    return lifePlanApi.get<TaskListResponse>('/tasks', { params });
  }
  get(id: string) {
    return lifePlanApi.get<TaskResponse>(`/tasks/${encodeURIComponent(id)}`);
  }
  create(input: TaskInput) {
    return lifePlanApi.post<TaskResponse, TaskInput>('/tasks', input);
  }
  update(id: string, input: Partial<TaskInput>) {
    return lifePlanApi.patch<TaskResponse, Partial<TaskInput>>(`/tasks/${encodeURIComponent(id)}`, input);
  }
  delete(id: string) {
    return lifePlanApi.delete<void>(`/tasks/${encodeURIComponent(id)}`);
  }
}
