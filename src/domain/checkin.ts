import { z } from 'zod';

export const CheckinSchema = z.object({
  id: z.string(),
  habitId: z.string(),
  dateKey: z.string(),
  count: z.number().int().min(0),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export type Checkin = z.infer<typeof CheckinSchema>;
