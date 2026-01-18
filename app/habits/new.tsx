import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { AppText, Screen } from '@/components';
import { createHabit } from '@/repositories';
import { scheduleHabitReminder } from '@/services/notifications';
import { HabitForm } from '@/screens/habits/HabitForm';

export default function NewHabitScreen() {
  const router = useRouter();

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="display">New habit</AppText>
        <AppText variant="caption">Design a ritual you can keep.</AppText>
      </View>
      <HabitForm
        submitLabel="Create habit"
        onSubmit={async (values) => {
          const created = await createHabit(values);
          if (created) {
            await scheduleHabitReminder(created);
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
