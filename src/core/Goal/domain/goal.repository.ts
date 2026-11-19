import type {
  GoalInput,
  GoalListParams,
  GoalListResponse,
  GoalResponse,
  GoalUpdateInput,
  MilestoneInput,
  MilestoneListResponse,
  MilestoneResponse,
} from './goal.interface';

export abstract class GoalRepository {
  abstract list(params?: GoalListParams): Promise<GoalListResponse>;
  abstract get(id: string): Promise<GoalResponse>;
  abstract create(input: GoalInput): Promise<GoalResponse>;
  abstract update(id: string, input: GoalUpdateInput): Promise<GoalResponse>;
  abstract delete(id: string): Promise<void>;
  abstract listMilestones(goalId: string): Promise<MilestoneListResponse>;
  abstract createMilestone(goalId: string, input: MilestoneInput): Promise<MilestoneResponse>;
  abstract updateMilestone(goalId: string, id: string, input: Partial<MilestoneInput>): Promise<MilestoneResponse>;
  abstract deleteMilestone(goalId: string, id: string): Promise<void>;
}
