import { client } from '@/services/api/client';

// ── Types matching backend FeedPostDto ──────────────────────────────

export interface FeedPostMedia {
    media_url: string;
    media_type: 'image' | 'video';
    position: number;
}

export interface FeedPostAuthor {
    profile_id: string;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
}

export interface FeedPost {
    id: string;
    heading: string;
    description: string;
    media: FeedPostMedia[];
    verification_status: 'verified' | 'ai' | 'unverified';
    likes_count: number;
    comments_count: number;
    created_at: string;
    author: FeedPostAuthor;
}

export interface FeedQuery {
    cursor?: string;
    limit?: number;
}

// ── Service ─────────────────────────────────────────────────────────

export const feedService = {
    /**
     * Fetch the personalized feed with cursor-based pagination.
     * Returns posts from followed users + own posts, newest first.
     */
    async getFeed(query: FeedQuery = {}): Promise<FeedPost[]> {
        const params: Record<string, string | number> = {};
        if (query.cursor) params.cursor = query.cursor;
        if (query.limit) params.limit = query.limit;

        const response = await client.get<FeedPost[]>('/feed', { params });
        return response.data;
    },
};
