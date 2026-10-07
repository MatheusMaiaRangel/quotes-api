import AsyncStorage from '@react-native-async-storage/async-storage';
import { screen, userEvent } from '@testing-library/react-native';

import FavoritesScreen from '@/app/favorites';
import { makeQuote } from '../helpers/fixtures';
import { renderWithProviders } from '../helpers/render-with-providers';

jest.mock('expo-router', () => jest.requireActual('../helpers/router-mock').expoRouterMock);

const STORAGE_KEY = '@quotes/favorites/v1';

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe('Tela de curtidas', () => {
  it('convida a explorar quando ainda não há curtidas', async () => {
    await renderWithProviders(<FavoritesScreen />);

    expect(await screen.findByText('Sua coleção começa aqui')).toBeOnTheScreen();
    expect(screen.getByText('Explorar frases')).toBeOnTheScreen();
  });

  it('lista as frases curtidas salvas no aparelho', async () => {
    const saved = [makeQuote({ id: 1, quote: 'Primeira curtida' }), makeQuote({ id: 2, quote: 'Segunda curtida' })];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

    await renderWithProviders(<FavoritesScreen />);

    expect(await screen.findByText('2 frases')).toBeOnTheScreen();
    expect(screen.getByText('Primeira curtida')).toBeOnTheScreen();
    expect(screen.getByText('Segunda curtida')).toBeOnTheScreen();
    expect(screen.getByText('♥ Curtidas 2')).toBeOnTheScreen();
  });

  it('usa "frase" no singular quando há só uma', async () => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([makeQuote({ id: 1 })]));
    await renderWithProviders(<FavoritesScreen />);
    expect(await screen.findByText('1 frase')).toBeOnTheScreen();
  });

  it('tira a frase da lista ao descurtir', async () => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([makeQuote({ id: 1, quote: 'Vou sair' })]));
    const user = userEvent.setup();
    await renderWithProviders(<FavoritesScreen />);

    await user.press(await screen.findByRole('button', { name: 'Descurtir frase' }));

    expect(await screen.findByText('Sua coleção começa aqui')).toBeOnTheScreen();
    expect(screen.queryByText('Vou sair')).not.toBeOnTheScreen();
  });

  it('mostra mais curtidas em lotes de 24', async () => {
    const many = Array.from({ length: 26 }, (_, index) => makeQuote({ id: index + 1, quote: `Curtida ${index + 1}` }));
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(many));
    const user = userEvent.setup();
    await renderWithProviders(<FavoritesScreen />);

    await screen.findByText('26 frases');
    expect(screen.queryByText('Curtida 26')).not.toBeOnTheScreen();
    await user.press(screen.getByRole('button', { name: 'Ver mais frases' }));

    expect(await screen.findByText('Curtida 26')).toBeOnTheScreen();
  });
});
