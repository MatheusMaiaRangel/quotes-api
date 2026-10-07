import { render } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { FavoritesProvider } from '@/contexts/favorites-context';

const SAFE_AREA_METRICS = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaProvider initialMetrics={SAFE_AREA_METRICS}>
      <FavoritesProvider>{children}</FavoritesProvider>
    </SafeAreaProvider>
  );
}

export function renderWithProviders(element: React.ReactElement) {
  return render(element, { wrapper: AppProviders });
}
