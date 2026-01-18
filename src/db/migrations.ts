import type { SQLiteDatabase } from 'expo-sqlite';

type Migration = {
  version: number;
  statements: string[];
};

const migrations: Migration[] = [
  {
    version: 1,
    statements: [
      `CREATE TABLE IF NOT EXISTS schema_migrations (
        version INTEGER PRIMARY KEY NOT NULL,
        applied_at INTEGER NOT NULL
      );`,
      `CREATE TABLE IF NOT EXISTS habits (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        icon TEXT NOT NULL,
        color TEXT NOT NULL,
        schedule TEXT NOT NULL,
        target INTEGER NOT NULL,
        reminder_time TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );`,
      `CREATE TABLE IF NOT EXISTS checkins (
        id TEXT PRIMARY KEY NOT NULL,
        habit_id TEXT NOT NULL,
        date_key TEXT NOT NULL,
        count INTEGER NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        UNIQUE(habit_id, date_key),
        FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE
      );`,
      `CREATE TABLE IF NOT EXISTS journal_entries (
        id TEXT PRIMARY KEY NOT NULL,
        date_key TEXT NOT NULL,
        mood INTEGER NOT NULL,
        energy INTEGER NOT NULL,
        notes TEXT,
        habit_ids TEXT,
        tags TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        UNIQUE(date_key)
      );`,
      `CREATE TABLE IF NOT EXISTS achievements (
        id TEXT PRIMARY KEY NOT NULL,
        type TEXT NOT NULL,
        unlocked_at INTEGER,
        progress REAL NOT NULL DEFAULT 0,
        metadata TEXT,
        created_at INTEGER NOT NULL
      );`,
      `CREATE TABLE IF NOT EXISTS challenges (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        code TEXT NOT NULL,
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL,
        target_streak INTEGER NOT NULL,
        habit_ids TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );`,
      `CREATE TABLE IF NOT EXISTS challenge_members (
        id TEXT PRIMARY KEY NOT NULL,
        challenge_id TEXT NOT NULL,
        name TEXT NOT NULL,
        avatar TEXT,
        is_self INTEGER NOT NULL DEFAULT 0,
        joined_at INTEGER NOT NULL,
        progress INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE
      );`,
      `CREATE TABLE IF NOT EXISTS app_state (
        key TEXT PRIMARY KEY NOT NULL,
        value TEXT NOT NULL,
        updated_at INTEGER NOT NULL
      );`,
      `CREATE INDEX IF NOT EXISTS idx_checkins_habit_date ON checkins (habit_id, date_key);`,
      `CREATE INDEX IF NOT EXISTS idx_journal_date ON journal_entries (date_key);`,
    ],
  },
];

export async function runMigrations(db: SQLiteDatabase) {
  await db.execAsync('PRAGMA foreign_keys = ON;');
  await db.execAsync('PRAGMA journal_mode = WAL;');

  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY NOT NULL,
      applied_at INTEGER NOT NULL
    );`,
  );

  const currentRow = await db.getFirstAsync<{ version: number }>(
    'SELECT version FROM schema_migrations ORDER BY version DESC LIMIT 1;',
  );
  const currentVersion = currentRow?.version ?? 0;

  const pending = migrations.filter((migration) => migration.version > currentVersion);
  for (const migration of pending) {
    await db.withTransactionAsync(async () => {
      for (const statement of migration.statements) {
        await db.execAsync(statement);
      }
      await db.runAsync('INSERT INTO schema_migrations (version, applied_at) VALUES (?, ?);', [
        migration.version,
        Date.now(),
      ]);
    });
  }
}
