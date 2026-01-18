import { z } from 'zod';

export const HabitScheduleSchema = z.object({
  days: z.array(z.number().int().min(0).max(6)),
  times: z.array(z.string()).optional(),
});

export const HabitSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  icon: z.string(),
  color: z.string(),
  schedule: HabitScheduleSchema,
  target: z.number().int().min(1),
  reminderTime: z.string().nullable(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export type Habit = z.infer<typeof HabitSchema>;
export type HabitSchedule = z.infer<typeof HabitScheduleSchema>;
