import { IsNumber, IsOptional, IsString, IsEnum, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PlaceCategory } from '../../common/interfaces/location.interface';

/**
 * Data Transfer Object for discovery query parameters
 * Handles validation and transformation of incoming query parameters
 */
export class DiscoveryQueryDto {
  @ApiProperty({
    description: 'Latitude coordinate for the search center',
    example: 40.7128,
    minimum: -90,
    maximum: 90,
  })
  @IsNumber({}, { message: 'Latitude must be a valid number' })
  @Min(-90, { message: 'Latitude must be between -90 and 90' })
  @Max(90, { message: 'Latitude must be between -90 and 90' })
  @Type(() => Number)
  latitude: number;

  @ApiProperty({
    description: 'Longitude coordinate for the search center',
    example: -74.0060,
    minimum: -180,
    maximum: 180,
  })
  @IsNumber({}, { message: 'Longitude must be a valid number' })
  @Min(-180, { message: 'Longitude must be between -180 and 180' })
  @Max(180, { message: 'Longitude must be between -180 and 180' })
  @Type(() => Number)
  longitude: number;

  @ApiPropertyOptional({
    description: 'Search radius in kilometers',
    example: 5.0,
    minimum: 0.1,
    maximum: 50.0,
    default: 5.0,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Radius must be a valid number' })
  @Min(0.1, { message: 'Radius must be at least 0.1 km' })
  @Max(50.0, { message: 'Radius cannot exceed 50 km' })
  @Type(() => Number)
  @Transform(({ value }) => value ?? 5.0)
  radius?: number = 5.0;

  @ApiPropertyOptional({
    description: 'Category filter for places',
    example: 'restaurant',
    enum: PlaceCategory,
  })
  @IsOptional()
  @IsString({ message: 'Category must be a string' })
  @IsEnum(PlaceCategory, { 
    message: `Category must be one of: ${Object.values(PlaceCategory).join(', ')}` 
  })
  @Transform(({ value }) => value?.toLowerCase())
  category?: string;

  @ApiPropertyOptional({
    description: 'Maximum number of results to return',
    example: 10,
    minimum: 1,
    maximum: 50,
    default: 10,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Limit must be a valid number' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(50, { message: 'Limit cannot exceed 50' })
  @Type(() => Number)
  @Transform(({ value }) => value ?? 10)
  limit?: number = 10;
} 