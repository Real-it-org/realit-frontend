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
    unread_notifications_count: number;
}

export interface PublicProfileResponse extends ProfileResponse {
    id: string;
    is_following: boolean;
}

export interface PostMedia {
    media_url: string;
    media_type: 'image' | 'video';
    position: number;
}

export interface PostResponse {
    id: number;
    heading?: string;
    description?: string;
    media: PostMedia[];
    verification_status: string;
    likes_count: number;
    comments_count: number;
    created_at: string;
    is_liked?: boolean;
}

export interface PaginationQuery {
    page?: number;
    limit?: number;
}
