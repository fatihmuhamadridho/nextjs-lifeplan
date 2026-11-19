'use client';

import { useQuery } from '@tanstack/react-query';
import { HealthController } from '../domain/health.controller';

const controller = new HealthController();

export function useGetHealth() {
  return useQuery({ queryKey: ['health'], queryFn: () => controller.getStatus() });
}
