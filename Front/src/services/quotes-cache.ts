import AsyncStorage from '@react-native-async-storage/async-storage';

import { isQuote, type Quote } from '@/models/quote';

const STORAGE_KEY = '@quotes/cache/v1';

export type CachedQuotes = { quotes: Quote[]; savedAt: string };

function isCachedQuotes(value: unknown): value is CachedQuotes {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return Array.isArray(candidate.quotes) && candidate.quotes.every(isQuote) && typeof candidate.savedAt === 'string';
}

// Guarda a última coleção que veio da API para o app funcionar sem internet.
// Lista vazia não sobrescreve um cache bom.
export async function saveCachedQuotes(quotes: Quote[], now = new Date()): Promise<void> {
  if (quotes.length === 0) return;
  const cache: CachedQuotes = { quotes, savedAt: now.toISOString() };
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.warn('[quotes-cache] falha ao salvar frases', error);
  }
}

export async function readCachedQuotes(): Promise<CachedQuotes | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isCachedQuotes(parsed) ? parsed : null;
  } catch (error) {
    console.warn('[quotes-cache] falha ao ler frases salvas', error);
    return null;
  }
}
