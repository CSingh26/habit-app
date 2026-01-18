import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import Slider from '@react-native-community/slider';
import * as Haptics from 'expo-haptics';

import { AchievementToast, AppText, Card, JournalEntryCard, PressableScale, Screen } from '@/components';
import type { Habit, JournalEntry } from '@/domain';
import { getHabits } from '@/repositories';
import { getCheckinsForDateRange } from '@/repositories/checkins';
import { getJournalEntries, getJournalEntry, upsertJournalEntry } from '@/repositories/journal';
import { handleJournalSaved } from '@/services/gamification';
import { useTheme } from '@/theme';
import { addDays, toDateKey } from '@/utils';

export default function JournalScreen() {
  const theme = useTheme();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [mood, setMood] = useState(70);
  const [energy, setEnergy] = useState(60);
  const [notes, setNotes] = useState('');
  const [linkedHabits, setLinkedHabits] = useState<string[]>([]);
  const [checkins, setCheckins] = useState<Map<string, number>>(new Map());
  const [toastAchievement, setToastAchievement] = useState<null | {
    id: string;
    title: string;
    description: string;
  }>(null);

  const load = useCallback(async () => {
    const habitsList = await getHabits();
    setHabits(habitsList);
    const allEntries = await getJournalEntries();
    setEntries(allEntries);

    const todayKey = toDateKey(new Date());
    const todayEntry = await getJournalEntry(todayKey);
    if (todayEntry) {
      setMood(todayEntry.mood);
      setEnergy(todayEntry.energy);
      setNotes(todayEntry.notes ?? '');
      setLinkedHabits(todayEntry.habitIds);
    }

    const end = new Date();
    const start = addDays(end, -30);
    const recentCheckins = await getCheckinsForDateRange(toDateKey(start), toDateKey(end));
    const map = new Map<string, number>();
    recentCheckins.forEach((checkin) => {
      map.set(checkin.dateKey, (map.get(checkin.dateKey) ?? 0) + checkin.count);
    });
    setCheckins(map);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const insight = useMemo(() => {
    const withCheckins: number[] = [];
    const withoutCheckins: number[] = [];
    entries.forEach((entry) => {
      if ((checkins.get(entry.dateKey) ?? 0) > 0) {
        withCheckins.push(entry.mood);
      } else {
        withoutCheckins.push(entry.mood);
      }
    });
    const avg = (values: number[]) =>
      values.length === 0 ? 0 : Math.round(values.reduce((sum, v) => sum + v, 0) / values.length);
    return {
      withHabits: avg(withCheckins),
      withoutHabits: avg(withoutCheckins),
    };
  }, [checkins, entries]);

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
          <AppText variant="subtitle">Today’s entry</AppText>
          <View style={styles.sliderBlock}>
            <AppText variant="caption" color={theme.colors.textMuted}>
              Mood: {mood}
            </AppText>
            <Slider
              value={mood}
              onValueChange={(value) => setMood(Math.round(value))}
              minimumValue={0}
              maximumValue={100}
              minimumTrackTintColor={theme.colors.accent}
              maximumTrackTintColor={theme.colors.border}
              thumbTintColor={theme.colors.accent}
            />
          </View>
          <View style={styles.sliderBlock}>
            <AppText variant="caption" color={theme.colors.textMuted}>
              Energy: {energy}
            </AppText>
            <Slider
              value={energy}
              onValueChange={(value) => setEnergy(Math.round(value))}
              minimumValue={0}
              maximumValue={100}
              minimumTrackTintColor={theme.colors.success}
              maximumTrackTintColor={theme.colors.border}
              thumbTintColor={theme.colors.success}
            />
          </View>
          <TextInput
            placeholder="What stood out today?"
            placeholderTextColor={theme.colors.textMuted}
            value={notes}
            onChangeText={setNotes}
            style={[
              styles.input,
              { borderColor: theme.colors.border, color: theme.colors.text },
            ]}
            multiline
          />
          <View style={styles.row}>
            {habits.map((habit) => {
              const selected = linkedHabits.includes(habit.id);
              return (
                <PressableScale
                  key={habit.id}
                  onPress={() =>
                    setLinkedHabits((prev) =>
                      prev.includes(habit.id)
                        ? prev.filter((id) => id !== habit.id)
                        : [...prev, habit.id],
                    )
                  }
                  style={[
                    styles.habitChip,
                    {
                      backgroundColor: selected ? theme.colors.accentSoft : theme.colors.surface,
                      borderColor: selected ? theme.colors.accent : theme.colors.border,
                    },
                  ]}
                >
                  <AppText variant="caption">{habit.name}</AppText>
                </PressableScale>
              );
            })}
          </View>
          <PressableScale
            onPress={async () => {
              await upsertJournalEntry({
                dateKey: toDateKey(new Date()),
                mood,
                energy,
                notes,
                habitIds: linkedHabits,
                tags: [],
              });
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              const achievements = await handleJournalSaved();
              if (achievements[0]) {
                setToastAchievement(achievements[0]);
              }
              load();
            }}
            style={[styles.saveButton, { backgroundColor: theme.colors.accent }]}
          >
            <AppText variant="subtitle" color="#0B0F18">
              Save entry
            </AppText>
          </PressableScale>
        </Card>

        <Card>
          <AppText variant="subtitle">Mood vs. completion</AppText>
          <View style={styles.statsRow}>
            <View>
              <AppText variant="title">{insight.withHabits}</AppText>
              <AppText variant="caption" color={theme.colors.textMuted}>
                Days with check-ins
              </AppText>
            </View>
            <View>
              <AppText variant="title">{insight.withoutHabits}</AppText>
              <AppText variant="caption" color={theme.colors.textMuted}>
                Days without
              </AppText>
            </View>
          </View>
        </Card>

        <AppText variant="subtitle">Past entries</AppText>
        <FlashList
          data={entries}
          keyExtractor={(item) => item.id}
          estimatedItemSize={120}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          renderItem={({ item }) => (
            <JournalEntryCard
              entry={item}
              linkedHabits={item.habitIds.map(
                (id) => habits.find((habit) => habit.id === id)?.name ?? 'Habit',
              )}
            />
          )}
        />
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
    gap: 6,
  },
  stack: {
    marginTop: 24,
    gap: 12,
    flex: 1,
  },
  sliderBlock: {
    gap: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    minHeight: 90,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  habitChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  saveButton: {
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
});
