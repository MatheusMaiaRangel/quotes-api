import AsyncStorage from '@react-native-async-storage/async-storage';

import { readCachedQuotes, saveCachedQuotes } from '@/services/quotes-cache';
import { makeQuote } from '../helpers/fixtures';

const STORAGE_KEY = '@quotes/cache/v1';
const quotes = [makeQuote({ id: 1 }), makeQuote({ id: 2 })];
const NOW = new Date('2026-10-07T12:00:00.000Z');

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.spyOn(console, 'warn').mockImplementation(() => undefined);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('cache de frases', () => {
  it('devolve null quando nunca salvou nada', async () => {
    await expect(readCachedQuotes()).resolves.toBeNull();
  });

  it('salva e lê de volta as frases com a data em que foram salvas', async () => {
    await saveCachedQuotes(quotes, NOW);

    await expect(readCachedQuotes()).resolves.toEqual({ quotes, savedAt: NOW.toISOString() });
  });

  it('não salva lista vazia para não apagar um cache bom', async () => {
    await saveCachedQuotes(quotes, NOW);
    await saveCachedQuotes([], NOW);

    await expect(readCachedQuotes()).resolves.toEqual({ quotes, savedAt: NOW.toISOString() });
  });

  it.each([
    ['JSON quebrado', '{quebrado'],
    ['formato errado', JSON.stringify({ foo: 'bar' })],
    ['frase inválida', JSON.stringify({ quotes: [{ id: 'x' }], savedAt: NOW.toISOString() })],
    ['sem data', JSON.stringify({ quotes })],
  ])('ignora cache corrompido (%s)', async (_label, raw) => {
    await AsyncStorage.setItem(STORAGE_KEY, raw);
    await expect(readCachedQuotes()).resolves.toBeNull();
  });

  it('devolve null e avisa no console se o armazenamento falhar na leitura', async () => {
    jest.spyOn(AsyncStorage, 'getItem').mockRejectedValue(new Error('falhou'));
    await expect(readCachedQuotes()).resolves.toBeNull();
    expect(console.warn).toHaveBeenCalled();
  });

  it('não quebra se o armazenamento falhar na escrita', async () => {
    jest.spyOn(AsyncStorage, 'setItem').mockRejectedValue(new Error('disco cheio'));
    await expect(saveCachedQuotes(quotes, NOW)).resolves.toBeUndefined();
    expect(console.warn).toHaveBeenCalled();
  });
});
