import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { Quote } from '@/models/quote';
import { toErrorMessage } from '@/services/api-client';
import { getAllQuotes } from '@/services/quotes-api';

function normalizeSearch(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

export default function HomeScreen() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [search, setSearch] = useState('');
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
        if (active) setQuotes(allQuotes);
      } catch (loadError) {
        if (active) setError(toErrorMessage(loadError));
      } finally {
        if (active) setIsLoading(false);
      }
    }
    void loadQuotes();
    return () => { active = false; };
  }, [attempt]);

  const filteredQuotes = useMemo(() => {
    const query = normalizeSearch(search.trim());
    return quotes.filter((quote) =>
      normalizeSearch(quote.author).includes(query) || normalizeSearch(quote.quote).includes(query)
    );
  }, [quotes, search]);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.brand}>QUOTES</Text>
        <Text style={styles.title}>Todas as frases</Text>
        <Text style={styles.description}>Explore as frases e encontre seus autores favoritos.</Text>
        <Text style={styles.searchLabel}>Pesquisar por autor ou frase</Text>
        <TextInput
          accessibilityLabel="Pesquisar por nome do autor ou texto da frase"
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Digite um autor ou trecho da frase"
          placeholderTextColor="#68728A"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
        {isLoading ? (
          <View style={styles.status}>
            <ActivityIndicator color="#4654C0" size="large" accessibilityLabel="Carregando frases" />
            <Text style={styles.description}>Carregando todas as frases…</Text>
          </View>
        ) : error ? (
          <View style={styles.status}>
            <Text style={styles.error} accessibilityLiveRegion="assertive">{error}</Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => setAttempt((current) => current + 1)}
              style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
              <Text style={styles.buttonText}>Tentar de novo</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <Text style={styles.count} accessibilityLiveRegion="polite">
              {filteredQuotes.length} de {quotes.length} frases
            </Text>
            <View style={styles.table}>
              <View style={[styles.row, styles.tableHeader]}>
                <Text accessibilityRole="header" style={[styles.quoteCell, styles.heading]}>Frase</Text>
                <Text accessibilityRole="header" style={[styles.authorCell, styles.heading]}>Autor</Text>
              </View>
              <FlatList
                data={filteredQuotes}
                keyExtractor={(item) => String(item.id)}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                renderItem={({ item, index }) => (
                  <View style={[styles.row, index % 2 === 1 && styles.alternateRow]}>
                    <Text style={[styles.quoteCell, styles.cell]}>{item.quote}</Text>
                    <Text style={[styles.authorCell, styles.cell]}>{item.author}</Text>
                  </View>
                )}
                ListEmptyComponent={
                  <Text style={styles.empty}>
                    {quotes.length === 0 ? 'Nenhuma frase disponível.' : 'Nenhuma frase encontrada para essa pesquisa.'}
                  </Text>
                }
              />
            </View>
          </>
        )}
        <Text style={styles.footer}>Frases fornecidas pela API DummyJSON.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4F6FB' },
  container: { flex: 1, width: '100%', maxWidth: 1100, alignSelf: 'center', padding: 16 },
  brand: { color: '#4654C0', fontSize: 13, fontWeight: '800', letterSpacing: 4, marginBottom: 12 },
  title: { color: '#18213B', fontSize: 30, fontWeight: '800', marginBottom: 8 },
  description: { color: '#556078', fontSize: 15, lineHeight: 22, marginBottom: 16 },
  searchLabel: { color: '#18213B', fontSize: 14, fontWeight: '600', marginBottom: 8 },
  searchInput: {
    backgroundColor: '#FFFFFF', borderColor: '#D7DDEA', borderWidth: 1,
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, color: '#18213B',
  },
  count: { color: '#68728A', fontSize: 13, marginVertical: 12 },
  table: { flex: 1, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D7DDEA', borderRadius: 12, overflow: 'hidden' },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E4E8F0' },
  tableHeader: { backgroundColor: '#E9ECF8' },
  heading: { color: '#18213B', fontSize: 14, fontWeight: '700', padding: 10 },
  cell: { color: '#18213B', fontSize: 14, lineHeight: 21, padding: 10 },
  // idCell: { width: 48 },
  quoteCell: { flex: 3, borderLeftWidth: 1, borderLeftColor: '#E4E8F0' },
  authorCell: { flex: 1.5, borderLeftWidth: 1, borderLeftColor: '#E4E8F0' },
  alternateRow: { backgroundColor: '#F8F9FC' },
  status: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 },
  error: { color: '#B3261E', fontSize: 14, lineHeight: 22, textAlign: 'center' },
  button: { backgroundColor: '#4654C0', borderRadius: 12, paddingHorizontal: 24, paddingVertical: 14 },
  pressed: { opacity: 0.8 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  empty: { color: '#68728A', padding: 24, textAlign: 'center', lineHeight: 22 },
  footer: { color: '#68728A', fontSize: 12, textAlign: 'center', marginTop: 12 },
});
