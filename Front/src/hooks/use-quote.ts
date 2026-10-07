import { useCallback, useEffect, useState } from 'react';

import type { Quote } from '@/models/quote';
import { ApiError, toErrorMessage } from '@/services/api-client';
import { loadQuoteById } from '@/services/quotes-repository';

type QuoteState = {
  quote: Quote | null;
  isLoading: boolean;
  error: string | null;
  isNotFound: boolean;
};

const LOADING: QuoteState = { quote: null, isLoading: true, error: null, isNotFound: false };
const INVALID_ID: QuoteState = { quote: null, isLoading: false, error: null, isNotFound: true };

function isValidId(id: number) {
  return Number.isInteger(id) && id > 0;
}

function errorState(error: unknown): QuoteState {
  const isNotFound = error instanceof ApiError && error.kind === 'not-found';
  return { quote: null, isLoading: false, error: toErrorMessage(error), isNotFound };
}

// Busca uma frase pelo id (GET /quotes/:id) e expõe os estados que a tela precisa.
export function useQuote(id: number) {
  const [state, setState] = useState<QuoteState>(isValidId(id) ? LOADING : INVALID_ID);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!isValidId(id)) {
      setState(INVALID_ID);
      return;
    }

    let active = true;
    setState(LOADING);
    loadQuoteById(id)
      .then((quote) => {
        if (active) setState({ quote, isLoading: false, error: null, isNotFound: false });
      })
      .catch((error: unknown) => {
        if (active) setState(errorState(error));
      });
    return () => { active = false; };
  }, [id, attempt]);

  const retry = useCallback(() => setAttempt((current) => current + 1), []);

  return { ...state, retry };
}
