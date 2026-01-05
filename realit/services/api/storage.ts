import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'realit_access_token';
const REFRESH_TOKEN_KEY = 'realit_refresh_token';

/**
 * Save the tokens securely.
 */
export const setTokens = async (accessToken: string, refreshToken: string) => {
    try {
        await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
    } catch (error) {
        console.error('Error saving tokens:', error);
        throw error;
    }
};

/**
 * Get the access token.
 */
export const getAccessToken = async () => {
    try {
        return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    } catch (error) {
        console.error('Error getting access token:', error);
        return null;
    }
};

/**
 * Get the refresh token.
 */
export const getRefreshToken = async () => {
    try {
        return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    } catch (error) {
        console.error('Error getting refresh token:', error);
        return null;
    }
};

/**
 * Clear all tokens (useful for logout).
 */
export const clearTokens = async () => {
    try {
        await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
        await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    } catch (error) {
        console.error('Error clearing tokens:', error);
    }
};
