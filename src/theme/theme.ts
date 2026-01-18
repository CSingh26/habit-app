import { darkColors, lightColors } from './colors';
import { radius } from './radius';
import { shadow } from './shadows';
import { spacing } from './spacing';
import { fontFamilies, fontSizes, lineHeights } from './typography';

export const lightTheme = {
  colors: lightColors,
  radius,
  shadow,
  spacing,
  typography: {
    fontFamilies,
    fontSizes,
    lineHeights,
  },
};

export const darkTheme: typeof lightTheme = {
  colors: darkColors,
  radius,
  shadow,
  spacing,
  typography: {
    fontFamilies,
    fontSizes,
    lineHeights,
  },
};

export type AppTheme = typeof lightTheme;
