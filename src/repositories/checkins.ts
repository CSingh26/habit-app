import { db } from '@/db/client';
import { CheckinSchema, type Checkin } from '@/domain';
import { createId, now } from '@/utils';

type CheckinRow = {
  id: string;
  habit_id: string;
  date_key: string;
  count: number;
  created_at: number;
  updated_at: number;
};

function mapCheckin(row: CheckinRow): Checkin {
  return CheckinSchema.parse({
    id: row.id,
    habitId: row.habit_id,
    dateKey: row.date_key,
    count: row.count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

export async function getCheckinsForHabit(habitId: string) {
  const rows = await db.getAllAsync<CheckinRow>(
    'SELECT id, habit_id, date_key, count, created_at, updated_at FROM checkins WHERE habit_id = ? ORDER BY date_key DESC;',
    [habitId],
  );
  return rows.map(mapCheckin);
}

export async function getCheckinsForDateRange(startDateKey: string, endDateKey: string) {
  const rows = await db.getAllAsync<CheckinRow>(
    `SELECT id, habit_id, date_key, count, created_at, updated_at
     FROM checkins
     WHERE date_key BETWEEN ? AND ?
     ORDER BY date_key ASC;`,
    [startDateKey, endDateKey],
  );
  return rows.map(mapCheckin);
}

export async function upsertCheckin(habitId: string, dateKey: string, count: number) {
  const existing = await db.getFirstAsync<CheckinRow>(
    'SELECT id, habit_id, date_key, count, created_at, updated_at FROM checkins WHERE habit_id = ? AND date_key = ?;',
    [habitId, dateKey],
  );

  if (existing) {
    const updatedAt = now();
    await db.runAsync('UPDATE checkins SET count = ?, updated_at = ? WHERE id = ?;', [
      count,
      updatedAt,
      existing.id,
    ]);
    return {
      ...mapCheckin(existing),
      count,
      updatedAt,
    };
  }

  const id = createId('checkin');
  const timestamp = now();
  await db.runAsync(
    `INSERT INTO checkins (id, habit_id, date_key, count, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?);`,
    [id, habitId, dateKey, count, timestamp, timestamp],
  );

  return {
    id,
    habitId,
    dateKey,
    count,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export async function removeCheckin(id: string) {
  await db.runAsync('DELETE FROM checkins WHERE id = ?;', [id]);
}
