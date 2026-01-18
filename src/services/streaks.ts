import type { Checkin } from '@/domain';
import { addDays, parseDateKey, toDateKey } from '@/utils';

const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export type StreakStats = {
  currentStreak: number;
  bestStreak: number;
  rolling7: number;
  rolling30: number;
  completionRate: number;
  consistencyScore: number;
  bestDay: string;
};

export function calculateStreakStats(
  checkins: Checkin[],
  target: number,
  today: Date = new Date(),
): StreakStats {
  const map = new Map<string, number>();
  checkins.forEach((checkin) => {
    map.set(checkin.dateKey, Math.max(map.get(checkin.dateKey) ?? 0, checkin.count));
  });

  const isComplete = (dateKey: string) => (map.get(dateKey) ?? 0) >= target;

  const todayKey = toDateKey(today);
  let currentStreak = 0;
  let cursor = new Date(today);
  if (!isComplete(todayKey)) {
    cursor = addDays(cursor, -1);
  }

  while (isComplete(toDateKey(cursor))) {
    currentStreak += 1;
    cursor = addDays(cursor, -1);
  }

  const sortedKeys = Array.from(map.keys()).sort();
  let bestStreak = 0;
  let tempStreak = 0;
  let prevDate: Date | null = null;

  for (const key of sortedKeys) {
    if (!isComplete(key)) {
      continue;
    }
    const date = parseDateKey(key);
    if (prevDate) {
      const diff = Math.round((date.getTime() - prevDate.getTime()) / (24 * 3600 * 1000));
      tempStreak = diff === 1 ? tempStreak + 1 : 1;
    } else {
      tempStreak = 1;
    }
    bestStreak = Math.max(bestStreak, tempStreak);
    prevDate = date;
  }

  const rolling = (days: number) => {
    let count = 0;
    for (let i = 0; i < days; i += 1) {
      const key = toDateKey(addDays(today, -i));
      if (isComplete(key)) {
        count += 1;
      }
    }
    return count;
  };

  const rolling7 = rolling(7);
  const rolling30 = rolling(30);
  const completionRate = rolling30 / 30;
  const consistencyScore = Math.round(completionRate * 100);

  const dayBuckets = new Array(7).fill(0);
  for (const key of sortedKeys) {
    if (isComplete(key)) {
      const day = parseDateKey(key).getDay();
      dayBuckets[day] += 1;
    }
  }
  const maxDay = Math.max(...dayBuckets);
  const bestDayIndex = maxDay === 0 ? -1 : dayBuckets.indexOf(maxDay);

  return {
    currentStreak,
    bestStreak,
    rolling7,
    rolling30,
    completionRate,
    consistencyScore,
    bestDay: bestDayIndex === -1 ? '—' : dayLabels[bestDayIndex],
  };
}
