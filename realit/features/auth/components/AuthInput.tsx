import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';

interface Props {
  placeholder: string;
  secureTextEntry?: boolean;
  value?: string;
  onChangeText?: (text: string) => void;
}

export const AuthInput: React.FC<Props> = ({
  placeholder,
  secureTextEntry,
  value,
  onChangeText,
}) => {
  return (
    <TextInput
      placeholder={placeholder}
      placeholderTextColor={colors.textSecondary}
      secureTextEntry={secureTextEntry}
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
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
