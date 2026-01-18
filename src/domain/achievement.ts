import { z } from 'zod';

export const AchievementSchema = z.object({
  id: z.string(),
  type: z.string(),
  unlockedAt: z.number().nullable(),
  progress: z.number().min(0),
  metadata: z.record(z.any()).nullable(),
  createdAt: z.number(),
});

export type Achievement = z.infer<typeof AchievementSchema>;
