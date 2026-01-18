import { z } from 'zod';

import { db } from '@/db/client';
import { HabitSchema, type Habit, type HabitSchedule } from '@/domain';
import { safeParseJson, createId, now } from '@/utils';

const CreateHabitInputSchema = z.object({
  name: z.string().min(1),
  icon: z.string().min(1),
  color: z.string().min(1),
  schedule: z.custom<HabitSchedule>(),
  target: z.number().int().min(1),
  reminderTime: z.string().nullable().optional(),
});

export type CreateHabitInput = z.infer<typeof CreateHabitInputSchema>;

type HabitRow = {
  id: string;
  name: string;
  icon: string;
  color: string;
  schedule: string;
  target: number;
  reminder_time: string | null;
  created_at: number;
  updated_at: number;
};

function mapHabit(row: HabitRow): Habit {
  return HabitSchema.parse({
    id: row.id,
    name: row.name,
    icon: row.icon,
    color: row.color,
    schedule: safeParseJson(row.schedule, { days: [] }),
    target: row.target,
    reminderTime: row.reminder_time,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

export async function getHabits() {
  const rows = await db.getAllAsync<HabitRow>(
    'SELECT id, name, icon, color, schedule, target, reminder_time, created_at, updated_at FROM habits ORDER BY created_at DESC;',
  );
  return rows.map(mapHabit);
}

export async function getHabitById(id: string) {
  const row = await db.getFirstAsync<HabitRow>(
    'SELECT id, name, icon, color, schedule, target, reminder_time, created_at, updated_at FROM habits WHERE id = ? LIMIT 1;',
    [id],
  );
  return row ? mapHabit(row) : null;
}

export async function createHabit(input: CreateHabitInput) {
  const parsed = CreateHabitInputSchema.parse(input);
  const id = createId('habit');
  const timestamp = now();

  await db.runAsync(
    `INSERT INTO habits (id, name, icon, color, schedule, target, reminder_time, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      id,
      parsed.name,
      parsed.icon,
      parsed.color,
      JSON.stringify(parsed.schedule),
      parsed.target,
      parsed.reminderTime ?? null,
      timestamp,
      timestamp,
    ],
  );

  return getHabitById(id);
}

export async function updateHabit(
  id: string,
  updates: Partial<Omit<CreateHabitInput, 'schedule'>> & { schedule?: HabitSchedule },
) {
  const existing = await getHabitById(id);
  if (!existing) {
    return null;
  }

  const next = {
    ...existing,
    ...updates,
    schedule: updates.schedule ?? existing.schedule,
    reminderTime: updates.reminderTime ?? existing.reminderTime,
    updatedAt: now(),
  };

  await db.runAsync(
    `UPDATE habits
     SET name = ?, icon = ?, color = ?, schedule = ?, target = ?, reminder_time = ?, updated_at = ?
     WHERE id = ?;`,
    [
      next.name,
      next.icon,
      next.color,
      JSON.stringify(next.schedule),
      next.target,
      next.reminderTime,
      next.updatedAt,
      id,
    ],
  );

  return getHabitById(id);
}

export async function removeHabit(id: string) {
  await db.runAsync('DELETE FROM habits WHERE id = ?;', [id]);
}
