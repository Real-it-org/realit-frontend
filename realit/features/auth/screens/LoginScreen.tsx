import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { authService } from '@/services/auth/auth.service';
import { useRouter } from 'expo-router';
import { AuthInput } from '../components/AuthInput';
import { Button } from '../../../components/Button';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';

export const LoginScreen = () => {
  const router = useRouter();
  const [identifier, setIdentifier] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    if (!identifier || !password) {
      // TODO: Add proper error handling/alert
      alert('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);

      await authService.login({
        identifier,
        password,
      });

      console.log('Login successful');
      // Navigate to home or dashboard after successful login
      router.replace('/feed');

    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign in</Text>

      <AuthInput
        placeholder="Email or Username"
        value={identifier}
        onChangeText={setIdentifier}
      />
      <AuthInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button
        title={loading ? "Logging in..." : "Login"}
        onPress={handleLogin}
        disabled={loading}
      />

      <Text style={styles.signupText}>
        Don’t have an account?{' '}
        <Text
          style={styles.signupLink}
          onPress={() => router.push('/signup')}
        >
          SignUp
        </Text>
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
