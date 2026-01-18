import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { AchievementToast, AppText, Card, PressableScale, Screen } from '@/components';
import type { Habit } from '@/domain';
import { getHabitById } from '@/repositories';
import { getCheckinsForHabit, upsertCheckin } from '@/repositories/checkins';
import { handleCheckinComplete } from '@/services/gamification';
import { useTheme } from '@/theme';
import { formatSchedule, toDateKey } from '@/utils';

export default function HabitDetailScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [habit, setHabit] = useState<Habit | null>(null);
  const [checkinsCount, setCheckinsCount] = useState(0);
  const [toastAchievement, setToastAchievement] = useState<null | {
    id: string;
    title: string;
    description: string;
  }>(null);

  const load = useCallback(async () => {
    if (!id) {
      return;
    }
    const loaded = await getHabitById(id);
    setHabit(loaded);
    if (loaded) {
      const checkins = await getCheckinsForHabit(loaded.id);
      setCheckinsCount(checkins.length);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  if (!habit) {
    return (
      <Screen>
        <AppText variant="title">Loading habit...</AppText>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.header}>
        <View style={[styles.icon, { backgroundColor: habit.color }]}>
          <Feather name={habit.icon as keyof typeof Feather.glyphMap} size={20} color="#0B0F18" />
        </View>
        <View>
          <AppText variant="display">{habit.name}</AppText>
          <AppText variant="caption" color={theme.colors.textMuted}>
            {formatSchedule(habit.schedule)} • Target {habit.target}
          </AppText>
        </View>
      </View>

      <Card style={styles.statCard}>
        <View style={styles.statRow}>
          <AppText variant="subtitle">Check-ins</AppText>
          <AppText variant="title">{checkinsCount}</AppText>
        </View>
        <View style={styles.statRow}>
          <AppText variant="subtitle">Reminder</AppText>
          <AppText variant="caption" color={theme.colors.textMuted}>
            {habit.reminderTime ? habit.reminderTime : 'None'}
          </AppText>
        </View>
      </Card>

      <View style={styles.actions}>
        <PressableScale
          onPress={async () => {
            const dateKey = toDateKey(new Date());
            await upsertCheckin(habit.id, dateKey, habit.target);
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            const result = await handleCheckinComplete(habit);
            if (result.achievements[0]) {
              setToastAchievement(result.achievements[0]);
            }
            load();
          }}
          style={[styles.primaryButton, { backgroundColor: theme.colors.accent }]}
        >
          <AppText variant="subtitle" color="#0B0F18">
            Log check-in
          </AppText>
        </PressableScale>
        <PressableScale
          onPress={() => router.push(`/habits/${habit.id}/edit`)}
          style={[styles.secondaryButton, { borderColor: theme.colors.border }]}
        >
          <AppText variant="subtitle">Edit habit</AppText>
        </PressableScale>
      </View>

      <AchievementToast
        achievement={toastAchievement}
        onDone={() => setToastAchievement(null)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  icon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statCard: {
    marginTop: 24,
    gap: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actions: {
    marginTop: 24,
    gap: 12,
  },
  primaryButton: {
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  secondaryButton: {
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
});
