import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, spacing } from '@/theme';

interface BadgeProps {
  label: string;
  variant?: 'default' | 'success' | 'danger' | 'dark';
  style?: ViewStyle;
}

export function Badge({ label, variant = 'default', style }: BadgeProps) {
  const palette = variantPalette[variant];
  return (
    <View style={[styles.base, { backgroundColor: palette.bg }, style]}>
      <Text style={[styles.text, { color: palette.text }]}>{label}</Text>
    </View>
  );
}

const variantPalette: Record<
  NonNullable<BadgeProps['variant']>,
  { bg: string; text: string }
> = {
  default: { bg: colors.pawSoft, text: colors.pawDeep },
  success: { bg: colors.successBg, text: colors.success },
  danger: { bg: colors.dangerBg, text: colors.danger },
  dark: { bg: colors.night, text: colors.white },
};

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
  },
});
