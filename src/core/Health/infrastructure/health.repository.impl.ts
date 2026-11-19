import { getLifePlanApiOrigin, lifePlanApi } from '@services/axios.service';
import type { HealthStatus } from '../domain/health.interface';
import { HealthRepository } from '../domain/health.repository';

export class HealthRepositoryImpl extends HealthRepository {
  getStatus() {
    return lifePlanApi.get<HealthStatus>(getLifePlanApiOrigin());
  }
}
