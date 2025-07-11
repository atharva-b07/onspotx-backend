import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as compression from 'compression';

import { AppModule } from './app.module';

/**
 * Bootstrap function to initialize and start the NestJS application
 * Configures security, validation, documentation, and other middleware
 */
async function bootstrap(): Promise<void> {
  const logger = new Logger('Bootstrap');
  
  try {
    // Create NestJS application instance
    const app = await NestFactory.create(AppModule);
    
    // Get configuration service
    const configService = app.get(ConfigService);
    const port = configService.get<number>('PORT', 3000);
    const environment = configService.get<string>('NODE_ENV', 'development');
    
    // Security middleware
    app.use(helmet({
      contentSecurityPolicy: environment === 'production',
    }));
    
    // Compression middleware for better performance
    app.use(compression());
    
    // CORS configuration
    app.enableCors({
      origin: environment === 'production' 
        ? configService.get<string>('ALLOWED_ORIGINS', '').split(',')
        : true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      credentials: true,
    });
    
    // Global API prefix
    app.setGlobalPrefix('api/v1');
    
    // Global validation pipe with comprehensive settings
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // Strip unknown properties
        forbidNonWhitelisted: true, // Throw error for unknown properties
        transform: true, // Auto-transform payloads to DTO instances
        transformOptions: {
          enableImplicitConversion: true,
        },
        disableErrorMessages: environment === 'production',
      }),
    );
    
    // Swagger API documentation setup
    if (environment !== 'production') {
      const config = new DocumentBuilder()
        .setTitle('OnSpotX Location Discovery API')
        .setDescription(`
          A professional real-time location discovery API that helps users find nearby places.
          
          ## Features
          - 🌍 Real-time location-based discovery
          - 📍 Distance calculation and sorting
          - 🏷️ Category-based filtering
          - 🔍 Comprehensive search capabilities
          - 📊 Rate limiting and security
          
          ## Usage
          All endpoints require latitude and longitude parameters for location-based queries.
          Optional parameters include radius (in km) and category filters.
        `)
        .setVersion('1.0.0')
        .addTag('discovery', 'Location discovery endpoints')
        .addTag('health', 'Health check endpoints')
        .setContact(
          'OnSpotX Team',
          'https://github.com/onspotx',
          'support@onspotx.com'
        )
        .setLicense('MIT', 'https://opensource.org/licenses/MIT')
        .build();
      
      const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup('api/docs', app, document, {
        customSiteTitle: 'OnSpotX API Documentation',
        customfavIcon: 'https://nestjs.com/img/logo_text.svg',
        customCss: `
          .swagger-ui .topbar { display: none }
          .swagger-ui .scheme-container { background: #fafafa; padding: 15px; border-radius: 5px; }
        `,
      });
      
      logger.log(`📚 API Documentation available at: http://localhost:${port}/api/docs`);
    }
    
    // Start the application
    await app.listen(port);
    
    logger.log(`🚀 Application is running on: http://localhost:${port}`);
    logger.log(`🌍 Environment: ${environment}`);
    logger.log(`📊 Global prefix: api/v1`);
    
  } catch (error) {
    logger.error('❌ Error starting application:', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions and unhandled rejections
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

bootstrap(); 