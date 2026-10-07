import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, screen, userEvent } from '@testing-library/react-native';

import HomeScreen from '@/app/index';
import { ApiError } from '@/services/api-client';
import { loadAllQuotes, type LoadedQuotes } from '@/services/quotes-repository';
import { deferred, makeQuote } from '../helpers/fixtures';
import { renderWithProviders } from '../helpers/render-with-providers';

jest.mock('expo-router', () => jest.requireActual('../helpers/router-mock').expoRouterMock);
jest.mock('@/services/quotes-repository');
const loadAllQuotesMock = jest.mocked(loadAllQuotes);

const quotes = [
  makeQuote({ id: 1, quote: 'A vida é bela.', author: 'Roberto Benigni' }),
  makeQuote({ id: 2, quote: 'Penso, logo existo.', author: 'René Descartes' }),
  makeQuote({ id: 3, quote: 'Só sei que nada sei.', author: 'Sócrates' }),
];
const online: LoadedQuotes = { quotes, isOffline: false, savedAt: null };

beforeEach(async () => {
  loadAllQuotesMock.mockReset();
  await AsyncStorage.clear();
});

async function renderLoadedHome(result: LoadedQuotes = online) {
  loadAllQuotesMock.mockResolvedValue(result);
  await renderWithProviders(<HomeScreen />);
  await screen.findByText(`${result.quotes.length} frases`);
}

describe('Tela inicial', () => {
  it('mostra carregando enquanto a API não responde', async () => {
    const response = deferred<LoadedQuotes>();
    loadAllQuotesMock.mockReturnValue(response.promise);

    await renderWithProviders(<HomeScreen />);
    expect(screen.getByLabelText('Carregando frases')).toBeOnTheScreen();

    await act(async () => response.resolve(online));
    expect(screen.queryByLabelText('Carregando frases')).not.toBeOnTheScreen();
  });

  it('mostra a frase em destaque e a coleção', async () => {
    await renderLoadedHome();

    expect(screen.getByText('EM DESTAQUE · Nº 1')).toBeOnTheScreen();
    expect(screen.getByText('3 frases')).toBeOnTheScreen();
    expect(screen.getByText('Penso, logo existo.')).toBeOnTheScreen();
    expect(screen.getAllByRole('link', { name: /Ver detalhes da frase/ })).toHaveLength(3);
  });

  it('não mostra aviso de offline quando a API respondeu', async () => {
    await renderLoadedHome();
    expect(screen.queryByText(/Você está offline/)).not.toBeOnTheScreen();
  });

  it('mostra aviso quando está usando as frases salvas', async () => {
    await renderLoadedHome({ quotes, isOffline: true, savedAt: '2026-10-06T12:00:00.000Z' });

    expect(screen.getByText('Você está offline. Mostrando as frases salvas em 06/10/2026.')).toBeOnTheScreen();
    expect(screen.getByText('Penso, logo existo.')).toBeOnTheScreen();
  });

  it('mostra erro amigável e recupera ao tentar novamente', async () => {
    loadAllQuotesMock.mockRejectedValueOnce(new ApiError('network')).mockResolvedValueOnce(online);
    const user = userEvent.setup();
    await renderWithProviders(<HomeScreen />);

    expect(await screen.findByText('Sem conexão com a internet. Verifique sua rede e tente de novo.')).toBeOnTheScreen();
    await user.press(screen.getByRole('button', { name: 'Tentar novamente' }));

    expect(await screen.findByText('3 frases')).toBeOnTheScreen();
    expect(loadAllQuotesMock).toHaveBeenCalledTimes(2);
  });

  it('filtra a coleção pelo autor, sem acento', async () => {
    const user = userEvent.setup();
    await renderLoadedHome();

    await user.type(screen.getByLabelText('Pesquisar por número, autor ou texto da frase'), 'socrates');

    expect(await screen.findByText('1 frase')).toBeOnTheScreen();
    expect(screen.queryByText('Penso, logo existo.')).not.toBeOnTheScreen();
  });

  it('avisa quando a busca por número não encontra nada e permite limpar', async () => {
    const user = userEvent.setup();
    await renderLoadedHome();

    await user.type(screen.getByLabelText('Pesquisar por número, autor ou texto da frase'), '#99');
    expect(await screen.findByText('Confira o número da frase e tente novamente.')).toBeOnTheScreen();

    await user.press(screen.getByRole('button', { name: 'Limpar pesquisa' }));
    expect(await screen.findByText('3 frases')).toBeOnTheScreen();
  });

  it('avisa quando a busca por texto não encontra nada', async () => {
    const user = userEvent.setup();
    await renderLoadedHome();

    await user.type(screen.getByLabelText('Pesquisar por número, autor ou texto da frase'), 'zzz');

    expect(await screen.findByText('Tente buscar por outro autor ou palavra.')).toBeOnTheScreen();
  });

  it('mostra mais frases em lotes de 24', async () => {
    const many = Array.from({ length: 30 }, (_, index) => makeQuote({ id: index + 1, quote: `Frase ${index + 1}` }));
    const user = userEvent.setup();
    await renderLoadedHome({ quotes: many, isOffline: false, savedAt: null });

    expect(screen.queryByText('Frase 30')).not.toBeOnTheScreen();
    await user.press(screen.getByRole('button', { name: 'Ver mais frases' }));

    expect(await screen.findByText('Frase 30')).toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: 'Ver mais frases' })).not.toBeOnTheScreen();
  });

  it('troca a frase em destaque por outra', async () => {
    const user = userEvent.setup();
    await renderLoadedHome();

    await user.press(screen.getByRole('button', { name: 'Mostrar outra frase em destaque' }));

    expect(screen.queryByText('EM DESTAQUE · Nº 1')).not.toBeOnTheScreen();
  });

  it('mostra mensagem quando a API devolve coleção vazia', async () => {
    loadAllQuotesMock.mockResolvedValue({ quotes: [], isOffline: false, savedAt: null });
    await renderWithProviders(<HomeScreen />);

    expect(await screen.findByText('Ainda não há frases por aqui')).toBeOnTheScreen();
    expect(screen.getByText('Inspiração para o seu dia.')).toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: 'Mostrar outra frase em destaque' })).not.toBeOnTheScreen();
  });
});
