'use client';

import { useQuery } from '@tanstack/react-query';
import { ReportController } from '../domain/report.controller';

const controller = new ReportController();

export function useGetOverviewReport() {
  return useQuery({
    queryKey: ['reports', 'overview'],
    queryFn: () => controller.getOverview(),
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  });
}

export function useGetWeeklyReport(year?: number) {
  return useQuery({
    queryKey: ['reports', 'weekly', year],
    queryFn: () => controller.getWeekly(year),
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  });
}
