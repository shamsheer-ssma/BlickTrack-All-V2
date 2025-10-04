import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashingService {
  private readonly saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');

  /**
   * Hash a password using bcrypt
   */
  async hash(password: string): Promise<string> {
    if (!password) {
      throw new Error('Password is required');
    }
    
    return bcrypt.hash(password, this.saltRounds);
  }

  /**
   * Compare a plain text password with a hashed password
   */
  async compare(password: string, hashedPassword: string): Promise<boolean> {
    if (!password || !hashedPassword) {
      return false;
    }
    
    return bcrypt.compare(password, hashedPassword);
  }

  /**
   * Generate a random salt
   */
  async generateSalt(): Promise<string> {
    return bcrypt.genSalt(this.saltRounds);
  }
}