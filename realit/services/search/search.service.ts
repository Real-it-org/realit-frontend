import { client } from '../api/client';

export interface UserSummary {
    id: string;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
    is_private: boolean;
}

export const searchUsers = async (query: string): Promise<UserSummary[]> => {
    if (!query) return [];
    try {
        const response = await client.get<UserSummary[]>('/profile/search', {
            params: { query },
        });
        return response.data;
    } catch (error) {
        console.error('Error searching users:', error);
        throw error;
    }
};
