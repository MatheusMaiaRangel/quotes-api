# Quotes

Aplicativo de frases desenvolvido com Expo e React Native. A tela inicial carrega a coleção da API DummyJSON, apresenta uma frase em destaque e permite pesquisar pelo número da frase, autor ou trecho. As traduções em português são exibidas quando disponíveis.

Para encontrar uma frase pelo número mostrado no cartão, digite `2` ou `#2`, por exemplo.

Toque no coração de uma frase para curti-la. As frases curtidas aparecem na página **Curtidas** e ficam salvas neste dispositivo, mesmo depois de fechar o aplicativo.

## Executar

```bash
npm install
npx expo start
```

No terminal do Expo, escolha Android, iOS ou web. Também é possível usar `npm run android`, `npm run ios` ou `npm run web`.

## Estrutura

- `src/app/index.tsx`: tela principal com frase em destaque, busca e coleção de frases em lotes.
- `src/app/favorites.tsx`: lista de frases curtidas.
- `src/contexts/favorites-context.tsx`: estado compartilhado e armazenamento local das curtidas.
- `src/app/explore.tsx`: tela de exemplo do Expo, ainda disponível na rota `/explore`.
- `src/services`: acesso à API e tradução das frases.
- `src/data/quote-translations.json`: traduções locais.
- `scripts/check-translations.js`: verifica quais frases da API ainda não têm tradução (`npm run check-translations`).

O enunciado do projeto está no PDF da pasta `../docs`.
