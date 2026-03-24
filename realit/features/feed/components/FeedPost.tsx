import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, Dimensions, Alert } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useIsFocused } from '@react-navigation/native';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { PostTypeBadge, PostType } from './PostTypeBadge';
import type { FeedPost as FeedPostData } from '@/services/feed/feed.service';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

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
    isVisible?: boolean;
    isOwnPost?: boolean;
    onAvatarPress?: () => void;
    onLikePress?: () => void;
    onSharePress?: () => void;
    onCommentPress?: () => void;
    onDeletePress?: () => void;
}

/**
 * Inline video player for feed posts.
 * Shows native controls with play/pause, seek bar, timestamp, and fullscreen.
 */
const HeroVideo = ({ uri, isVisible }: { uri: string; isVisible: boolean }) => {
    const isFocused = useIsFocused();
    const shouldPlay = isVisible && isFocused;

    const player = useVideoPlayer(uri, (p) => {
        p.loop = true;
    });

    useEffect(() => {
        if (shouldPlay) {
            player.play();
        } else {
            player.pause();
        }
    }, [shouldPlay, player]);

    return (
        <VideoView
            style={styles.postImage}
            player={player}
            nativeControls={true}
            allowsFullscreen={true}
            allowsPictureInPicture={true}
        />
    );
};

/**
 * Fullscreen video player shown inside the modal.
 */
const FullscreenVideo = ({ uri }: { uri: string }) => {
    const player = useVideoPlayer(uri, (p) => {
        p.loop = true;
        p.play();
    });

    return (
        <VideoView
            style={styles.fullscreenMedia}
            player={player}
            nativeControls={true}
            allowsFullscreen={true}
            allowsPictureInPicture={true}
        />
    );
};

export const FeedPost: React.FC<FeedPostProps> = ({
    post,
    isVisible = false,
    isOwnPost = false,
    onAvatarPress,
    onLikePress,
    onSharePress,
    onCommentPress,
    onDeletePress,
}) => {
    const postType = mapVerificationToPostType(post.verification_status);
    const [fullscreenOpen, setFullscreenOpen] = useState(false);

    // 3-dot menu handler
    const handleMenuPress = () => {
        Alert.alert(
            'Post Options',
            undefined,
            [
                {
                    text: 'Delete Post',
                    style: 'destructive',
                    onPress: onDeletePress,
                },
                { text: 'Cancel', style: 'cancel' },
            ],
        );
    };

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

            {/* Post Media — square box; images are tappable for fullscreen, videos are not */}
            {heroMedia && heroMedia.media_type === 'video' && (
                <View style={styles.imageContainer}>
                    <HeroVideo uri={heroMedia.media_url} isVisible={isVisible} />
                </View>
            )}
            {heroMedia && heroMedia.media_type !== 'video' && (
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => setFullscreenOpen(true)}
                    style={styles.imageContainer}
                >
                    <Image
                        source={{ uri: heroMedia.media_url }}
                        style={styles.postImage}
                        resizeMode="cover"
                    />
                </TouchableOpacity>
            )}

            {/* Fullscreen Modal — images only (videos handle fullscreen natively) */}
            {heroMedia && heroMedia.media_type !== 'video' && (
                <Modal
                    visible={fullscreenOpen}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setFullscreenOpen(false)}
                >
                    <View style={styles.modalContainer}>
                        <TouchableOpacity
                            style={styles.modalCloseButton}
                            onPress={() => setFullscreenOpen(false)}
                        >
                            <Ionicons name="close-circle" size={36} color="#FFF" />
                        </TouchableOpacity>

                        <Image
                            source={{ uri: heroMedia.media_url }}
                            style={styles.fullscreenMedia}
                            resizeMode="contain"
                        />
                    </View>
                </Modal>
            )}

            {/* Actions + Badge */}
            <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.actionItem} onPress={onLikePress}>
                    <FontAwesome5
                        name="fire"
                        size={24}
                        color={post.is_liked ? '#FF5722' : '#888'}
                        solid={post.is_liked}
                    />
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
                {isOwnPost && (
                    <TouchableOpacity onPress={handleMenuPress} style={styles.menuButton} hitSlop={8}>
                        <Ionicons name="ellipsis-vertical" size={20} color="#FFF" />
                    </TouchableOpacity>
                )}
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
    menuButton: {
        padding: 4,
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
        aspectRatio: 1,
        backgroundColor: '#1a1a1a',
    },
    postImage: {
        width: '100%',
        height: '100%',
    },
    // Fullscreen modal
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.95)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalCloseButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 20,
    },
    fullscreenMedia: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT * 0.8,
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
