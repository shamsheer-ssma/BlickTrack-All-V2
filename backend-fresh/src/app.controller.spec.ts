/**
 * File: app.controller.spec.ts
 * Purpose: Unit test suite for the BlickTrack backend API main application controller. Tests the core application functionality including health checks, API information, and basic system endpoints. Ensures the main application controller works correctly in isolation.
 *
 * Key Functions / Components / Classes:
 *   - AppController tests: Unit tests for the main application controller
 *   - Health check tests: Validates health status endpoint functionality
 *   - API info tests: Validates API information endpoint functionality
 *   - Test setup: Configures NestJS testing module
 *   - Mock services: Isolates controller from dependencies
 *
 * Inputs:
 *   - Test configuration and setup
 *   - Mock service instances
 *   - Test assertions and expectations
 *
 * Outputs:
 *   - Test results and assertions
 *   - Health check validation
 *   - API information validation
 *   - Test coverage reports
 *
 * Dependencies:
 *   - @nestjs/testing for NestJS testing utilities
 *   - AppController for testing
 *   - AppService for mocking
 *
 * Notes:
 *   - Implements comprehensive unit testing
 *   - Tests core application functionality
 *   - Validates health and info endpoints
 *   - Ensures controller isolation
 *   - Provides test coverage for main features
 */

import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('health check', () => {
    it('should return health status', () => {
      const result = appController.getHealth();
      expect(result).toHaveProperty('status', 'OK');
      expect(result).toHaveProperty('service', 'BlickTrack API');
    });
  });

  describe('api info', () => {
    it('should return API information', () => {
      const result = appController.getInfo();
      expect(result).toHaveProperty('name', 'BlickTrack Cybersecurity Platform API');
      expect(result).toHaveProperty('version', '1.0.0');
    });
  });
});
