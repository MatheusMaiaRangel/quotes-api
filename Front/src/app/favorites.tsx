import { Link } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { QuoteCard } from '@/components/quote-card';
import { QuotesHeader } from '@/components/quotes-header';
import { useQuotesColors } from '@/constants/quotes-theme';
import { useFavorites } from '@/contexts/favorites-context';

export default function FavoritesScreen() {
  const colors = useQuotesColors();
  const { favorites, isReady } = useFavorites();
  const { width } = useWindowDimensions();
  const isWide = width >= 760;
  const [visibleCount, setVisibleCount] = useState(24);
  const visibleFavorites = favorites.slice(0, visibleCount);

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingHorizontal: isWide ? 40 : 20 }]}>
        <QuotesHeader active="favorites" />

        <View style={[styles.intro, isWide && styles.introWide]}>
          <View style={styles.introCopy}>
            <View style={[styles.eyebrowLine, { backgroundColor: colors.accent }]} />
            <Text style={[styles.eyebrow, { color: colors.accent }]}>GUARDADAS POR VOCÊ</Text>
          </View>
          <Text style={[styles.title, isWide && styles.titleWide, { color: colors.ink }]}>Frases que você quer guardar.</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Suas palavras favoritas, sempre ao seu alcance.
          </Text>
        </View>

        {isReady ? (
          favorites.length > 0 ? (
            <>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.ink }]}>Curtidas</Text>
                <Text style={[styles.count, { color: colors.muted }]}>
                  {favorites.length} {favorites.length === 1 ? 'frase' : 'frases'}
                </Text>
              </View>
              <View style={[styles.cards, isWide && styles.cardsWide]}>
                {visibleFavorites.map((quote) => (
                  <View key={quote.id} style={[styles.cardSlot, isWide && styles.cardSlotWide]}>
                    <QuoteCard quote={quote} />
                  </View>
                ))}
              </View>
              {visibleCount < favorites.length && (
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setVisibleCount((current) => current + 24)}
                  style={({ pressed }) => [
                    styles.moreButton,
                    { borderColor: colors.line, backgroundColor: colors.surface },
                    pressed && styles.pressed,
                  ]}>
                  <Text style={[styles.moreButtonText, { color: colors.ink }]}>Ver mais frases</Text>
                </Pressable>
              )}
            </>
          ) : (
            <View style={[styles.empty, { backgroundColor: colors.surface, borderColor: colors.line }]}>
              <View style={[styles.emptyIcon, { backgroundColor: colors.soft }]}>
                <Text style={[styles.emptyHeart, { color: colors.accent }]}>♡</Text>
              </View>
              <Text style={[styles.emptyTitle, { color: colors.ink }]}>Sua coleção começa aqui</Text>
              <Text style={[styles.emptyDescription, { color: colors.muted }]}>
                Toque no coração de uma frase para guardá-la nesta página.
              </Text>
              <Link href="/" asChild>
                <Pressable style={StyleSheet.flatten([styles.exploreButton, { backgroundColor: colors.feature }])}>
                  <Text style={styles.exploreButtonText}>Explorar frases</Text>
                </Pressable>
              </Link>
            </View>
          )
        ) : (
          <View style={styles.loading}>
            <ActivityIndicator color={colors.accent} accessibilityLabel="Carregando frases curtidas" />
          </View>
        )}

        <View style={[styles.footer, { borderTopColor: colors.line }]}>
          <Text style={[styles.footerBrand, { color: colors.ink }]}>quotes<Text style={{ color: colors.accent }}>.</Text></Text>
          <Text style={[styles.footerCredit, { color: colors.muted }]}>Suas frases favoritas</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: { flex: 1 },
  content: { width: '100%', maxWidth: 1200, alignSelf: 'center', paddingBottom: 28 },
  intro: { paddingTop: 42, paddingBottom: 50 },
  introWide: { paddingTop: 72, paddingBottom: 64 },
  introCopy: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 18 },
  eyebrowLine: { width: 24, height: 2, borderRadius: 1 },
  eyebrow: { fontSize: 11, fontWeight: '700', letterSpacing: 1.7 },
  title: { maxWidth: 800, fontSize: 39, lineHeight: 44, fontWeight: '700', letterSpacing: -2.1 },
  titleWide: { fontSize: 62, lineHeight: 66, letterSpacing: -3.6 },
  subtitle: { maxWidth: 500, fontSize: 16, lineHeight: 25, marginTop: 18 },
  sectionHeader: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, marginBottom: 20 },
  sectionTitle: { fontSize: 29, lineHeight: 36, fontWeight: '700', letterSpacing: -1 },
  count: { fontSize: 13, marginBottom: 5 },
  cards: { width: '100%' },
  cardsWide: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -8, width: undefined },
  cardSlot: { width: '100%', paddingBottom: 16 },
  cardSlotWide: { width: '50%', paddingHorizontal: 8 },
  empty: { minHeight: 300, borderWidth: 1, borderRadius: 24, padding: 32, alignItems: 'center', justifyContent: 'center' },
  emptyIcon: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  emptyHeart: { fontSize: 40, lineHeight: 46 },
  emptyTitle: { fontSize: 22, fontWeight: '700', textAlign: 'center', letterSpacing: -0.5 },
  emptyDescription: { maxWidth: 330, fontSize: 15, lineHeight: 23, textAlign: 'center', marginTop: 10 },
  exploreButton: { minHeight: 46, borderRadius: 23, paddingHorizontal: 22, alignItems: 'center', justifyContent: 'center', marginTop: 24 },
  exploreButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  loading: { minHeight: 220, alignItems: 'center', justifyContent: 'center' },
  moreButton: { minHeight: 48, borderWidth: 1, borderRadius: 24, paddingHorizontal: 24, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  moreButtonText: { fontSize: 14, fontWeight: '700' },
  pressed: { opacity: 0.75 },
  footer: { borderTopWidth: 1, marginTop: 42, paddingTop: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' },
  footerBrand: { fontSize: 18, fontWeight: '700', letterSpacing: -0.7 },
  footerCredit: { fontSize: 12 },
});
