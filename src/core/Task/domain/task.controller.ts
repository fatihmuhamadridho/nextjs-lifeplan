import { TaskRepositoryImpl } from '../infrastructure/task.repository.impl';
import type { TaskRepository } from './task.repository';

export class TaskController {
  constructor(private readonly repository: TaskRepository = new TaskRepositoryImpl()) {}

  list(...args: Parameters<TaskRepository['list']>) {
    return this.repository.list(...args);
  }
  get(...args: Parameters<TaskRepository['get']>) {
    return this.repository.get(...args);
  }
  create(...args: Parameters<TaskRepository['create']>) {
    return this.repository.create(...args);
  }
  update(...args: Parameters<TaskRepository['update']>) {
    return this.repository.update(...args);
  }
  delete(...args: Parameters<TaskRepository['delete']>) {
    return this.repository.delete(...args);
  }
}
