import type { DataResponse, PaginatedResponse } from '@interfaces/api.interface';

export type Goal = {
  id: string;
  title: string;
  description: string;
  progress: number;
  color: string;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
};
export type GoalInput = Pick<Goal, 'title' | 'description' | 'progress' | 'color'>;
export type GoalUpdateInput = Partial<GoalInput> & { archived?: boolean };
export type Milestone = {
  id: string;
  title: string;
  timeline: string;
  progress: number;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
};
export type MilestoneInput = Pick<Milestone, 'title' | 'timeline' | 'progress'> & Partial<Pick<Milestone, 'startDate' | 'endDate'>>;
export type GoalListResponse = PaginatedResponse<Goal>;
export type GoalResponse = DataResponse<Goal>;
export type MilestoneListResponse = DataResponse<Milestone[]>;
export type MilestoneResponse = DataResponse<Milestone>;
export type GoalListParams = { page?: number; limit?: number; archived?: boolean };
