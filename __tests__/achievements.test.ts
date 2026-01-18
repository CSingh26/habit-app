import { getEligibleAchievements } from '@/services/achievements';

describe('getEligibleAchievements', () => {
  it('returns newly unlocked achievements', () => {
    const unlocked = new Set<string>();
    const result = getEligibleAchievements(
      {
        totalCheckins: 12,
        currentStreak: 7,
        journalDays: 7,
        lastCheckinHour: 6,
      },
      unlocked,
    );

    const ids = result.map((achievement) => achievement.id);
    expect(ids).toContain('first_checkin');
    expect(ids).toContain('checkins_10');
    expect(ids).toContain('streak_7');
    expect(ids).toContain('journal_7');
    expect(ids).toContain('early_bird');
  });
});
