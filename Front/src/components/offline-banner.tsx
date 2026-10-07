import { StyleSheet, Text, View } from 'react-native';

import { useQuotesColors } from '@/constants/quotes-theme';

// Aparece quando a API falhou e a tela está mostrando as frases salvas no aparelho.
export function OfflineBanner({ savedAt }: { savedAt: string }) {
  const colors = useQuotesColors();
  const savedDate = new Date(savedAt).toLocaleDateString('pt-BR');

  return (
    <View style={[styles.banner, { backgroundColor: colors.soft, borderColor: colors.line }]}>
      <Text style={[styles.text, { color: colors.ink }]} accessibilityLiveRegion="polite">
        Você está offline. Mostrando as frases salvas em {savedDate}.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 18 },
  text: { fontSize: 13, lineHeight: 19, fontWeight: '600' },
});
