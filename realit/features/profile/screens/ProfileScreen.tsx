import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { profileService } from '@/services/profile/profile.service';
import { ProfileResponse, PostResponse, PublicProfileResponse } from '@/services/profile/types';
import { ProfileHeader } from '../components/ProfileHeader';
import { PostGrid } from '../components/PostGrid';
import { PrivateAccountBanner } from '../components/PrivateAccountBanner';
import { colors } from '@/theme/colors';

interface ProfileScreenProps {
    userId?: string;
}

export default function ProfileScreen({ userId }: ProfileScreenProps) {
    const [profile, setProfile] = useState<ProfileResponse | PublicProfileResponse | null>(null);
    const [posts, setPosts] = useState<PostResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // isFollowing: true = following, false = not following, null = request sent (pending)
    const [followState, setFollowState] = useState<boolean | 'requested'>(false);

    const isOwnProfile = !userId;

    useEffect(() => {
        loadData();
    }, [userId]);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);

            if (userId) {
                const [profileData, postsData] = await Promise.all([
                    profileService.getPublicProfile(userId),
                    profileService.getPublicUserPosts(userId),
                ]);
                setProfile(profileData);
                setFollowState(profileData.is_following);

                // Only load posts if public or already following
                if (!profileData.is_private || profileData.is_following) {
                    setPosts(postsData);
                }
            } else {
                const [profileData, postsData] = await Promise.all([
                    profileService.getProfile(),
                    profileService.getUserPosts(),
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

        const currentState = followState;

        // Optimistic update
        if (currentState === true) {
            // Unfollow
            setFollowState(false);
            setProfile(prev => prev ? { ...prev, followers_count: prev.followers_count - 1 } : null);
            try {
                await profileService.unfollowUser(userId);
            } catch {
                setFollowState(true);
                setProfile(prev => prev ? { ...prev, followers_count: prev.followers_count + 1 } : null);
            }
        } else if (currentState === false) {
            // Follow (may become 'requested' for private accounts)
            const isPrivate = (profile as PublicProfileResponse).is_private;
            if (isPrivate) {
                setFollowState('requested');
            } else {
                setFollowState(true);
                setProfile(prev => prev ? { ...prev, followers_count: prev.followers_count + 1 } : null);
            }
            try {
                await profileService.followUser(userId);
            } catch {
                setFollowState(false);
                if (!isPrivate) {
                    setProfile(prev => prev ? { ...prev, followers_count: prev.followers_count - 1 } : null);
                }
            }
        }
        // 'requested' state: tapping again does nothing (could cancel in future)
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

    // Private profile guard: only applies when viewing someone else's private profile and NOT following
    const isPrivateAndLocked =
        !isOwnProfile &&
        (profile as PublicProfileResponse).is_private &&
        followState !== true;

    const header = (
        <ProfileHeader
            profile={profile}
            isOwnProfile={isOwnProfile}
            followState={isOwnProfile ? true : followState}
            onFollowPress={handleFollowToggle}
        />
    );

    return (
        <View style={styles.container}>
            {isPrivateAndLocked ? (
                <PostGrid
                    posts={[]}
                    ListHeaderComponent={
                        <View>
                            {header}
                            <PrivateAccountBanner />
                        </View>
                    }
                />
            ) : (
                <PostGrid
                    posts={posts}
                    ListHeaderComponent={header}
                />
            )}
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
