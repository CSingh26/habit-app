import { z } from 'zod';

export const ChallengeSchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  targetStreak: z.number().int().min(1),
  habitIds: z.array(z.string()),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export const ChallengeMemberSchema = z.object({
  id: z.string(),
  challengeId: z.string(),
  name: z.string(),
  avatar: z.string().nullable(),
  isSelf: z.boolean(),
  joinedAt: z.number(),
  progress: z.number().int().min(0),
});

export type Challenge = z.infer<typeof ChallengeSchema>;
export type ChallengeMember = z.infer<typeof ChallengeMemberSchema>;
