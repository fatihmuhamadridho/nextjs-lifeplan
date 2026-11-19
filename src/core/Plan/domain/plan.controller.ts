import { PlanRepositoryImpl } from '../infrastructure/plan.repository.impl';
import type { PlanRepository } from './plan.repository';

export class PlanController {
  constructor(private readonly repository: PlanRepository = new PlanRepositoryImpl()) {}

  listPlans(...args: Parameters<PlanRepository['listPlans']>) {
    return this.repository.listPlans(...args);
  }
  getPlan(...args: Parameters<PlanRepository['getPlan']>) {
    return this.repository.getPlan(...args);
  }
  createPlan(...args: Parameters<PlanRepository['createPlan']>) {
    return this.repository.createPlan(...args);
  }
  updatePlan(...args: Parameters<PlanRepository['updatePlan']>) {
    return this.repository.updatePlan(...args);
  }
  deletePlan(...args: Parameters<PlanRepository['deletePlan']>) {
    return this.repository.deletePlan(...args);
  }
  listWeeks(...args: Parameters<PlanRepository['listWeeks']>) {
    return this.repository.listWeeks(...args);
  }
  getWeek(...args: Parameters<PlanRepository['getWeek']>) {
    return this.repository.getWeek(...args);
  }
  createWeek(...args: Parameters<PlanRepository['createWeek']>) {
    return this.repository.createWeek(...args);
  }
  duplicateWeek(...args: Parameters<PlanRepository['duplicateWeek']>) {
    return this.repository.duplicateWeek(...args);
  }
  updateWeek(...args: Parameters<PlanRepository['updateWeek']>) {
    return this.repository.updateWeek(...args);
  }
  deleteWeek(...args: Parameters<PlanRepository['deleteWeek']>) {
    return this.repository.deleteWeek(...args);
  }
}
