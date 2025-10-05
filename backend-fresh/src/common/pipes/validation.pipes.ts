/**
 * File: validation.pipes.ts
 * Purpose: Validation pipes for the BlickTrack backend API. Provides input validation, sanitization, and transformation for request parameters and body data. Implements security-focused input processing and data validation.
 *
 * Key Functions / Components / Classes:
 *   - ParseUUIDPipe: Validates and parses UUID parameters
 *   - ParseEmailPipe: Validates and normalizes email addresses
 *   - SanitizeStringPipe: Sanitizes string input for security
 *   - TrimStringsPipe: Trims whitespace from string values
 *   - Input validation: Ensures data integrity and security
 *
 * Inputs:
 *   - Request parameters and body data
 *   - String values for validation
 *   - UUID and email parameters
 *   - User input from forms and APIs
 *
 * Outputs:
 *   - Validated and sanitized data
 *   - Validation errors for invalid input
 *   - Normalized string values
 *   - Security-processed input data
 *
 * Dependencies:
 *   - NestJS pipe system
 *   - ValidationUtils for validation logic
 *   - ArgumentMetadata for parameter context
 *   - BadRequestException for error handling
 *
 * Notes:
 *   - Implements comprehensive input validation
 *   - Includes security-focused sanitization
 *   - Provides data normalization
 *   - Handles validation errors gracefully
 *   - Supports various data types and formats
 */

import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ValidationUtils } from '../utils';

@Injectable()
export class ParseUUIDPipe implements PipeTransform<string, string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    if (!ValidationUtils.isValidUUID(value)) {
      throw new BadRequestException(`Invalid UUID format: ${value}`);
    }
    return value;
  }
}

@Injectable()
export class ParseEmailPipe implements PipeTransform<string, string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    if (!ValidationUtils.isValidEmail(value)) {
      throw new BadRequestException(`Invalid email format: ${value}`);
    }
    return value.toLowerCase().trim();
  }
}

@Injectable()
export class SanitizeStringPipe implements PipeTransform<string, string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    if (typeof value !== 'string') {
      return value;
    }
    return ValidationUtils.sanitizeString(value);
  }
}

@Injectable()
export class TrimStringsPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): any {
    if (typeof value === 'string') {
      return value.trim();
    }
    
    if (typeof value === 'object' && value !== null) {
      const trimmed: any = {};
      for (const [key, val] of Object.entries(value)) {
        trimmed[key] = typeof val === 'string' ? (val as string).trim() : val;
      }
      return trimmed;
    }
    
    return value;
  }
}