import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FeedPost } from '../components/FeedPost';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
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
    const renderItem = ({ item }: { item: any }) => (
        <FeedPost
            heading={item.heading}
            userAvatar={item.userAvatar}
            postImage={item.postImage}
            likes={item.likes}
            shares={item.shares}
            comments={item.comments}
            description={item.description}
        />
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            {/* Top Header */}
            <View style={styles.header}>
                <TouchableOpacity>
                    <Ionicons name="settings-outline" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Ionicons name="notifications-outline" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Ionicons name="search-outline" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Ionicons name="person-outline" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
            </View>

            {/* Feed List */}
            <FlatList
                data={MOCK_POSTS}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.feedContent}
                showsVerticalScrollIndicator={false}
            />

            {/* Bottom Buttons */}
            <View style={styles.bottomBar}>
                <TouchableOpacity style={[styles.bottomButton, { backgroundColor: colors.buttonPost }]}>
                    <Text style={styles.buttonText}>Post</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.bottomButton, { backgroundColor: colors.buttonRealIt }]}>
                    <Text style={styles.buttonText}>Real-it</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.bottomButton, { backgroundColor: colors.buttonGenie }]}>
                    <Text style={styles.buttonText}>Genie</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        backgroundColor: '#000000',
        borderBottomWidth: 1,
        borderBottomColor: '#222',
    },
    feedContent: {
        paddingBottom: 80, // Space for bottom bar
    },
    bottomBar: {
        flexDirection: 'row',
        height: 60,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    bottomButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#000000',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'serif',
        fontStyle: 'italic', // Matching the cursive/italic look in the screenshot
    },
});
