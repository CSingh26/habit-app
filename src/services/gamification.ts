import { getJournalEntries } from '@/repositories/journal';
import { getAllCheckins, getCheckinsForHabit } from '@/repositories/checkins';
import type { Habit } from '@/domain';
import { calculateStreakStats } from '@/services/streaks';

import { evaluateAchievements, type AchievementUnlock } from './achievements';
import { addXp, getLevelProgress, getTotalXp, xpForCheckin, xpForStreakMilestone } from './xp';

export type GamificationResult = {
  xpGained: number;
  totalXp: number;
  levelProgress: ReturnType<typeof getLevelProgress>;
  achievements: AchievementUnlock[];
};

export async function handleCheckinComplete(habit: Habit): Promise<GamificationResult> {
  const [checkins, allCheckins, journalEntries] = await Promise.all([
    getCheckinsForHabit(habit.id),
    getAllCheckins(),
    getJournalEntries(),
  ]);

  const stats = calculateStreakStats(checkins, habit.target);
  const streakBonus = xpForStreakMilestone(stats.currentStreak);
  const baseXp = xpForCheckin(habit.target);
  const xpGained = baseXp + streakBonus;
  const totalXp = await addXp(xpGained);
  const levelProgress = getLevelProgress(totalXp);

  const achievements = await evaluateAchievements({
    totalCheckins: allCheckins.length,
    currentStreak: stats.currentStreak,
    bestStreak: stats.bestStreak,
    journalDays: journalEntries.length,
    lastCheckinHour: new Date().getHours(),
  });

  return { xpGained, totalXp, levelProgress, achievements };
}

export async function handleJournalSaved() {
  const [allCheckins, journalEntries] = await Promise.all([
    getAllCheckins(),
    getJournalEntries(),
  ]);
  return evaluateAchievements({
    totalCheckins: allCheckins.length,
    journalDays: journalEntries.length,
  });
}

export async function getLevelSnapshot() {
  const totalXp = await getTotalXp();
  return getLevelProgress(totalXp);
}
