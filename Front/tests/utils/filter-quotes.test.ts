import { filterQuotes, isNumberSearch } from '@/utils/filter-quotes';
import { makeQuote } from '../helpers/fixtures';

const quotes = [
  makeQuote({ id: 2, quote: 'A vida é bela.', author: 'Roberto Benigni' }),
  makeQuote({ id: 12, quote: 'Penso, logo existo.', author: 'René Descartes' }),
  makeQuote({ id: 20, quote: 'Só sei que nada sei.', author: 'Sócrates' }),
];

describe('filterQuotes', () => {
  it('devolve todas as frases quando a busca está vazia', () => {
    expect(filterQuotes(quotes, '')).toEqual(quotes);
  });

  it('ignora espaços em volta da busca', () => {
    expect(filterQuotes(quotes, '   ')).toEqual(quotes);
  });

  it('busca pelo número exato da frase', () => {
    expect(filterQuotes(quotes, '2')).toEqual([quotes[0]]);
  });

  it('aceita o número com # na frente', () => {
    expect(filterQuotes(quotes, '#12')).toEqual([quotes[1]]);
  });

  it('devolve lista vazia quando o número não existe', () => {
    expect(filterQuotes(quotes, '999')).toEqual([]);
  });

  it('busca pelo autor sem diferenciar maiúsculas', () => {
    expect(filterQuotes(quotes, 'DESCARTES')).toEqual([quotes[1]]);
  });

  it('busca por trecho da frase', () => {
    expect(filterQuotes(quotes, 'nada sei')).toEqual([quotes[2]]);
  });

  it('ignora acentos na busca e no texto', () => {
    expect(filterQuotes(quotes, 'socrates')).toEqual([quotes[2]]);
    expect(filterQuotes(quotes, 'René')).toEqual([quotes[1]]);
    expect(filterQuotes(quotes, 'é bela')).toEqual([quotes[0]]);
  });

  it('não altera a lista original', () => {
    const copy = [...quotes];
    filterQuotes(quotes, 'vida');
    expect(quotes).toEqual(copy);
  });
});

describe('isNumberSearch', () => {
  it.each([['2', true], ['#12', true], [' 7 ', true], ['abc', false], ['#', false], ['', false], ['1a', false]])(
    '"%s" é busca por número? %p',
    (value, expected) => {
      expect(isNumberSearch(value)).toBe(expected);
    }
  );
});
