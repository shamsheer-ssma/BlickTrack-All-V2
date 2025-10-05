/**
 * File: app.e2e-spec.ts
 * Purpose: End-to-end (e2e) test suite for the BlickTrack backend API. Tests the complete application flow from HTTP requests to responses, ensuring the entire system works correctly in an integrated environment. Validates API endpoints, middleware, and application behavior.
 *
 * Key Functions / Components / Classes:
 *   - AppController (e2e): End-to-end test suite for the main application controller
 *   - Test setup: Configures NestJS testing module and application
 *   - HTTP testing: Uses supertest for HTTP request testing
 *   - Integration testing: Tests complete application flow
 *
 * Inputs:
 *   - HTTP requests to application endpoints
 *   - Test configuration and setup
 *   - NestJS testing module
 *
 * Outputs:
 *   - Test results and assertions
 *   - HTTP response validation
 *   - Application behavior verification
 *
 * Dependencies:
 *   - @nestjs/testing for NestJS testing utilities
 *   - supertest for HTTP testing
 *   - AppModule for application configuration
 *
 * Notes:
 *   - Implements comprehensive e2e testing
 *   - Tests complete application flow
 *   - Validates HTTP endpoints and responses
 *   - Ensures application integration works correctly
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
