import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { HashingService } from '../common/services/hashing.service';
import { LoginDto } from './dto/auth.dto';

interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    userType: string;
    tenantId: string;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService, 
    private jwtService: JwtService,
    private hashingService: HashingService
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    console.log('🔍 [AUTH DEBUG] Validating user:', email);
    
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        passwordHash: true,
        userType: true,
        isActive: true,
        isEmailVerified: true,
        tenantId: true,
      },
    });

    if (!user) {
      console.log('❌ [AUTH DEBUG] User not found:', email);
      return null;
    }

    console.log('✅ [AUTH DEBUG] User found:', {
      email: user.email,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
      hasPasswordHash: !!user.passwordHash
    });

    if (!user.isActive) {
      console.log('❌ [AUTH DEBUG] Account deactivated:', email);
      throw new UnauthorizedException('Account has been deactivated');
    }

    if (!user.isEmailVerified) {
      console.log('❌ [AUTH DEBUG] Email not verified:', email);
      throw new UnauthorizedException('Email not verified');
    }

    if (!user.passwordHash) {
      console.log('❌ [AUTH DEBUG] No password hash:', email);
      return null;
    }

    const isPasswordValid = await this.hashingService.compare(password, user.passwordHash);
    console.log('🔐 [AUTH DEBUG] Password validation result:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('❌ [AUTH DEBUG] Password validation failed:', email);
      return null;
    }

    console.log('✅ [AUTH DEBUG] Authentication successful:', email);
    
    // Return user without password
    const { passwordHash: _, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { email, password } = loginDto;
    console.log('🔍 [AUTH DEBUG] Login attempt for:', email);

    // Use validateUser which has proper error handling
    const user = await this.validateUser(email, password);
    
    if (!user) {
      console.log('❌ [AUTH DEBUG] Login failed for:', email);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.userType === 'ADMIN' ? 
        (user.email === 'admin@blicktrack.com' ? 'SUPER_ADMIN' : 'TENANT_ADMIN') : 
        'END_USER',
      tenantId: user.tenantId,
    };

    const access_token = this.jwtService.sign(payload);
    console.log('✅ [AUTH DEBUG] JWT token generated for:', email);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.userType,
        tenantId: user.tenantId,
      },
    };
  }
}