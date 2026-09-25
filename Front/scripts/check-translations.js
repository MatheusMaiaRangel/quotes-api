#!/usr/bin/env node

/**
 * Lista as frases da DummyJSON que ainda não têm tradução em
 * src/data/quote-translations.json. Rode com: npm run check-translations
 */
const path = require('path');

const API_URL = 'https://dummyjson.com/quotes?limit=0';
const translations = require(path.join(__dirname, '..', 'src', 'data', 'quote-translations.json'));

async function main() {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error(`DummyJSON respondeu ${response.status}`);
  }

  const { quotes } = await response.json();
  const missing = quotes.filter((quote) => !translations[String(quote.id)]);

  console.log(`${quotes.length} frases na API, ${quotes.length - missing.length} traduzidas.`);
  if (missing.length === 0) return;

  console.log(`\nFaltam ${missing.length}:`);
  for (const quote of missing) {
    console.log(`${quote.id}|${quote.quote}`);
  }
  process.exitCode = 1;
}

main().catch((error) => {
  console.error('Falha ao verificar traduções:', error.message);
  process.exitCode = 1;
});
