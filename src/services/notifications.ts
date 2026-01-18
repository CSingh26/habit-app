import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

import type { Habit } from '@/domain';
import { getAppState, removeAppState, setAppState } from '@/repositories/appState';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function getNotificationPermissionStatus() {
  const settings = await Notifications.getPermissionsAsync();
  return settings.status;
}

export async function requestNotificationPermission() {
  const settings = await Notifications.requestPermissionsAsync();
  return settings.status;
}

async function ensureChannel() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('habits', {
      name: 'Habit Reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#7B6CFF',
    });
  }
}

export async function scheduleHabitReminder(habit: Habit) {
  if (!habit.reminderTime) {
    return;
  }

  await ensureChannel();
  const [hour, minute] = habit.reminderTime.split(':').map(Number);

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: habit.name,
      body: 'Time to keep your streak alive.',
      sound: 'default',
    },
    trigger: {
      hour,
      minute,
      repeats: true,
      channelId: Platform.OS === 'android' ? 'habits' : undefined,
    },
  });

  await setAppState(`notif_${habit.id}`, notificationId);
}

export async function cancelHabitReminder(habitId: string) {
  const stored = await getAppState(`notif_${habitId}`);
  if (stored?.value) {
    await Notifications.cancelScheduledNotificationAsync(stored.value);
    await removeAppState(`notif_${habitId}`);
  }
}
