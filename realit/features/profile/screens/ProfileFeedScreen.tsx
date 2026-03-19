import React, { useState, useRef, useCallback } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    StatusBar,
    TouchableOpacity,
    Text,
    ViewToken,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FeedPost } from '@/features/feed/components/FeedPost';
import type { FeedPost as FeedPostData, FeedPostMedia } from '@/services/feed/feed.service';
import type { PostResponse } from '@/services/profile/types';
import { postsService } from '@/services/posts/posts.service';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

/**
 * Maps a profile PostResponse to the FeedPost data shape
 * used by the shared FeedPost component.
 */
function mapPostToFeedPost(
    post: PostResponse,
    author: { profile_id: string; username: string; display_name: string | null; avatar_url: string | null },
): FeedPostData {
    return {
        id: String(post.id),
        heading: post.heading || '',
        description: post.description || '',
        media: post.media.map((m): FeedPostMedia => ({
            media_url: m.media_url,
            media_type: m.media_type.toLowerCase() as 'image' | 'video',
            position: m.position,
        })),
        verification_status: (post.verification_status as 'verified' | 'ai' | 'unverified') || 'unverified',
        likes_count: post.likes_count,
        comments_count: post.comments_count,
        created_at: post.created_at,
        author,
    };
}

export default function ProfileFeedScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    // Parse route params
    const rawPosts: PostResponse[] = params.posts ? JSON.parse(params.posts as string) : [];
    const startIndex = params.startIndex ? Number(params.startIndex) : 0;
    const isOwnPost = params.is_own_profile === 'true';
    const authorInfo = {
        profile_id: (params.profile_id as string) || '',
        username: (params.username as string) || '',
        display_name: (params.display_name as string) || null,
        avatar_url: (params.avatar_url as string) || null,
    };

    // Manage posts as local state so we can remove deleted ones
    const [feedPosts, setFeedPosts] = useState<FeedPostData[]>(
        () => rawPosts.map((p) => mapPostToFeedPost(p, authorInfo)),
    );

    // Visibility tracking for video auto-pause
    const [visiblePostIds, setVisiblePostIds] = useState<Set<string>>(new Set());

    const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
        const ids = new Set(viewableItems.map((v) => v.item?.id).filter(Boolean) as string[]);
        setVisiblePostIds(ids);
    }).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    }).current;

    const handleDeletePost = (postId: string) => {
        Alert.alert(
            'Delete Post?',
            'This cannot be undone. The post and all its media will be permanently deleted.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await postsService.deletePost(postId);
                            setFeedPosts((prev) => {
                                const next = prev.filter((p) => p.id !== postId);
                                // If no posts left, go back to profile
                                if (next.length === 0) {
                                    router.back();
                                }
                                return next;
                            });
                        } catch (err: any) {
                            console.error('Failed to delete post:', err);
                            Alert.alert('Error', err.response?.data?.message || 'Failed to delete post');
                        }
                    },
                },
            ],
        );
    };

    const renderItem = useCallback(({ item }: { item: FeedPostData }) => (
        <FeedPost
            post={item}
            isVisible={visiblePostIds.has(item.id)}
            isOwnPost={isOwnPost}
            onDeletePress={() => handleDeletePost(item.id)}
        />
    ), [visiblePostIds, isOwnPost]);

    const getItemLayout = useCallback((_: any, index: number) => ({
        length: 400, // approximate post height
        offset: 400 * index,
        index,
    }), []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                    {authorInfo.display_name || authorInfo.username || 'Posts'}
                </Text>
            </View>

            <FlatList
                data={feedPosts}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                initialScrollIndex={startIndex}
                getItemLayout={getItemLayout}
                contentContainerStyle={styles.feedContent}
                showsVerticalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: '#222',
    },
    backButton: {
        marginRight: spacing.md,
    },
    headerTitle: {
        color: colors.textPrimary,
        fontSize: 18,
        fontWeight: '600',
    },
    feedContent: {
        paddingBottom: 40,
    },
});
