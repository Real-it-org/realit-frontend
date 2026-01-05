import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Platform, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

interface CustomHeaderProps {
    hasNotifications?: boolean;
}

export const CustomHeader: React.FC<CustomHeaderProps> = ({ hasNotifications = false }) => {
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#1a1a1a', '#000000']} // Dark gradient top to bottom
                style={styles.gradient}
            >
                {/* 1. Settings Icon - Gold/Gear effect */}
                <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="settings-sharp" size={28} color="#FFD700" style={styles.glowIcon} />
                </TouchableOpacity>

                {/* 2. Notification Icon - Bell with Badge */}
                <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="notifications" size={28} color="#FF9800" style={styles.glowIcon} />
                    {hasNotifications && (
                        <View style={styles.badge}>
                            <View style={styles.badgeDot} />
                        </View>
                    )}
                </TouchableOpacity>

                {/* 3. Search Icon - Blue/Glassy */}
                <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="search" size={28} color="#64B5F6" style={styles.glowIcon} />
                </TouchableOpacity>

                {/* 4. Profile Picture - Rounded with glow (Default/Empty initially) */}
                <TouchableOpacity style={styles.profileContainer}>
                    <View style={[styles.profileImage, styles.emptyProfile]}>
                        <Ionicons name="person" size={20} color="#666" />
                    </View>
                </TouchableOpacity>
            </LinearGradient>

            {/* Divider Line */}
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
        shadowColor: "#FFD700",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
    },
    glowIcon: {
        textShadowColor: 'rgba(255, 255, 255, 0.4)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    badge: {
        position: 'absolute',
        top: 2,
        right: 4,
        backgroundColor: 'red',
        width: 10,
        height: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#FFF'
    },
    profileContainer: {
        padding: 2,
        borderRadius: 20,
        backgroundColor: '#FFF',
        shadowColor: "#FFF",
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
    }
});
