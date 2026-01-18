import React from 'react';
import { StyleSheet, Text, type TextProps } from 'react-native';

import { fontFamilies, fontSizes, lineHeights, useTheme } from '@/theme';

type TextVariant = 'display' | 'title' | 'subtitle' | 'body' | 'caption';

const variantMap: Record<
  TextVariant,
  { size: keyof typeof fontSizes; line: keyof typeof lineHeights; family: keyof typeof fontFamilies }
> = {
  display: { size: 'display', line: 'display', family: 'display' },
  title: { size: 'xxl', line: 'xxl', family: 'bodySemiBold' },
  subtitle: { size: 'lg', line: 'lg', family: 'bodyMedium' },
  body: { size: 'md', line: 'md', family: 'body' },
  caption: { size: 'sm', line: 'sm', family: 'bodyMedium' },
};

export function AppText({
  variant = 'body',
  color,
  style,
  ...props
}: TextProps & { variant?: TextVariant; color?: string }) {
  const theme = useTheme();
  const mapped = variantMap[variant];

  return (
    <Text
      {...props}
      style={[
        styles.base,
        {
          color: color ?? theme.colors.text,
          fontFamily: theme.typography.fontFamilies[mapped.family],
          fontSize: theme.typography.fontSizes[mapped.size],
          lineHeight: theme.typography.lineHeights[mapped.line],
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    letterSpacing: -0.2,
  },
});
