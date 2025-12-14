import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AuthInput } from '../components/AuthInput';
import { Button } from '../../../components/Button';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';

export const LoginScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign in</Text>

      <AuthInput placeholder="Email" />
      <AuthInput placeholder="Password" secureTextEntry />

      <Button title="Login" onPress={() => {}} />

      <Text style={styles.signupText}>
        Don’t have an account?{' '}
        <Text style={styles.signupLink}>SignUp</Text>
      </Text>

      <TouchableOpacity style={styles.googleButton}>
        <Text style={styles.googleText}>Sign up with Google</Text>
      </TouchableOpacity>
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
    color: colors.textPrimary,
    fontSize: 24,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  signupText: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  signupLink: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: spacing.sm,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  googleText: {
    color: '#000000',
    fontWeight: '500',
  },
});
