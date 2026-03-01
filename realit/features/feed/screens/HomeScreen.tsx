import React, { useState, useCallback, useRef } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    StatusBar,
    ActivityIndicator,
    Text,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { FeedPost } from '../components/FeedPost';
import { CustomHeader } from '../components/CustomHeader';
import { CustomBottomBar } from '../components/CustomBottomBar';
import { usePreventScreenCapture } from '@/hooks/usePreventScreenCapture';
import { profileService } from '@/services/profile/profile.service';
import { feedService, FeedPost as FeedPostData } from '@/services/feed/feed.service';

const FEED_PAGE_SIZE = 10;

export const HomeScreen = () => {
    usePreventScreenCapture(false);

    const [unreadCount, setUnreadCount] = useState(0);
    const [posts, setPosts] = useState<FeedPostData[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    // Track if a fetch is already in flight to prevent duplicates
    const fetchingRef = useRef(false);

    // ── Fetch feed (initial or refresh) ─────────────────────────────
    const fetchFeed = useCallback(async (isRefresh = false) => {
        if (fetchingRef.current) return;
        fetchingRef.current = true;

        try {
            if (isRefresh) setRefreshing(true);
            else setLoading(true);

            const data = await feedService.getFeed({ limit: FEED_PAGE_SIZE });
            setPosts(data);
            setHasMore(data.length >= FEED_PAGE_SIZE);
        } catch (error) {
            console.error('Failed to fetch feed:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
            fetchingRef.current = false;
        }
    }, []);

    // ── Load more (infinite scroll) ─────────────────────────────────
    const loadMore = useCallback(async () => {
        if (fetchingRef.current || !hasMore || posts.length === 0) return;
        fetchingRef.current = true;
        setLoadingMore(true);

        try {
            const lastPost = posts[posts.length - 1];
            const data = await feedService.getFeed({
                cursor: lastPost.id,
                limit: FEED_PAGE_SIZE,
            });
            setPosts((prev) => [...prev, ...data]);
            setHasMore(data.length >= FEED_PAGE_SIZE);
        } catch (error) {
            console.error('Failed to load more feed:', error);
        } finally {
            setLoadingMore(false);
            fetchingRef.current = false;
        }
    }, [hasMore, posts]);

    // ── Fetch on screen focus ───────────────────────────────────────
    useFocusEffect(
        useCallback(() => {
            fetchFeed();
            profileService
                .getProfile()
                .then((p) => setUnreadCount(p.unread_notifications_count ?? 0))
                .catch(() => { });
        }, [fetchFeed]),
    );

    // ── Handlers ────────────────────────────────────────────────────
    const handleLike = (id: string) => console.log('Like', id);
    const handleShare = (id: string) => console.log('Share', id);
    const handleComment = (id: string) => console.log('Comment', id);

    const renderItem = ({ item }: { item: FeedPostData }) => (
        <FeedPost
            post={item}
            onLikePress={() => handleLike(item.id)}
            onSharePress={() => handleShare(item.id)}
            onCommentPress={() => handleComment(item.id)}
        />
    );

    const renderFooter = () => {
        if (loadingMore) {
            return (
                <View style={styles.footerLoader}>
                    <ActivityIndicator color="#888" />
                </View>
            );
        }
        return null;
    };

    const renderEmpty = () => {
        if (loading) return null;
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Your feed is empty</Text>
                <Text style={styles.emptySubtext}>
                    Follow people to see their posts here
                </Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />

            <CustomHeader unreadCount={unreadCount} />

            {loading && posts.length === 0 ? (
                <View style={styles.centerLoader}>
                    <ActivityIndicator size="large" color="#888" />
                </View>
            ) : (
                <FlatList
                    data={posts}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.feedContent}
                    showsVerticalScrollIndicator={false}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={renderFooter}
                    ListEmptyComponent={renderEmpty}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => fetchFeed(true)}
                            tintColor="#888"
                        />
                    }
                />
            )}

            <CustomBottomBar />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    feedContent: {
        paddingBottom: 110,
        flexGrow: 1,
    },
    centerLoader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerLoader: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyText: {
        color: '#AAA',
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },
    emptySubtext: {
        color: '#666',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 8,
    },
});
