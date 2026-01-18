import React from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { useTheme } from '@/theme';

export function Card({ style, children, ...props }: ViewProps) {
  const theme = useTheme();
  return (
    <View
      {...props}
      style={[
        styles.base,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          ...(theme.shadow.md ?? {}),
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
  },
});
