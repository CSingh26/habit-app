import React, { useEffect } from 'react';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '@/theme';

type ProgressRingProps = {
  size: number;
  strokeWidth?: number;
  progress: number;
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function ProgressRing({ size, strokeWidth = 8, progress }: ProgressRingProps) {
  const theme = useTheme();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    const clamped = Math.min(1, Math.max(0, progress));
    animatedProgress.value = withTiming(clamped, { duration: 700 });
  }, [progress, animatedProgress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - animatedProgress.value),
  }));

  return (
    <Svg width={size} height={size}>
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={theme.colors.border}
        strokeWidth={strokeWidth}
        fill="none"
      />
      <AnimatedCircle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={theme.colors.accent}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={[circumference, circumference]}
        animatedProps={animatedProps}
        fill="none"
      />
    </Svg>
  );
}
