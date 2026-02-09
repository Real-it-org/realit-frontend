import { client } from '@/services/api/client';
import { setTokens, clearTokens } from '@/services/api/storage';
import { LoginDto, SignupDto, AuthResponse } from '@/services/auth/types';

// Let's define types here for now to avoid multiple file creations if not strictly necessary, 
// or I can create a types.ts file. Let's create a types.ts file for cleanliness.

export * from '@/services/auth/types'; // Re-export types

export const authService = {
    async signup(dto: SignupDto): Promise<AuthResponse> {
        const payload = {
            ...dto,
            display_name: dto.displayName,
        };
        const response = await client.post<AuthResponse>('/auth/signup', payload);
        const { access_token, refresh_token } = response.data;
        await setTokens(access_token, refresh_token);
        return response.data;
    },

    async login(dto: LoginDto): Promise<AuthResponse> {
        const response = await client.post<AuthResponse>('/auth/login', dto);
        const { access_token, refresh_token } = response.data;
        await setTokens(access_token, refresh_token);
        return response.data;
    },

    async logout() {
        // Best effort network logout
        try {
            await client.post('/auth/logout');
        } catch (e) {
            console.log('Logout API call failed, but clearing local tokens anyway');
        }
        await clearTokens();
    }
};
