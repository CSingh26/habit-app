import React, { useCallback, useRef, useState } from 'react';
import { Share, StyleSheet, TextInput, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { LinearGradient } from 'expo-linear-gradient';

import { AppText, Card, PressableScale, Screen } from '@/components';
import type { Challenge, ChallengeMember } from '@/domain';
import { addChallengeMember, getChallengeById, getChallengeMembers } from '@/repositories/challenges';
import { useTheme } from '@/theme';

export default function ChallengeDetailScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [members, setMembers] = useState<ChallengeMember[]>([]);
  const [newMemberName, setNewMemberName] = useState('');
  const viewShotRef = useRef<ViewShot>(null);

  const load = useCallback(async () => {
    if (!id) {
      return;
    }
    const loaded = await getChallengeById(id);
    setChallenge(loaded);
    const list = await getChallengeMembers(id);
    setMembers(list);
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const shareProgress = async () => {
    const uri = await viewShotRef.current?.capture?.();
    if (!uri || !challenge) {
      return;
    }
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, { dialogTitle: challenge.name });
    } else {
      await Share.share({ url: uri, message: `Join my challenge: ${challenge.code}` });
    }
  };

  if (!challenge) {
    return (
      <Screen>
        <AppText variant="title">Loading challenge...</AppText>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="display">{challenge.name}</AppText>
        <AppText variant="caption" color={theme.colors.textMuted}>
          Target {challenge.targetStreak} days • Code {challenge.code}
        </AppText>
      </View>

      <Card style={styles.card}>
        <AppText variant="subtitle">Invite code</AppText>
        <View style={styles.codeRow}>
          <AppText variant="title">{challenge.code}</AppText>
          <QRCode value={challenge.code} size={92} color={theme.colors.text} />
        </View>
      </Card>

      <Card>
        <AppText variant="subtitle">Leaderboard</AppText>
        <View style={styles.leaderboard}>
          {members.map((member) => {
            const progress = Math.min(1, member.progress / challenge.targetStreak);
            return (
              <View key={member.id} style={styles.memberRow}>
                <AppText variant="subtitle">{member.name}</AppText>
                <View style={[styles.progressTrack, { backgroundColor: theme.colors.border }]}>
                  <View
                    style={[
                      styles.progressFill,
                      { backgroundColor: theme.colors.accent, width: `${progress * 100}%` },
                    ]}
                  />
                </View>
              </View>
            );
          })}
        </View>
      </Card>

      <Card>
        <AppText variant="subtitle">Add a friend</AppText>
        <TextInput
          value={newMemberName}
          onChangeText={setNewMemberName}
          placeholder="Name"
          placeholderTextColor={theme.colors.textMuted}
          style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
        />
        <PressableScale
          onPress={async () => {
            if (!newMemberName.trim()) return;
            await addChallengeMember(challenge.id, newMemberName.trim());
            setNewMemberName('');
            load();
          }}
          style={[styles.addButton, { backgroundColor: theme.colors.accent }]}
        >
          <AppText variant="subtitle" color="#0B0F18">
            Add
          </AppText>
        </PressableScale>
      </Card>

      <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 0.9 }}>
        <LinearGradient
          colors={[theme.colors.accent, theme.colors.accentSoft]}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.shareCard}
        >
          <AppText variant="subtitle" color="#0B0F18">
            {challenge.name}
          </AppText>
          <AppText variant="title" color="#0B0F18">
            {challenge.targetStreak}-day streak goal
          </AppText>
          <AppText variant="caption" color="#0B0F18">
            Code: {challenge.code}
          </AppText>
        </LinearGradient>
      </ViewShot>

      <PressableScale
        onPress={shareProgress}
        style={[styles.shareButton, { borderColor: theme.colors.border }]}
      >
        <AppText variant="subtitle">Share progress card</AppText>
      </PressableScale>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 6,
    marginBottom: 16,
  },
  card: {
    marginBottom: 12,
  },
  codeRow: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leaderboard: {
    marginTop: 12,
    gap: 12,
  },
  memberRow: {
    gap: 6,
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 12,
  },
  addButton: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  shareCard: {
    marginTop: 12,
    borderRadius: 20,
    padding: 16,
    gap: 6,
  },
  shareButton: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
});
