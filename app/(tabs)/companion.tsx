import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText, Card, Screen } from '@/components';
import { useTheme } from '@/theme';

export default function CompanionScreen() {
  const theme = useTheme();

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="display">Companion</AppText>
        <AppText variant="caption" color={theme.colors.textMuted}>
          Grow your pet with every streak.
        </AppText>
      </View>

      <View style={styles.stack}>
        <Card>
          <AppText variant="title">Your companion awaits</AppText>
          <AppText variant="caption" color={theme.colors.textMuted}>
            Complete habits to help it thrive.
          </AppText>
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 6,
  },
  stack: {
    marginTop: 24,
    gap: 12,
  },
});
