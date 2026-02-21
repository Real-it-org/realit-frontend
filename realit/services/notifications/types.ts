export type NotificationType =
    | 'follow'
    | 'follow_request'
    | 'follow_accepted'
    | 'like'
    | 'comment';

export interface NotificationActor {
    id: string;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
}

export interface Notification {
    id: string;
    type: NotificationType;
    actor: NotificationActor;
    post_id: string | null;
    comment_id: string | null;
    is_read: boolean;
    created_at: string;
}
