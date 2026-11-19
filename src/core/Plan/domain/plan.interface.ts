import type { DataResponse, PaginatedResponse } from '@interfaces/api.interface';

export type PlanStatus = 'In Progress' | 'Completed' | 'On Hold' | 'Not Started';
export type Plan = {
  id: string;
  name: string;
  goal: string;
  timeline: string;
  progress: number;
  weeks: number;
  tasks: number;
  focus: string;
  status: PlanStatus;
  createdAt: string;
  updatedAt: string;
};
export type PlanInput = Omit<Plan, 'id' | 'createdAt' | 'updatedAt'>;
export type Week = { id: string; planId: string; week: string; start: string; end: string; createdAt: string; updatedAt: string };
export type WeekInput = Pick<Week, 'planId' | 'week' | 'start' | 'end'>;
export type PlanListResponse = PaginatedResponse<Plan>;
export type PlanResponse = DataResponse<Plan>;
export type WeekListResponse = PaginatedResponse<Week>;
export type WeekResponse = DataResponse<Week>;
export type PlanListParams = { page?: number; limit?: number };
export type WeekListParams = PlanListParams & { planId?: string };
