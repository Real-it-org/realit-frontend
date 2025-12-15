import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AuthInput } from '../components/AuthInput';
import { Button } from '../../../components/Button';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';

export const SignupScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <AuthInput placeholder="Email" />
      <AuthInput placeholder="Password" secureTextEntry />
      <AuthInput placeholder="Confirm Password" secureTextEntry />

      <Button title="Sign up" onPress={() => {}} />
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
