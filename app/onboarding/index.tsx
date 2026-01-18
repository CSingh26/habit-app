import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { AppText, Screen } from '@/components';
import { useTheme } from '@/theme';

export default function OnboardingScreen() {
  const theme = useTheme();

  return (
    <Screen padded={false}>
      <LinearGradient
        colors={[theme.colors.accent, theme.colors.background]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.content}>
          <AppText variant="display" color="#0B0F18">
            Rituals, refined.
          </AppText>
          <AppText variant="subtitle" color="#0B0F18">
            Track habits, streaks, and your companion’s growth — offline and on your terms.
          </AppText>
        </View>
      </LinearGradient>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    flex: 1,
    padding: 32,
    justifyContent: 'flex-end',
  },
  content: {
    gap: 12,
    paddingBottom: 32,
  },
});
