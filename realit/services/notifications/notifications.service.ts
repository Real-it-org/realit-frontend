import { client } from '@/services/api/client';
import { Notification } from './types';

export const notificationsService = {
    /**
     * Fetch paginated notifications for the current user.
     */
    async getNotifications(page = 1, limit = 30): Promise<Notification[]> {
        const response = await client.get<Notification[]>('/notifications', {
            params: { page, limit },
        });
        return response.data;
    },

    /**
     * Mark specific notification IDs as read.
     */
    async markAsRead(ids: string[]): Promise<void> {
        await client.patch('/notifications/read', { ids });
    },

    /**
     * Mark all notifications as read (called when user opens the screen).
     */
    async markAllAsRead(): Promise<void> {
        await client.patch('/notifications/read-all');
    },
};
