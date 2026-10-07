import type { Quote, QuotesPage } from '@/models/quote';

export const QUOTE_EN: Quote = { id: 9001, quote: 'Stay hungry, stay foolish.', author: 'Steve Jobs' };

export function makeQuote(overrides: Partial<Quote> = {}): Quote {
  return { ...QUOTE_EN, ...overrides };
}

export function makePage(quotes: Quote[], overrides: Partial<QuotesPage> = {}): QuotesPage {
  return { quotes, total: quotes.length, skip: 0, limit: quotes.length, ...overrides };
}

export function jsonResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  } as Response;
}

// Promessa controlada pelo teste: permite ver o estado "carregando" antes da resposta chegar.
export function deferred<T>() {
  let resolve: (value: T) => void = () => undefined;
  let reject: (reason: unknown) => void = () => undefined;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}
