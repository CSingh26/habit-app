import { Platform } from 'react-native';

export const shadow = {
  md: Platform.select({
    ios: {
      shadowColor: '#0B1220',
      shadowOpacity: 0.12,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
    },
    android: {
      elevation: 6,
    },
    default: {
      shadowColor: '#0B1220',
      shadowOpacity: 0.12,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
    },
  }),
  lg: Platform.select({
    ios: {
      shadowColor: '#0B1220',
      shadowOpacity: 0.18,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 12 },
    },
    android: {
      elevation: 12,
    },
    default: {
      shadowColor: '#0B1220',
      shadowOpacity: 0.18,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 12 },
    },
  }),
};
