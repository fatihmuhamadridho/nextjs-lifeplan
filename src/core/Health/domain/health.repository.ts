import type { HealthStatus } from './health.interface';

export abstract class HealthRepository {
  abstract getStatus(): Promise<HealthStatus>;
}
