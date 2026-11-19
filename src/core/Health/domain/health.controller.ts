import { HealthRepositoryImpl } from '../infrastructure/health.repository.impl';
import type { HealthRepository } from './health.repository';

export class HealthController {
  constructor(private readonly repository: HealthRepository = new HealthRepositoryImpl()) {}

  getStatus(...args: Parameters<HealthRepository['getStatus']>) {
    return this.repository.getStatus(...args);
  }
}
