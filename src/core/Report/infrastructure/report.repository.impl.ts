import { lifePlanApi } from '@services/axios.service';
import type { OverviewReportResponse, WeeklyReportResponse } from '../domain/report.interface';
import { ReportRepository } from '../domain/report.repository';

export class ReportRepositoryImpl extends ReportRepository {
  getOverview() {
    return lifePlanApi.get<OverviewReportResponse>('/reports/overview');
  }
  getWeekly(year?: number) {
    return lifePlanApi.get<WeeklyReportResponse>('/reports/weekly', { params: { year } });
  }
}
