import type { HabitSchedule } from '@/domain';

const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function formatSchedule(schedule: HabitSchedule) {
  if (schedule.days.length === 7) {
    return 'Every day';
  }
  const days = schedule.days.map((day) => dayLabels[day]).join(', ');
  return days || 'Custom';
}
