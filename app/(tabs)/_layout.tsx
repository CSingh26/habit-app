import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Slot, usePathname, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { AppText } from '@/components';
import { useTheme } from '@/theme';

const TAB_HEIGHT = 64;

const tabs = [
  { label: 'Today', icon: 'sun', route: '/' },
  { label: 'Habits', icon: 'check-circle', route: '/habits' },
  { label: 'Journal', icon: 'book-open', route: '/journal' },
  { label: 'Insights', icon: 'activity', route: '/insights' },
  { label: 'Companion', icon: 'feather', route: '/companion' },
] as const;

export default function TabsLayout() {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const activeRoute = useMemo(() => {
    if (pathname === '/' || pathname === '/index') {
      return '/';
    }
    const match = tabs.find((tab) => pathname.startsWith(tab.route));
    return match?.route ?? '/';
  }, [pathname]);

  return (
    <View style={styles.container}>
      <View style={[styles.content, { paddingBottom: TAB_HEIGHT + insets.bottom + 12 }]}>
        <Slot />
      </View>
      <View
        style={[
          styles.tabBar,
          {
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.colors.border,
            paddingBottom: insets.bottom,
          },
        ]}
      >
        {tabs.map((tab) => {
          const active = activeRoute === tab.route;
          const color = active ? theme.colors.accent : theme.colors.textMuted;
          return (
            <Pressable
              key={tab.route}
              onPress={async () => {
                await Haptics.selectionAsync();
                router.replace(tab.route);
              }}
              style={styles.tabItem}
            >
              <Feather name={tab.icon as keyof typeof Feather.glyphMap} size={22} color={color} />
              <AppText variant="caption" color={color}>
                {tab.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    height: TAB_HEIGHT + 12,
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  tabItem: {
    alignItems: 'center',
    gap: 4,
  },
});
