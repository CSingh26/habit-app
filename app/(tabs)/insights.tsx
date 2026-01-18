import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { AppText, Card, Screen } from '@/components';
import { HeatmapCalendar } from '@/components/HeatmapCalendar';
import type { Checkin } from '@/domain';
import { getCheckinsForDateRange } from '@/repositories';
import { calculateStreakStats } from '@/services';
import { useTheme } from '@/theme';
import { addDays, toDateKey } from '@/utils';

export default function InsightsScreen() {
  const theme = useTheme();
  const [checkins, setCheckins] = useState<Checkin[]>([]);

  const load = useCallback(async () => {
    const end = new Date();
    const start = addDays(end, -84);
    const results = await getCheckinsForDateRange(toDateKey(start), toDateKey(end));
    setCheckins(results);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const stats = useMemo(() => calculateStreakStats(checkins, 1), [checkins]);

  const heatmapData = useMemo(() => {
    const map = new Map<string, number>();
    checkins.forEach((checkin) => {
      map.set(checkin.dateKey, (map.get(checkin.dateKey) ?? 0) + checkin.count);
    });
    return Array.from(map.entries()).map(([dateKey, value]) => ({ dateKey, value }));
  }, [checkins]);

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
          <AppText variant="subtitle">Streak summary</AppText>
          <View style={styles.statsRow}>
            <View>
              <AppText variant="title">{stats.currentStreak}</AppText>
              <AppText variant="caption" color={theme.colors.textMuted}>
                Current streak
              </AppText>
            </View>
            <View>
              <AppText variant="title">{stats.bestStreak}</AppText>
              <AppText variant="caption" color={theme.colors.textMuted}>
                Best streak
              </AppText>
            </View>
            <View>
              <AppText variant="title">{stats.consistencyScore}%</AppText>
              <AppText variant="caption" color={theme.colors.textMuted}>
                Consistency
              </AppText>
            </View>
          </View>
        </Card>

        <Card>
          <AppText variant="subtitle">Last 12 weeks</AppText>
          <HeatmapCalendar days={heatmapData} weeks={12} />
        </Card>

        <Card>
          <View style={styles.statsRow}>
            <View>
              <AppText variant="title">{stats.rolling7}</AppText>
              <AppText variant="caption" color={theme.colors.textMuted}>
                7-day wins
              </AppText>
            </View>
            <View>
              <AppText variant="title">{stats.rolling30}</AppText>
              <AppText variant="caption" color={theme.colors.textMuted}>
                30-day wins
              </AppText>
            </View>
            <View>
              <AppText variant="title">{stats.bestDay}</AppText>
              <AppText variant="caption" color={theme.colors.textMuted}>
                Best day
              </AppText>
            </View>
          </View>
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
});
