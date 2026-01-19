import 'react-native-gesture-handler';

import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { enableScreens } from 'react-native-screens';
import {
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
} from '@expo-google-fonts/space-grotesk';
import { DMSerifDisplay_400Regular } from '@expo-google-fonts/dm-serif-display';

import { initializeDatabase } from '@/db';
import { AppProviders } from '@/theme';

enableScreens(false);
SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding/index" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_600SemiBold,
    DMSerifDisplay_400Regular,
  });
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    if (loaded) {
      initializeDatabase()
        .then(() => {
          if (mounted) {
            setDbReady(true);
          }
        })
        .finally(() => {
          SplashScreen.hideAsync();
        });
    }

    return () => {
      mounted = false;
    };
  }, [loaded]);

  if (!loaded || !dbReady) {
    return null;
  }

  return (
    <AppProviders>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <RootNavigator />
      </GestureHandlerRootView>
    </AppProviders>
  );
}
