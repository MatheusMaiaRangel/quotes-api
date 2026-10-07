# Evidências de TDD

Cada arquivo `.txt` é a saída real do `npx jest` no momento de cada etapa do ciclo **RED → GREEN → REFACTOR**.

Para rodar tudo de novo, entre em `Front/` e use `npm test` (ou `npm run test:coverage` para ver a cobertura).

## 1. Busca e filtro de frases (RF03)

O que a busca faz: procura pelo número (`2` ou `#2`), pelo autor ou por um trecho da frase, sem diferenciar acentos nem maiúsculas.

| Etapa | Evidência | O que aconteceu |
|---|---|---|
| RED | `01-busca-1-red.txt` | O teste `tests/utils/filter-quotes.test.ts` foi escrito antes do código e falhou, porque `@/utils/filter-quotes` ainda não existia. |
| GREEN | `01-busca-2-green.txt` | Implementação mínima em `src/utils/filter-quotes.ts`. Os 16 testes passaram. |
| REFACTOR | `01-busca-3-refactor.txt` | A normalização repetida virou a função `normalize`, a regex virou a constante `NUMBER_SEARCH` e a tela `index.tsx` passou a usar `filterQuotes`/`isNumberSearch`. Os testes continuaram passando. |

## 2. Consulta de frase por identificador (RF03: `GET /quotes/:id`)

| Etapa | Evidência | O que aconteceu |
|---|---|---|
| RED | `02-detalhe-por-id-1-red.txt` | Os testes do hook `useQuote` (carregando, sucesso, não encontrada, sem internet, tentar de novo, id inválido, troca de id) falharam porque o hook não existia. |
| GREEN | `02-detalhe-por-id-2-green.txt` | Hook `src/hooks/use-quote.ts` criado com 5 `useState`. Os 6 testes passaram. |
| REFACTOR | `02-detalhe-por-id-3-refactor.txt` | Os 5 estados viraram um único objeto imutável (`QuoteState`) com as funções `isValidId` e `errorState`. Os testes continuaram passando. |
| RED (tela) | `02-detalhe-por-id-4-tela-red.txt` | Os testes da tela `/quote/[id]` falharam porque a rota não existia. |
| GREEN (tela) | `02-detalhe-por-id-5-tela-green.txt` | Tela `src/app/quote/[id].tsx` criada. Os 6 testes passaram. |

## 3. Funcionamento sem conexão (RF05 + RF06)

- **O que fica salvo:** a última coleção de frases que veio da API, com a data em que foi salva (chave `@quotes/cache/v1` no AsyncStorage).
- **Por que fica salvo:** para o app continuar útil sem internet ou com a API fora do ar.
- **Quando é atualizado:** toda vez que a API responde com sucesso. Uma lista vazia não apaga um cache bom.

| Etapa | Evidência | O que aconteceu |
|---|---|---|
| RED | `03-offline-1-red.txt` | Os testes de `quotes-cache` e `quotes-repository` falharam porque os módulos não existiam. |
| GREEN | `03-offline-2-green.txt` | Implementação mínima. Os 12 testes passaram. |
| REFACTOR | `03-offline-3-refactor.txt` | A chave virou a constante `STORAGE_KEY`, a validação foi para o type guard `isCachedQuotes` e o retorno ganhou o tipo `LoadedQuotes`. Os testes continuaram passando. |
| RED (tela) | `03-offline-4-tela-red.txt` | Os 11 testes da Home falharam porque a tela ainda chamava a API direto, sem o cache. |
| GREEN (tela) | `03-offline-5-tela-green.txt` | A Home passou a usar `loadAllQuotes` e mostra o aviso "Você está offline…". Os 11 testes passaram. |
| REFACTOR (tela) | `03-offline-6-refactor.txt` | O aviso foi extraído para o componente `src/components/offline-banner.tsx`. Os testes continuaram passando. |

## 4. Detalhe da frase sem conexão (RF06, achado na revisão de código)

A lista abria do cache quando estava offline, mas o detalhe da frase ainda dependia da API.

| Etapa | Evidência | O que aconteceu |
|---|---|---|
| RED | `04-detalhe-offline-1-red.txt` | Os testes de `loadQuoteById` falharam porque a função não existia, e o teste do aviso no console também falhou. |
| GREEN | `04-detalhe-offline-2-green.txt` | `loadQuoteById` tenta a API primeiro e, se der erro de conexão, procura a frase no cache. "Não encontrada" não cai no cache. O cache passou a ser salvo em segundo plano. |
| REFACTOR | `04-detalhe-offline-3-refactor.txt` | O hook `useQuote` passou a usar o repository, os mocks ganharam nomes melhores e a tela passou a tratar o `id` quando ele chega como lista. |

## Outros testes (código que já existia)

Esses testes foram escritos depois do código, por isso não contam como TDD. Eles garantem que nada quebra:

- `tests/models`: validação dos dados que chegam da API.
- `tests/services/api-client.test.ts`: os erros de sem internet, timeout, 404, 500, JSON quebrado e formato inválido.
- `tests/services/quotes-api.test.ts`: as URLs dos endpoints e a correção de `limit`, `skip` e `id`.
- `tests/contexts`: as curtidas salvas no AsyncStorage.
- `tests/screens` e `tests/components`: as telas Home, Curtidas e Detalhe e o card de frase.
