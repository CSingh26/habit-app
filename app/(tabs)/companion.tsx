import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';

import { AppText, Card, LevelMeter, PetStageView, PressableScale, Screen } from '@/components';
import { getLevelSnapshot } from '@/services/gamification';
import { useTheme } from '@/theme';

export default function CompanionScreen() {
  const theme = useTheme();
  const [level, setLevel] = useState({ level: 1, progress: 0, currentXp: 0, nextLevelXp: 120 });

  useFocusEffect(
    useCallback(() => {
      getLevelSnapshot().then(setLevel);
    }, []),
  );

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="display">Companion</AppText>
        <AppText variant="caption" color={theme.colors.textMuted}>
          Grow your pet with every streak.
        </AppText>
      </View>

      <View style={styles.stack}>
        <Card style={styles.petCard}>
          <PetStageView level={level.level} size={180} />
          <AppText variant="subtitle">Stage {level.level >= 5 ? 'Bloom' : level.level >= 3 ? 'Sprout' : 'Seed'}</AppText>
          <AppText variant="caption" color={theme.colors.textMuted}>
            Feed your companion with every check-in.
          </AppText>
          <PressableScale
            onPress={async () => {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }}
            style={[styles.feedButton, { backgroundColor: theme.colors.accent }]}
          >
            <AppText variant="subtitle" color="#0B0F18">
              Feed
            </AppText>
          </PressableScale>
        </Card>

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
  stack: {
    marginTop: 24,
    gap: 12,
  },
  petCard: {
    alignItems: 'center',
    gap: 12,
  },
  feedButton: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
  },
});
