import { Injectable } from '@nestjs/common';
import { Place, PlaceCategory } from '../../common/interfaces/location.interface';

/**
 * Mock data service providing realistic location data for testing
 * In production, this would be replaced with actual database queries
 */
@Injectable()
export class MockDataService {
  /**
   * Static mock data representing various places in New York City area
   */
  private readonly mockPlaces: Place[] = [
    {
      id: 'rest_001',
      name: 'Trattoria Alfredo',
      category: PlaceCategory.RESTAURANT,
      description: 'Authentic Italian pasta, great ambiance and fresh ingredients.',
      distance_km: 0, // Will be calculated dynamically
      open_now: true,
      image_url: 'https://cdn.onspotx.ai/spots/alfredo.jpg',
      location: {
        lat: 40.7130,
        lng: -74.0050,
        address: '123 Main St, New York, NY 10001',
      },
    },
    {
      id: 'cafe_002',
      name: 'Blue Bottle Coffee',
      category: PlaceCategory.CAFE,
      description: 'Artisanal coffee roasters with specialty single-origin beans.',
      distance_km: 0,
      open_now: true,
      image_url: 'https://cdn.onspotx.ai/spots/blue-bottle.jpg',
      location: {
        lat: 40.7140,
        lng: -74.0070,
        address: '456 Broadway, New York, NY 10012',
      },
    },
    {
      id: 'bar_003',
      name: 'The Rooftop Lounge',
      category: PlaceCategory.BAR,
      description: 'Upscale cocktail bar with stunning city views.',
      distance_km: 0,
      open_now: false,
      image_url: 'https://cdn.onspotx.ai/spots/rooftop-lounge.jpg',
      location: {
        lat: 40.7120,
        lng: -74.0040,
        address: '789 5th Ave, New York, NY 10019',
      },
    },
    {
      id: 'shop_004',
      name: 'Central Park Bookstore',
      category: PlaceCategory.SHOP,
      description: 'Independent bookstore with rare finds and cozy reading nooks.',
      distance_km: 0,
      open_now: true,
      image_url: 'https://cdn.onspotx.ai/spots/bookstore.jpg',
      location: {
        lat: 40.7150,
        lng: -74.0030,
        address: '321 Park Ave, New York, NY 10016',
      },
    },
    {
      id: 'hotel_005',
      name: 'The Plaza Hotel',
      category: PlaceCategory.HOTEL,
      description: 'Luxury hotel with world-class amenities and service.',
      distance_km: 0,
      open_now: true,
      image_url: 'https://cdn.onspotx.ai/spots/plaza-hotel.jpg',
      location: {
        lat: 40.7160,
        lng: -74.0080,
        address: '768 5th Ave, New York, NY 10019',
      },
    },
    {
      id: 'attr_006',
      name: 'Brooklyn Bridge',
      category: PlaceCategory.ATTRACTION,
      description: 'Historic suspension bridge offering breathtaking views.',
      distance_km: 0,
      open_now: true,
      image_url: 'https://cdn.onspotx.ai/spots/brooklyn-bridge.jpg',
      location: {
        lat: 40.7061,
        lng: -73.9969,
        address: 'Brooklyn Bridge, New York, NY 10038',
      },
    },
    {
      id: 'park_007',
      name: 'Central Park',
      category: PlaceCategory.PARK,
      description: 'Iconic urban park perfect for walking, jogging, and relaxation.',
      distance_km: 0,
      open_now: true,
      image_url: 'https://cdn.onspotx.ai/spots/central-park.jpg',
      location: {
        lat: 40.7829,
        lng: -73.9654,
        address: 'Central Park, New York, NY 10024',
      },
    },
    {
      id: 'hosp_008',
      name: 'Mount Sinai Hospital',
      category: PlaceCategory.HOSPITAL,
      description: 'Leading medical center with comprehensive healthcare services.',
      distance_km: 0,
      open_now: true,
      image_url: 'https://cdn.onspotx.ai/spots/mount-sinai.jpg',
      location: {
        lat: 40.7903,
        lng: -73.9503,
        address: '1 Gustave L. Levy Pl, New York, NY 10029',
      },
    },
    {
      id: 'gas_009',
      name: 'Shell Gas Station',
      category: PlaceCategory.GAS_STATION,
      description: 'Full-service gas station with convenience store.',
      distance_km: 0,
      open_now: true,
      image_url: 'https://cdn.onspotx.ai/spots/shell-station.jpg',
      location: {
        lat: 40.7100,
        lng: -74.0100,
        address: '555 West St, New York, NY 10014',
      },
    },
    {
      id: 'bank_010',
      name: 'Chase Bank',
      category: PlaceCategory.BANK,
      description: 'Full-service bank with ATM and financial advisory services.',
      distance_km: 0,
      open_now: true,
      image_url: 'https://cdn.onspotx.ai/spots/chase-bank.jpg',
      location: {
        lat: 40.7110,
        lng: -74.0020,
        address: '999 Wall St, New York, NY 10005',
      },
    },
    {
      id: 'gym_011',
      name: 'Equinox Fitness',
      category: PlaceCategory.GYM,
      description: 'Premium fitness club with state-of-the-art equipment.',
      distance_km: 0,
      open_now: true,
      image_url: 'https://cdn.onspotx.ai/spots/equinox.jpg',
      location: {
        lat: 40.7170,
        lng: -74.0010,
        address: '222 Broadway, New York, NY 10038',
      },
    },
    {
      id: 'pharm_012',
      name: 'CVS Pharmacy',
      category: PlaceCategory.PHARMACY,
      description: 'Full-service pharmacy with prescription and over-the-counter medications.',
      distance_km: 0,
      open_now: true,
      image_url: 'https://cdn.onspotx.ai/spots/cvs-pharmacy.jpg',
      location: {
        lat: 40.7080,
        lng: -74.0060,
        address: '111 Houston St, New York, NY 10012',
      },
    },
  ];

  /**
   * Retrieves all mock places
   * 
   * @returns Array of all mock places
   */
  getAllPlaces(): Place[] {
    return [...this.mockPlaces];
  }

  /**
   * Filters places by category
   * 
   * @param category - Category to filter by
   * @returns Array of places matching the category
   */
  getPlacesByCategory(category: string): Place[] {
    return this.mockPlaces.filter(
      place => place.category.toLowerCase() === category.toLowerCase(),
    );
  }

  /**
   * Gets a specific place by ID
   * 
   * @param id - Place ID
   * @returns Place if found, null otherwise
   */
  getPlaceById(id: string): Place | null {
    return this.mockPlaces.find(place => place.id === id) || null;
  }

  /**
   * Simulates database query with optional filters
   * In production, this would execute actual database queries
   * 
   * @param filters - Optional filters for the query
   * @returns Filtered array of places
   */
  queryPlaces(filters?: {
    category?: string;
    openNow?: boolean;
    limit?: number;
  }): Place[] {
    let results = [...this.mockPlaces];

    // Apply category filter
    if (filters?.category) {
      results = results.filter(
        place => place.category.toLowerCase() === filters.category!.toLowerCase(),
      );
    }

    // Apply open now filter
    if (filters?.openNow !== undefined) {
      results = results.filter(place => place.open_now === filters.openNow);
    }

    // Apply limit
    if (filters?.limit && filters.limit > 0) {
      results = results.slice(0, filters.limit);
    }

    return results;
  }

  /**
   * Gets available categories from mock data
   * 
   * @returns Array of unique categories
   */
  getAvailableCategories(): string[] {
    const categories = this.mockPlaces.map(place => place.category);
    return [...new Set(categories)];
  }

  /**
   * Gets statistics about the mock data
   * 
   * @returns Object with data statistics
   */
  getDataStatistics(): {
    totalPlaces: number;
    categoriesCount: number;
    openPlaces: number;
    closedPlaces: number;
  } {
    return {
      totalPlaces: this.mockPlaces.length,
      categoriesCount: this.getAvailableCategories().length,
      openPlaces: this.mockPlaces.filter(place => place.open_now).length,
      closedPlaces: this.mockPlaces.filter(place => !place.open_now).length,
    };
  }
} 