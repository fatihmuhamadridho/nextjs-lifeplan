import type {
  PlanInput,
  PlanListParams,
  PlanListResponse,
  PlanResponse,
  WeekInput,
  WeekListParams,
  WeekListResponse,
  WeekResponse,
} from './plan.interface';

export abstract class PlanRepository {
  abstract listPlans(params?: PlanListParams): Promise<PlanListResponse>;
  abstract getPlan(id: string): Promise<PlanResponse>;
  abstract createPlan(input: PlanInput): Promise<PlanResponse>;
  abstract updatePlan(id: string, input: Partial<PlanInput>): Promise<PlanResponse>;
  abstract deletePlan(id: string): Promise<void>;
  abstract listWeeks(params?: WeekListParams): Promise<WeekListResponse>;
  abstract getWeek(id: string): Promise<WeekResponse>;
  abstract createWeek(input: WeekInput): Promise<WeekResponse>;
  abstract duplicateWeek(id: string, input: WeekInput): Promise<WeekResponse>;
  abstract updateWeek(id: string, input: Partial<WeekInput>): Promise<WeekResponse>;
  abstract deleteWeek(id: string): Promise<void>;
}
