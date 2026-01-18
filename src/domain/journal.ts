import { z } from 'zod';

export const JournalEntrySchema = z.object({
  id: z.string(),
  dateKey: z.string(),
  mood: z.number().int().min(0).max(100),
  energy: z.number().int().min(0).max(100),
  notes: z.string().nullable(),
  habitIds: z.array(z.string()),
  tags: z.array(z.string()),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export type JournalEntry = z.infer<typeof JournalEntrySchema>;
