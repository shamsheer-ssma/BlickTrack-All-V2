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
export declare class AuthService {
    private prisma;
    private jwtService;
    private hashingService;
    constructor(prisma: PrismaService, jwtService: JwtService, hashingService: HashingService);
    validateUser(email: string, password: string): Promise<any>;
    login(loginDto: LoginDto): Promise<AuthResponse>;
}
export {};
