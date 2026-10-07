import { ApiError } from '@/services/api-client';
import { readCachedQuotes, saveCachedQuotes } from '@/services/quotes-cache';
import { getAllQuotes, getQuoteById } from '@/services/quotes-api';
import { loadAllQuotes, loadQuoteById } from '@/services/quotes-repository';
import { makeQuote } from '../helpers/fixtures';

jest.mock('@/services/quotes-api');
jest.mock('@/services/quotes-cache');
const getAllQuotesMock = jest.mocked(getAllQuotes);
const getQuoteByIdMock = jest.mocked(getQuoteById);
const readCacheMock = jest.mocked(readCachedQuotes);
const saveCacheMock = jest.mocked(saveCachedQuotes);

const onlineQuotes = [makeQuote({ id: 1 }), makeQuote({ id: 2 })];
const cachedQuotes = [makeQuote({ id: 1 })];
const SAVED_AT = '2026-10-06T09:30:00.000Z';

beforeEach(() => {
  jest.resetAllMocks();
  jest.spyOn(console, 'warn').mockImplementation(() => undefined);
});

describe('loadAllQuotes', () => {
  it('usa a API quando está online e atualiza o cache', async () => {
    getAllQuotesMock.mockResolvedValue(onlineQuotes);

    const result = await loadAllQuotes();

    expect(result).toEqual({ quotes: onlineQuotes, isOffline: false, savedAt: null });
    expect(saveCacheMock).toHaveBeenCalledWith(onlineQuotes);
    expect(readCacheMock).not.toHaveBeenCalled();
  });

  it('usa as frases salvas quando a API falha', async () => {
    getAllQuotesMock.mockRejectedValue(new ApiError('network'));
    readCacheMock.mockResolvedValue({ quotes: cachedQuotes, savedAt: SAVED_AT });

    const result = await loadAllQuotes();

    expect(result).toEqual({ quotes: cachedQuotes, isOffline: true, savedAt: SAVED_AT });
    expect(saveCacheMock).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledWith('[quotes] usando frases salvas', expect.any(ApiError));
  });

  it('repassa o erro original quando falha e não há nada salvo', async () => {
    const error = new ApiError('timeout');
    getAllQuotesMock.mockRejectedValue(error);
    readCacheMock.mockResolvedValue(null);

    await expect(loadAllQuotes()).rejects.toBe(error);
  });
});

describe('loadQuoteById', () => {
  it('busca a frase na API quando está online', async () => {
    getQuoteByIdMock.mockResolvedValue(cachedQuotes[0]);

    await expect(loadQuoteById(1)).resolves.toEqual(cachedQuotes[0]);
    expect(readCacheMock).not.toHaveBeenCalled();
  });

  it('usa a frase salva quando a API falha por conexão', async () => {
    getQuoteByIdMock.mockRejectedValue(new ApiError('network'));
    readCacheMock.mockResolvedValue({ quotes: cachedQuotes, savedAt: SAVED_AT });

    await expect(loadQuoteById(1)).resolves.toEqual(cachedQuotes[0]);
  });

  it('repassa o erro quando a frase não está salva', async () => {
    const error = new ApiError('network');
    getQuoteByIdMock.mockRejectedValue(error);
    readCacheMock.mockResolvedValue({ quotes: cachedQuotes, savedAt: SAVED_AT });

    await expect(loadQuoteById(2)).rejects.toBe(error);
  });

  it('não usa o cache quando a API diz que a frase não existe', async () => {
    const error = new ApiError('not-found', 404);
    getQuoteByIdMock.mockRejectedValue(error);

    await expect(loadQuoteById(99999)).rejects.toBe(error);
    expect(readCacheMock).not.toHaveBeenCalled();
  });
});
