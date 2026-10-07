import { Link, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FavoriteButton } from '@/components/favorite-button';
import { QuotesHeader } from '@/components/quotes-header';
import { useQuotesColors } from '@/constants/quotes-theme';
import { useQuote } from '@/hooks/use-quote';
import type { Quote } from '@/models/quote';

function QuoteDetail({ quote, isWide }: { quote: Quote; isWide: boolean }) {
  return (
    <View style={styles.feature}>
      <View style={styles.featureTop}>
        <View style={styles.featurePill}>
          <Text style={styles.featurePillText}>Frase Nº {String(quote.id).padStart(2, '0')}</Text>
        </View>
        <FavoriteButton quote={quote} onFeature />
      </View>
      <Text style={[styles.featureQuote, isWide && styles.featureQuoteWide]}>“{quote.quote}”</Text>
      <View style={styles.featureAuthorGroup}>
        <View style={styles.featureRule} />
        <Text style={styles.featureAuthor}>{quote.author}</Text>
      </View>
    </View>
  );
}

function QuoteError({ message, isNotFound, onRetry }: { message: string | null; isNotFound: boolean; onRetry: () => void }) {
  const colors = useQuotesColors();
  return (
    <View style={[styles.messageBox, { backgroundColor: colors.surface, borderColor: colors.line }]}>
      <Text style={[styles.messageTitle, { color: colors.ink }]}>
        {isNotFound ? 'Frase não encontrada' : 'Não foi possível carregar a frase'}
      </Text>
      <Text style={[styles.statusText, { color: colors.muted }]} accessibilityLiveRegion="assertive">
        {isNotFound ? 'Confira o número da frase e tente outra.' : message}
      </Text>
      {!isNotFound && (
        <Pressable
          accessibilityRole="button"
          onPress={onRetry}
          style={({ pressed }) => [styles.retryButton, { backgroundColor: colors.feature }, pressed && styles.pressed]}>
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </Pressable>
      )}
    </View>
  );
}

export default function QuoteDetailScreen() {
  const colors = useQuotesColors();
  const { width } = useWindowDimensions();
  const isWide = width >= 760;
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const { quote, isLoading, error, isNotFound, retry } = useQuote(Number(Array.isArray(id) ? id[0] : id));

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={[styles.content, { paddingHorizontal: isWide ? 40 : 20 }]}>
        <QuotesHeader active="explore" />
        <Link href="/" asChild>
          <Pressable accessibilityRole="link" style={({ pressed }) => [styles.back, pressed && styles.pressed]}>
            <Text style={[styles.backText, { color: colors.accent }]}>← Voltar para a coleção</Text>
          </Pressable>
        </Link>

        {isLoading && (
          <View style={styles.status}>
            <ActivityIndicator color={colors.accent} accessibilityLabel="Carregando frase" />
            <Text style={[styles.statusText, { color: colors.muted }]}>Carregando frase…</Text>
          </View>
        )}
        {!isLoading && quote && <QuoteDetail quote={quote} isWide={isWide} />}
        {!isLoading && !quote && <QuoteError message={error} isNotFound={isNotFound} onRetry={retry} />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { width: '100%', maxWidth: 1200, alignSelf: 'center', paddingBottom: 28 },
  back: { minHeight: 44, justifyContent: 'center', alignSelf: 'flex-start', marginTop: 12, marginBottom: 18 },
  backText: { fontSize: 14, fontWeight: '700' },
  feature: { borderRadius: 24, padding: 25, minHeight: 320, justifyContent: 'space-between', backgroundColor: '#233D35' },
  featureTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  featurePill: { borderRadius: 50, borderWidth: 1, borderColor: '#628C74', paddingHorizontal: 12, paddingVertical: 8 },
  featurePillText: { color: '#C7E0CE', fontSize: 10, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' },
  featureQuote: { color: '#FFFFFF', fontSize: 26, lineHeight: 36, fontWeight: '500', letterSpacing: -0.6, maxWidth: 780, marginVertical: 24 },
  featureQuoteWide: { fontSize: 38, lineHeight: 50, marginVertical: 36 },
  featureAuthorGroup: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  featureRule: { width: 18, height: 1, backgroundColor: '#B8CDC1' },
  featureAuthor: { color: '#D3E3D7', fontSize: 15, fontWeight: '500' },
  status: { minHeight: 160, alignItems: 'center', justifyContent: 'center', gap: 12 },
  statusText: { fontSize: 14, lineHeight: 21, textAlign: 'center' },
  messageBox: { borderWidth: 1, borderRadius: 18, padding: 32, alignItems: 'center', gap: 10 },
  messageTitle: { fontSize: 18, fontWeight: '700', textAlign: 'center' },
  retryButton: { minHeight: 44, borderRadius: 22, paddingHorizontal: 20, justifyContent: 'center', marginTop: 8 },
  retryButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  pressed: { opacity: 0.75 },
});
