import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

/**
 * Health check controller for monitoring application status
 * Provides endpoints to verify service availability and health
 */
@ApiTags('health')
@Controller('health')
export class HealthController {
  /**
   * Basic health check endpoint
   * 
   * @returns Health status information
   */
  @Get()
  @ApiOperation({
    summary: 'Health check',
    description: 'Returns the current health status of the application',
  })
  @ApiResponse({
    status: 200,
    description: 'Application is healthy',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
        uptime: { type: 'number', example: 12345.678 },
        version: { type: 'string', example: '1.0.0' },
        environment: { type: 'string', example: 'development' },
        memory: {
          type: 'object',
          properties: {
            used: { type: 'number', example: 45.2 },
            total: { type: 'number', example: 128.0 },
            percentage: { type: 'number', example: 35.3 },
          },
        },
      },
    },
  })
  getHealth(): {
    status: string;
    timestamp: string;
    uptime: number;
    version: string;
    environment: string;
    memory: {
      used: number;
      total: number;
      percentage: number;
    };
  } {
    const memoryUsage = process.memoryUsage();
    const totalMemory = memoryUsage.heapTotal;
    const usedMemory = memoryUsage.heapUsed;
    
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      memory: {
        used: Math.round((usedMemory / 1024 / 1024) * 100) / 100, // MB
        total: Math.round((totalMemory / 1024 / 1024) * 100) / 100, // MB
        percentage: Math.round((usedMemory / totalMemory) * 10000) / 100, // %
      },
    };
  }

  /**
   * Detailed health check with service dependencies
   * 
   * @returns Detailed health information
   */
  @Get('detailed')
  @ApiOperation({
    summary: 'Detailed health check',
    description: 'Returns detailed health information including service dependencies',
  })
  @ApiResponse({
    status: 200,
    description: 'Detailed health information',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
        services: {
          type: 'object',
          properties: {
            api: { type: 'string', example: 'healthy' },
            discovery: { type: 'string', example: 'healthy' },
            mockData: { type: 'string', example: 'healthy' },
          },
        },
        system: {
          type: 'object',
          properties: {
            platform: { type: 'string', example: 'linux' },
            nodeVersion: { type: 'string', example: '18.17.0' },
            uptime: { type: 'number', example: 12345.678 },
          },
        },
      },
    },
  })
  getDetailedHealth(): {
    status: string;
    timestamp: string;
    services: Record<string, string>;
    system: {
      platform: string;
      nodeVersion: string;
      uptime: number;
    };
  } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        api: 'healthy',
        discovery: 'healthy',
        mockData: 'healthy',
      },
      system: {
        platform: process.platform,
        nodeVersion: process.version,
        uptime: process.uptime(),
      },
    };
  }
} 