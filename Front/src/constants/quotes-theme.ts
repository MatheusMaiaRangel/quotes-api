import { useColorScheme } from 'react-native';

export const palettes = {
  light: {
    background: '#F7F7F5', surface: '#FFFFFF', ink: '#202320', muted: '#696F6B',
    line: '#E7E9E5', soft: '#EFF2EF', accent: '#3C6A59', feature: '#233D35',
    shadow: '#1C3328',
  },
  dark: {
    background: '#151A17', surface: '#202722', ink: '#F4F5F1', muted: '#AEB8AF',
    line: '#343D36', soft: '#29342D', accent: '#A9D6B8', feature: '#2D4B3D',
    shadow: '#000000',
  },
} as const;

export function useQuotesColors() {
  const colorScheme = useColorScheme();
  return palettes[colorScheme === 'dark' ? 'dark' : 'light'];
}
