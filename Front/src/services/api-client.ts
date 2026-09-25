const BASE_URL = 'https://dummyjson.com';
const REQUEST_TIMEOUT_MS = 10_000;

export type ApiErrorKind = 'network' | 'timeout' | 'not-found' | 'server' | 'invalid-data';

const ERROR_MESSAGES: Record<ApiErrorKind, string> = {
  network: 'Sem conexão com a internet. Verifique sua rede e tente de novo.',
  timeout: 'O servidor demorou demais para responder. Tente de novo.',
  'not-found': 'Não encontramos o que você procurou.',
  server: 'O servidor está com problemas agora. Tente mais tarde.',
  'invalid-data': 'Recebemos dados inválidos do servidor.',
};

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status?: number;

  constructor(kind: ApiErrorKind, status?: number) {
    super(ERROR_MESSAGES[kind]);
    this.name = 'ApiError';
    this.kind = kind;
    this.status = status;
  }
}

function kindFromStatus(status: number): ApiErrorKind {
  if (status === 404) return 'not-found';
  return 'server';
}

async function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(url, { signal: controller.signal });
  } catch (error) {
    const isTimeout = error instanceof Error && error.name === 'AbortError';
    throw new ApiError(isTimeout ? 'timeout' : 'network');
  } finally {
    clearTimeout(timer);
  }
}

export async function getJson<T>(path: string, isValid: (value: unknown) => value is T): Promise<T> {
  const response = await fetchWithTimeout(`${BASE_URL}${path}`);

  if (!response.ok) {
    throw new ApiError(kindFromStatus(response.status), response.status);
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    throw new ApiError('invalid-data', response.status);
  }

  if (!isValid(body)) {
    throw new ApiError('invalid-data', response.status);
  }

  return body;
}

export function toErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  return 'Algo deu errado. Tente de novo.';
}
