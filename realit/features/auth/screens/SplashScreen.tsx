import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../../theme/colors';

export const SplashScreen = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/login');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/logo/realit_logo.png')}
        style={styles.logoImage}
        resizeMode="contain"
      />
      <Text style={styles.logo}>Real-it</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: 100,
    height: 100,
    marginBottom: 12,
  },
  logo: {
    color: colors.textPrimary,
    fontSize: 32,
    fontWeight: '600',
  },
});
