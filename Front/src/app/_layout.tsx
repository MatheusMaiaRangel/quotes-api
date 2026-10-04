import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { FavoritesProvider } from '@/contexts/favorites-context';

export default function RootLayout() {
  return (
    <FavoritesProvider>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }} />
    </FavoritesProvider>
  );
}
