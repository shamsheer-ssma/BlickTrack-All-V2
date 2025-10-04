export declare class HashingService {
    private readonly saltRounds;
    hash(password: string): Promise<string>;
    compare(password: string, hashedPassword: string): Promise<boolean>;
    generateSalt(): Promise<string>;
}
