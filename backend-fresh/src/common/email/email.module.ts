/**
 * File: email.module.ts
 * Purpose: Modular and reusable email module for the BlickTrack backend API.
 * Provides email service as a global module that can be imported by any feature module.
 * Ensures single instance (singleton) of email service across the application.
 * 
 * Key Functions / Components / Classes:
 *   - EmailModule: Global module for email functionality
 *   - Exports EmailService for use in other modules
 *   - Configured as global module for application-wide availability
 *
 * Usage:
 *   Import this module in AppModule to make EmailService available globally:
 *   
 *   @Module({
 *     imports: [EmailModule, ...],
 *     ...
 *   })
 *   
 *   Then inject EmailService anywhere in your app:
 *   
 *   constructor(private emailService: EmailService) {}
 *
 * Dependencies:
 *   - EmailService - Core email sending functionality
 *   - ConfigModule - For environment variables (automatically available)
 *
 * Notes:
 *   - Configured as @Global() for application-wide availability
 *   - Single instance shared across all modules (memory efficient)
 *   - No need to import in feature modules once added to AppModule
 *   - Follows NestJS best practices for shared services
 */

import { Global, Module } from '@nestjs/common';
import { EmailService } from '../services/email.service';

@Global() // Makes this module available globally without importing in each feature module
@Module({
  providers: [EmailService],
  exports: [EmailService], // Export for use in other modules
})
export class EmailModule {}

