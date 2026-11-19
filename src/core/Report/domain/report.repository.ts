import type { OverviewReportResponse, WeeklyReportResponse } from './report.interface';

export abstract class ReportRepository {
  abstract getOverview(): Promise<OverviewReportResponse>;
  abstract getWeekly(year?: number): Promise<WeeklyReportResponse>;
}
