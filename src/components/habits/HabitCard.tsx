import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { AppText, Card, PressableScale } from '@/components';
import { useTheme } from '@/theme';
import type { Habit } from '@/domain';
import { formatSchedule } from '@/utils';

type HabitCardProps = {
  habit: Habit;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onQuickComplete?: () => void;
};

export function HabitCard({ habit, onPress, onEdit, onDelete, onQuickComplete }: HabitCardProps) {
  const theme = useTheme();

  return (
    <Swipeable
      renderRightActions={() => (
        <View style={styles.actions}>
          <PressableScale
            onPress={onEdit}
            style={[styles.actionButton, { backgroundColor: theme.colors.accentSoft }]}
          >
            <Feather name="edit-2" size={18} color={theme.colors.accent} />
          </PressableScale>
          <PressableScale
            onPress={onDelete}
            style={[styles.actionButton, { backgroundColor: theme.colors.danger }]}
          >
            <Feather name="trash-2" size={18} color="#0B0F18" />
          </PressableScale>
        </View>
      )}
    >
      <PressableScale onPress={onPress} scaleTo={0.98}>
        <Card style={styles.card}>
          <View style={styles.row}>
            <View style={[styles.iconWrap, { backgroundColor: habit.color }]}>
              <Feather name={habit.icon as keyof typeof Feather.glyphMap} size={18} color="#0B0F18" />
            </View>
            <View style={styles.info}>
              <AppText variant="title">{habit.name}</AppText>
              <AppText variant="caption" color={theme.colors.textMuted}>
                {formatSchedule(habit.schedule)}
              </AppText>
            </View>
          </View>
          <PressableScale
            onPress={async () => {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onQuickComplete?.();
            }}
            style={[styles.completeButton, { borderColor: theme.colors.border }]}
          >
            <Feather name="check" size={18} color={theme.colors.text} />
          </PressableScale>
        </Card>
      </PressableScale>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  info: {
    gap: 4,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingLeft: 12,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
