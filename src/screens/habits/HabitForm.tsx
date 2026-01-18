import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { AppText, PressableScale } from '@/components';
import type { Habit, HabitSchedule } from '@/domain';
import { habitColors, habitIcons } from '@/data/habitOptions';
import { getNotificationPermissionStatus, requestNotificationPermission } from '@/services/notifications';
import { useTheme } from '@/theme';

type HabitFormValues = {
  name: string;
  icon: string;
  color: string;
  target: number;
  schedule: HabitSchedule;
  reminderTime: string | null;
};

type HabitFormProps = {
  initial?: Habit | null;
  submitLabel?: string;
  onSubmit: (values: HabitFormValues) => Promise<void>;
};

const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const reminderSlots = ['06:00', '08:00', '10:00', '12:00', '15:00', '18:00', '20:00'];

export function HabitForm({ initial, submitLabel = 'Save habit', onSubmit }: HabitFormProps) {
  const theme = useTheme();
  const [name, setName] = useState(initial?.name ?? '');
  const [icon, setIcon] = useState(initial?.icon ?? habitIcons[0]);
  const [color, setColor] = useState(initial?.color ?? habitColors[0]);
  const [target, setTarget] = useState(initial?.target ?? 1);
  const [selectedDays, setSelectedDays] = useState<number[]>(
    initial?.schedule?.days ?? [1, 2, 3, 4, 5],
  );
  const [reminderTime, setReminderTime] = useState<string | null>(
    initial?.reminderTime ?? null,
  );
  const [permissionStatus, setPermissionStatus] = useState<string>('undetermined');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getNotificationPermissionStatus().then((status) => setPermissionStatus(status));
  }, []);

  const schedule = useMemo(
    () => ({
      days: selectedDays,
      times: reminderTime ? [reminderTime] : [],
    }),
    [selectedDays, reminderTime],
  );

  const toggleDay = (index: number) => {
    setSelectedDays((prev) =>
      prev.includes(index) ? prev.filter((day) => day !== index) : [...prev, index],
    );
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      return;
    }
    setSaving(true);
    await onSubmit({
      name: name.trim(),
      icon,
      color,
      target,
      schedule,
      reminderTime,
    });
    setSaving(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <AppText variant="subtitle">Name</AppText>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Morning focus"
          placeholderTextColor={theme.colors.textMuted}
          style={[
            styles.input,
            { borderColor: theme.colors.border, color: theme.colors.text },
          ]}
        />
      </View>

      <View style={styles.section}>
        <AppText variant="subtitle">Icon</AppText>
        <View style={styles.grid}>
          {habitIcons.map((option) => (
            <PressableScale
              key={option}
              onPress={() => setIcon(option)}
              style={[
                styles.iconChip,
                {
                  backgroundColor: icon === option ? theme.colors.accentSoft : theme.colors.surface,
                  borderColor: icon === option ? theme.colors.accent : theme.colors.border,
                },
              ]}
            >
              <Feather
                name={option as keyof typeof Feather.glyphMap}
                size={18}
                color={theme.colors.text}
              />
            </PressableScale>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <AppText variant="subtitle">Color</AppText>
        <View style={styles.row}>
          {habitColors.map((swatch) => (
            <PressableScale
              key={swatch}
              onPress={() => setColor(swatch)}
              style={[
                styles.colorChip,
                {
                  backgroundColor: swatch,
                  borderColor: color === swatch ? theme.colors.text : 'transparent',
                },
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <AppText variant="subtitle">Schedule</AppText>
        <View style={styles.row}>
          {days.map((label, index) => {
            const active = selectedDays.includes(index);
            return (
              <PressableScale
                key={`${label}-${index}`}
                onPress={() => toggleDay(index)}
                style={[
                  styles.dayChip,
                  {
                    backgroundColor: active ? theme.colors.accentSoft : theme.colors.surface,
                    borderColor: active ? theme.colors.accent : theme.colors.border,
                  },
                ]}
              >
                <AppText variant="caption">{label}</AppText>
              </PressableScale>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <AppText variant="subtitle">Target</AppText>
        <View style={styles.row}>
          <PressableScale
            onPress={() => setTarget((value) => Math.max(1, value - 1))}
            style={[styles.stepper, { borderColor: theme.colors.border }]}
          >
            <AppText variant="title">-</AppText>
          </PressableScale>
          <AppText variant="title">{target}</AppText>
          <PressableScale
            onPress={() => setTarget((value) => value + 1)}
            style={[styles.stepper, { borderColor: theme.colors.border }]}
          >
            <AppText variant="title">+</AppText>
          </PressableScale>
        </View>
      </View>

      <View style={styles.section}>
        <AppText variant="subtitle">Reminder</AppText>
        {permissionStatus !== 'granted' && (
          <PressableScale
            onPress={async () => {
              const status = await requestNotificationPermission();
              setPermissionStatus(status);
            }}
            style={[styles.permissionButton, { borderColor: theme.colors.border }]}
          >
            <AppText variant="caption">Enable notifications</AppText>
          </PressableScale>
        )}
        <View style={styles.row}>
          <PressableScale
            onPress={() => setReminderTime(null)}
            style={[
              styles.timeChip,
              {
                backgroundColor: reminderTime === null ? theme.colors.accentSoft : theme.colors.surface,
                borderColor: reminderTime === null ? theme.colors.accent : theme.colors.border,
              },
            ]}
          >
            <AppText variant="caption">Off</AppText>
          </PressableScale>
          {reminderSlots.map((slot) => (
            <PressableScale
              key={slot}
              onPress={() => setReminderTime(slot)}
              style={[
                styles.timeChip,
                {
                  backgroundColor: reminderTime === slot ? theme.colors.accentSoft : theme.colors.surface,
                  borderColor: reminderTime === slot ? theme.colors.accent : theme.colors.border,
                },
              ]}
            >
              <AppText variant="caption">{slot}</AppText>
            </PressableScale>
          ))}
        </View>
      </View>

      <PressableScale
        onPress={handleSubmit}
        style={[styles.submit, { backgroundColor: theme.colors.accent, opacity: saving ? 0.6 : 1 }]}
      >
        <AppText variant="subtitle" color="#0B0F18">
          {submitLabel}
        </AppText>
      </PressableScale>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 120,
    gap: 24,
  },
  section: {
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    alignItems: 'center',
  },
  iconChip: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  colorChip: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
  },
  dayChip: {
    width: 34,
    height: 34,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepper: {
    width: 40,
    height: 40,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  timeChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  submit: {
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
  },
});
