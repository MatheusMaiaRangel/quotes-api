import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { isQuote, type Quote } from '@/models/quote';

const STORAGE_KEY = '@quotes/favorites/v1';

type FavoritesContextValue = {
  favorites: Quote[];
  isReady: boolean;
  isFavorite: (id: number) => boolean;
  toggleFavorite: (quote: Quote) => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

function parseFavorites(value: string | null): Quote[] {
  if (!value) return [];
  const parsed: unknown = JSON.parse(value);
  if (!Array.isArray(parsed)) return [];
  const seen = new Set<number>();
  return parsed.filter((item): item is Quote => {
    if (!isQuote(item) || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Quote[]>([]);
  const [isReady, setIsReady] = useState(false);
  const writeQueue = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (active) setFavorites(parseFavorites(saved));
      })
      .catch((error) => console.warn('[favorites] falha ao carregar curtidas', error))
      .finally(() => {
        if (active) setIsReady(true);
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!isReady) return;
    writeQueue.current = writeQueue.current
      .catch(() => undefined)
      .then(() => AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(favorites)))
      .catch((error) => console.warn('[favorites] falha ao salvar curtidas', error));
  }, [favorites, isReady]);

  const favoriteIds = useMemo(() => new Set(favorites.map((quote) => quote.id)), [favorites]);
  const isFavorite = useCallback((id: number) => favoriteIds.has(id), [favoriteIds]);
  const toggleFavorite = useCallback((quote: Quote) => {
    if (!isReady) return;
    setFavorites((current) =>
      current.some((item) => item.id === quote.id)
        ? current.filter((item) => item.id !== quote.id)
        : [quote, ...current]
    );
  }, [isReady]);

  const value = useMemo(
    () => ({ favorites, isReady, isFavorite, toggleFavorite }),
    [favorites, isReady, isFavorite, toggleFavorite]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites deve ser usado dentro de FavoritesProvider');
  return context;
}
