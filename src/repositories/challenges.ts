import { z } from 'zod';

import { db } from '@/db/client';
import { ChallengeMemberSchema, ChallengeSchema, type Challenge, type ChallengeMember } from '@/domain';
import { createId, now, safeParseJson } from '@/utils';

const CreateChallengeSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(4),
  startDate: z.string(),
  endDate: z.string(),
  targetStreak: z.number().int().min(1),
  habitIds: z.array(z.string()),
});

export type CreateChallengeInput = z.infer<typeof CreateChallengeSchema>;

type ChallengeRow = {
  id: string;
  name: string;
  code: string;
  start_date: string;
  end_date: string;
  target_streak: number;
  habit_ids: string;
  created_at: number;
  updated_at: number;
};

type ChallengeMemberRow = {
  id: string;
  challenge_id: string;
  name: string;
  avatar: string | null;
  is_self: number;
  joined_at: number;
  progress: number;
};

function mapChallenge(row: ChallengeRow): Challenge {
  return ChallengeSchema.parse({
    id: row.id,
    name: row.name,
    code: row.code,
    startDate: row.start_date,
    endDate: row.end_date,
    targetStreak: row.target_streak,
    habitIds: safeParseJson(row.habit_ids, []),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

function mapMember(row: ChallengeMemberRow): ChallengeMember {
  return ChallengeMemberSchema.parse({
    id: row.id,
    challengeId: row.challenge_id,
    name: row.name,
    avatar: row.avatar,
    isSelf: row.is_self === 1,
    joinedAt: row.joined_at,
    progress: row.progress,
  });
}

export async function getChallenges() {
  const rows = await db.getAllAsync<ChallengeRow>(
    `SELECT id, name, code, start_date, end_date, target_streak, habit_ids, created_at, updated_at
     FROM challenges ORDER BY created_at DESC;`,
  );
  return rows.map(mapChallenge);
}

export async function createChallenge(input: CreateChallengeInput) {
  const parsed = CreateChallengeSchema.parse(input);
  const id = createId('challenge');
  const timestamp = now();

  await db.runAsync(
    `INSERT INTO challenges (id, name, code, start_date, end_date, target_streak, habit_ids, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      id,
      parsed.name,
      parsed.code,
      parsed.startDate,
      parsed.endDate,
      parsed.targetStreak,
      JSON.stringify(parsed.habitIds),
      timestamp,
      timestamp,
    ],
  );

  return mapChallenge({
    id,
    name: parsed.name,
    code: parsed.code,
    start_date: parsed.startDate,
    end_date: parsed.endDate,
    target_streak: parsed.targetStreak,
    habit_ids: JSON.stringify(parsed.habitIds),
    created_at: timestamp,
    updated_at: timestamp,
  });
}

export async function getChallengeMembers(challengeId: string) {
  const rows = await db.getAllAsync<ChallengeMemberRow>(
    `SELECT id, challenge_id, name, avatar, is_self, joined_at, progress
     FROM challenge_members WHERE challenge_id = ? ORDER BY joined_at ASC;`,
    [challengeId],
  );
  return rows.map(mapMember);
}

export async function addChallengeMember(challengeId: string, name: string, isSelf = false) {
  const id = createId('member');
  const joinedAt = now();
  await db.runAsync(
    `INSERT INTO challenge_members (id, challenge_id, name, avatar, is_self, joined_at, progress)
     VALUES (?, ?, ?, ?, ?, ?, ?);`,
    [id, challengeId, name, null, isSelf ? 1 : 0, joinedAt, 0],
  );

  return mapMember({
    id,
    challenge_id: challengeId,
    name,
    avatar: null,
    is_self: isSelf ? 1 : 0,
    joined_at: joinedAt,
    progress: 0,
  });
}

export async function updateChallengeProgress(memberId: string, progress: number) {
  await db.runAsync('UPDATE challenge_members SET progress = ? WHERE id = ?;', [
    progress,
    memberId,
  ]);
}
