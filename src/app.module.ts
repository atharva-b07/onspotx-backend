import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import { DiscoveryModule } from './discovery/discovery.module';
import { HealthModule } from './health/health.module';
import { configuration } from './config/configuration';

/**
 * Root application module that orchestrates all feature modules
 * Configures global settings, rate limiting, and environment variables
 */
@Module({
  imports: [
    // Configuration module for environment variables
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env.local', '.env'],
      cache: true,
    }),
    
    // Rate limiting module to prevent abuse
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000, // 1 second
        limit: 10, // 10 requests per second
      },
      {
        name: 'medium',
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
      {
        name: 'long',
        ttl: 900000, // 15 minutes
        limit: 1000, // 1000 requests per 15 minutes
      },
    ]),
    
    // Feature modules
    DiscoveryModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {} 