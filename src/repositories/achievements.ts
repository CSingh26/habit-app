import { db } from '@/db/client';
import { AchievementSchema, type Achievement } from '@/domain';
import { createId, now, safeParseJson } from '@/utils';

type AchievementRow = {
  id: string;
  type: string;
  unlocked_at: number | null;
  progress: number;
  metadata: string | null;
  created_at: number;
};

function mapAchievement(row: AchievementRow): Achievement {
  return AchievementSchema.parse({
    id: row.id,
    type: row.type,
    unlockedAt: row.unlocked_at,
    progress: row.progress,
    metadata: safeParseJson(row.metadata, null),
    createdAt: row.created_at,
  });
}

export async function getAchievements() {
  const rows = await db.getAllAsync<AchievementRow>(
    'SELECT id, type, unlocked_at, progress, metadata, created_at FROM achievements ORDER BY created_at DESC;',
  );
  return rows.map(mapAchievement);
}

export async function upsertAchievement(type: string, progress: number, metadata?: Record<string, unknown>) {
  const existing = await db.getFirstAsync<AchievementRow>(
    'SELECT id, type, unlocked_at, progress, metadata, created_at FROM achievements WHERE type = ? LIMIT 1;',
    [type],
  );

  if (existing) {
    await db.runAsync('UPDATE achievements SET progress = ?, metadata = ? WHERE id = ?;', [
      progress,
      JSON.stringify(metadata ?? null),
      existing.id,
    ]);
    return {
      ...mapAchievement(existing),
      progress,
      metadata: metadata ?? null,
    };
  }

  const id = createId('ach');
  const createdAt = now();
  await db.runAsync(
    'INSERT INTO achievements (id, type, unlocked_at, progress, metadata, created_at) VALUES (?, ?, ?, ?, ?, ?);',
    [id, type, null, progress, JSON.stringify(metadata ?? null), createdAt],
  );

  return AchievementSchema.parse({
    id,
    type,
    unlockedAt: null,
    progress,
    metadata: metadata ?? null,
    createdAt,
  });
}

export async function unlockAchievement(id: string) {
  const unlockedAt = now();
  await db.runAsync('UPDATE achievements SET unlocked_at = ? WHERE id = ?;', [unlockedAt, id]);
  const row = await db.getFirstAsync<AchievementRow>(
    'SELECT id, type, unlocked_at, progress, metadata, created_at FROM achievements WHERE id = ? LIMIT 1;',
    [id],
  );
  return row ? mapAchievement(row) : null;
}
