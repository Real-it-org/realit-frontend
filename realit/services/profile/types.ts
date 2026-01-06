export interface ProfileResponse {
    username: string;
    display_name: string | null;
    bio: string | null;
    avatar_url: string | null;
    website: string | null;
    is_private: boolean;
    followers_count: number;
    following_count: number;
    posts_count: number;
}

export interface PostResponse {
    id: number;
    caption: string;
    media_url: string;
    media_type: 'IMAGE' | 'VIDEO'; // Assuming enum based on common patterns, or string to be safe
    verification_status: string;
    likes_count: number;
    comments_count: number;
    created_at: string; // Serialized date
}

export interface PaginationQuery {
    page?: number;
    limit?: number;
}
