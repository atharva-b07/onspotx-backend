import { Module } from '@nestjs/common';
import { DiscoveryController } from './controllers/discovery.controller';
import { DiscoveryService } from './services/discovery.service';
import { MockDataService } from './services/mock-data.service';

/**
 * Discovery module containing all location discovery functionality
 * Provides controllers, services, and utilities for place discovery
 */
@Module({
  controllers: [DiscoveryController],
  providers: [DiscoveryService, MockDataService],
  exports: [DiscoveryService, MockDataService],
})
export class DiscoveryModule {} 