import { client } from '@/services/api/client';
import { ProfileResponse, PostResponse, PaginationQuery, PublicProfileResponse } from './types';

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
    /**
     * Get the current user's posts (paginated).
     */
    async getUserPosts(query: PaginationQuery = { page: 1, limit: 12 }): Promise<PostResponse[]> {
        const response = await client.get<PostResponse[]>('/profile/posts', {
            params: query,
        });
        return response.data;
    },

    /**
     * Get a public user's profile metadata.
     */
    async getPublicProfile(id: string): Promise<PublicProfileResponse> {
        const response = await client.get<PublicProfileResponse>(`/profile/${id}`);
        return response.data;
    },

    /**
     * Follow a user.
     */
    async followUser(id: string): Promise<void> {
        await client.post(`/profile/${id}/follow`);
    },

    /**
     * Unfollow a user.
     */
    async unfollowUser(id: string): Promise<void> {
        await client.delete(`/profile/${id}/follow`);
    },

    /**
     * Get a public user's posts (paginated).
     */
    async getPublicUserPosts(id: string, query: PaginationQuery = { page: 1, limit: 12 }): Promise<PostResponse[]> {
        const response = await client.get<PostResponse[]>(`/profile/${id}/posts`, {
            params: query,
        });
        return response.data;
    }
};
