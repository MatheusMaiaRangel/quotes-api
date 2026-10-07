import AsyncStorage from '@react-native-async-storage/async-storage';
import { screen, userEvent } from '@testing-library/react-native';

import { QuoteCard } from '@/components/quote-card';
import { makeQuote } from '../helpers/fixtures';
import { renderWithProviders } from '../helpers/render-with-providers';

jest.mock('expo-router', () => jest.requireActual('../helpers/router-mock').expoRouterMock);

const quote = makeQuote({ id: 5, quote: 'Menos é mais.', author: 'Mies van der Rohe' });

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe('QuoteCard', () => {
  it('mostra número, frase, autor e link para os detalhes', async () => {
    await renderWithProviders(<QuoteCard quote={quote} />);

    expect(screen.getByText('Nº 05')).toBeOnTheScreen();
    expect(screen.getByText('Menos é mais.')).toBeOnTheScreen();
    expect(screen.getByText('Mies van der Rohe')).toBeOnTheScreen();
    expect(screen.getByRole('link', { name: 'Ver detalhes da frase 5' })).toBeOnTheScreen();
  });

  it('alterna entre curtir e descurtir', async () => {
    const user = userEvent.setup();
    await renderWithProviders(<QuoteCard quote={quote} />);

    await user.press(await screen.findByRole('button', { name: 'Curtir frase' }));
    expect(await screen.findByRole('button', { name: 'Descurtir frase' })).toBeSelected();

    await user.press(screen.getByRole('button', { name: 'Descurtir frase' }));
    expect(await screen.findByRole('button', { name: 'Curtir frase' })).not.toBeSelected();
  });
});
