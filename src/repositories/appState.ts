import { db } from '@/db/client';
import { AppStateSchema, type AppStateEntry } from '@/domain';
import { now } from '@/utils';

type AppStateRow = {
  key: string;
  value: string;
  updated_at: number;
};

function mapState(row: AppStateRow): AppStateEntry {
  return AppStateSchema.parse({
    key: row.key,
    value: row.value,
    updatedAt: row.updated_at,
  });
}

export async function getAppState(key: string) {
  const row = await db.getFirstAsync<AppStateRow>(
    'SELECT key, value, updated_at FROM app_state WHERE key = ? LIMIT 1;',
    [key],
  );
  return row ? mapState(row) : null;
}

export async function setAppState(key: string, value: string) {
  const updatedAt = now();
  const existing = await getAppState(key);

  if (existing) {
    await db.runAsync('UPDATE app_state SET value = ?, updated_at = ? WHERE key = ?;', [
      value,
      updatedAt,
      key,
    ]);
    return { ...existing, value, updatedAt };
  }

  await db.runAsync('INSERT INTO app_state (key, value, updated_at) VALUES (?, ?, ?);', [
    key,
    value,
    updatedAt,
  ]);

  return { key, value, updatedAt };
}

export async function removeAppState(key: string) {
  await db.runAsync('DELETE FROM app_state WHERE key = ?;', [key]);
}
