import { http } from '@/api/http-client';
import type { AuthUser, LoginDto } from '@/types/auth';

export class AuthService {
    login(credentials: LoginDto): Promise<AuthUser> {
        return http<AuthUser>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ ...credentials, expiresInMins: 30 }),
        });
    }

    getCurrentUser(): Promise<AuthUser> {
        return http<AuthUser>('/auth/me');
    }
}