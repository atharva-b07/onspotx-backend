import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('OnSpotX Discovery API (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Apply the same configuration as in main.ts
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/api/v1/health (GET)', () => {
    it('should return health status', () => {
      return request(app.getHttpServer())
        .get('/api/v1/health')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('status', 'ok');
          expect(res.body).toHaveProperty('timestamp');
          expect(res.body).toHaveProperty('uptime');
          expect(res.body).toHaveProperty('version');
          expect(res.body).toHaveProperty('environment');
          expect(res.body).toHaveProperty('memory');
        });
    });
  });

  describe('/api/v1/discover (GET)', () => {
    it('should discover places with valid coordinates', () => {
      return request(app.getHttpServer())
        .get('/api/v1/discover')
        .query({
          latitude: 40.7128,
          longitude: -74.0060,
          radius: 5,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('results');
          expect(res.body).toHaveProperty('total');
          expect(res.body).toHaveProperty('query');
          expect(res.body).toHaveProperty('metadata');
          expect(Array.isArray(res.body.results)).toBe(true);
          expect(typeof res.body.total).toBe('number');
        });
    });

    it('should filter by category', () => {
      return request(app.getHttpServer())
        .get('/api/v1/discover')
        .query({
          latitude: 40.7128,
          longitude: -74.0060,
          category: 'restaurant',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.results).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                category: 'restaurant',
              }),
            ]),
          );
        });
    });

    it('should return 400 for invalid coordinates', () => {
      return request(app.getHttpServer())
        .get('/api/v1/discover')
        .query({
          latitude: 91, // Invalid latitude
          longitude: -74.0060,
        })
        .expect(400);
    });

    it('should return 400 for missing required parameters', () => {
      return request(app.getHttpServer())
        .get('/api/v1/discover')
        .query({
          latitude: 40.7128,
          // Missing longitude
        })
        .expect(400);
    });
  });

  describe('/api/v1/discover/categories (GET)', () => {
    it('should return available categories', () => {
      return request(app.getHttpServer())
        .get('/api/v1/discover/categories')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('categories');
          expect(res.body).toHaveProperty('total');
          expect(Array.isArray(res.body.categories)).toBe(true);
          expect(res.body.categories.length).toBeGreaterThan(0);
        });
    });
  });

  describe('/api/v1/discover/stats (GET)', () => {
    it('should return service statistics', () => {
      return request(app.getHttpServer())
        .get('/api/v1/discover/stats')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('dataStats');
          expect(res.body).toHaveProperty('config');
          expect(res.body.dataStats).toHaveProperty('totalPlaces');
          expect(res.body.config).toHaveProperty('defaultRadius');
        });
    });
  });

  describe('/api/v1/discover/nearest (GET)', () => {
    it('should find nearest place', () => {
      return request(app.getHttpServer())
        .get('/api/v1/discover/nearest')
        .query({
          latitude: 40.7128,
          longitude: -74.0060,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('place');
          if (res.body.place) {
            expect(res.body.place).toHaveProperty('id');
            expect(res.body.place).toHaveProperty('name');
            expect(res.body.place).toHaveProperty('distance_km');
          }
        });
    });
  });
}); 