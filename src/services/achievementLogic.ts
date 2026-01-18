export type AchievementsContext = {
  totalCheckins?: number;
  currentStreak?: number;
  bestStreak?: number;
  journalDays?: number;
  lastCheckinHour?: number;
};

export type AchievementUnlock = {
  id: string;
  title: string;
  description: string;
};

export type AchievementDefinition = {
  id: string;
  title: string;
  description: string;
  condition: (context: AchievementsContext) => boolean;
};

export const achievementCatalog: AchievementDefinition[] = [
  {
    id: 'first_checkin',
    title: 'First Check-in',
    description: 'Complete your first habit.',
    condition: (context) => (context.totalCheckins ?? 0) >= 1,
  },
  {
    id: 'streak_7',
    title: '7-Day Streak',
    description: 'Keep the momentum alive for a week.',
    condition: (context) => (context.currentStreak ?? 0) >= 7,
  },
  {
    id: 'streak_14',
    title: '14-Day Streak',
    description: 'Two weeks, strong and steady.',
    condition: (context) => (context.currentStreak ?? 0) >= 14,
  },
  {
    id: 'checkins_10',
    title: 'Double Digits',
    description: 'Hit 10 total check-ins.',
    condition: (context) => (context.totalCheckins ?? 0) >= 10,
  },
  {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Check in before 7 AM.',
    condition: (context) => (context.lastCheckinHour ?? 24) < 7,
  },
  {
    id: 'night_owl',
    title: 'Night Owl',
    description: 'Check in after 9 PM.',
    condition: (context) => (context.lastCheckinHour ?? 0) >= 21,
  },
  {
    id: 'journal_7',
    title: 'Reflective',
    description: 'Write in your journal 7 times.',
    condition: (context) => (context.journalDays ?? 0) >= 7,
  },
];

export function getEligibleAchievements(
  context: AchievementsContext,
  unlockedIds: Set<string>,
) {
  return achievementCatalog.filter(
    (achievement) => !unlockedIds.has(achievement.id) && achievement.condition(context),
  );
}
