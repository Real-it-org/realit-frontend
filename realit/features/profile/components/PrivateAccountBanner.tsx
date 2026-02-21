import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

export const PrivateAccountBanner: React.FC = () => (
    <View style={styles.container}>
        <View style={styles.iconWrap}>
            <Ionicons name="lock-closed" size={32} color="#555" />
        </View>
        <Text style={styles.title}>This account is private</Text>
        <Text style={styles.subtitle}>Follow this account to see their posts</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingTop: spacing.xl + spacing.lg,
        paddingHorizontal: spacing.xl,
    },
    iconWrap: {
        width: 72,
        height: 72,
        borderRadius: 36,
        borderWidth: 2,
        borderColor: '#222',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
    },
    title: {
        color: colors.textPrimary,
        fontSize: 16,
        fontWeight: '600',
        marginBottom: spacing.xs,
    },
    subtitle: {
        color: colors.textSecondary,
        fontSize: 14,
        textAlign: 'center',
    },
});
