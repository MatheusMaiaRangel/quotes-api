import '@/global.css';

import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput,
  useWindowDimensions, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FavoriteButton } from '@/components/favorite-button';
import { QuoteCard } from '@/components/quote-card';
import { QuotesHeader } from '@/components/quotes-header';
import { useQuotesColors } from '@/constants/quotes-theme';
import type { Quote } from '@/models/quote';
import { toErrorMessage } from '@/services/api-client';
import { getAllQuotes } from '@/services/quotes-api';
import { filterQuotes, isNumberSearch } from '@/utils/filter-quotes';

export default function HomeScreen() {
  const colors = useQuotesColors();
  const { width } = useWindowDimensions();
  const isWide = width >= 760;
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(24);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    async function loadQuotes() {
      setIsLoading(true);
      setError(null);
      try {
        const allQuotes = await getAllQuotes();
        if (active) {
          setQuotes(allQuotes);
          setFeaturedIndex(0);
        }
      } catch (loadError) {
        if (active) setError(toErrorMessage(loadError));
      } finally {
        if (active) setIsLoading(false);
      }
    }
    void loadQuotes();
    return () => { active = false; };
  }, [attempt]);

  const filteredQuotes = useMemo(() => filterQuotes(quotes, search), [quotes, search]);

  const featuredQuote = quotes[featuredIndex];
  const visibleQuotes = filteredQuotes.slice(0, visibleCount);
  const showAnotherQuote = () => {
    if (quotes.length < 2) return;
    setFeaturedIndex((current) => (current + 1 + Math.floor(Math.random() * (quotes.length - 1))) % quotes.length);
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.list}
        contentContainerStyle={[styles.content, { paddingHorizontal: isWide ? 40 : 20 }]}
        keyboardShouldPersistTaps="handled">
          <View>
            <QuotesHeader active="explore" />

            <View style={[styles.intro, isWide && styles.introWide]}>
              <View style={styles.introCopy}>
                <View style={[styles.eyebrowLine, { backgroundColor: colors.accent }]} />
                <Text style={[styles.eyebrow, { color: colors.accent }]}>INSPIRAÇÃO PARA TODOS OS DIAS</Text>
              </View>
              <Text style={[styles.title, isWide && styles.titleWide, { color: colors.ink }]}>Palavras que{'\n'}ficam com você.</Text>
              <Text style={[styles.subtitle, { color: colors.muted }]}>
                Pequenas ideias, grandes perspectivas. Encontre a frase certa para o seu momento.
              </Text>
            </View>

            <View style={[styles.feature, { backgroundColor: colors.feature }]}>
              <View style={styles.featureTop}>
                <View style={styles.featurePill}>
                  <Text style={styles.featurePillText}>EM DESTAQUE{featuredQuote ? ` · Nº ${featuredQuote.id}` : ''}</Text>
                </View>
                {featuredQuote ? <FavoriteButton quote={featuredQuote} onFeature /> : <Text style={styles.featureMark}>“</Text>}
              </View>
              {featuredQuote ? (
                <>
                  <Text style={[styles.featureQuote, isWide && styles.featureQuoteWide]}>“{featuredQuote.quote}”</Text>
                  <View style={styles.featureBottom}>
                    <View style={styles.featureAuthorGroup}>
                      <View style={styles.featureRule} />
                      <Text style={styles.featureAuthor}>{featuredQuote.author}</Text>
                    </View>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Mostrar outra frase em destaque"
                      disabled={quotes.length < 2}
                      onPress={showAnotherQuote}
                      style={({ pressed }) => [styles.anotherButton, pressed && styles.pressed]}>
                      <Text style={styles.anotherButtonText}>Outra frase  ↗</Text>
                    </Pressable>
                  </View>
                </>
              ) : (
                <Text style={styles.featurePlaceholder}>
                  {isLoading ? 'Uma boa frase está a caminho…' : 'Inspiração para o seu dia.'}
                </Text>
              )}
            </View>

            <View style={styles.libraryHeader}>
              <View>
                <Text style={[styles.sectionKicker, { color: colors.accent }]}>EXPLORE A COLEÇÃO</Text>
                <Text style={[styles.sectionTitle, { color: colors.ink }]}>Todas as frases</Text>
              </View>
              {!isLoading && !error && (
                <Text style={[styles.count, { color: colors.muted }]} accessibilityLiveRegion="polite">
                  {filteredQuotes.length} {filteredQuotes.length === 1 ? 'frase' : 'frases'}
                </Text>
              )}
            </View>

            <View testID="quote-search" style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.line }]}>
              <Text style={[styles.searchIcon, { color: colors.muted }]}>⌕</Text>
              <TextInput
                accessibilityLabel="Pesquisar por número, autor ou texto da frase"
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Número, autor ou palavra-chave"
                placeholderTextColor={colors.muted}
                value={search}
                onChangeText={(value) => { setSearch(value); setVisibleCount(24); }}
                style={[styles.searchInput, { color: colors.ink }]}
              />
              {search.length > 0 && (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Limpar pesquisa"
                  onPress={() => { setSearch(''); setVisibleCount(24); }}
                  style={({ pressed }) => [styles.clearButton, { backgroundColor: colors.soft }, pressed && styles.pressed]}>
                  <Text style={[styles.clearText, { color: colors.muted }]}>×</Text>
                </Pressable>
              )}
            </View>

            {isLoading && (
              <View style={styles.status}>
                <ActivityIndicator color={colors.accent} accessibilityLabel="Carregando frases" />
                <Text style={[styles.statusText, { color: colors.muted }]}>Carregando frases…</Text>
              </View>
            )}
            {error && !isLoading && (
              <View style={[styles.messageBox, { backgroundColor: colors.surface, borderColor: colors.line }]}>
                <Text style={[styles.messageTitle, { color: colors.ink }]}>Não foi possível carregar as frases</Text>
                <Text style={[styles.statusText, { color: colors.muted }]} accessibilityLiveRegion="assertive">{error}</Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setAttempt((current) => current + 1)}
                  style={({ pressed }) => [styles.retryButton, { backgroundColor: colors.feature }, pressed && styles.pressed]}>
                  <Text style={styles.retryButtonText}>Tentar novamente</Text>
                </Pressable>
              </View>
            )}
          </View>
        {!isLoading && !error && (
          <View style={[styles.cards, isWide && styles.cardsWide]}>
            {visibleQuotes.map((item) => (
              <View key={item.id} style={[styles.cardSlot, isWide && styles.cardSlotWide]}>
                <QuoteCard quote={item} />
              </View>
            ))}
          </View>
        )}
        {!isLoading && !error && filteredQuotes.length === 0 && (
          <View style={[styles.messageBox, { backgroundColor: colors.surface, borderColor: colors.line }]}>
            <Text style={[styles.messageTitle, { color: colors.ink }]}>
              {quotes.length === 0 ? 'Ainda não há frases por aqui' : 'Nenhuma frase encontrada'}
            </Text>
            <Text style={[styles.statusText, { color: colors.muted }]}>
              {quotes.length === 0
                ? 'Tente novamente em instantes.'
                : isNumberSearch(search)
                  ? 'Confira o número da frase e tente novamente.'
                  : 'Tente buscar por outro autor ou palavra.'}
            </Text>
          </View>
        )}
        {!isLoading && !error && visibleCount < filteredQuotes.length && (
          <Pressable
            accessibilityRole="button"
            onPress={() => setVisibleCount((current) => current + 24)}
            style={({ pressed }) => [styles.moreButton, { borderColor: colors.line, backgroundColor: colors.surface }, pressed && styles.pressed]}>
            <Text style={[styles.moreButtonText, { color: colors.ink }]}>Ver mais frases</Text>
          </Pressable>
        )}
          <View style={[styles.footer, { borderTopColor: colors.line }]}>
            <Text style={[styles.footerBrand, { color: colors.ink }]}>quotes<Text style={{ color: colors.accent }}>.</Text></Text>
            <Text style={[styles.footerCredit, { color: colors.muted }]}>Frases fornecidas pela API DummyJSON</Text>
          </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  list: { flex: 1 },
  content: { width: '100%', maxWidth: 1200, alignSelf: 'center', paddingBottom: 28 },
  cards: { width: '100%' },
  cardsWide: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -8, width: undefined },
  intro: { paddingTop: 42, paddingBottom: 34 },
  introWide: { paddingTop: 72, paddingBottom: 48 },
  introCopy: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 18 },
  eyebrowLine: { width: 24, height: 2, borderRadius: 1 },
  eyebrow: { fontSize: 11, fontWeight: '700', letterSpacing: 1.7 },
  title: { fontSize: 39, lineHeight: 44, fontWeight: '700', letterSpacing: -2.1 },
  titleWide: { fontSize: 62, lineHeight: 66, letterSpacing: -3.6 },
  subtitle: { maxWidth: 500, fontSize: 16, lineHeight: 25, marginTop: 18 },
  feature: { borderRadius: 24, padding: 25, minHeight: 260, justifyContent: 'space-between', overflow: 'hidden' },
  featureTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  featurePill: { borderRadius: 50, borderWidth: 1, borderColor: '#628C74', paddingHorizontal: 12, paddingVertical: 8 },
  featurePillText: { color: '#C7E0CE', fontSize: 10, fontWeight: '700', letterSpacing: 1.5 },
  featureMark: { color: '#527563', fontSize: 86, lineHeight: 75, fontWeight: '700' },
  featureQuote: { color: '#FFFFFF', fontSize: 24, lineHeight: 34, fontWeight: '500', letterSpacing: -0.6, maxWidth: 780, marginVertical: 18 },
  featureQuoteWide: { fontSize: 34, lineHeight: 46, marginVertical: 28 },
  featurePlaceholder: { color: '#D1E3D5', fontSize: 24, lineHeight: 34, marginVertical: 30 },
  featureBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' },
  featureAuthorGroup: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  featureRule: { width: 18, height: 1, backgroundColor: '#B8CDC1' },
  featureAuthor: { color: '#D3E3D7', fontSize: 14, fontWeight: '500' },
  anotherButton: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 16, borderRadius: 22, backgroundColor: '#FFFFFF' },
  anotherButtonText: { color: '#233D35', fontSize: 13, fontWeight: '700' },
  libraryHeader: { marginTop: 62, marginBottom: 20, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 },
  sectionKicker: { fontSize: 11, fontWeight: '700', letterSpacing: 1.6, marginBottom: 8 },
  sectionTitle: { fontSize: 29, lineHeight: 36, fontWeight: '700', letterSpacing: -1 },
  count: { fontSize: 13, marginBottom: 5 },
  searchBox: { minHeight: 58, borderWidth: 1, borderRadius: 16, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 17, marginBottom: 18 },
  searchIcon: { fontSize: 28, lineHeight: 30, marginRight: 10, marginTop: -4 },
  searchInput: { flex: 1, minHeight: 54, fontSize: 15 },
  clearButton: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  clearText: { fontSize: 22, lineHeight: 25 },
  cardSlot: { width: '100%', paddingBottom: 16 },
  cardSlotWide: { width: '50%', paddingHorizontal: 8 },
  status: { minHeight: 160, alignItems: 'center', justifyContent: 'center', gap: 12 },
  statusText: { fontSize: 14, lineHeight: 21, textAlign: 'center' },
  messageBox: { borderWidth: 1, borderRadius: 18, padding: 32, alignItems: 'center', gap: 10, marginBottom: 16 },
  messageTitle: { fontSize: 18, fontWeight: '700', textAlign: 'center' },
  retryButton: { minHeight: 44, borderRadius: 22, paddingHorizontal: 20, justifyContent: 'center', marginTop: 8 },
  retryButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  pressed: { opacity: 0.75 },
  moreButton: { minHeight: 48, borderWidth: 1, borderRadius: 24, paddingHorizontal: 24, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  moreButtonText: { fontSize: 14, fontWeight: '700' },
  footer: { borderTopWidth: 1, marginTop: 42, paddingTop: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' },
  footerBrand: { fontSize: 18, fontWeight: '700', letterSpacing: -0.7 },
  footerCredit: { fontSize: 12 },
});
