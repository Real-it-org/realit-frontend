import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ProfileResponse } from '@/services/profile/types';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

interface ProfileHeaderProps {
    profile: ProfileResponse;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <View style={styles.headerBar}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile Page</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.content}>
                <Text style={styles.username}>{profile.username || 'User'}</Text>

                <View style={styles.avatarContainer}>
                    {profile.avatar_url ? (
                        <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
                    ) : (
                        <View style={[styles.avatar, styles.avatarPlaceholder]}>
                            <Ionicons name="person" size={48} color="#666" />
                        </View>
                    )}
                    <View style={styles.avatarRing} />
                </View>

                <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>Edit Profile</Text>
                </TouchableOpacity>

                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{profile.posts_count}</Text>
                        <Text style={styles.statLabel}>Posts</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{profile.followers_count}</Text>
                        <Text style={styles.statLabel}>Followers</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{profile.following_count}</Text>
                        <Text style={styles.statLabel}>Following</Text>
                    </View>
                </View>

                {profile.bio ? <Text style={styles.bio}>{profile.bio}</Text> : null}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000',
        paddingBottom: spacing.lg,
    },
    headerBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 50,
        marginBottom: spacing.md,
    },
    backButton: {
        padding: spacing.xs,
    },
    headerTitle: {
        color: '#888',
        fontSize: 16,
    },
    content: {
        alignItems: 'center',
    },
    username: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: spacing.lg,
    },
    avatarContainer: {
        marginBottom: spacing.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        zIndex: 1,
    },
    avatarPlaceholder: {
        backgroundColor: '#333',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#555',
    },
    avatarRing: {
        position: 'absolute',
        width: 116,
        height: 116,
        borderRadius: 58,
        borderWidth: 2,
        borderColor: '#333',
        zIndex: 0,
    },
    actionButton: {
        backgroundColor: '#444',
        paddingVertical: 8,
        paddingHorizontal: 32,
        borderRadius: 6,
        marginBottom: spacing.xl,
    },
    actionButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        paddingHorizontal: spacing.xl,
        marginBottom: spacing.md,
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statLabel: {
        color: '#888',
        fontSize: 12,
    },
    bio: {
        color: '#CCC',
        textAlign: 'center',
        paddingHorizontal: spacing.xl,
        marginTop: spacing.sm,
    },
});
