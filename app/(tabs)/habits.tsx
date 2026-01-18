import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText, Card, Screen } from '@/components';
import { useTheme } from '@/theme';

export default function HabitsScreen() {
  const theme = useTheme();

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="display">Habits</AppText>
        <AppText variant="caption" color={theme.colors.textMuted}>
          Build rituals that stick.
        </AppText>
      </View>

      <View style={styles.stack}>
        <Card>
          <AppText variant="title">Add your first habit</AppText>
          <AppText variant="caption" color={theme.colors.textMuted}>
            Create a routine with reminders, targets, and color.
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
