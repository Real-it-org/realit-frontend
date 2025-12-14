import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';

interface Props {
  placeholder: string;
  secureTextEntry?: boolean;
}

export const AuthInput: React.FC<Props> = ({
  placeholder,
  secureTextEntry,
}) => {
  return (
    <TextInput
      placeholder={placeholder}
      placeholderTextColor={colors.textSecondary}
      secureTextEntry={secureTextEntry}
      style={styles.input}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.inputBg,
    borderRadius: 8,
    padding: spacing.sm,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
});
