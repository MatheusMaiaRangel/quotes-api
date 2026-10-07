import type { Quote } from '@/models/quote';

const NUMBER_SEARCH = /^#?\d+$/;

function normalize(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

export function isNumberSearch(search: string) {
  return NUMBER_SEARCH.test(search.trim());
}

// Busca por número ("2" ou "#2") ou por trecho do autor/frase, sem acentos.
export function filterQuotes(quotes: Quote[], search: string): Quote[] {
  const query = normalize(search.trim());

  if (isNumberSearch(query)) {
    const quoteId = Number(query.replace('#', ''));
    return quotes.filter((quote) => quote.id === quoteId);
  }

  return quotes.filter((quote) => normalize(quote.author).includes(query) || normalize(quote.quote).includes(query));
}
