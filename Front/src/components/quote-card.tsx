import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FavoriteButton } from '@/components/favorite-button';
import { useQuotesColors } from '@/constants/quotes-theme';
import type { Quote } from '@/models/quote';

export function QuoteCard({ quote }: { quote: Quote }) {
  const colors = useQuotesColors();

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.line, shadowColor: colors.shadow }]}>
      <View style={styles.top}>
        <Text style={[styles.number, { color: colors.accent }]}>Nº {String(quote.id).padStart(2, '0')}</Text>
        <FavoriteButton quote={quote} />
      </View>
      <Text style={[styles.quote, { color: colors.ink }]}>{quote.quote}</Text>
      <View style={[styles.divider, { backgroundColor: colors.line }]} />
      <View style={styles.bottom}>
        <Text style={[styles.author, { color: colors.muted }]}>{quote.author}</Text>
        <Link href={`/quote/${quote.id}`} asChild>
          <Pressable
            accessibilityRole="link"
            accessibilityLabel={`Ver detalhes da frase ${quote.id}`}
            style={({ pressed }) => [styles.detailsLink, pressed && styles.pressed]}>
            <Text style={[styles.detailsText, { color: colors.accent }]}>Ver frase →</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { minHeight: 220, borderRadius: 18, borderWidth: 1, padding: 24, shadowOpacity: 0.035, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 1 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  number: { fontSize: 11, fontWeight: '700', letterSpacing: 1.3 },
  quote: { fontSize: 18, lineHeight: 28, fontWeight: '500', letterSpacing: -0.3, marginTop: 16, marginBottom: 24 },
  divider: { height: 1, marginTop: 'auto', marginBottom: 16 },
  bottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  author: { flexShrink: 1, fontSize: 13, fontWeight: '600' },
  detailsLink: { minHeight: 44, justifyContent: 'center' },
  detailsText: { fontSize: 13, fontWeight: '700' },
  pressed: { opacity: 0.7 },
});
