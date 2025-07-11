import { 
  Controller, 
  Get, 
  Query, 
  Logger, 
  HttpException, 
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiQuery,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';

import { DiscoveryService } from '../services/discovery.service';
import { DiscoveryQueryDto } from '../dto/discovery-query.dto';
import { DiscoveryResponseDto } from '../dto/discovery-response.dto';
import { DiscoveryQuery } from '../../common/interfaces/location.interface';

/**
 * Discovery controller handling location-based place discovery endpoints
 * Provides RESTful API for discovering nearby places with filtering and sorting
 */
@ApiTags('discovery')
@Controller('discover')
@UseGuards(ThrottlerGuard)
export class DiscoveryController {
  private readonly logger = new Logger(DiscoveryController.name);

  constructor(private readonly discoveryService: DiscoveryService) {}

  /**
   * Main discovery endpoint for finding nearby places
   * 
   * @param queryDto - Query parameters for discovery
   * @returns Promise resolving to discovery response
   */
  @Get()
  @ApiOperation({
    summary: 'Discover nearby places',
    description: `
      Discovers places near a given location with optional filtering by category and radius.
      Results are sorted by distance from the query location (closest first).
      
      **Features:**
      - Real-time distance calculation using Haversine formula
      - Category-based filtering (restaurants, cafes, bars, etc.)
      - Customizable search radius (0.1 - 50 km)
      - Configurable result limits (1 - 50 results)
      - Comprehensive place information including hours and images
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully discovered places',
    type: DiscoveryResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid query parameters',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'array', items: { type: 'string' } },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: { type: 'string', example: 'Internal server error' },
        error: { type: 'string', example: 'Internal Server Error' },
      },
    },
  })
  @ApiQuery({
    name: 'latitude',
    required: true,
    type: 'number',
    description: 'Latitude coordinate (-90 to 90)',
    example: 40.7128,
  })
  @ApiQuery({
    name: 'longitude',
    required: true,
    type: 'number',
    description: 'Longitude coordinate (-180 to 180)',
    example: -74.0060,
  })
  @ApiQuery({
    name: 'radius',
    required: false,
    type: 'number',
    description: 'Search radius in kilometers (0.1 to 50)',
    example: 5.0,
  })
  @ApiQuery({
    name: 'category',
    required: false,
    type: 'string',
    description: 'Category filter (restaurant, cafe, bar, etc.)',
    example: 'restaurant',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: 'number',
    description: 'Maximum number of results (1 to 50)',
    example: 10,
  })
  async discoverPlaces(
    @Query() queryDto: DiscoveryQueryDto,
  ): Promise<DiscoveryResponseDto> {
    try {
      this.logger.log(`Discovery request: ${JSON.stringify(queryDto)}`);
      
      // Convert DTO to internal query format
      const query: DiscoveryQuery = {
        latitude: queryDto.latitude,
        longitude: queryDto.longitude,
        radius: queryDto.radius,
        category: queryDto.category,
        limit: queryDto.limit,
      };
      
      // Execute discovery
      const response = await this.discoveryService.discoverPlaces(query);
      
      this.logger.log(`Discovery response: ${response.results.length} places found`);
      
      return response as DiscoveryResponseDto;
      
    } catch (error) {
      this.logger.error(`Discovery failed: ${error.message}`, error.stack);
      
      if (error.message.includes('Invalid')) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: error.message,
            error: 'Bad Request',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'An error occurred while discovering places',
          error: 'Internal Server Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get available categories for filtering
   * 
   * @returns Array of available categories
   */
  @Get('categories')
  @ApiOperation({
    summary: 'Get available categories',
    description: 'Returns all available place categories that can be used for filtering.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved categories',
    schema: {
      type: 'object',
      properties: {
        categories: {
          type: 'array',
          items: { type: 'string' },
          example: ['restaurant', 'cafe', 'bar', 'shop', 'hotel'],
        },
        total: { type: 'number', example: 15 },
      },
    },
  })
  async getCategories(): Promise<{ categories: string[]; total: number }> {
    try {
      const categories = this.discoveryService.getAvailableCategories();
      
      return {
        categories,
        total: categories.length,
      };
      
    } catch (error) {
      this.logger.error(`Failed to get categories: ${error.message}`, error.stack);
      
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'An error occurred while retrieving categories',
          error: 'Internal Server Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get service statistics and configuration
   * 
   * @returns Service statistics
   */
  @Get('stats')
  @ApiOperation({
    summary: 'Get service statistics',
    description: 'Returns statistics about the discovery service and available data.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved statistics',
    schema: {
      type: 'object',
      properties: {
        dataStats: {
          type: 'object',
          properties: {
            totalPlaces: { type: 'number', example: 12 },
            categoriesCount: { type: 'number', example: 8 },
            openPlaces: { type: 'number', example: 10 },
            closedPlaces: { type: 'number', example: 2 },
          },
        },
        config: {
          type: 'object',
          properties: {
            defaultRadius: { type: 'number', example: 5.0 },
            maxRadius: { type: 'number', example: 50.0 },
            maxResults: { type: 'number', example: 50 },
          },
        },
      },
    },
  })
  async getStatistics(): Promise<any> {
    try {
      return this.discoveryService.getServiceStatistics();
      
    } catch (error) {
      this.logger.error(`Failed to get statistics: ${error.message}`, error.stack);
      
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'An error occurred while retrieving statistics',
          error: 'Internal Server Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Find the nearest place to a location
   * 
   * @param queryDto - Query parameters
   * @returns Nearest place or null
   */
  @Get('nearest')
  @ApiOperation({
    summary: 'Find nearest place',
    description: 'Finds the single nearest place to a given location, optionally filtered by category.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully found nearest place',
    schema: {
      type: 'object',
      properties: {
        place: {
          type: 'object',
          nullable: true,
          description: 'Nearest place or null if none found',
        },
      },
    },
  })
  @ApiQuery({
    name: 'latitude',
    required: true,
    type: 'number',
    description: 'Latitude coordinate',
    example: 40.7128,
  })
  @ApiQuery({
    name: 'longitude',
    required: true,
    type: 'number',
    description: 'Longitude coordinate',
    example: -74.0060,
  })
  @ApiQuery({
    name: 'category',
    required: false,
    type: 'string',
    description: 'Optional category filter',
    example: 'restaurant',
  })
  async findNearest(
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
    @Query('category') category?: string,
  ): Promise<{ place: any }> {
    try {
      const place = await this.discoveryService.findNearestPlace(
        latitude,
        longitude,
        category,
      );
      
      return { place };
      
    } catch (error) {
      this.logger.error(`Failed to find nearest place: ${error.message}`, error.stack);
      
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'An error occurred while finding nearest place',
          error: 'Internal Server Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
} 