import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { Button } from '../../../components/Button';
import { validatePassword, doPasswordsMatch } from '@/features/auth/utils/validation';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { AuthInput } from '../components/AuthInput';

export const SignupScreen = () => {
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!username || !displayName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!doPasswordsMatch(password, confirmPassword)) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    const validationResult = validatePassword(password);
    if (!validationResult.isValid) {
      Alert.alert('Invalid Password', validationResult.error);
      return;
    }

    try {
      setLoading(true);
      // NOTE: Ensure EXPO_PUBLIC_BACKEND_API_URL is set in your .env
      const apiUrl = process.env.EXPO_PUBLIC_BACKEND_API_URL || 'http://192.168.1.200:3000';

      const response = await fetch(`${apiUrl}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          username,
          display_name: displayName,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => router.push('/confirmation') }
      ]);

    } catch (error: any) {
      Alert.alert('Signup Error', error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <AuthInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <AuthInput
        placeholder="Display Name"
        value={displayName}
        onChangeText={setDisplayName}
      />
      <AuthInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <AuthInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <AuthInput
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <Button
        title={loading ? "Signing up..." : "Sign up"}
        onPress={handleSignup}
        disabled={loading}
      />
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
