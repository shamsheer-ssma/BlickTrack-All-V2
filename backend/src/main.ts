/**
 * File: main.ts
 * Purpose: Application bootstrap file for the BlickTrack backend API. Initializes the NestJS application with security middleware, CORS configuration, global validation, Swagger documentation, and starts the server. This is the entry point for the entire backend application.
 * 
 * Key Functions / Components / Classes:
 *   - bootstrap: Main application initialization function
 *   - Security configuration: Helmet middleware for security headers
 *   - CORS setup: Cross-origin resource sharing configuration
 *   - Global validation: Input validation and transformation
 *   - Swagger documentation: API documentation setup
 *   - Server startup: Application server initialization
 *
 * Inputs:
 *   - Environment configuration from ConfigService
 *   - CORS origin settings
 *   - Port configuration
 *   - Security middleware configuration
 *
 * Outputs:
 *   - Running NestJS application server
 *   - Swagger API documentation at /api/docs
 *   - Configured security middleware
 *   - Global validation pipeline
 *
 * Dependencies:
 *   - NestJS core framework
 *   - Helmet for security headers
 *   - Swagger for API documentation
 *   - ConfigService for environment variables
 *
 * Notes:
 *   - Implements comprehensive security configuration
 *   - Sets up global validation with whitelist and transformation
 *   - Configures CORS for frontend communication
 *   - Provides Swagger documentation for API testing
 *   - Uses helmet for security headers and protection
 */

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Security middleware
  app.use(helmet());
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests from localhost on any port for development
      if (origin?.startsWith('http://localhost:')) {
        callback(null, true);
      } else if (!origin) {
        // Allow requests with no origin (like mobile apps or curl requests)
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'), false);
      }
    },
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('BlickTrack API')
    .setDescription('Enterprise Cybersecurity Platform API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Start server
  const port = configService.get<number>('PORT') || 3001;
  await app.listen(port);
  
  console.log(`🚀 BlickTrack API is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}
bootstrap();
