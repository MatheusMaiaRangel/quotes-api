import { act, renderHook, waitFor } from '@testing-library/react-native';

import { useQuote } from '@/hooks/use-quote';
import { ApiError } from '@/services/api-client';
import { loadQuoteById } from '@/services/quotes-repository';
import { makeQuote } from '../helpers/fixtures';

jest.mock('@/services/quotes-repository');
const loadQuoteByIdMock = jest.mocked(loadQuoteById);

const quote = makeQuote({ id: 7 });

beforeEach(() => {
  loadQuoteByIdMock.mockReset();
});

describe('useQuote', () => {
  it('começa carregando e depois mostra a frase do id pedido', async () => {
    loadQuoteByIdMock.mockResolvedValue(quote);

    const { result } = await renderHook(() => useQuote(7));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(loadQuoteByIdMock).toHaveBeenCalledWith(7);
    expect(result.current.quote).toEqual(quote);
    expect(result.current.error).toBeNull();
  });

  it('avisa quando a frase não existe', async () => {
    loadQuoteByIdMock.mockRejectedValue(new ApiError('not-found', 404));

    const { result } = await renderHook(() => useQuote(99999));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.quote).toBeNull();
    expect(result.current.isNotFound).toBe(true);
    expect(result.current.error).toBe('Não encontramos o que você procurou.');
  });

  it('mostra mensagem amigável quando está sem internet', async () => {
    loadQuoteByIdMock.mockRejectedValue(new ApiError('network'));

    const { result } = await renderHook(() => useQuote(7));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.isNotFound).toBe(false);
    expect(result.current.error).toBe('Sem conexão com a internet. Verifique sua rede e tente de novo.');
  });

  it('tenta de novo e mostra a frase quando a conexão volta', async () => {
    loadQuoteByIdMock.mockRejectedValueOnce(new ApiError('network')).mockResolvedValueOnce(quote);
    const { result } = await renderHook(() => useQuote(7));
    await waitFor(() => expect(result.current.error).not.toBeNull());

    await act(async () => result.current.retry());

    await waitFor(() => expect(result.current.quote).toEqual(quote));
    expect(result.current.error).toBeNull();
    expect(loadQuoteByIdMock).toHaveBeenCalledTimes(2);
  });

  it('não chama a API quando o id é inválido', async () => {
    const { result } = await renderHook(() => useQuote(Number.NaN));

    expect(loadQuoteByIdMock).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isNotFound).toBe(true);
  });

  it('busca de novo quando o id muda', async () => {
    loadQuoteByIdMock.mockResolvedValueOnce(quote).mockResolvedValueOnce(makeQuote({ id: 8 }));
    const { result, rerender } = await renderHook(({ id }: { id: number }) => useQuote(id), { initialProps: { id: 7 } });
    await waitFor(() => expect(result.current.quote?.id).toBe(7));

    await rerender({ id: 8 });

    await waitFor(() => expect(result.current.quote?.id).toBe(8));
  });
});
