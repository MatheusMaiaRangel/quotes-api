import translations from '@/data/quote-translations.json';
import { translateQuote } from '@/services/quote-translations';
import { makeQuote } from '../helpers/fixtures';

describe('translateQuote', () => {
  it('troca o texto pela tradução quando ela existe', () => {
    const original = makeQuote({ id: 1, quote: 'original em inglês' });

    const translated = translateQuote(original);

    expect(translated.quote).toBe((translations as Record<string, string>)['1']);
    expect(translated.author).toBe(original.author);
  });

  it('mantém o texto original quando não há tradução', () => {
    const original = makeQuote({ id: 9001 });
    expect(translateQuote(original)).toEqual(original);
  });

  it('não altera o objeto original', () => {
    const original = makeQuote({ id: 1, quote: 'original' });
    translateQuote(original);
    expect(original.quote).toBe('original');
  });
});
