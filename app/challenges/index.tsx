import React, { useCallback, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';

import { AppText, Card, PressableScale, Screen } from '@/components';
import type { Challenge } from '@/domain';
import { createChallenge, getChallengeByCode, getChallenges } from '@/repositories/challenges';
import { useTheme } from '@/theme';
import { addDays, toDateKey } from '@/utils';

export default function ChallengesScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [joinCode, setJoinCode] = useState('');

  const load = useCallback(async () => {
    const list = await getChallenges();
    setChallenges(list);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="display">Challenges</AppText>
        <AppText variant="caption" color={theme.colors.textMuted}>
          Invite friends and race your streaks.
        </AppText>
      </View>

      <View style={styles.stack}>
        {challenges.length === 0 ? (
          <Card>
            <AppText variant="title">Create your first streak challenge</AppText>
            <AppText variant="caption" color={theme.colors.textMuted}>
              Pick habits, set a goal, and share an invite code.
            </AppText>
          </Card>
        ) : (
          <FlashList
            data={challenges}
            keyExtractor={(item) => item.id}
            estimatedItemSize={96}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            renderItem={({ item }) => (
              <PressableScale onPress={() => router.push(`/challenges/${item.id}`)}>
                <Card>
                  <AppText variant="title">{item.name}</AppText>
                  <AppText variant="caption" color={theme.colors.textMuted}>
                    {item.targetStreak} day goal • Code {item.code}
                  </AppText>
                </Card>
              </PressableScale>
            )}
          />
        )}

        <Card>
          <AppText variant="subtitle">Join by code</AppText>
          <TextInput
            value={joinCode}
            onChangeText={setJoinCode}
            placeholder="Enter invite code"
            placeholderTextColor={theme.colors.textMuted}
            style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
          />
          <PressableScale
            onPress={async () => {
              if (!joinCode.trim()) {
                return;
              }
              const code = joinCode.trim().toUpperCase();
              let challenge = await getChallengeByCode(code);
              if (!challenge) {
                const start = new Date();
                const end = addDays(start, 6);
                challenge = await createChallenge({
                  name: `Shared Challenge ${code}`,
                  code,
                  startDate: toDateKey(start),
                  endDate: toDateKey(end),
                  targetStreak: 7,
                  habitIds: [],
                });
              }
              setJoinCode('');
              router.push(`/challenges/${challenge.id}`);
            }}
            style={[styles.joinButton, { borderColor: theme.colors.border }]}
          >
            <AppText variant="subtitle">Join challenge</AppText>
          </PressableScale>
        </Card>
      </View>

      <PressableScale
        onPress={() => router.push('/challenges/new')}
        style={[styles.fab, { backgroundColor: theme.colors.accent }]}
      >
        <AppText variant="title" color="#0B0F18">
          +
        </AppText>
      </PressableScale>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 6,
  },
  stack: {
    marginTop: 24,
    flex: 1,
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 12,
  },
  joinButton: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
