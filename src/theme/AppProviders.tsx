import React, { createContext, useContext, useMemo } from 'react';
import { ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useColorScheme } from 'react-native';

import { darkTheme, lightTheme, type AppTheme } from './theme';

const ThemeContext = createContext<AppTheme>(lightTheme);

export function AppProviders({ children }: { children: React.ReactNode }) {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? darkTheme : lightTheme;
  const navigationTheme = useMemo(
    () => ({
      dark: scheme === 'dark',
      colors: {
        primary: theme.colors.accent,
        background: theme.colors.background,
        card: theme.colors.surface,
        text: theme.colors.text,
        border: theme.colors.border,
        notification: theme.colors.accent,
      },
    }),
    [scheme, theme],
  );

  return (
    <ThemeContext.Provider value={theme}>
      <NavigationThemeProvider value={navigationTheme}>{children}</NavigationThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
