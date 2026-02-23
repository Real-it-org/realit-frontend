import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform, StatusBar, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
            <View style={styles.row}>
                {/* App Title — left */}
                <View style={styles.brandRow}>
                    <Image
                        source={require('../../../assets/logo/realit_logo.png')}
                        style={styles.logoImage}
                        resizeMode="contain"
                    />
                    <Text style={styles.title}>Real-it</Text>
                </View>

                {/* Right icons */}
                <View style={styles.rightIcons}>
                    {/* Settings */}
                    <TouchableOpacity
                        style={styles.iconButton}
                        hitSlop={8}
                        onPress={() => router.push('/settings' as any)}
                    >
                        <Ionicons name="settings-outline" size={22} color="#fff" />
                    </TouchableOpacity>

                    {/* Notifications */}
                    <TouchableOpacity
                        style={styles.iconButton}
                        hitSlop={8}
                        onPress={() => router.push('/notifications' as any)}
                    >
                        <Ionicons name="notifications-outline" size={22} color="#fff" />
                        {hasNotifications && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    {/* Search */}
                    <TouchableOpacity
                        style={styles.iconButton}
                        hitSlop={8}
                        onPress={() => router.push('/search')}
                    >
                        <Ionicons name="search-outline" size={22} color="#fff" />
                    </TouchableOpacity>

                    {/* Profile */}
                    <TouchableOpacity
                        style={styles.profileButton}
                        hitSlop={8}
                        onPress={() => router.push('/profile')}
                    >
                        <View style={styles.avatar}>
                            <Ionicons name="person-outline" size={16} color="#888" />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.divider} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#000',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingVertical: 8,
    },
    brandRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    logoImage: {
        width: 28,
        height: 28,
    },
    title: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    rightIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    iconButton: {
        padding: 6,
    },
    badge: {
        position: 'absolute',
        top: 2,
        right: 2,
        backgroundColor: '#e53935',
        minWidth: 15,
        height: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 3,
    },
    badgeText: {
        color: '#fff',
        fontSize: 9,
        fontWeight: '700',
        lineHeight: 11,
    },
    profileButton: {
        padding: 4,
        marginLeft: 2,
    },
    avatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#1a1a1a',
        borderWidth: 1,
        borderColor: '#333',
        alignItems: 'center',
        justifyContent: 'center',
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#222',
    },
});
