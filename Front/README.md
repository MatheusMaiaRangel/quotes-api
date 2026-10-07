# Quotes

Aplicativo de frases desenvolvido com Expo e React Native. A tela inicial carrega a coleção da API DummyJSON, apresenta uma frase em destaque e permite pesquisar pelo número da frase, autor ou trecho. As traduções em português são exibidas quando disponíveis.

Para encontrar uma frase pelo número mostrado no cartão, digite `2` ou `#2`, por exemplo.

Toque em **Ver frase →** para abrir a frase sozinha na tela de detalhe (`/quote/:id`), que busca o item direto na API.

Sem internet, o app mostra a última coleção baixada e avisa que está offline.

Toque no coração de uma frase para curti-la. As frases curtidas aparecem na página **Curtidas** e ficam salvas neste dispositivo, mesmo depois de fechar o aplicativo.

## Executar

```bash
npm install
npx expo start
```

No terminal do Expo, escolha Android, iOS ou web. Também é possível usar `npm run android`, `npm run ios` ou `npm run web`.

## Testes

```bash
npm test               # roda todos os testes
npm run test:coverage  # roda com relatório de cobertura (mínimo 80%)
npm run tdd:demo       # mostra ao vivo o ciclo TDD: testes falhando (RED) e depois passando (GREEN)
```

O `tdd:demo` não altera nenhum arquivo: ele roda o Jest como se o código de cada funcionalidade ainda não existisse.

Os testes ficam em `tests/` (fora de `src/app` para o Expo Router não tratá-los como rotas). As evidências do ciclo TDD estão em `../docs/tdd`.

## Estrutura

- `src/app/index.tsx`: tela principal com frase em destaque, busca e coleção de frases em lotes.
- `src/app/quote/[id].tsx`: detalhe de uma frase buscada pelo id.
- `src/app/favorites.tsx`: lista de frases curtidas.
- `src/contexts/favorites-context.tsx`: estado compartilhado e armazenamento local das curtidas.
- `src/app/explore.tsx`: tela de exemplo do Expo, ainda disponível na rota `/explore`.
- `src/services`: acesso à API, tradução das frases e cache para uso offline (`quotes-cache.ts`, `quotes-repository.ts`).
- `src/hooks/use-quote.ts`: estado da consulta de uma frase por id.
- `src/utils/filter-quotes.ts`: regra de busca da coleção.
- `src/data/quote-translations.json`: traduções locais.
- `scripts/check-translations.js`: verifica quais frases da API ainda não têm tradução (`npm run check-translations`).

O enunciado do projeto está no PDF da pasta `../docs`.
