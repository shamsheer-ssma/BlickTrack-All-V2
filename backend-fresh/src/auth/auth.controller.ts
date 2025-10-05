/**
 * File: auth.controller.ts
 * Purpose: Authentication controller for the BlickTrack backend API. Provides REST endpoints for user authentication, registration, password management, and user profile operations. Handles HTTP requests and responses for all authentication-related functionality.
 * 
 * Key Functions / Components / Classes:
 *   - AuthController: Main authentication controller class
 *   - register: User registration endpoint
 *   - login: User authentication endpoint
 *   - logout: User logout and token invalidation
 *   - forgotPassword: Password reset request endpoint
 *   - resetPassword: Password reset with token endpoint
 *   - changePassword: Authenticated password change endpoint
 *   - verifyEmail: Email verification endpoint
 *   - getProfile: User profile retrieval endpoint
 *
 * Inputs:
 *   - HTTP POST requests for authentication operations
 *   - User registration and login data
 *   - Password reset and change requests
 *   - Email verification tokens
 *   - JWT tokens for authenticated requests
 *
 * Outputs:
 *   - HTTP responses with authentication status
 *   - JWT tokens for authenticated users
 *   - User profile and authentication data
 *   - Password reset confirmations
 *   - Email verification confirmations
 *
 * Dependencies:
 *   - AuthService for business logic
 *   - JWT guards for authentication
 *   - Swagger decorators for API documentation
 *   - DTOs for request validation
 *
 * Notes:
 *   - Implements comprehensive authentication endpoints
 *   - Includes Swagger documentation for all endpoints
 *   - Uses JWT guards for protected routes
 *   - Provides detailed error handling and responses
 *   - Supports enterprise-grade authentication flows
 */

import { 
  Controller, 
  Post, 
  Body, 
  UseGuards, 
  Request,
  HttpCode,
  HttpStatus,
  Get,
  Patch
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService, AuthResponse } from './auth.service';
import { 
  RegisterDto, 
  LoginDto, 
  ForgotPasswordDto, 
  ResetPasswordDto,
  ChangePasswordDto,
  VerifyEmailDto,
  RefreshTokenDto,
  ResendVerificationDto 
} from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'Login successful', type: 'AuthResponse' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto, @Request() req): Promise<AuthResponse> {
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    
    return this.authService.login(loginDto, ipAddress, userAgent);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({ status: 200, description: 'Password reset email sent' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiResponse({ status: 200, description: 'Password reset successful' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify email address' })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyEmailDto);
  }

  @Post('send-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send OTP to email for verification' })
  @ApiResponse({ status: 200, description: 'OTP sent successfully' })
  @ApiResponse({ status: 400, description: 'Invalid email or user not found' })
  async sendOtp(@Body() sendOtpDto: { email: string }) {
    return this.authService.sendOtp(sendOtpDto.email);
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify OTP code' })
  @ApiResponse({ status: 200, description: 'OTP verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired OTP' })
  async verifyOtp(@Body() verifyOtpDto: { email: string; otp: string }) {
    return this.authService.verifyOtp(verifyOtpDto.email, verifyOtpDto.otp);
  }

  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change password (authenticated users)' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 401, description: 'Current password is incorrect' })
  async changePassword(
    @CurrentUser('id') userId: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(userId, changePasswordDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@CurrentUser() user: any) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      tenantId: user.tenantId,
      isVerified: user.isVerified,
      mfaEnabled: user.mfaEnabled,
    };
  }

  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Resend email verification', 
    description: 'Resend verification email to user. Useful when original email expires or user didn\'t receive it.' 
  })
  @ApiResponse({ status: 200, description: 'Verification email resent successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Email already verified' })
  async resendVerification(@Body() resendVerificationDto: ResendVerificationDto) {
    return this.authService.resendVerificationEmail(resendVerificationDto.email);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Refresh access token', 
    description: 'Generate new access and refresh tokens using a valid refresh token. Implements token rotation for enhanced security.' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Tokens refreshed successfully',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
        refresh_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto.refresh_token);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Logout user',
    description: 'Revoke refresh token and logout user. Access token will remain valid until expiration but refresh token is immediately invalidated.' 
  })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  @ApiResponse({ status: 401, description: 'Invalid or expired token' })
  async logout(@Body() refreshTokenDto: RefreshTokenDto) {
    // Revoke the refresh token to prevent further use
    await this.authService.revokeRefreshToken(refreshTokenDto.refresh_token);
    
    return { 
      message: 'Logout successful',
      note: 'Refresh token has been revoked. Please discard your access token on the client side.' 
    };
  }
}