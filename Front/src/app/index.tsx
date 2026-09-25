import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useRandomQuote } from '@/hooks/use-random-quote';

export default function HomeScreen() {
  const { quote, isLoading, error, refresh } = useRandomQuote();

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.container}>
          <Text style={styles.brand}>QUOTES</Text>
          <Text style={styles.title}>Frase do dia</Text>
          <Text style={styles.description}>
            Toque no botão para buscar uma nova frase.
          </Text>
          <View style={styles.card}>
            <Text style={styles.label}>FRASE ALEATÓRIA</Text>
            {isLoading && !quote ? (
              <ActivityIndicator color="#4654C0" size="large" accessibilityLabel="Carregando frase" />
            ) : quote ? (
              <>
                <Text style={styles.quote} accessibilityLiveRegion="polite">
                  “{quote.quote}”
                </Text>
                <Text style={styles.caption}>— {quote.author}</Text>
              </>
            ) : null}
            {error ? (
              <Text style={styles.error} accessibilityLiveRegion="assertive">
                {error}
              </Text>
            ) : null}
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ busy: isLoading, disabled: isLoading }}
            disabled={isLoading}
            onPress={refresh}
            style={({ pressed }) => [styles.button, (pressed || isLoading) && styles.pressed]}>
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>{error ? 'Tentar de novo' : 'Nova frase'}</Text>
            )}
          </Pressable>
          <Text style={styles.footer}>Frases fornecidas pela API DummyJSON.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4F6FB' },
  content: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  container: { width: '100%', maxWidth: 460, alignSelf: 'center' },
  brand: { color: '#4654C0', fontSize: 13, fontWeight: '800', letterSpacing: 4, marginBottom: 20 },
  title: { color: '#18213B', fontSize: 34, fontWeight: '800', marginBottom: 12 },
  description: { color: '#556078', fontSize: 17, lineHeight: 26, marginBottom: 28 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 28, marginBottom: 24, minHeight: 160 },
  label: { color: '#68728A', fontSize: 11, fontWeight: '700', letterSpacing: 2, marginBottom: 20 },
  quote: { color: '#18213B', fontSize: 25, fontWeight: '600', lineHeight: 36, marginBottom: 24 },
  caption: { color: '#68728A', fontSize: 13, lineHeight: 20 },
  error: { color: '#B3261E', fontSize: 14, lineHeight: 22, marginTop: 12 },
  button: { backgroundColor: '#4654C0', borderRadius: 16, padding: 18, alignItems: 'center' },
  pressed: { opacity: 0.8 },
  buttonText: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
  footer: { color: '#68728A', fontSize: 12, lineHeight: 20, textAlign: 'center', marginTop: 32 },
});
