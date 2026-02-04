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
    heading: string;
    description: string;
    media: {
        media_url: string;
        media_type: 'image' | 'video';
        position: number;
    }[];
    verification_status: string;
    likes_count: number;
    comments_count: number;
    created_at: string;
}

export interface PaginationQuery {
    page?: number;
    limit?: number;
}
