import type { Quote } from '@/models/quote';
import { ApiError } from '@/services/api-client';
import { getAllQuotes, getQuoteById } from '@/services/quotes-api';
import { readCachedQuotes, saveCachedQuotes } from '@/services/quotes-cache';

export type LoadedQuotes = {
  quotes: Quote[];
  isOffline: boolean;
  savedAt: string | null;
};

// Online: busca na API e atualiza o cache em segundo plano. Offline/erro: usa o cache.
// Sem cache, repassa o erro original para a tela mostrar a mensagem certa.
export async function loadAllQuotes(): Promise<LoadedQuotes> {
  try {
    const quotes = await getAllQuotes();
    void saveCachedQuotes(quotes);
    return { quotes, isOffline: false, savedAt: null };
  } catch (error) {
    const cached = await readCachedQuotes();
    if (!cached) throw error;
    console.warn('[quotes] usando frases salvas', error);
    return { quotes: cached.quotes, isOffline: true, savedAt: cached.savedAt };
  }
}

// Detalhe por id (GET /quotes/:id). Se a API falhar, procura a frase no cache.
// "Não encontrada" é resposta da API, então não cai no cache.
export async function loadQuoteById(id: number): Promise<Quote> {
  try {
    return await getQuoteById(id);
  } catch (error) {
    if (error instanceof ApiError && error.kind === 'not-found') throw error;
    const cached = await readCachedQuotes();
    const quote = cached?.quotes.find((item) => item.id === id);
    if (!quote) throw error;
    return quote;
  }
}
