# Quotes

Aplicativo de frases desenvolvido com Expo e React Native. A tela inicial busca uma frase aleatória na API DummyJSON e apresenta a tradução em português quando disponível.

## Executar

```bash
npm install
npm start
```

No terminal do Expo, escolha Android, iOS ou web. Também é possível usar `npm run android`, `npm run ios` ou `npm run web`.

## Estrutura

- `src/app/index.tsx`: tela principal de frases.
- `src/app/explore.tsx`: tela de exemplo do Expo, ainda disponível na rota `/explore`.
- `src/services`: acesso à API e tradução das frases.
- `src/data/quote-translations.json`: traduções locais.
- `scripts/check-translations.js`: verifica quais frases da API ainda não têm tradução (`npm run check-translations`).

O enunciado do projeto está no PDF da pasta `../docs`.
