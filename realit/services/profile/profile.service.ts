import { client } from '@/services/api/client';
import { ProfileResponse, PostResponse, PaginationQuery } from './types';

export const profileService = {
    /**
     * Get the current user's profile metadata.
     */
    async getProfile(): Promise<ProfileResponse> {
        const response = await client.get<ProfileResponse>('/profile');
        return response.data;
    },

    /**
     * Get the current user's posts (paginated).
     */
    async getUserPosts(query: PaginationQuery = { page: 1, limit: 12 }): Promise<PostResponse[]> {
        const response = await client.get<PostResponse[]>('/profile/posts', {
            params: query,
        });
        return response.data;
    }
};
