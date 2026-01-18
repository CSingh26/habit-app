import React, { useCallback, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { AchievementToast, AppText, PressableScale, Screen, HabitCard } from '@/components';
import type { Habit } from '@/domain';
import { getHabits, removeHabit } from '@/repositories';
import { upsertCheckin } from '@/repositories/checkins';
import { handleCheckinComplete } from '@/services/gamification';
import { useTheme } from '@/theme';
import { toDateKey } from '@/utils';

export default function HabitsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastAchievement, setToastAchievement] = useState<null | {
    id: string;
    title: string;
    description: string;
  }>(null);

  const loadHabits = useCallback(async () => {
    setLoading(true);
    const results = await getHabits();
    setHabits(results);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadHabits();
    }, [loadHabits]),
  );

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="display">Habits</AppText>
        <AppText variant="caption" color={theme.colors.textMuted}>
          Build rituals that stick.
        </AppText>
      </View>

      <View style={styles.stack}>
        {habits.length === 0 && !loading ? (
          <View style={[styles.emptyCard, { backgroundColor: theme.colors.surface }]}>
            <AppText variant="title">Add your first habit</AppText>
            <AppText variant="caption" color={theme.colors.textMuted}>
              Create a routine with reminders, targets, and color.
            </AppText>
          </View>
        ) : (
          <FlashList
            data={habits}
            keyExtractor={(item) => item.id}
            estimatedItemSize={96}
            contentContainerStyle={styles.list}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            renderItem={({ item }) => (
              <HabitCard
                habit={item}
                onPress={() => router.push(`/habits/${item.id}`)}
                onEdit={() => router.push(`/habits/${item.id}/edit`)}
                onDelete={() =>
                  Alert.alert('Delete habit?', 'This will remove all check-ins.', [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Delete',
                      style: 'destructive',
                      onPress: async () => {
                        await removeHabit(item.id);
                        loadHabits();
                      },
                    },
                  ])
                }
                onQuickComplete={async () => {
                  const dateKey = toDateKey(new Date());
                  await upsertCheckin(item.id, dateKey, item.target);
                  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                  const result = await handleCheckinComplete(item);
                  if (result.achievements[0]) {
                    setToastAchievement(result.achievements[0]);
                  }
                }}
              />
            )}
          />
        )}
      </View>

      <AchievementToast
        achievement={toastAchievement}
        onDone={() => setToastAchievement(null)}
      />

      <PressableScale
        onPress={() => router.push('/habits/new')}
        style={[styles.fab, { backgroundColor: theme.colors.accent }]}
      >
        <AppText variant="title" color="#0B0F18">
          +
        </AppText>
      </PressableScale>
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
    flex: 1,
  },
  list: {
    paddingBottom: 120,
  },
  emptyCard: {
    padding: 20,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'transparent',
    gap: 6,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
