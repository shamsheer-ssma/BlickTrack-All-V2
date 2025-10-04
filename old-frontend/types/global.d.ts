declare global {
  var otpCache: Map<string, {
    otp: string;
    email: string;
    expiresAt: number;
  }> | undefined;
}

export {};


