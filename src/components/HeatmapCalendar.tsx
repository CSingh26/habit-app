import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

import { AppText } from '@/components';
import { useTheme } from '@/theme';
import { addDays, toDateKey } from '@/utils';

type HeatmapDay = {
  dateKey: string;
  value: number;
};

type HeatmapCalendarProps = {
  days: HeatmapDay[];
  weeks?: number;
};

const daySize = 12;
const dayGap = 4;

export function HeatmapCalendar({ days, weeks = 12 }: HeatmapCalendarProps) {
  const theme = useTheme();
  const dataMap = useMemo(() => new Map(days.map((day) => [day.dateKey, day.value])), [days]);

  const { cells, monthLabels } = useMemo(() => {
    const today = new Date();
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const start = addDays(end, -(weeks * 7 - 1));
    const cellsData: Array<{ key: string; x: number; y: number; value: number }> = [];
    const labels: Array<{ label: string; x: number }> = [];

    let cursor = start;
    for (let w = 0; w < weeks; w += 1) {
      const monthLabel = cursor.toLocaleDateString('en-US', { month: 'short' });
      if (w === 0 || cursor.getDate() <= 7) {
        labels.push({ label: monthLabel, x: w * (daySize + dayGap) });
      }
      for (let d = 0; d < 7; d += 1) {
        const key = toDateKey(cursor);
        const value = dataMap.get(key) ?? 0;
        cellsData.push({
          key,
          x: w * (daySize + dayGap),
          y: d * (daySize + dayGap),
          value,
        });
        cursor = addDays(cursor, 1);
      }
    }
    return { cells: cellsData, monthLabels: labels };
  }, [dataMap, weeks]);

  const bucketColors = [
    theme.colors.border,
    theme.colors.accentSoft,
    theme.colors.accent,
    theme.colors.success,
    theme.colors.warning,
  ];

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        {monthLabels.map((label) => (
          <AppText
            key={label.x}
            variant="caption"
            color={theme.colors.textMuted}
            style={[styles.monthLabel, { left: label.x }]}
          >
            {label.label}
          </AppText>
        ))}
      </View>
      <Svg
        width={weeks * (daySize + dayGap)}
        height={7 * (daySize + dayGap)}
        style={styles.grid}
      >
        {cells.map((cell) => {
          const intensity = Math.min(cell.value, bucketColors.length - 1);
          return (
            <Rect
              key={cell.key}
              x={cell.x}
              y={cell.y}
              width={daySize}
              height={daySize}
              rx={4}
              fill={bucketColors[intensity]}
            />
          );
        })}
      </Svg>
      <View style={styles.legend}>
        <AppText variant="caption" color={theme.colors.textMuted}>
          Less
        </AppText>
        {bucketColors.map((color, index) => (
          <View key={color} style={[styles.legendDot, { backgroundColor: color }]} />
        ))}
        <AppText variant="caption" color={theme.colors.textMuted}>
          More
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  labelRow: {
    height: 18,
  },
  monthLabel: {
    position: 'absolute',
    top: 0,
  },
  grid: {
    alignSelf: 'flex-start',
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 3,
  },
});
