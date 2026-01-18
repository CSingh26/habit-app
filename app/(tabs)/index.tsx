import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import { AppText, Card, Screen } from '@/components';
import { useTheme } from '@/theme';

export default function TodayScreen() {
  const theme = useTheme();
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="display">Today</AppText>
        <AppText variant="caption" color={theme.colors.textMuted}>
          {today}
        </AppText>
      </View>

      <LinearGradient
        colors={[theme.colors.accent, theme.colors.accentSoft]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.hero, { borderColor: theme.colors.border }]}
      >
        <View>
          <AppText variant="subtitle" color="#0B0F18">
            Momentum
          </AppText>
          <AppText variant="title" color="#0B0F18">
            3 habits ready
          </AppText>
        </View>
        <View style={styles.heroMeta}>
          <AppText variant="caption" color="#0B0F18">
            68% complete
          </AppText>
          <View style={[styles.progressTrack, { backgroundColor: '#EDE7FF' }]}>
            <View style={styles.progressFill} />
          </View>
        </View>
      </LinearGradient>

      <View style={styles.section}>
        <AppText variant="subtitle">Quick actions</AppText>
        <View style={styles.actionRow}>
          {['Log check-in', 'New habit'].map((label) => (
            <Pressable
              key={label}
              onPress={async () => {
                await Haptics.selectionAsync();
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
              <AppText variant="caption">{label}</AppText>
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
    width: '68%',
    backgroundColor: '#0B0F18',
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
