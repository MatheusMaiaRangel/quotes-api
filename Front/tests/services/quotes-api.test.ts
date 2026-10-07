import { getAllQuotes, getQuoteById, getQuotes, getRandomQuote } from '@/services/quotes-api';
import { ApiError } from '@/services/api-client';
import { jsonResponse, makePage, makeQuote, QUOTE_EN } from '../helpers/fixtures';

const fetchMock = jest.fn();

beforeEach(() => {
  fetchMock.mockReset();
  globalThis.fetch = fetchMock;
});

function calledUrl() {
  return fetchMock.mock.calls[0][0] as string;
}

describe('getQuotes', () => {
  it('usa 20 por página e começa do zero por padrão', async () => {
    fetchMock.mockResolvedValue(jsonResponse(makePage([QUOTE_EN])));

    const page = await getQuotes();

    expect(calledUrl()).toBe('https://dummyjson.com/quotes?limit=20&skip=0');
    expect(page.quotes).toEqual([QUOTE_EN]);
  });

  it.each([
    [500, 10, 'limit=100&skip=10'],
    [0, -5, 'limit=1&skip=0'],
    [Number.NaN, Number.NaN, 'limit=1&skip=0'],
    [5.9, 2.7, 'limit=5&skip=2'],
  ])('corrige limit=%p e skip=%p para valores seguros', async (limit, skip, expected) => {
    fetchMock.mockResolvedValue(jsonResponse(makePage([])));
    await getQuotes(limit, skip);
    expect(calledUrl()).toContain(expected);
  });

  it('aplica a tradução nas frases da página', async () => {
    fetchMock.mockResolvedValue(jsonResponse(makePage([makeQuote({ id: 1, quote: 'english' })])));
    const page = await getQuotes();
    expect(page.quotes[0].quote).not.toBe('english');
  });
});

describe('getAllQuotes', () => {
  it('pede a coleção inteira com limit=0', async () => {
    fetchMock.mockResolvedValue(jsonResponse(makePage([QUOTE_EN])));

    await expect(getAllQuotes()).resolves.toEqual([QUOTE_EN]);
    expect(calledUrl()).toBe('https://dummyjson.com/quotes?limit=0');
  });
});

describe('getQuoteById', () => {
  it('busca a frase pelo id', async () => {
    fetchMock.mockResolvedValue(jsonResponse(QUOTE_EN));

    await expect(getQuoteById(9001)).resolves.toEqual(QUOTE_EN);
    expect(calledUrl()).toBe('https://dummyjson.com/quotes/9001');
  });

  it('nunca manda id menor que 1', async () => {
    fetchMock.mockResolvedValue(jsonResponse(QUOTE_EN));
    await getQuoteById(-3);
    expect(calledUrl()).toBe('https://dummyjson.com/quotes/1');
  });

  it('repassa o erro "not-found" da API', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ message: 'not found' }, 404));
    await expect(getQuoteById(99999)).rejects.toMatchObject({ kind: 'not-found' } satisfies Partial<ApiError>);
  });
});

describe('getRandomQuote', () => {
  it('busca uma frase aleatória', async () => {
    fetchMock.mockResolvedValue(jsonResponse(QUOTE_EN));

    await expect(getRandomQuote()).resolves.toEqual(QUOTE_EN);
    expect(calledUrl()).toBe('https://dummyjson.com/quotes/random');
  });
});
