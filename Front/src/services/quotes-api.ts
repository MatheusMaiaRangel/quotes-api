import { isQuote, isQuotesPage, type Quote, type QuotesPage } from '@/models/quote';
import { getJson } from '@/services/api-client';
import { translateQuote } from '@/services/quote-translations';

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

function toSafeInteger(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(Math.trunc(value), min), max);
}

export async function getQuotes(limit = DEFAULT_PAGE_SIZE, skip = 0): Promise<QuotesPage> {
  const safeLimit = toSafeInteger(limit, 1, MAX_PAGE_SIZE);
  const safeSkip = toSafeInteger(skip, 0, Number.MAX_SAFE_INTEGER);
  const page = await getJson(`/quotes?limit=${safeLimit}&skip=${safeSkip}`, isQuotesPage);
  return { ...page, quotes: page.quotes.map(translateQuote) };
}

export async function getQuoteById(id: number): Promise<Quote> {
  const safeId = toSafeInteger(id, 1, Number.MAX_SAFE_INTEGER);
  return translateQuote(await getJson(`/quotes/${safeId}`, isQuote));
}

export async function getRandomQuote(): Promise<Quote> {
  return translateQuote(await getJson('/quotes/random', isQuote));
}
