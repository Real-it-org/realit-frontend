import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { profileService } from '@/services/profile/profile.service';
import { ProfileResponse, PostResponse } from '@/services/profile/types';
import { ProfileHeader } from '../components/ProfileHeader';
import { PostGrid } from '../components/PostGrid';
import { colors } from '@/theme/colors';

export default function ProfileScreen() {
    const [profile, setProfile] = useState<ProfileResponse | null>(null);
    const [posts, setPosts] = useState<PostResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Load profile and posts in parallel
            const [profileData, postsData] = await Promise.all([
                profileService.getProfile(),
                profileService.getUserPosts()
            ]);

            setProfile(profileData);
            setPosts(postsData);

        } catch (err: any) {
            console.error('Failed to load profile:', err);
            setError('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FFD700" />
            </View>
        );
    }

    if (error || !profile) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>{error || 'Something went wrong'}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <PostGrid
                posts={posts}
                ListHeaderComponent={<ProfileHeader profile={profile} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    centerContainer: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
    },
});
