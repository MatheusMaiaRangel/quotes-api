import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, renderHook, waitFor } from '@testing-library/react-native';

import { FavoritesProvider, useFavorites } from '@/contexts/favorites-context';
import { makeQuote } from '../helpers/fixtures';

const STORAGE_KEY = '@quotes/favorites/v1';
const first = makeQuote({ id: 1, quote: 'primeira' });
const second = makeQuote({ id: 2, quote: 'segunda' });

async function renderFavorites() {
  return renderHook(() => useFavorites(), { wrapper: FavoritesProvider });
}

async function renderReadyFavorites() {
  const view = await renderFavorites();
  await waitFor(() => expect(view.result.current.isReady).toBe(true));
  return view;
}

async function savedFavorites() {
  return JSON.parse((await AsyncStorage.getItem(STORAGE_KEY)) ?? 'null');
}

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.spyOn(console, 'warn').mockImplementation(() => undefined);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('FavoritesProvider', () => {
  it('começa sem curtidas quando não há nada salvo', async () => {
    const { result } = await renderReadyFavorites();
    expect(result.current.favorites).toEqual([]);
  });

  it('carrega as curtidas salvas no aparelho', async () => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([first, second]));

    const { result } = await renderReadyFavorites();

    expect(result.current.favorites).toEqual([first, second]);
    expect(result.current.isFavorite(1)).toBe(true);
    expect(result.current.isFavorite(3)).toBe(false);
  });

  it('ignora itens inválidos e repetidos do armazenamento', async () => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([first, { id: 'x' }, first, second]));
    const { result } = await renderReadyFavorites();
    expect(result.current.favorites).toEqual([first, second]);
  });

  it('ignora armazenamento que não é uma lista', async () => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ id: 1 }));
    const { result } = await renderReadyFavorites();
    expect(result.current.favorites).toEqual([]);
  });

  it('não quebra quando o JSON salvo está corrompido', async () => {
    await AsyncStorage.setItem(STORAGE_KEY, '{quebrado');

    const { result } = await renderReadyFavorites();

    expect(result.current.favorites).toEqual([]);
    expect(console.warn).toHaveBeenCalled();
  });

  it('curte uma frase, coloca no topo e salva no aparelho', async () => {
    const { result } = await renderReadyFavorites();

    await act(async () => result.current.toggleFavorite(first));
    await act(async () => result.current.toggleFavorite(second));

    expect(result.current.favorites).toEqual([second, first]);
    await waitFor(async () => expect(await savedFavorites()).toEqual([second, first]));
  });

  it('descurte uma frase já curtida e atualiza o armazenamento', async () => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([first, second]));
    const { result } = await renderReadyFavorites();

    await act(async () => result.current.toggleFavorite(first));

    expect(result.current.favorites).toEqual([second]);
    expect(result.current.isFavorite(1)).toBe(false);
    await waitFor(async () => expect(await savedFavorites()).toEqual([second]));
  });

  it('avisa no console quando falha ao salvar, sem quebrar o app', async () => {
    const { result } = await renderReadyFavorites();
    jest.spyOn(AsyncStorage, 'setItem').mockRejectedValue(new Error('disco cheio'));

    await act(async () => result.current.toggleFavorite(first));

    expect(result.current.favorites).toEqual([first]);
    await waitFor(() => expect(console.warn).toHaveBeenCalledWith('[favorites] falha ao salvar curtidas', expect.any(Error)));
  });

  it('ignora toques antes de terminar de carregar', async () => {
    let finishLoading: (value: string | null) => void = () => undefined;
    jest.spyOn(AsyncStorage, 'getItem').mockImplementation(() => new Promise((resolve) => { finishLoading = resolve; }));
    const { result } = await renderFavorites();

    await act(async () => result.current.toggleFavorite(first));
    expect(result.current.favorites).toEqual([]);

    await act(async () => finishLoading(null));
    expect(result.current.isReady).toBe(true);
  });
});

describe('useFavorites', () => {
  it('dá erro claro quando usado fora do FavoritesProvider', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    await expect(renderHook(() => useFavorites())).rejects.toThrow('useFavorites deve ser usado dentro de FavoritesProvider');
  });
});
