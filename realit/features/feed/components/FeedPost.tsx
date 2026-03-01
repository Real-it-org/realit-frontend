import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { PostTypeBadge, PostType } from './PostTypeBadge';
import type { FeedPost as FeedPostData } from '@/services/feed/feed.service';

// ── Map backend verification_status → PostType ──────────────────────
const mapVerificationToPostType = (
    status: FeedPostData['verification_status'],
): PostType => {
    switch (status) {
        case 'verified':
            return 'realit';
        case 'ai':
            return 'ai';
        case 'unverified':
        default:
            return 'post';
    }
};

interface FeedPostProps {
    post: FeedPostData;
    onAvatarPress?: () => void;
    onLikePress?: () => void;
    onSharePress?: () => void;
    onCommentPress?: () => void;
}

export const FeedPost: React.FC<FeedPostProps> = ({
    post,
    onAvatarPress,
    onLikePress,
    onSharePress,
    onCommentPress,
}) => {
    const postType = mapVerificationToPostType(post.verification_status);

    // Use the first media item as the hero image (if any)
    const heroMedia = post.media.length > 0 ? post.media[0] : null;

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.heading} numberOfLines={1}>
                    {post.heading || ''}
                </Text>
                <TouchableOpacity onPress={onAvatarPress} style={styles.avatarGroup}>
                    {post.author.avatar_url ? (
                        <Image
                            source={{ uri: post.author.avatar_url }}
                            style={styles.avatar}
                        />
                    ) : (
                        <View style={[styles.avatar, styles.avatarPlaceholder]}>
                            <Text style={styles.avatarInitial}>
                                {(post.author.display_name || post.author.username || '?')[0].toUpperCase()}
                            </Text>
                        </View>
                    )}
                    <Text style={styles.username} numberOfLines={1}>
                        {post.author.display_name || post.author.username}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Post Image */}
            {heroMedia && (
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: heroMedia.media_url }}
                        style={styles.postImage}
                        resizeMode="cover"
                    />
                </View>
            )}

            {/* Actions + Badge */}
            <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.actionItem} onPress={onLikePress}>
                    <FontAwesome5 name="fire" size={24} color="#FF5722" />
                    <Text style={styles.actionText}>{post.likes_count}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionItem} onPress={onSharePress}>
                    <FontAwesome5 name="users" size={20} color="#00C853" />
                    <Text style={styles.actionText}>0</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionItem} onPress={onCommentPress}>
                    <FontAwesome5 name="comment" size={20} color="#FFF" />
                    <Text style={styles.actionText}>{post.comments_count}</Text>
                </TouchableOpacity>

                <View style={styles.actionSpacer} />
                <PostTypeBadge type={postType} />
            </View>

            {/* Description */}
            {post.description ? (
                <View style={styles.footer}>
                    <Text style={styles.description}>{post.description}</Text>
                </View>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000000',
        marginBottom: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: '#333333',
        paddingBottom: spacing.sm,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: 6,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    heading: {
        color: colors.textPrimary,
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'serif',
        flex: 1,
        marginRight: spacing.sm,
    },
    avatarGroup: {
        alignItems: 'center',
        gap: 3,
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#FFF',
    },
    avatarPlaceholder: {
        backgroundColor: '#555',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarInitial: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    username: {
        color: colors.textSecondary,
        fontSize: 10,
        fontWeight: '500',
        maxWidth: 70,
    },
    actionSpacer: {
        flex: 1,
    },
    imageContainer: {
        width: '100%',
        height: 300,
        backgroundColor: '#1a1a1a',
    },
    postImage: {
        width: '100%',
        height: '100%',
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingTop: spacing.sm,
        gap: spacing.lg,
    },
    actionItem: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionText: {
        color: colors.textPrimary,
        fontSize: 12,
        marginTop: 4,
    },
    footer: {
        paddingHorizontal: spacing.md,
        marginTop: spacing.sm,
    },
    description: {
        color: colors.textPrimary,
        fontSize: 14,
        fontStyle: 'italic',
    },
});
