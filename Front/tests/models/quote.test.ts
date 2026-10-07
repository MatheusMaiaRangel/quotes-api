import { isQuote, isQuotesPage } from '@/models/quote';
import { makePage, makeQuote } from '../helpers/fixtures';

describe('isQuote', () => {
  it('aceita uma frase com id, texto e autor', () => {
    expect(isQuote(makeQuote())).toBe(true);
  });

  it.each([
    ['null', null],
    ['texto solto', 'frase'],
    ['sem autor', { id: 1, quote: 'x' }],
    ['id como string', { id: '1', quote: 'x', author: 'y' }],
    ['texto como número', { id: 1, quote: 2, author: 'y' }],
  ])('recusa valor inválido: %s', (_label, value) => {
    expect(isQuote(value)).toBe(false);
  });
});

describe('isQuotesPage', () => {
  it('aceita uma página válida', () => {
    expect(isQuotesPage(makePage([makeQuote()]))).toBe(true);
  });

  it('aceita uma página vazia', () => {
    expect(isQuotesPage(makePage([]))).toBe(true);
  });

  it.each([
    ['null', null],
    ['quotes não é lista', { quotes: {}, total: 0, skip: 0, limit: 0 }],
    ['frase inválida na lista', { quotes: [{ id: 1 }], total: 1, skip: 0, limit: 1 }],
    ['sem total', { quotes: [], skip: 0, limit: 0 }],
    ['skip como string', { quotes: [], total: 0, skip: '0', limit: 0 }],
  ])('recusa página inválida: %s', (_label, value) => {
    expect(isQuotesPage(value)).toBe(false);
  });
});
