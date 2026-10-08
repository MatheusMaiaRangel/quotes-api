# 📖 Quotes — Aplicativo de Frases

E um aplicativo multiplataforma desenvolvido como projeto prático da disciplina de **Técnicas Avançadas de Programação Web e Mobile** da Fatec.

A aplicação permite consultar frases inspiradoras, pesquisar por autor, trecho ou número da frase, visualizar detalhes e salvar frases favoritas.

Os dados são obtidos da **API DummyJSON**, com suporte a traduções em português e armazenamento local para utilização offline.

## ✨ Funcionalidades

- **Consulta de frases:** exibição de frases e seus respectivos autores.
- **Pesquisa:** busca por autor, texto ou número da frase.
- **Detalhamento:** visualização individual das frases.
- **Favoritos:** possibilidade de curtir e salvar frases no dispositivo.
- **Traduções:** apresentação de frases em português quando disponíveis.
- **Modo offline:** acesso às últimas frases armazenadas mesmo sem conexão.
- **Multiplataforma:** compatibilidade com Android, iOS e Web.

## 🧰 Tecnologias utilizadas

- **React Native:** Desenvolvimento da interface do aplicativo.
- **Expo:** Ambiente de desenvolvimento e execução multiplataforma.
- **TypeScript:** Tipagem estática e organização do código.
- **Expo Router:** Navegação entre as telas da aplicação.
- **JavaScript / Node.js:** Execução de scripts e ferramentas de desenvolvimento.
- **AsyncStorage:** Armazenamento local de favoritos e cache.
- **DummyJSON API:** Fornecimento das frases por meio de requisições HTTP.
- **Jest:** Execução de testes automatizados.
- **React Native Testing Library:** Testes de componentes e funcionalidades.

## 📂 Estrutura do Projeto

Cada diretório organiza as funcionalidades da aplicação. A pasta `Front/` possui um README próprio com instruções adicionais.

- **Front/** → Aplicativo React Native + Expo
- **Front/src/app/** → Telas e navegação
- **Front/src/components/** → Componentes reutilizáveis
- **Front/src/services/** → Integração com API, traduções e cache
- **Front/src/contexts/** → Gerenciamento dos favoritos
- **Front/src/hooks/** → Hooks personalizados
- **Front/src/data/** → Traduções das frases
- **Front/tests/** → Testes automatizados
- **docs/** → Documentação do projeto e evidências de TDD

## 🚀 Como executar

Clone o repositório e acesse a pasta do aplicativo:

```bash
git clone https://github.com/MatheusMaiaRangel/quotes-api.git
cd quotes-api/Front
npm install
npx expo start
```

Para executar diretamente em uma plataforma:

```bash
npm run android
npm run ios
npm run web
```

## 🧪 Testes automatizados

O projeto utiliza Jest para testes e possui configuração de cobertura mínima de 80%.

```bash
npm test
npm run test:coverage
npm run test:watch
npm run tdd:demo
```

O comando `tdd:demo` demonstra o ciclo RED → GREEN do desenvolvimento orientado a testes.

## <h2>👥 Créditos</h2>
<table>
  <tr>
    <td align="center">
      <a href="https://github.com/MatheusMaiaRangel">
        <img src="https://avatars.githubusercontent.com/u/179478474?v=4" width="100px" alt="Foto do Maia"/><br>
        <sub><b>Maia</b></sub>
      </a>
    </td>
     <td align="center">
      <a href="https://github.com/brunor18">
        <img src="https://github.com/user-attachments/assets/7a8c8cd4-3efb-4c74-ba7f-6360f293dcda" width="100px" alt="Foto do Bruno"/><br>
        <sub><b>Bruno</b></sub>
      </a>
    </td>
     <td align="center">
      <a href="https://github.com/alvesxr">
        <img src="https://avatars.githubusercontent.com/u/175729323?v=4" width="100px" alt="Foto do João"/><br>
        <sub><b>João Rafael</b></sub>
      </a>
    </td>
     <td align="center">
      <a href="https://github.com/otaviocuriel">
        <img src="https://github.com/user-attachments/assets/f6f9b505-e0d8-48c2-a2c1-9f6ac73c6b51" width="100px" alt="Foto do Otávio"/><br>
        <sub><b>Otávio</b></sub>
      </a>
    </td>
  </tr>
