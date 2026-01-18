import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { AppText } from '@/components/AppText';
import { useTheme } from '@/theme';

type LevelMeterProps = {
  level: number;
  progress: number;
  xp: number;
  nextLevelXp: number;
};

export function LevelMeter({ level, progress, xp, nextLevelXp }: LevelMeterProps) {
  const theme = useTheme();
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withTiming(progress, { duration: 600 });
  }, [progress, width]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${Math.max(0.08, width.value) * 100}%`,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <AppText variant="subtitle">Level {level}</AppText>
        <AppText variant="caption" color={theme.colors.textMuted}>
          {xp} / {nextLevelXp} XP
        </AppText>
      </View>
      <View style={[styles.track, { backgroundColor: theme.colors.border }]}>
        <Animated.View style={[styles.fill, { backgroundColor: theme.colors.accent }, animatedStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  track: {
    height: 10,
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
});
