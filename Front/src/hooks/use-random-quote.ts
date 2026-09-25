import { useCallback, useEffect, useState } from 'react';

import type { Quote } from '@/models/quote';
import { toErrorMessage } from '@/services/api-client';
import { getRandomQuote } from '@/services/quotes-api';

type RandomQuoteState = {
  quote: Quote | null;
  isLoading: boolean;
  error: string | null;
};

const INITIAL_STATE: RandomQuoteState = { quote: null, isLoading: true, error: null };

export function useRandomQuote() {
  const [state, setState] = useState<RandomQuoteState>(INITIAL_STATE);

  const refresh = useCallback(async () => {
    setState((current) => ({ ...current, isLoading: true, error: null }));
    try {
      const quote = await getRandomQuote();
      setState({ quote, isLoading: false, error: null });
    } catch (error) {
      console.warn('[useRandomQuote] falha ao buscar frase', error);
      setState((current) => ({ ...current, isLoading: false, error: toErrorMessage(error) }));
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { ...state, refresh };
}
