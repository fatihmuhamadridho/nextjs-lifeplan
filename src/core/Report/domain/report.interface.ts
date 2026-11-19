import type { DataResponse } from '@interfaces/api.interface';

export type OverviewReport = {
  tasks: { total: number; completed: number; failed: number; active: number };
  plans: { total: number };
  goals: { total: number; averageProgress: number };
};
export type WeeklyReport = {
  week: string;
  start: string;
  end: string;
  month: number;
  successRate: number | null;
  failedRate: number | null;
  successCount: number;
  failedCount: number;
}[];
export type OverviewReportResponse = DataResponse<OverviewReport>;
export type WeeklyReportResponse = DataResponse<WeeklyReport>;
