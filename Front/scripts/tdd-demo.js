#!/usr/bin/env node

/**
 * Demonstra o ciclo TDD ao vivo: para cada funcionalidade, roda os testes
 * como se o código ainda não existisse (RED) e depois com o código (GREEN).
 * Nenhum arquivo é alterado: o "sumiço" do código é feito só na configuração
 * do Jest desta execução. Rode com: npm run tdd:demo
 */
const { spawnSync } = require('child_process');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const JEST_BIN = require.resolve('jest/bin/jest', { paths: [ROOT] });
const baseConfig = require(path.join(ROOT, 'package.json')).jest;

const FEATURES = [
  {
    name: 'Busca e filtro de frases',
    hiddenModules: ['@/utils/filter-quotes'],
    tests: ['tests/utils/filter-quotes.test.ts'],
  },
  {
    name: 'Consulta de frase por id (tela de detalhe)',
    hiddenModules: ['@/hooks/use-quote'],
    tests: ['tests/hooks/use-quote.test.tsx', 'tests/screens/quote-detail.test.tsx'],
  },
  {
    name: 'Funcionamento sem internet (cache)',
    hiddenModules: ['@/services/quotes-cache', '@/services/quotes-repository'],
    tests: [
      'tests/services/quotes-cache.test.ts',
      'tests/services/quotes-repository.test.ts',
      'tests/screens/home.test.tsx',
    ],
  },
];

const SUMMARY_LINE = /^(PASS|FAIL) |✓|✕|Tests:|Could not locate module|is not a function/;

// Aponta os módulos escondidos para um caminho que não existe, como antes de serem criados.
function configHiding(hiddenModules) {
  const hidden = Object.fromEntries(
    hiddenModules.map((name) => [`^${name}$`, `<rootDir>/__tdd_demo__/ainda-nao-existe/${path.basename(name)}`])
  );
  return { ...baseConfig, rootDir: ROOT, moduleNameMapper: { ...hidden, ...baseConfig.moduleNameMapper } };
}

function runJest(tests, config) {
  const result = spawnSync(
    process.execPath,
    [JEST_BIN, '--config', JSON.stringify(config), '--verbose', '--colors=false', ...tests],
    { cwd: ROOT, encoding: 'utf8' }
  );
  const output = `${result.stdout}${result.stderr}`;
  const lines = [...new Set(output.split('\n').filter((line) => SUMMARY_LINE.test(line)))];
  return { passed: result.status === 0, lines };
}

function printStep(label, { lines }) {
  console.log(`\n  ${label}`);
  for (const line of lines) console.log(`    ${line.trim()}`);
}

function main() {
  let isCycleOk = true;

  FEATURES.forEach((feature, index) => {
    console.log(`\n${'='.repeat(64)}\n${index + 1}. ${feature.name}\n${'='.repeat(64)}`);

    const red = runJest(feature.tests, configHiding(feature.hiddenModules));
    printStep('RED: sem a implementação, os testes falham', red);

    const green = runJest(feature.tests, { ...baseConfig, rootDir: ROOT });
    printStep('GREEN: com a implementação, os testes passam', green);

    const isOk = !red.passed && green.passed;
    console.log(`\n  ${isOk ? 'OK: ciclo RED -> GREEN confirmado' : 'ATENÇÃO: o ciclo não se comportou como esperado'}`);
    isCycleOk = isCycleOk && isOk;
  });

  console.log('\nO REFACTOR de cada ciclo está registrado em ../docs/tdd. Rode "npm test" para ver tudo passando.');
  if (!isCycleOk) process.exitCode = 1;
}

main();
