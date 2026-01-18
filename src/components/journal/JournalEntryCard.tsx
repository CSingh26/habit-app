import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';

import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { PressableScale } from '@/components/PressableScale';
import type { JournalEntry } from '@/domain';
import { useTheme } from '@/theme';

type JournalEntryCardProps = {
  entry: JournalEntry;
  linkedHabits: string[];
};

export function JournalEntryCard({ entry, linkedHabits }: JournalEntryCardProps) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const height = useSharedValue(0);
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    maxHeight: height.value,
    opacity: opacity.value,
  }));

  const toggle = () => {
    setExpanded((prev) => !prev);
    const next = !expanded;
    height.value = withTiming(next ? 140 : 0, { duration: 200 });
    opacity.value = withTiming(next ? 1 : 0, { duration: 200 });
  };

  return (
    <PressableScale onPress={toggle}>
      <Card style={styles.card}>
        <View style={styles.row}>
          <View>
            <AppText variant="subtitle">{entry.dateKey}</AppText>
            <AppText variant="caption" color={theme.colors.textMuted}>
              Mood {entry.mood} • Energy {entry.energy}
            </AppText>
          </View>
          <Feather name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color={theme.colors.textMuted} />
        </View>
        <Animated.View style={[styles.details, animatedStyle]}>
          <AppText variant="caption" color={theme.colors.textMuted}>
            {entry.notes || 'No reflection yet.'}
          </AppText>
          {linkedHabits.length > 0 && (
            <View style={styles.tags}>
              {linkedHabits.map((habit) => (
                <View key={habit} style={[styles.tag, { borderColor: theme.colors.border }]}>
                  <AppText variant="caption">{habit}</AppText>
                </View>
              ))}
            </View>
          )}
        </Animated.View>
      </Card>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  details: {
    overflow: 'hidden',
    gap: 10,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
});
