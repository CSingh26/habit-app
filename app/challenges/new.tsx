import React, { useCallback, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';

import { AppText, PressableScale, Screen } from '@/components';
import type { Habit } from '@/domain';
import { addChallengeMember, createChallenge } from '@/repositories/challenges';
import { getHabits } from '@/repositories/habits';
import { useTheme } from '@/theme';
import { addDays, toDateKey } from '@/utils';

function generateCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export default function NewChallengeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [name, setName] = useState('7-Day Focus Sprint');
  const [duration, setDuration] = useState(7);
  const [targetStreak, setTargetStreak] = useState(7);
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      getHabits().then(setHabits);
    }, []),
  );

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="display">New challenge</AppText>
        <AppText variant="caption" color={theme.colors.textMuted}>
          Build a streak race with your circle.
        </AppText>
      </View>

      <View style={styles.form}>
        <AppText variant="subtitle">Challenge name</AppText>
        <TextInput
          value={name}
          onChangeText={setName}
          style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
        />

        <AppText variant="subtitle">Duration (days)</AppText>
        <View style={styles.row}>
          <PressableScale
            onPress={() => setDuration((value) => Math.max(3, value - 1))}
            style={[styles.stepper, { borderColor: theme.colors.border }]}
          >
            <AppText variant="title">-</AppText>
          </PressableScale>
          <AppText variant="title">{duration}</AppText>
          <PressableScale
            onPress={() => setDuration((value) => value + 1)}
            style={[styles.stepper, { borderColor: theme.colors.border }]}
          >
            <AppText variant="title">+</AppText>
          </PressableScale>
        </View>

        <AppText variant="subtitle">Target streak</AppText>
        <View style={styles.row}>
          <PressableScale
            onPress={() => setTargetStreak((value) => Math.max(3, value - 1))}
            style={[styles.stepper, { borderColor: theme.colors.border }]}
          >
            <AppText variant="title">-</AppText>
          </PressableScale>
          <AppText variant="title">{targetStreak}</AppText>
          <PressableScale
            onPress={() => setTargetStreak((value) => value + 1)}
            style={[styles.stepper, { borderColor: theme.colors.border }]}
          >
            <AppText variant="title">+</AppText>
          </PressableScale>
        </View>

        <AppText variant="subtitle">Habits</AppText>
        <View style={styles.row}>
          {habits.map((habit) => {
            const active = selectedHabits.includes(habit.id);
            return (
              <PressableScale
                key={habit.id}
                onPress={() =>
                  setSelectedHabits((prev) =>
                    prev.includes(habit.id)
                      ? prev.filter((id) => id !== habit.id)
                      : [...prev, habit.id],
                  )
                }
                style={[
                  styles.habitChip,
                  {
                    backgroundColor: active ? theme.colors.accentSoft : theme.colors.surface,
                    borderColor: active ? theme.colors.accent : theme.colors.border,
                  },
                ]}
              >
                <AppText variant="caption">{habit.name}</AppText>
              </PressableScale>
            );
          })}
        </View>
      </View>

      <PressableScale
        onPress={async () => {
          const code = generateCode();
          const start = new Date();
          const end = addDays(start, duration - 1);
          const challenge = await createChallenge({
            name,
            code,
            startDate: toDateKey(start),
            endDate: toDateKey(end),
            targetStreak,
            habitIds: selectedHabits,
          });
          await addChallengeMember(challenge.id, 'You', true);
          router.replace(`/challenges/${challenge.id}`);
        }}
        style={[styles.submit, { backgroundColor: theme.colors.accent }]}
      >
        <AppText variant="subtitle" color="#0B0F18">
          Create challenge
        </AppText>
      </PressableScale>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 6,
    marginBottom: 20,
  },
  form: {
    gap: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    alignItems: 'center',
  },
  stepper: {
    width: 40,
    height: 40,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  habitChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  submit: {
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
  },
});
