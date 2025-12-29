import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface Props {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
}

export const Button: React.FC<Props> = ({ title, onPress, disabled }) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.buttonPrimary,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  text: {
    color: colors.buttonTextDark,
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.6,
  },
});
