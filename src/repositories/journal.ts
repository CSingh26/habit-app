import { z } from 'zod';

import { db } from '@/db/client';
import { JournalEntrySchema, type JournalEntry } from '@/domain';
import { createId, now, safeParseJson } from '@/utils';

const JournalInputSchema = z.object({
  dateKey: z.string(),
  mood: z.number().int().min(0).max(100),
  energy: z.number().int().min(0).max(100),
  notes: z.string().nullable().optional(),
  habitIds: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

export type JournalInput = z.infer<typeof JournalInputSchema>;

type JournalRow = {
  id: string;
  date_key: string;
  mood: number;
  energy: number;
  notes: string | null;
  habit_ids: string | null;
  tags: string | null;
  created_at: number;
  updated_at: number;
};

function mapJournal(row: JournalRow): JournalEntry {
  return JournalEntrySchema.parse({
    id: row.id,
    dateKey: row.date_key,
    mood: row.mood,
    energy: row.energy,
    notes: row.notes,
    habitIds: safeParseJson(row.habit_ids, []),
    tags: safeParseJson(row.tags, []),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

export async function getJournalEntry(dateKey: string) {
  const row = await db.getFirstAsync<JournalRow>(
    `SELECT id, date_key, mood, energy, notes, habit_ids, tags, created_at, updated_at
     FROM journal_entries WHERE date_key = ? LIMIT 1;`,
    [dateKey],
  );
  return row ? mapJournal(row) : null;
}

export async function getJournalEntries() {
  const rows = await db.getAllAsync<JournalRow>(
    `SELECT id, date_key, mood, energy, notes, habit_ids, tags, created_at, updated_at
     FROM journal_entries ORDER BY date_key DESC;`,
  );
  return rows.map(mapJournal);
}

export async function upsertJournalEntry(input: JournalInput) {
  const parsed = JournalInputSchema.parse(input);
  const existing = await getJournalEntry(parsed.dateKey);
  const timestamp = now();

  if (existing) {
    const updated = {
      ...existing,
      mood: parsed.mood,
      energy: parsed.energy,
      notes: parsed.notes ?? null,
      habitIds: parsed.habitIds ?? [],
      tags: parsed.tags ?? [],
      updatedAt: timestamp,
    };

    await db.runAsync(
      `UPDATE journal_entries
       SET mood = ?, energy = ?, notes = ?, habit_ids = ?, tags = ?, updated_at = ?
       WHERE id = ?;`,
      [
        updated.mood,
        updated.energy,
        updated.notes,
        JSON.stringify(updated.habitIds),
        JSON.stringify(updated.tags),
        updated.updatedAt,
        updated.id,
      ],
    );

    return updated;
  }

  const id = createId('journal');
  const createdAt = timestamp;
  await db.runAsync(
    `INSERT INTO journal_entries (id, date_key, mood, energy, notes, habit_ids, tags, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      id,
      parsed.dateKey,
      parsed.mood,
      parsed.energy,
      parsed.notes ?? null,
      JSON.stringify(parsed.habitIds ?? []),
      JSON.stringify(parsed.tags ?? []),
      createdAt,
      createdAt,
    ],
  );

  return JournalEntrySchema.parse({
    id,
    dateKey: parsed.dateKey,
    mood: parsed.mood,
    energy: parsed.energy,
    notes: parsed.notes ?? null,
    habitIds: parsed.habitIds ?? [],
    tags: parsed.tags ?? [],
    createdAt,
    updatedAt: createdAt,
  });
}
