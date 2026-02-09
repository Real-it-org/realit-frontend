import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { profileService } from '@/services/profile/profile.service';
import { ProfileResponse, PostResponse, PublicProfileResponse } from '@/services/profile/types';
import { ProfileHeader } from '../components/ProfileHeader';
import { PostGrid } from '../components/PostGrid';
import { colors } from '@/theme/colors';

interface ProfileScreenProps {
    userId?: string;
}

export default function ProfileScreen({ userId }: ProfileScreenProps) {
    const [profile, setProfile] = useState<ProfileResponse | PublicProfileResponse | null>(null);
    const [posts, setPosts] = useState<PostResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        loadData();
    }, [userId]);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);

            if (userId) {
                // Load public profile
                const [profileData, postsData] = await Promise.all([
                    profileService.getPublicProfile(userId),
                    profileService.getPublicUserPosts(userId)
                ]);
                setProfile(profileData);
                setPosts(postsData);
                setIsFollowing(profileData.is_following);
            } else {
                // Load own profile
                const [profileData, postsData] = await Promise.all([
                    profileService.getProfile(),
                    profileService.getUserPosts()
                ]);
                setProfile(profileData);
                setPosts(postsData);
            }

        } catch (err: any) {
            console.error('Failed to load profile:', err);
            setError('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleFollowToggle = async () => {
        if (!userId || !profile) return;

        // Optimistic update
        const newIsFollowing = !isFollowing;
        setIsFollowing(newIsFollowing);

        // Update follower count locally
        setProfile(prev => {
            if (!prev) return null;
            return {
                ...prev,
                followers_count: prev.followers_count + (newIsFollowing ? 1 : -1)
            };
        });

        try {
            if (newIsFollowing) {
                await profileService.followUser(userId);
            } else {
                await profileService.unfollowUser(userId);
            }
        } catch (error) {
            console.error('Failed to toggle follow:', error);
            // Revert on error
            setIsFollowing(!newIsFollowing);
            setProfile(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    followers_count: prev.followers_count + (newIsFollowing ? -1 : 1)
                };
            });
            alert('Failed to update follow status');
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
                ListHeaderComponent={
                    <ProfileHeader
                        profile={profile}
                        isOwnProfile={!userId}
                        isFollowing={isFollowing}
                        onFollowPress={handleFollowToggle}
                    />
                }
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
