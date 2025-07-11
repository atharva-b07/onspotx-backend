import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { 
  Place, 
  DiscoveryQuery, 
  DiscoveryResponse, 
  Coordinates 
} from '../../common/interfaces/location.interface';
import { DistanceUtil } from '../../common/utils/distance.util';
import { MockDataService } from './mock-data.service';

/**
 * Discovery service responsible for location-based place discovery
 * Handles business logic for filtering, sorting, and processing location queries
 */
@Injectable()
export class DiscoveryService {
  private readonly logger = new Logger(DiscoveryService.name);
  private readonly defaultRadius: number;
  private readonly maxRadius: number;
  private readonly maxResults: number;

  constructor(
    private readonly mockDataService: MockDataService,
    private readonly configService: ConfigService,
  ) {
    // Load configuration values
    this.defaultRadius = this.configService.get<number>('discovery.defaultRadius', 5.0);
    this.maxRadius = this.configService.get<number>('discovery.maxRadius', 50.0);
    this.maxResults = this.configService.get<number>('discovery.maxResults', 50);
  }

  /**
   * Discovers places based on location and filters
   * 
   * @param query - Discovery query parameters
   * @returns Promise resolving to discovery response
   */
  async discoverPlaces(query: DiscoveryQuery): Promise<DiscoveryResponse> {
    const startTime = Date.now();
    
    try {
      this.logger.log(`Starting discovery query: ${JSON.stringify(query)}`);
      
      // Validate query parameters
      this.validateQuery(query);
      
      // Set defaults for optional parameters
      const radius = query.radius || this.defaultRadius;
      const limit = Math.min(query.limit || 10, this.maxResults);
      
      // Get base data from mock service
      const allPlaces = query.category 
        ? this.mockDataService.getPlacesByCategory(query.category)
        : this.mockDataService.getAllPlaces();
      
      // Filter places within radius and calculate distances
      const centerPoint: Coordinates = {
        lat: query.latitude,
        lng: query.longitude,
      };
      
      const placesWithDistance = this.calculateDistances(allPlaces, centerPoint);
      const placesInRadius = this.filterByRadius(placesWithDistance, radius);
      
      // Sort by distance (closest first)
      const sortedPlaces = this.sortByDistance(placesInRadius);
      
      // Apply limit
      const limitedResults = sortedPlaces.slice(0, limit);
      
      // Build response
      const response: DiscoveryResponse = {
        results: limitedResults,
        total: limitedResults.length,
        query: {
          latitude: query.latitude,
          longitude: query.longitude,
          radius,
          category: query.category,
          limit,
        },
        metadata: {
          processing_time_ms: Date.now() - startTime,
          timestamp: new Date().toISOString(),
        },
      };
      
      this.logger.log(`Discovery completed: ${limitedResults.length} results in ${response.metadata.processing_time_ms}ms`);
      
      return response;
      
    } catch (error) {
      this.logger.error(`Discovery failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Gets available categories for filtering
   * 
   * @returns Array of available categories
   */
  getAvailableCategories(): string[] {
    return this.mockDataService.getAvailableCategories();
  }

  /**
   * Gets service statistics
   * 
   * @returns Object with service statistics
   */
  getServiceStatistics(): {
    dataStats: any;
    config: {
      defaultRadius: number;
      maxRadius: number;
      maxResults: number;
    };
  } {
    return {
      dataStats: this.mockDataService.getDataStatistics(),
      config: {
        defaultRadius: this.defaultRadius,
        maxRadius: this.maxRadius,
        maxResults: this.maxResults,
      },
    };
  }

  /**
   * Validates discovery query parameters
   * 
   * @param query - Query to validate
   * @throws Error if validation fails
   */
  private validateQuery(query: DiscoveryQuery): void {
    if (!DistanceUtil.isValidLatitude(query.latitude)) {
      throw new Error(`Invalid latitude: ${query.latitude}. Must be between -90 and 90.`);
    }
    
    if (!DistanceUtil.isValidLongitude(query.longitude)) {
      throw new Error(`Invalid longitude: ${query.longitude}. Must be between -180 and 180.`);
    }
    
    if (query.radius && (query.radius < 0.1 || query.radius > this.maxRadius)) {
      throw new Error(`Invalid radius: ${query.radius}. Must be between 0.1 and ${this.maxRadius} km.`);
    }
    
    if (query.limit && (query.limit < 1 || query.limit > this.maxResults)) {
      throw new Error(`Invalid limit: ${query.limit}. Must be between 1 and ${this.maxResults}.`);
    }
  }

  /**
   * Calculates distances for all places from a center point
   * 
   * @param places - Array of places
   * @param centerPoint - Center point for distance calculation
   * @returns Places with calculated distances
   */
  private calculateDistances(places: Place[], centerPoint: Coordinates): Place[] {
    return places.map(place => ({
      ...place,
      distance_km: DistanceUtil.calculateDistance(centerPoint, place.location),
    }));
  }

  /**
   * Filters places by radius
   * 
   * @param places - Places with distances
   * @param radius - Radius in kilometers
   * @returns Places within radius
   */
  private filterByRadius(places: Place[], radius: number): Place[] {
    return places.filter(place => place.distance_km <= radius);
  }

  /**
   * Sorts places by distance (closest first)
   * 
   * @param places - Places to sort
   * @returns Sorted places
   */
  private sortByDistance(places: Place[]): Place[] {
    return places.sort((a, b) => a.distance_km - b.distance_km);
  }

  /**
   * Finds the nearest place to a given location
   * 
   * @param latitude - Latitude of the search center
   * @param longitude - Longitude of the search center
   * @param category - Optional category filter
   * @returns Nearest place or null if none found
   */
  async findNearestPlace(
    latitude: number,
    longitude: number,
    category?: string,
  ): Promise<Place | null> {
    const query: DiscoveryQuery = {
      latitude,
      longitude,
      radius: this.maxRadius,
      category,
      limit: 1,
    };
    
    const response = await this.discoverPlaces(query);
    return response.results.length > 0 ? response.results[0] : null;
  }
} 