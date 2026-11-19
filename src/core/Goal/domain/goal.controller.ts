import { GoalRepositoryImpl } from '../infrastructure/goal.repository.impl';
import type { GoalRepository } from './goal.repository';

export class GoalController {
  constructor(private readonly repository: GoalRepository = new GoalRepositoryImpl()) {}

  list(...args: Parameters<GoalRepository['list']>) {
    return this.repository.list(...args);
  }
  get(...args: Parameters<GoalRepository['get']>) {
    return this.repository.get(...args);
  }
  create(...args: Parameters<GoalRepository['create']>) {
    return this.repository.create(...args);
  }
  update(...args: Parameters<GoalRepository['update']>) {
    return this.repository.update(...args);
  }
  delete(...args: Parameters<GoalRepository['delete']>) {
    return this.repository.delete(...args);
  }
  listMilestones(...args: Parameters<GoalRepository['listMilestones']>) {
    return this.repository.listMilestones(...args);
  }
  createMilestone(...args: Parameters<GoalRepository['createMilestone']>) {
    return this.repository.createMilestone(...args);
  }
  updateMilestone(...args: Parameters<GoalRepository['updateMilestone']>) {
    return this.repository.updateMilestone(...args);
  }
  deleteMilestone(...args: Parameters<GoalRepository['deleteMilestone']>) {
    return this.repository.deleteMilestone(...args);
  }
}
