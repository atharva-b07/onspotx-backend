/**
 * Represents a geographical coordinate point
 */
export interface Coordinates {
  /** Latitude in decimal degrees */
  lat: number;
  /** Longitude in decimal degrees */
  lng: number;
}

/**
 * Represents a complete location with address information
 */
export interface Location extends Coordinates {
  /** Human-readable address */
  address: string;
}

/**
 * Represents a discovered place/spot
 */
export interface Place {
  /** Unique identifier for the place */
  id: string;
  /** Display name of the place */
  name: string;
  /** Category/type of the place */
  category: string;
  /** Detailed description */
  description: string;
  /** Distance from query point in kilometers */
  distance_km: number;
  /** Whether the place is currently open */
  open_now: boolean;
  /** URL to the place's image */
  image_url: string;
  /** Location information */
  location: Location;
}

/**
 * Supported place categories
 */
export enum PlaceCategory {
  RESTAURANT = 'restaurant',
  CAFE = 'cafe',
  BAR = 'bar',
  SHOP = 'shop',
  HOTEL = 'hotel',
  ATTRACTION = 'attraction',
  PARK = 'park',
  HOSPITAL = 'hospital',
  GAS_STATION = 'gas_station',
  BANK = 'bank',
  GYM = 'gym',
  PHARMACY = 'pharmacy',
  EVENT = 'event',
  ENTERTAINMENT = 'entertainment',
  SERVICE = 'service',
}

/**
 * Discovery query parameters
 */
export interface DiscoveryQuery {
  /** Latitude of the search center */
  latitude: number;
  /** Longitude of the search center */
  longitude: number;
  /** Search radius in kilometers (optional) */
  radius?: number;
  /** Category filter (optional) */
  category?: string;
  /** Maximum number of results (optional) */
  limit?: number;
}

/**
 * Discovery response structure
 */
export interface DiscoveryResponse {
  /** Array of discovered places */
  results: Place[];
  /** Total number of results found */
  total: number;
  /** Query parameters used */
  query: DiscoveryQuery;
  /** Response metadata */
  metadata: {
    /** Processing time in milliseconds */
    processing_time_ms: number;
    /** Timestamp of the response */
    timestamp: string;
  };
} 