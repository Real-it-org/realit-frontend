import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Platform,
    StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { authService } from '@/services/auth/auth.service';
import { colors } from '@/theme/colors';

export const SettingsScreen = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogout = () => {
        Alert.alert(
            'Log Out',
            'Are you sure you want to log out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Log Out',
                    style: 'destructive',
                    onPress: async () => {
                        setLoading(true);
                        try {
                            await authService.logout();
                        } finally {
                            setLoading(false);
                            // Replace the entire stack so back-button can't return to feed
                            router.replace('/login');
                        }
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                    hitSlop={8}
                >
                    <Ionicons name="chevron-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
                {/* Spacer to balance header */}
                <View style={styles.headerSpacer} />
            </View>

            <View style={styles.divider} />

            {/* Settings list */}
            <View style={styles.section}>
                <TouchableOpacity
                    style={styles.row}
                    onPress={handleLogout}
                    disabled={loading}
                    activeOpacity={0.7}
                >
                    <View style={styles.rowLeft}>
                        <View style={[styles.iconBox, { backgroundColor: '#e5393520' }]}>
                            <Ionicons name="log-out-outline" size={20} color="#e53935" />
                        </View>
                        <Text style={styles.rowLabel}>Log Out</Text>
                    </View>
                    {loading
                        ? <ActivityIndicator size="small" color="#e53935" />
                        : <Ionicons name="chevron-forward" size={18} color="#555" />
                    }
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '600',
    },
    headerSpacer: {
        width: 32,
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#222',
    },
    section: {
        marginTop: 28,
        marginHorizontal: 16,
        backgroundColor: '#111',
        borderRadius: 14,
        overflow: 'hidden',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconBox: {
        width: 34,
        height: 34,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rowLabel: {
        color: '#e53935',
        fontSize: 16,
        fontWeight: '500',
    },
});
