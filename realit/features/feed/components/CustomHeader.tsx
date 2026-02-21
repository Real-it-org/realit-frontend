import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Platform, StatusBar, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

import { useRouter } from 'expo-router';

interface CustomHeaderProps {
    unreadCount?: number;
}

export const CustomHeader: React.FC<CustomHeaderProps> = ({ unreadCount = 0 }) => {
    const router = useRouter();
    const hasNotifications = unreadCount > 0;

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#1a1a1a', '#000000']}
                style={styles.gradient}
            >
                {/* 1. Settings Icon */}
                <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="settings-sharp" size={28} color="#FFD700" style={styles.glowIcon} />
                </TouchableOpacity>

                {/* 2. Notification Icon — navigates to /notifications */}
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => router.push('/notifications' as any)}
                >
                    <Ionicons name="notifications" size={28} color="#FF9800" style={styles.glowIcon} />
                    {hasNotifications && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>

                {/* 3. Search Icon */}
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => router.push('/search')}
                >
                    <Ionicons name="search" size={28} color="#64B5F6" style={styles.glowIcon} />
                </TouchableOpacity>

                {/* 4. Profile Picture */}
                <TouchableOpacity
                    style={styles.profileContainer}
                    onPress={() => router.push('/profile')}
                >
                    <View style={[styles.profileImage, styles.emptyProfile]}>
                        <Ionicons name="person" size={20} color="#666" />
                    </View>
                </TouchableOpacity>
            </LinearGradient>

            {/* Divider */}
            <LinearGradient
                colors={['transparent', '#333', 'transparent']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.divider}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    gradient: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
    },
    iconButton: {
        padding: spacing.xs,
    },
    glowIcon: {
        textShadowColor: 'rgba(255, 255, 255, 0.4)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    badge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: 'red',
        minWidth: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 3,
    },
    badgeText: {
        color: '#FFF',
        fontSize: 9,
        fontWeight: '800',
        lineHeight: 11,
    },
    profileContainer: {
        padding: 2,
        borderRadius: 20,
        backgroundColor: '#FFF',
        shadowColor: '#FFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 8,
    },
    profileImage: {
        width: 36,
        height: 36,
        borderRadius: 18,
    },
    emptyProfile: {
        backgroundColor: '#222',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#444',
    },
    divider: {
        height: 1,
        width: '100%',
        opacity: 0.5,
    },
});
