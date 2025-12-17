import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../../../components/Button';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { AuthInput } from '../components/AuthInput';

export const SignupScreen = () => {
  const handleSignup = () => {
    router.push('/confirmation');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <AuthInput placeholder="Email" />
      <AuthInput placeholder="Password" secureTextEntry />
      <AuthInput placeholder="Confirm Password" secureTextEntry />

      <Button title="Sign up" onPress={handleSignup} />
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
    fontSize: 22,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
});
