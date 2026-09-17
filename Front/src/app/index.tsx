import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const phrases = [
  'Todo grande projeto começa com um pequeno passo.',
  'Um passo de cada vez também é progresso.',
  'Hoje é um bom dia para aprender algo novo.',
];

export default function HomeScreen() {
  const [touches, setTouches] = useState(0);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.container}>
          <Text style={styles.brand}>QUOTES</Text>
          <Text style={styles.title}>Olá! O app abriu.</Text>
          <Text style={styles.description}>
            Toque no botão para trocar a frase e testar seu aplicativo.
          </Text>
          <View style={styles.card}>
            <Text style={styles.label}>FRASE DO DIA</Text>
            <Text style={styles.quote} accessibilityLiveRegion="polite">
              {phrases[touches % phrases.length]}
            </Text>
            <Text style={styles.caption}>Uma pequena dose de inspiração.</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => setTouches((current) => current + 1)}
            style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
            <Text style={styles.buttonText}>Trocar frase</Text>
          </Pressable>
          <Text style={styles.counter} accessibilityLiveRegion="polite">
            {touches === 0
              ? 'Vamos testar o primeiro toque?'
              : `Funcionou! ${touches} ${touches === 1 ? 'toque' : 'toques'} no botão.`}
          </Text>
          <Text style={styles.footer}>As frases de demonstração funcionam sem internet.</Text>
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
  card: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 28, marginBottom: 24 },
  label: { color: '#68728A', fontSize: 11, fontWeight: '700', letterSpacing: 2, marginBottom: 20 },
  quote: { color: '#18213B', fontSize: 25, fontWeight: '600', lineHeight: 36, marginBottom: 24 },
  caption: { color: '#68728A', fontSize: 13, lineHeight: 20 },
  button: { backgroundColor: '#4654C0', borderRadius: 16, padding: 18, alignItems: 'center' },
  pressed: { opacity: 0.8 },
  buttonText: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
  counter: { color: '#4654C0', fontSize: 14, lineHeight: 22, textAlign: 'center', marginTop: 18 },
  footer: { color: '#68728A', fontSize: 12, lineHeight: 20, textAlign: 'center', marginTop: 32 },
});
