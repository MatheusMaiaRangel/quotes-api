import { ApiError, getJson, toErrorMessage } from '@/services/api-client';
import { isQuote } from '@/models/quote';
import { jsonResponse, makeQuote } from '../helpers/fixtures';

const fetchMock = jest.fn();

beforeEach(() => {
  fetchMock.mockReset();
  globalThis.fetch = fetchMock;
});

afterEach(() => {
  jest.useRealTimers();
});

async function expectApiError(promise: Promise<unknown>, kind: ApiError['kind'], status?: number) {
  const error = await promise.catch((caught: unknown) => caught);
  expect(error).toBeInstanceOf(ApiError);
  expect((error as ApiError).kind).toBe(kind);
  expect((error as ApiError).status).toBe(status);
}

describe('getJson', () => {
  it('chama a DummyJSON e devolve o corpo quando é válido', async () => {
    const quote = makeQuote();
    fetchMock.mockResolvedValue(jsonResponse(quote));

    await expect(getJson('/quotes/1', isQuote)).resolves.toEqual(quote);
    expect(fetchMock).toHaveBeenCalledWith('https://dummyjson.com/quotes/1', expect.objectContaining({ signal: expect.anything() }));
  });

  it('transforma 404 em erro "not-found"', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ message: 'not found' }, 404));
    await expectApiError(getJson('/quotes/999', isQuote), 'not-found', 404);
  });

  it('transforma 500 em erro "server"', async () => {
    fetchMock.mockResolvedValue(jsonResponse({}, 500));
    await expectApiError(getJson('/quotes/1', isQuote), 'server', 500);
  });

  it('transforma falha de rede em erro "network"', async () => {
    fetchMock.mockRejectedValue(new TypeError('Network request failed'));
    await expectApiError(getJson('/quotes/1', isQuote), 'network');
  });

  it('transforma JSON quebrado em erro "invalid-data"', async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, json: () => Promise.reject(new SyntaxError('bad')) });
    await expectApiError(getJson('/quotes/1', isQuote), 'invalid-data', 200);
  });

  it('transforma JSON no formato errado em erro "invalid-data"', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ foo: 'bar' }));
    await expectApiError(getJson('/quotes/1', isQuote), 'invalid-data', 200);
  });

  it('cancela a requisição depois de 10s e devolve erro "timeout"', async () => {
    jest.useFakeTimers();
    fetchMock.mockImplementation((_url: string, { signal }: { signal: AbortSignal }) =>
      new Promise((_resolve, reject) => {
        signal.addEventListener('abort', () => {
          const abortError = new Error('aborted');
          abortError.name = 'AbortError';
          reject(abortError);
        });
      })
    );

    const request = getJson('/quotes/1', isQuote);
    jest.advanceTimersByTime(10_000);

    await expectApiError(request, 'timeout');
  });
});

describe('toErrorMessage', () => {
  it('usa a mensagem amigável do ApiError', () => {
    expect(toErrorMessage(new ApiError('network'))).toBe('Sem conexão com a internet. Verifique sua rede e tente de novo.');
  });

  it('usa uma mensagem genérica para outros erros', () => {
    expect(toErrorMessage(new Error('boom'))).toBe('Algo deu errado. Tente de novo.');
  });
});
