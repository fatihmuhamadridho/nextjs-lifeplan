import { ReportRepositoryImpl } from '../infrastructure/report.repository.impl';
import type { ReportRepository } from './report.repository';

export class ReportController {
  constructor(private readonly repository: ReportRepository = new ReportRepositoryImpl()) {}

  getOverview(...args: Parameters<ReportRepository['getOverview']>) {
    return this.repository.getOverview(...args);
  }
  getWeekly(...args: Parameters<ReportRepository['getWeekly']>) {
    return this.repository.getWeekly(...args);
  }
}
