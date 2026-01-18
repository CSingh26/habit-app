import { getAchievements, unlockAchievement, upsertAchievement } from '@/repositories/achievements';

import {
  getEligibleAchievements,
  type AchievementUnlock,
  type AchievementsContext,
} from './achievementLogic';

export type { AchievementUnlock, AchievementsContext } from './achievementLogic';

export async function evaluateAchievements(context: AchievementsContext) {
  const existing = await getAchievements();
  const unlocked = new Set(existing.filter((entry) => entry.unlockedAt).map((entry) => entry.type));
  const newlyUnlocked: AchievementUnlock[] = [];

  for (const achievement of getEligibleAchievements(context, unlocked)) {
    const entry = await upsertAchievement(achievement.id, 1, {
      title: achievement.title,
      description: achievement.description,
    });
    if (entry) {
      await unlockAchievement(entry.id);
    }
    newlyUnlocked.push({
      id: achievement.id,
      title: achievement.title,
      description: achievement.description,
    });
  }

  return newlyUnlocked;
}
