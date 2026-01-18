import { getAppState, setAppState } from '@/repositories/appState';

const XP_KEY = 'xp_total';

export type LevelProgress = {
  level: number;
  currentXp: number;
  nextLevelXp: number;
  progress: number;
};

function xpForLevel(level: number) {
  const base = 120;
  return Math.floor(base * Math.pow(level, 1.35));
}

export async function getTotalXp() {
  const stored = await getAppState(XP_KEY);
  if (!stored?.value) {
    return 0;
  }
  return Number(stored.value) || 0;
}

export async function addXp(amount: number) {
  const current = await getTotalXp();
  const next = current + amount;
  await setAppState(XP_KEY, String(next));
  return next;
}

export function getLevelProgress(totalXp: number): LevelProgress {
  let level = 1;
  while (totalXp >= xpForLevel(level + 1)) {
    level += 1;
  }
  const currentXp = xpForLevel(level);
  const nextLevelXp = xpForLevel(level + 1);
  const progress = Math.min(1, (totalXp - currentXp) / (nextLevelXp - currentXp));

  return {
    level,
    currentXp: totalXp,
    nextLevelXp,
    progress,
  };
}

export function xpForCheckin(target: number) {
  return 12 + target * 2;
}

export function xpForStreakMilestone(streak: number) {
  const bonuses: Record<number, number> = {
    3: 10,
    7: 30,
    14: 60,
    30: 150,
  };
  return bonuses[streak] ?? 0;
}
