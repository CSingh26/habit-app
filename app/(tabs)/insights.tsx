import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText, Card, Screen } from '@/components';
import { useTheme } from '@/theme';

export default function InsightsScreen() {
  const theme = useTheme();

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="display">Insights</AppText>
        <AppText variant="caption" color={theme.colors.textMuted}>
          Trends, streaks, and progress snapshots.
        </AppText>
      </View>

      <View style={styles.stack}>
        <Card>
          <AppText variant="title">Analytics preview</AppText>
          <AppText variant="caption" color={theme.colors.textMuted}>
            Streaks and heatmaps will live here.
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
