import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

import { AppText, Card, LevelMeter, PetStageView, ProgressRing, Screen } from '@/components';
import type { Habit } from '@/domain';
import { getHabits } from '@/repositories';
import { getCheckinsForDateRange } from '@/repositories/checkins';
import { getLevelSnapshot } from '@/services/gamification';
import { useTheme } from '@/theme';
import { toDateKey } from '@/utils';

export default function TodayScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [level, setLevel] = useState({ level: 1, progress: 0, currentXp: 0, nextLevelXp: 120 });
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completionRate, setCompletionRate] = useState(0);
  const heroOpacity = useSharedValue(0);
  const heroTranslate = useSharedValue(14);
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  useFocusEffect(
    useCallback(() => {
      getLevelSnapshot().then(setLevel);
      getHabits().then(async (list) => {
        setHabits(list);
        if (list.length === 0) {
          setCompletionRate(0);
          return;
        }
        const todayKey = toDateKey(new Date());
        const checkins = await getCheckinsForDateRange(todayKey, todayKey);
        const map = new Map(checkins.map((checkin) => [checkin.habitId, checkin.count]));
        const completed = list.filter((habit) => (map.get(habit.id) ?? 0) >= habit.target).length;
        setCompletionRate(completed / list.length);
      });
    }, []),
  );

  useEffect(() => {
    heroOpacity.value = withTiming(1, { duration: 520 });
    heroTranslate.value = withTiming(0, { duration: 520 });
  }, [heroOpacity, heroTranslate]);

  const completionPercent = useMemo(() => Math.round(completionRate * 100), [completionRate]);
  const heroStyle = useAnimatedStyle(() => ({
    opacity: heroOpacity.value,
    transform: [{ translateY: heroTranslate.value }],
  }));

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="display">Today</AppText>
        <AppText variant="caption" color={theme.colors.textMuted}>
          {today}
        </AppText>
      </View>

      <Animated.View style={heroStyle}>
        <LinearGradient
          colors={[theme.colors.accent, theme.colors.accentSoft]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.hero, { borderColor: theme.colors.border }]}
        >
          <View style={styles.heroTop}>
            <View>
              <AppText variant="subtitle" color="#0B0F18">
                Momentum
              </AppText>
              <AppText variant="title" color="#0B0F18">
                {habits.length} habits ready
              </AppText>
            </View>
            <View style={styles.ring}>
              <ProgressRing size={68} progress={completionRate} />
              <View style={styles.ringLabel}>
                <AppText variant="caption" color="#0B0F18">
                  {completionPercent}%
                </AppText>
              </View>
            </View>
          </View>
          <View style={styles.heroMeta}>
            <AppText variant="caption" color="#0B0F18">
              {completionPercent}% complete
            </AppText>
            <View style={[styles.progressTrack, { backgroundColor: '#EDE7FF' }]}>
              <View style={[styles.progressFill, { width: `${completionPercent}%` }]} />
            </View>
          </View>
          <Pressable
            onPress={() => router.push('/companion')}
            style={styles.petPreview}
          >
            <PetStageView level={level.level} size={90} />
            <View>
              <AppText variant="caption" color="#0B0F18">
                Companion stage
              </AppText>
              <AppText variant="subtitle" color="#0B0F18">
                {level.level >= 5 ? 'Bloom' : level.level >= 3 ? 'Sprout' : 'Seed'}
              </AppText>
            </View>
          </Pressable>
        </LinearGradient>
      </Animated.View>

      <View style={styles.section}>
        <AppText variant="subtitle">Quick actions</AppText>
        <View style={styles.actionRow}>
          {[
            { label: 'Log check-in', route: '/habits' },
            { label: 'New habit', route: '/habits/new' },
            { label: 'Challenges', route: '/challenges' },
          ].map((item) => (
            <Pressable
              key={item.label}
              onPress={async () => {
                await Haptics.selectionAsync();
                router.push(item.route);
              }}
              style={({ pressed }) => [
                styles.actionPill,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <AppText variant="caption">{item.label}</AppText>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <AppText variant="subtitle">Up next</AppText>
        <View style={styles.cardStack}>
          {['Morning reset', 'Hydration'].map((title) => (
            <Card key={title} style={styles.listCard}>
              <View>
                <AppText variant="title">{title}</AppText>
                <AppText variant="caption" color={theme.colors.textMuted}>
                  7:30 AM • 1/1 today
                </AppText>
              </View>
              <View style={[styles.dot, { backgroundColor: theme.colors.accent }]} />
            </Card>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Card>
          <LevelMeter
            level={level.level}
            progress={level.progress}
            xp={level.currentXp}
            nextLevelXp={level.nextLevelXp}
          />
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 6,
  },
  hero: {
    marginTop: 20,
    borderRadius: 28,
    padding: 20,
    gap: 18,
    borderWidth: 1,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ring: {
    width: 68,
    height: 68,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringLabel: {
    position: 'absolute',
    alignItems: 'center',
  },
  heroMeta: {
    gap: 10,
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0B0F18',
  },
  petPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  section: {
    marginTop: 28,
    gap: 12,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionPill: {
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
  },
  cardStack: {
    gap: 12,
  },
  listCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
