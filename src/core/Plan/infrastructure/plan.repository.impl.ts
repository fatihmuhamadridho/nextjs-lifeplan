import { lifePlanApi } from '@services/axios.service';
import type {
  PlanInput,
  PlanListParams,
  PlanListResponse,
  PlanResponse,
  WeekInput,
  WeekListParams,
  WeekListResponse,
  WeekResponse,
} from '../domain/plan.interface';
import { PlanRepository } from '../domain/plan.repository';

export class PlanRepositoryImpl extends PlanRepository {
  listPlans(params?: PlanListParams) {
    return lifePlanApi.get<PlanListResponse>('/plans', { params });
  }
  getPlan(id: string) {
    return lifePlanApi.get<PlanResponse>(`/plans/${encodeURIComponent(id)}`);
  }
  createPlan(input: PlanInput) {
    return lifePlanApi.post<PlanResponse, PlanInput>('/plans', input);
  }
  updatePlan(id: string, input: Partial<PlanInput>) {
    return lifePlanApi.patch<PlanResponse, Partial<PlanInput>>(`/plans/${encodeURIComponent(id)}`, input);
  }
  deletePlan(id: string) {
    return lifePlanApi.delete<void>(`/plans/${encodeURIComponent(id)}`);
  }
  listWeeks(params?: WeekListParams) {
    return lifePlanApi.get<WeekListResponse>('/weeks', { params });
  }
  getWeek(id: string) {
    return lifePlanApi.get<WeekResponse>(`/weeks/${encodeURIComponent(id)}`);
  }
  createWeek(input: WeekInput) {
    return lifePlanApi.post<WeekResponse, WeekInput>('/weeks', input);
  }
  duplicateWeek(id: string, input: WeekInput) {
    return lifePlanApi.post<WeekResponse, WeekInput>(`/weeks/${encodeURIComponent(id)}/duplicate`, input);
  }
  updateWeek(id: string, input: Partial<WeekInput>) {
    return lifePlanApi.patch<WeekResponse, Partial<WeekInput>>(`/weeks/${encodeURIComponent(id)}`, input);
  }
  deleteWeek(id: string) {
    return lifePlanApi.delete<void>(`/weeks/${encodeURIComponent(id)}`);
  }
}
