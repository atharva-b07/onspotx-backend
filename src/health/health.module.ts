import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';

/**
 * Health module containing health check functionality
 * Provides endpoints for monitoring application health and status
 */
@Module({
  controllers: [HealthController],
  providers: [],
  exports: [],
})
export class HealthModule {} 