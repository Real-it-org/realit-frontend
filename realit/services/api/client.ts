import axios from 'axios';
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from './storage';
import { router } from 'expo-router';

// For now, using a default that matches the emulator or local network IP
const BASE_URL = process.env.BACKEND_API_URL || 'http://192.168.1.247:3000';

export const client = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach Access Token
client.interceptors.request.use(
    async (config) => {
        const token = await getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle 401 & Refresh
client.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Check if error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = await getRefreshToken();

                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                // Call backend refresh endpoint
                // NOTE: We use a separate axios instance or fetch to avoid infinite loops if this fails
                // But since the refresh endpoint usually requires the Refresh Token in the header (or body),
                // we need to be careful.
                // Looking at backend: @UseGuards(RtGuard) on /auth/refresh expects Bearer <RefreshToken>

                const response = await axios.post(
                    `${BASE_URL}/auth/refresh`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${refreshToken}`,
                        },
                    }
                );

                const { access_token, refresh_token } = response.data;

                if (access_token && refresh_token) {
                    await setTokens(access_token, refresh_token);

                    // Retry original request with new token
                    originalRequest.headers.Authorization = `Bearer ${access_token}`;
                    return client(originalRequest);
                }

            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                // Refresh failed -> Logout user
                await clearTokens();
                // Redirect to login
                router.replace('/login');
            }
        }

        return Promise.reject(error);
    }
);
