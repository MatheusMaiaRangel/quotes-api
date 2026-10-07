import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, screen, userEvent } from '@testing-library/react-native';

import QuoteDetailScreen from '@/app/quote/[id]';
import { ApiError } from '@/services/api-client';
import { loadQuoteById } from '@/services/quotes-repository';
import { deferred, makeQuote } from '../helpers/fixtures';
import { renderWithProviders } from '../helpers/render-with-providers';
import { routerState } from '../helpers/router-mock';

jest.mock('expo-router', () => jest.requireActual('../helpers/router-mock').expoRouterMock);
jest.mock('@/services/quotes-repository');
const loadQuoteByIdMock = jest.mocked(loadQuoteById);

const quote = makeQuote({ id: 7, quote: 'A persistência é o caminho do êxito.', author: 'Charles Chaplin' });

beforeEach(async () => {
  loadQuoteByIdMock.mockReset();
  routerState.params = { id: '7' };
  await AsyncStorage.clear();
});

describe('Tela de detalhe da frase', () => {
  it('mostra carregando e depois a frase completa', async () => {
    const response = deferred<typeof quote>();
    loadQuoteByIdMock.mockReturnValue(response.promise);

    await renderWithProviders(<QuoteDetailScreen />);
    expect(screen.getByLabelText('Carregando frase')).toBeOnTheScreen();

    await act(async () => response.resolve(quote));
    expect(await screen.findByText('“A persistência é o caminho do êxito.”')).toBeOnTheScreen();
    expect(screen.getByText('Charles Chaplin')).toBeOnTheScreen();
    expect(screen.getByText('Frase Nº 07')).toBeOnTheScreen();
    expect(loadQuoteByIdMock).toHaveBeenCalledWith(7);
  });

  it('permite curtir a frase pela tela de detalhe', async () => {
    loadQuoteByIdMock.mockResolvedValue(quote);
    const user = userEvent.setup();
    await renderWithProviders(<QuoteDetailScreen />);

    await user.press(await screen.findByRole('button', { name: 'Curtir frase' }));

    expect(await screen.findByRole('button', { name: 'Descurtir frase' })).toBeOnTheScreen();
  });

  it('avisa quando a frase não existe, sem botão de tentar de novo', async () => {
    routerState.params = { id: '99999' };
    loadQuoteByIdMock.mockRejectedValue(new ApiError('not-found', 404));

    await renderWithProviders(<QuoteDetailScreen />);

    expect(await screen.findByText('Frase não encontrada')).toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: 'Tentar novamente' })).not.toBeOnTheScreen();
  });

  it('trata id inválido na URL como frase inexistente', async () => {
    routerState.params = { id: 'abc' };

    await renderWithProviders(<QuoteDetailScreen />);

    expect(await screen.findByText('Frase não encontrada')).toBeOnTheScreen();
    expect(loadQuoteByIdMock).not.toHaveBeenCalled();
  });

  it('usa o primeiro valor quando o id chega como lista', async () => {
    routerState.params = { id: ['7', '8'] };
    loadQuoteByIdMock.mockResolvedValue(quote);

    await renderWithProviders(<QuoteDetailScreen />);

    expect(await screen.findByText('Charles Chaplin')).toBeOnTheScreen();
    expect(loadQuoteByIdMock).toHaveBeenCalledWith(7);
  });

  it('mostra erro de conexão e recupera ao tentar novamente', async () => {
    loadQuoteByIdMock.mockRejectedValueOnce(new ApiError('network')).mockResolvedValueOnce(quote);
    const user = userEvent.setup();
    await renderWithProviders(<QuoteDetailScreen />);

    expect(await screen.findByText('Sem conexão com a internet. Verifique sua rede e tente de novo.')).toBeOnTheScreen();
    await user.press(screen.getByRole('button', { name: 'Tentar novamente' }));

    expect(await screen.findByText('Charles Chaplin')).toBeOnTheScreen();
  });

  it('tem link para voltar à coleção', async () => {
    loadQuoteByIdMock.mockResolvedValue(quote);
    await renderWithProviders(<QuoteDetailScreen />);
    expect(await screen.findByRole('link', { name: '← Voltar para a coleção' })).toBeOnTheScreen();
  });
});
