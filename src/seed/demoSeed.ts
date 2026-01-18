import type { SQLiteDatabase } from 'expo-sqlite';

import { toDateKey } from '@/utils';

const SEED_KEY = 'demo_seeded';

function daysAgo(count: number) {
  const date = new Date();
  date.setDate(date.getDate() - count);
  return date;
}

export async function seedDemoData(db: SQLiteDatabase) {
  const existing = await db.getFirstAsync<{ value: string }>(
    'SELECT value FROM app_state WHERE key = ? LIMIT 1;',
    [SEED_KEY],
  );
  if (existing?.value === 'true') {
    return;
  }

  const now = Date.now();
  const habits = [
    {
      id: 'habit_demo_focus',
      name: 'Focus Sprint',
      icon: 'focus',
      color: '#7B6CFF',
      schedule: JSON.stringify({ days: [1, 2, 3, 4, 5], times: ['09:00'] }),
      target: 1,
      reminderTime: '09:00',
    },
    {
      id: 'habit_demo_hydrate',
      name: 'Hydration',
      icon: 'drop',
      color: '#5AA6FF',
      schedule: JSON.stringify({ days: [0, 1, 2, 3, 4, 5, 6], times: ['11:00'] }),
      target: 8,
      reminderTime: '11:00',
    },
  ];

  for (const habit of habits) {
    await db.runAsync(
      `INSERT INTO habits (id, name, icon, color, schedule, target, reminder_time, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        habit.id,
        habit.name,
        habit.icon,
        habit.color,
        habit.schedule,
        habit.target,
        habit.reminderTime,
        now,
        now,
      ],
    );
  }

  const checkins = [0, 1, 2, 3, 4, 5].map((offset) => ({
    id: `checkin_demo_${offset}`,
    habitId: 'habit_demo_focus',
    dateKey: toDateKey(daysAgo(offset)),
    count: 1,
  }));

  for (const checkin of checkins) {
    await db.runAsync(
      `INSERT INTO checkins (id, habit_id, date_key, count, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?);`,
      [checkin.id, checkin.habitId, checkin.dateKey, checkin.count, now, now],
    );
  }

  const todayKey = toDateKey(new Date());
  await db.runAsync(
    `INSERT INTO journal_entries (id, date_key, mood, energy, notes, habit_ids, tags, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      'journal_demo_today',
      todayKey,
      78,
      66,
      'A focused morning with clear priorities.',
      JSON.stringify(['habit_demo_focus']),
      JSON.stringify(['clarity', 'momentum']),
      now,
      now,
    ],
  );

  await db.runAsync(
    `INSERT INTO achievements (id, type, unlocked_at, progress, metadata, created_at)
     VALUES (?, ?, ?, ?, ?, ?);`,
    [
      'ach_demo_first',
      'first_checkin',
      now,
      1,
      JSON.stringify({ label: 'First Check-in' }),
      now,
    ],
  );

  await db.runAsync(
    `INSERT INTO challenges (id, name, code, start_date, end_date, target_streak, habit_ids, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      'challenge_demo',
      '7-Day Focus Sprint',
      'FOCUS7',
      todayKey,
      toDateKey(daysAgo(-6)),
      7,
      JSON.stringify(['habit_demo_focus']),
      now,
      now,
    ],
  );

  await db.runAsync(
    `INSERT INTO challenge_members (id, challenge_id, name, avatar, is_self, joined_at, progress)
     VALUES (?, ?, ?, ?, ?, ?, ?);`,
    ['member_demo_self', 'challenge_demo', 'You', null, 1, now, 4],
  );

  await db.runAsync('INSERT INTO app_state (key, value, updated_at) VALUES (?, ?, ?);', [
    SEED_KEY,
    'true',
    now,
  ]);
}
