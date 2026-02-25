import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { FeedPost } from '../components/FeedPost';
import { CustomHeader } from '../components/CustomHeader';
import { CustomBottomBar } from '../components/CustomBottomBar';
import { usePreventScreenCapture } from '@/hooks/usePreventScreenCapture';
import { profileService } from '@/services/profile/profile.service';

// Mock Data
const MOCK_POSTS = [
    {
        id: '1',
        heading: 'Into the empty land...',
        username: 'alex_wanderer',
        postType: 'realit' as const,
        userAvatar: { uri: 'https://i.pravatar.cc/150?img=1' },
        postImage: { uri: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1000&auto=format&fit=crop' },
        likes: 50,
        shares: 10,
        comments: 5,
        description: 'The beauty of the desert is that it hides a well somewhere...',
    },
    {
        id: '2',
        heading: 'My Goa Trip',
        username: 'priya_travels',
        postType: 'post' as const,
        userAvatar: { uri: 'https://i.pravatar.cc/150?img=8' },
        postImage: { uri: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1000&auto=format&fit=crop' },
        likes: 12,
        shares: 3,
        comments: 2,
        description: 'One of the best place to Visit is south Goa..',
    },
    {
        id: '3',
        heading: 'Teacher Slapped',
        username: 'news_daily',
        postType: 'ai' as const,
        userAvatar: { uri: 'https://i.pravatar.cc/150?img=5' },
        postImage: { uri: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1000&auto=format&fit=crop' },
        likes: 102,
        shares: 45,
        comments: 89,
        description: 'Breaking news from the local school district.',
    },
];

export const HomeScreen = () => {
    usePreventScreenCapture(false);

    const [unreadCount, setUnreadCount] = useState(0);

    useFocusEffect(
        useCallback(() => {
            // Re-fetch on every focus so the badge clears after visiting notifications
            profileService.getProfile()
                .then((p) => setUnreadCount(p.unread_notifications_count ?? 0))
                .catch(() => { });
        }, [])
    );

    const handleLike = (id: string) => console.log('Like', id);
    const handleShare = (id: string) => console.log('Share', id);
    const handleComment = (id: string) => console.log('Comment', id);

    const renderItem = ({ item }: { item: any }) => (
        <FeedPost
            heading={item.heading}
            username={item.username}
            postType={item.postType}
            userAvatar={item.userAvatar}
            postImage={item.postImage}
            likes={item.likes}
            shares={item.shares}
            comments={item.comments}
            description={item.description}
            onLikePress={() => handleLike(item.id)}
            onSharePress={() => handleShare(item.id)}
            onCommentPress={() => handleComment(item.id)}
        />
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />

            <CustomHeader unreadCount={unreadCount} />

            <FlatList
                data={MOCK_POSTS}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.feedContent}
                showsVerticalScrollIndicator={false}
            />

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
    },
});
