import React, { useEffect, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { useTheme } from '@/theme';

type PetStage = 'seed' | 'sprout' | 'bloom';

type PetStageViewProps = {
  size?: number;
  level: number;
};

export function PetStageView({ size = 180, level }: PetStageViewProps) {
  const theme = useTheme();
  const float = useSharedValue(0);

  useEffect(() => {
    float.value = withRepeat(withTiming(1, { duration: 2200 }), -1, true);
  }, [float]);

  const stage: PetStage = useMemo(() => {
    if (level >= 5) return 'bloom';
    if (level >= 3) return 'sprout';
    return 'seed';
  }, [level]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: -6 * float.value },
      { rotate: `${(float.value - 0.5) * 4}deg` },
    ],
  }));

  const colors = {
    pot: theme.colors.surface,
    potBorder: theme.colors.border,
    leaf: theme.colors.success,
    stem: theme.colors.success,
    flower: theme.colors.accent,
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Svg width={size} height={size} viewBox="0 0 180 180">
        <Rect x="55" y="120" width="70" height="40" rx="16" fill={colors.pot} stroke={colors.potBorder} strokeWidth="2" />
        <Path d="M65 120 L115 120 L110 150 L70 150 Z" fill={colors.pot} stroke={colors.potBorder} strokeWidth="2" />
        {stage === 'seed' && <Circle cx="90" cy="112" r="8" fill={colors.stem} />}
        {stage !== 'seed' && (
          <>
            <Rect x="88" y="80" width="4" height="40" rx="2" fill={colors.stem} />
            <Path d="M90 90 C70 90, 70 70, 90 70" fill="none" stroke={colors.leaf} strokeWidth="6" strokeLinecap="round" />
            <Path d="M90 100 C110 100, 112 80, 92 78" fill="none" stroke={colors.leaf} strokeWidth="6" strokeLinecap="round" />
          </>
        )}
        {stage === 'bloom' && (
          <>
            <Circle cx="90" cy="58" r="10" fill={colors.flower} />
            <Path d="M80 58 C82 48, 98 48, 100 58" fill="none" stroke={colors.flower} strokeWidth="6" strokeLinecap="round" />
          </>
        )}
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
