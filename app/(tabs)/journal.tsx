import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText, Card, Screen } from '@/components';
import { useTheme } from '@/theme';

export default function JournalScreen() {
  const theme = useTheme();

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="display">Journal</AppText>
        <AppText variant="caption" color={theme.colors.textMuted}>
          Reflect on mood, energy, and wins.
        </AppText>
      </View>

      <View style={styles.stack}>
        <Card>
          <AppText variant="title">Start today’s entry</AppText>
          <AppText variant="caption" color={theme.colors.textMuted}>
            Track mood, energy, and habit reflections.
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
