import { calculateStreakStats } from '@/services/streaks';
import { addDays, toDateKey } from '@/utils';

describe('calculateStreakStats', () => {
  it('computes current and best streaks', () => {
    const today = new Date(2025, 0, 10);
    const checkins = [0, 1, 2].map((offset) => ({
      id: `c_${offset}`,
      habitId: 'habit_1',
      dateKey: toDateKey(addDays(today, -offset)),
      count: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }));

    const stats = calculateStreakStats(checkins, 1, today);
    expect(stats.currentStreak).toBe(3);
    expect(stats.bestStreak).toBe(3);
    expect(stats.rolling7).toBe(3);
  });

  it('breaks streak when days are missing', () => {
    const today = new Date(2025, 0, 10);
    const checkins = [0, 2, 3].map((offset) => ({
      id: `c_${offset}`,
      habitId: 'habit_1',
      dateKey: toDateKey(addDays(today, -offset)),
      count: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }));

    const stats = calculateStreakStats(checkins, 1, today);
    expect(stats.currentStreak).toBe(1);
    expect(stats.bestStreak).toBe(2);
  });
});
