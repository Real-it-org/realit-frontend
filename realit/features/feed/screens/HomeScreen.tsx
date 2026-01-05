import React from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, Platform, StatusBar } from 'react-native';
import { FeedPost } from '../components/FeedPost';
import { CustomHeader } from '../components/CustomHeader';
import { CustomBottomBar } from '../components/CustomBottomBar';
import { usePreventScreenCapture } from '@/hooks/usePreventScreenCapture';

// Mock Data
const MOCK_POSTS = [
    {
        id: '1',
        heading: 'Into the empty land...',
        userAvatar: { uri: 'https://i.pravatar.cc/150?img=1' }, // Placeholder
        postImage: { uri: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1000&auto=format&fit=crop' }, // Desert
        likes: 50,
        shares: 10,
        comments: 5,
        description: 'The beauty of the desert is that it hides a well somewhere...',
    },
    {
        id: '2',
        heading: 'My Goa Trip',
        userAvatar: { uri: 'https://i.pravatar.cc/150?img=8' },
        postImage: { uri: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1000&auto=format&fit=crop' }, // Sunset/Person
        likes: 12,
        shares: 3,
        comments: 2,
        description: 'One of the best place to Visit is south Goa..',
    },
    {
        id: '3',
        heading: 'Teacher Slapped',
        userAvatar: { uri: 'https://i.pravatar.cc/150?img=5' },
        postImage: { uri: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1000&auto=format&fit=crop' }, // Classroom/School
        likes: 102,
        shares: 45,
        comments: 89,
        description: 'Breaking news from the local school district.',
    },
];

export const HomeScreen = () => {
    usePreventScreenCapture();

    // Handlers (Placeholders)
    const handleLike = (id: string) => console.log('Like', id);
    const handleShare = (id: string) => console.log('Share', id);
    const handleComment = (id: string) => console.log('Comment', id);

    const renderItem = ({ item }: { item: any }) => (
        <FeedPost
            heading={item.heading}
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

            {/* Custom Header - Pass true/false to toggle notification badge */}
            <CustomHeader hasNotifications={true} />

            {/* Feed List */}
            <FlatList
                data={MOCK_POSTS}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.feedContent}
                showsVerticalScrollIndicator={false}
            />

            {/* Custom Bottom Bar */}
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
        paddingBottom: 110, // Increased space for the taller CustomBottomBar
    },
});
