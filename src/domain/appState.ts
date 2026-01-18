import { z } from 'zod';

export const AppStateSchema = z.object({
  key: z.string(),
  value: z.string(),
  updatedAt: z.number(),
});

export type AppStateEntry = z.infer<typeof AppStateSchema>;
