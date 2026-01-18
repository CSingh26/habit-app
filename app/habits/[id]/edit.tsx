import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { AppText, Screen } from '@/components';
import type { Habit } from '@/domain';
import { getHabitById, updateHabit } from '@/repositories';
import { cancelHabitReminder, scheduleHabitReminder } from '@/services/notifications';
import { HabitForm } from '@/screens/habits/HabitForm';

export default function EditHabitScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [habit, setHabit] = useState<Habit | null>(null);

  const load = useCallback(async () => {
    if (!id) {
      return;
    }
    const loaded = await getHabitById(id);
    setHabit(loaded);
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
        <AppText variant="display">Edit habit</AppText>
        <AppText variant="caption">Tune the ritual details.</AppText>
      </View>
      <HabitForm
        initial={habit}
        submitLabel="Save changes"
        onSubmit={async (values) => {
          const updated = await updateHabit(habit.id, values);
          await cancelHabitReminder(habit.id);
          if (updated) {
            await scheduleHabitReminder(updated);
          }
          router.back();
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 6,
    marginBottom: 20,
  },
});
