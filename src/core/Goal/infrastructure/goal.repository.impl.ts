import { lifePlanApi } from '@services/axios.service';
import type {
  GoalInput,
  GoalListParams,
  GoalListResponse,
  GoalResponse,
  GoalUpdateInput,
  MilestoneInput,
  MilestoneListResponse,
  MilestoneResponse,
} from '../domain/goal.interface';
import { GoalRepository } from '../domain/goal.repository';

export class GoalRepositoryImpl extends GoalRepository {
  list(params?: GoalListParams) {
    return lifePlanApi.get<GoalListResponse>('/goals', { params });
  }
  get(id: string) {
    return lifePlanApi.get<GoalResponse>(`/goals/${encodeURIComponent(id)}`);
  }
  create(input: GoalInput) {
    return lifePlanApi.post<GoalResponse, GoalInput>('/goals', input);
  }
  update(id: string, input: GoalUpdateInput) {
    return lifePlanApi.patch<GoalResponse, GoalUpdateInput>(`/goals/${encodeURIComponent(id)}`, input);
  }
  delete(id: string) {
    return lifePlanApi.delete<void>(`/goals/${encodeURIComponent(id)}`);
  }
  listMilestones(goalId: string) {
    return lifePlanApi.get<MilestoneListResponse>(`/goals/${encodeURIComponent(goalId)}/milestones`);
  }
  createMilestone(goalId: string, input: MilestoneInput) {
    return lifePlanApi.post<MilestoneResponse, MilestoneInput>(`/goals/${encodeURIComponent(goalId)}/milestones`, input);
  }
  updateMilestone(goalId: string, id: string, input: Partial<MilestoneInput>) {
    return lifePlanApi.patch<MilestoneResponse, Partial<MilestoneInput>>(
      `/goals/${encodeURIComponent(goalId)}/milestones/${encodeURIComponent(id)}`,
      input
    );
  }
  deleteMilestone(goalId: string, id: string) {
    return lifePlanApi.delete<void>(`/goals/${encodeURIComponent(goalId)}/milestones/${encodeURIComponent(id)}`);
  }
}
