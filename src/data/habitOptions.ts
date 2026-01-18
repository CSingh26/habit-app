export const habitIcons = [
  'sun',
  'droplet',
  'activity',
  'book',
  'coffee',
  'heart',
  'leaf',
  'moon',
  'smile',
  'zap',
  'wind',
] as const;

export const habitColors = [
  '#7B6CFF',
  '#5AA6FF',
  '#4FD1B5',
  '#FF8B7A',
  '#F6C36A',
  '#2EC4B6',
  '#8B5CF6',
  '#F472B6',
  '#22C55E',
  '#0EA5E9',
] as const;

export type HabitIconName = (typeof habitIcons)[number];
