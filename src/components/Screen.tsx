import React from 'react';
import { StyleSheet, type ViewStyle } from 'react-native';
import { SafeAreaView, type SafeAreaViewProps } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { useTheme } from '@/theme';

type ScreenProps = SafeAreaViewProps & {
  padded?: boolean;
  style?: ViewStyle;
};

export function Screen({ children, padded = true, style, ...props }: ScreenProps) {
  const theme = useTheme();
  const background = theme.colors.background;
  const glow = theme.colors.accentSoft;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: background }, padded && styles.padded, style]}
      {...props}
    >
      <LinearGradient
        colors={[background, glow]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  padded: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
});
