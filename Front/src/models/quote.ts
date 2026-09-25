export type Quote = {
  id: number;
  quote: string;
  author: string;
};

export type QuotesPage = {
  quotes: Quote[];
  total: number;
  skip: number;
  limit: number;
};

export function isQuote(value: unknown): value is Quote {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === 'number' &&
    typeof candidate.quote === 'string' &&
    typeof candidate.author === 'string'
  );
}

export function isQuotesPage(value: unknown): value is QuotesPage {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    Array.isArray(candidate.quotes) &&
    candidate.quotes.every(isQuote) &&
    typeof candidate.total === 'number' &&
    typeof candidate.skip === 'number' &&
    typeof candidate.limit === 'number'
  );
}
