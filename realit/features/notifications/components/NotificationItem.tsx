import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Notification, NotificationType } from '@/services/notifications/types';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

interface NotificationItemProps {
    notification: Notification;
}

function buildMessage(type: NotificationType, actorUsername: string): string {
    switch (type) {
        case 'follow':
            return `${actorUsername} started following you.`;
        case 'follow_request':
            return `${actorUsername} requested to follow you.`;
        case 'follow_accepted':
            return `${actorUsername} accepted your follow request.`;
        case 'like':
            return `${actorUsername} liked your post.`;
        case 'comment':
            return `${actorUsername} commented on your post.`;
        default:
            return `${actorUsername} interacted with you.`;
    }
}

function typeIcon(type: NotificationType): { name: keyof typeof Ionicons.glyphMap; color: string } {
    switch (type) {
        case 'follow':
        case 'follow_accepted':
            return { name: 'person-add', color: '#64B5F6' };
        case 'follow_request':
            return { name: 'person-add-outline', color: '#FF9800' };
        case 'like':
            return { name: 'heart', color: '#F06292' };
        case 'comment':
            return { name: 'chatbubble', color: colors.buttonPost };
        default:
            return { name: 'notifications', color: '#888' };
    }
}

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const secs = Math.floor(diff / 1000);
    if (secs < 60) return `${secs}s`;
    const mins = Math.floor(secs / 60);
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;
    return `${Math.floor(days / 7)}w`;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
    const router = useRouter();
    const { actor, type, is_read, created_at } = notification;
    const icon = typeIcon(type);

    return (
        <TouchableOpacity
            style={[styles.row, !is_read && styles.unreadRow]}
            activeOpacity={0.7}
            onPress={() => router.push(`/profile/${actor.id}`)}
        >
            {/* Unread indicator */}
            {!is_read && <View style={styles.unreadDot} />}

            {/* Avatar */}
            <View style={styles.avatarWrapper}>
                {actor.avatar_url ? (
                    <Image source={{ uri: actor.avatar_url }} style={styles.avatar} />
                ) : (
                    <View style={[styles.avatar, styles.avatarPlaceholder]}>
                        <Ionicons name="person" size={18} color="#666" />
                    </View>
                )}
                {/* Type icon badge */}
                <View style={[styles.iconBadge, { backgroundColor: icon.color }]}>
                    <Ionicons name={icon.name} size={10} color="#000" />
                </View>
            </View>

            {/* Text */}
            <View style={styles.textContainer}>
                <Text style={styles.message} numberOfLines={2}>
                    <Text style={styles.bold}>{actor.username}</Text>
                    {' '}
                    {buildMessage(type, '').replace(actor.username + ' ', '')}
                </Text>
                <Text style={styles.time}>{timeAgo(created_at)}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: '#111',
    },
    unreadRow: {
        backgroundColor: '#0d0d0d',
    },
    unreadDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.buttonPost,
        marginRight: spacing.xs,
        flexShrink: 0,
    },
    avatarWrapper: {
        position: 'relative',
        marginRight: spacing.md,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
    },
    avatarPlaceholder: {
        backgroundColor: '#333',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#555',
    },
    iconBadge: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        width: 18,
        height: 18,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: '#000',
    },
    textContainer: {
        flex: 1,
    },
    message: {
        color: colors.textPrimary,
        fontSize: 14,
        lineHeight: 20,
    },
    bold: {
        fontWeight: '700',
    },
    time: {
        color: colors.textSecondary,
        fontSize: 12,
        marginTop: 3,
    },
});
