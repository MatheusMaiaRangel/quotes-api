import translations from '@/data/quote-translations.json';
import type { Quote } from '@/models/quote';

const TRANSLATIONS: Readonly<Record<string, string>> = translations;

// A DummyJSON só tem frases em inglês. Quando não houver tradução para o id,
// mantém o texto original para nunca quebrar a tela.
export function translateQuote(quote: Quote): Quote {
  const translated = TRANSLATIONS[String(quote.id)];
  return translated ? { ...quote, quote: translated } : quote;
}
