import { Coordinates } from '../interfaces/location.interface';

/**
 * Utility class for geographical distance calculations
 */
export class DistanceUtil {
  private static readonly EARTH_RADIUS_KM = 6371; // Earth's radius in kilometers

  /**
   * Calculates the great-circle distance between two points on Earth
   * using the Haversine formula
   * 
   * @param point1 - First coordinate point
   * @param point2 - Second coordinate point
   * @returns Distance in kilometers
   */
  static calculateDistance(point1: Coordinates, point2: Coordinates): number {
    const lat1Rad = this.toRadians(point1.lat);
    const lat2Rad = this.toRadians(point2.lat);
    const deltaLatRad = this.toRadians(point2.lat - point1.lat);
    const deltaLngRad = this.toRadians(point2.lng - point1.lng);

    const a = Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
              Math.cos(lat1Rad) * Math.cos(lat2Rad) *
              Math.sin(deltaLngRad / 2) * Math.sin(deltaLngRad / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    const distance = this.EARTH_RADIUS_KM * c;
    
    // Round to 2 decimal places for precision
    return Math.round(distance * 100) / 100;
  }

  /**
   * Converts degrees to radians
   * 
   * @param degrees - Angle in degrees
   * @returns Angle in radians
   */
  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Checks if a point is within a given radius of another point
   * 
   * @param center - Center point
   * @param point - Point to check
   * @param radiusKm - Radius in kilometers
   * @returns True if point is within radius
   */
  static isWithinRadius(
    center: Coordinates,
    point: Coordinates,
    radiusKm: number,
  ): boolean {
    const distance = this.calculateDistance(center, point);
    return distance <= radiusKm;
  }

  /**
   * Sorts an array of places by distance from a reference point
   * 
   * @param places - Array of places with location information
   * @param referencePoint - Reference point for distance calculation
   * @returns Sorted array of places (closest first)
   */
  static sortByDistance<T extends { location: Coordinates; distance_km?: number }>(
    places: T[],
    referencePoint: Coordinates,
  ): T[] {
    return places
      .map(place => ({
        ...place,
        distance_km: this.calculateDistance(referencePoint, place.location),
      }))
      .sort((a, b) => a.distance_km - b.distance_km);
  }

  /**
   * Validates latitude value
   * 
   * @param lat - Latitude value
   * @returns True if valid
   */
  static isValidLatitude(lat: number): boolean {
    return !isNaN(lat) && lat >= -90 && lat <= 90;
  }

  /**
   * Validates longitude value
   * 
   * @param lng - Longitude value
   * @returns True if valid
   */
  static isValidLongitude(lng: number): boolean {
    return !isNaN(lng) && lng >= -180 && lng <= 180;
  }

  /**
   * Validates coordinate pair
   * 
   * @param coordinates - Coordinate pair to validate
   * @returns True if valid
   */
  static isValidCoordinates(coordinates: Coordinates): boolean {
    return this.isValidLatitude(coordinates.lat) && 
           this.isValidLongitude(coordinates.lng);
  }
} 