import { ApiProperty } from '@nestjs/swagger';
import { Place, DiscoveryQuery } from '../../common/interfaces/location.interface';

/**
 * Data Transfer Object for place information
 */
export class PlaceDto implements Place {
  @ApiProperty({
    description: 'Unique identifier for the place',
    example: 'abc123',
  })
  id: string;

  @ApiProperty({
    description: 'Display name of the place',
    example: 'Trattoria Alfredo',
  })
  name: string;

  @ApiProperty({
    description: 'Category/type of the place',
    example: 'restaurant',
  })
  category: string;

  @ApiProperty({
    description: 'Detailed description of the place',
    example: 'Authentic Italian pasta, great ambiance.',
  })
  description: string;

  @ApiProperty({
    description: 'Distance from query point in kilometers',
    example: 0.5,
  })
  distance_km: number;

  @ApiProperty({
    description: 'Whether the place is currently open',
    example: true,
  })
  open_now: boolean;

  @ApiProperty({
    description: 'URL to the place\'s image',
    example: 'https://cdn.onspotx.ai/spots/alfredo.jpg',
  })
  image_url: string;

  @ApiProperty({
    description: 'Location information',
    type: 'object',
    properties: {
      lat: { type: 'number', example: 40.7130 },
      lng: { type: 'number', example: -74.0050 },
      address: { type: 'string', example: '123 Main St, NY' },
    },
  })
  location: {
    lat: number;
    lng: number;
    address: string;
  };
}

/**
 * Data Transfer Object for discovery response metadata
 */
export class ResponseMetadataDto {
  @ApiProperty({
    description: 'Processing time in milliseconds',
    example: 45,
  })
  processing_time_ms: number;

  @ApiProperty({
    description: 'Timestamp of the response',
    example: '2024-01-15T10:30:00.000Z',
  })
  timestamp: string;
}

/**
 * Data Transfer Object for discovery query information
 */
export class QueryInfoDto implements DiscoveryQuery {
  @ApiProperty({
    description: 'Latitude of the search center',
    example: 40.7128,
  })
  latitude: number;

  @ApiProperty({
    description: 'Longitude of the search center',
    example: -74.0060,
  })
  longitude: number;

  @ApiProperty({
    description: 'Search radius in kilometers',
    example: 5.0,
  })
  radius?: number;

  @ApiProperty({
    description: 'Category filter applied',
    example: 'restaurant',
    required: false,
  })
  category?: string;

  @ApiProperty({
    description: 'Maximum number of results requested',
    example: 10,
  })
  limit?: number;
}

/**
 * Data Transfer Object for the complete discovery response
 */
export class DiscoveryResponseDto {
  @ApiProperty({
    description: 'Array of discovered places',
    type: [PlaceDto],
  })
  results: PlaceDto[];

  @ApiProperty({
    description: 'Total number of results found',
    example: 5,
  })
  total: number;

  @ApiProperty({
    description: 'Query parameters used for the search',
    type: QueryInfoDto,
  })
  query: QueryInfoDto;

  @ApiProperty({
    description: 'Response metadata',
    type: ResponseMetadataDto,
  })
  metadata: ResponseMetadataDto;
} 