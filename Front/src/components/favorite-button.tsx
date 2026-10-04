import { Pressable, StyleSheet, Text } from 'react-native';

import { useQuotesColors } from '@/constants/quotes-theme';
import { useFavorites } from '@/contexts/favorites-context';
import type { Quote } from '@/models/quote';

export function FavoriteButton({ quote, onFeature = false }: { quote: Quote; onFeature?: boolean }) {
  const colors = useQuotesColors();
  const { isFavorite, isReady, toggleFavorite } = useFavorites();
  const selected = isFavorite(quote.id);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={selected ? 'Descurtir frase' : 'Curtir frase'}
      accessibilityState={{ selected, disabled: !isReady }}
      disabled={!isReady}
      onPress={() => toggleFavorite(quote)}
      style={({ pressed }) => [
        styles.button,
        onFeature
          ? styles.featureButton
          : { backgroundColor: selected ? colors.soft : colors.surface, borderColor: colors.line },
        pressed && styles.pressed,
      ]}>
      <Text style={[styles.heart, { color: onFeature ? '#FFFFFF' : selected ? colors.accent : colors.muted }]}>
        {selected ? '♥' : '♡'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  featureButton: { backgroundColor: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.28)' },
  heart: { fontSize: 26, lineHeight: 30, marginTop: -1 },
  pressed: { opacity: 0.7 },
});
