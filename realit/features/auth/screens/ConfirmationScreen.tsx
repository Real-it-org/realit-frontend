import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../../../components/Button';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';

export const ConfirmationScreen = () => {
    const handleSignIn = () => {
        router.push('/login');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Confirmation page</Text>

            <View style={styles.messageContainer}>
                <Text style={styles.messageText}>
                    A Confirmation link has been sent to the registered email. Please verify your account and Login
                </Text>
            </View>

            <Button title="Sign in" onPress={handleSignIn} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: spacing.lg,
        justifyContent: 'center',
    },
    title: {
        color: colors.textSecondary,
        fontSize: 18,
        textAlign: 'center',
        marginBottom: spacing.lg,
    },
    messageContainer: {
        backgroundColor: colors.inputBg,
        borderRadius: 8,
        padding: spacing.lg,
        marginBottom: spacing.xl,
    },
    messageText: {
        color: colors.textPrimary,
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
    },
});
