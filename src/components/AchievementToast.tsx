import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';

import { AppText } from '@/components/AppText';
import { useTheme } from '@/theme';
import type { AchievementUnlock } from '@/services/achievements';

type AchievementToastProps = {
  achievement: AchievementUnlock | null;
  onDone: () => void;
};

export function AchievementToast({ achievement, onDone }: AchievementToastProps) {
  const theme = useTheme();
  const translateY = useSharedValue(-40);
  const opacity = useSharedValue(0);
  const dot1 = useConfettiDot();
  const dot2 = useConfettiDot();
  const dot3 = useConfettiDot();
  const dot4 = useConfettiDot();
  const dot5 = useConfettiDot();
  const dot6 = useConfettiDot();
  const confetti = [dot1, dot2, dot3, dot4, dot5, dot6];

  useEffect(() => {
    if (!achievement) {
      return;
    }
    translateY.value = withTiming(0, { duration: 250 });
    opacity.value = withTiming(1, { duration: 250 });

    confetti.forEach((dot, index) => {
      dot.x.value = withDelay(index * 40, withTiming((index - 3) * 14, { duration: 400 }));
      dot.y.value = withDelay(index * 40, withTiming(-18 - index * 6, { duration: 400 }));
      dot.opacity.value = withDelay(index * 40, withTiming(1, { duration: 150 }));
    });

    const timeout = setTimeout(() => {
      opacity.value = withTiming(0, { duration: 200 });
      translateY.value = withTiming(-40, { duration: 200 }, () => {
        onDone();
      });
    }, 2800);

    return () => clearTimeout(timeout);
  }, [achievement, confetti, onDone, opacity, translateY]);

  const toastStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  if (!achievement) {
    return null;
  }

  return (
    <Animated.View style={[styles.toast, toastStyle]}>
      <View style={[styles.toastCard, { backgroundColor: theme.colors.surface }]}>
        <Feather name="award" size={18} color={theme.colors.accent} />
        <View style={styles.text}>
          <AppText variant="subtitle">{achievement.title}</AppText>
          <AppText variant="caption" color={theme.colors.textMuted}>
            {achievement.description}
          </AppText>
        </View>
      <View style={styles.confettiWrap}>
        {confetti.map((dot, index) => (
          <Animated.View
            key={index}
            style={[styles.confettiDot, { backgroundColor: theme.colors.accent }, dot.style]}
          />
        ))}
      </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: 52,
    left: 16,
    right: 16,
    zIndex: 20,
  },
  toastCard: {
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  text: {
    flex: 1,
  },
  confettiWrap: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confettiDot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});

function useConfettiDot() {
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const dotOpacity = useSharedValue(0);

  const style = useAnimatedStyle(() => ({
    opacity: dotOpacity.value,
    transform: [{ translateX: x.value }, { translateY: y.value }],
  }));

  return { x, y, opacity: dotOpacity, style };
}
