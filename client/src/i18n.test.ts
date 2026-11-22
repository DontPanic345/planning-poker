import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LANGUAGES, pickLanguage } from './i18n.ts';

const placeholders = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();

test('every translation keeps the English placeholders', () => {
  for (const [lang, dict] of Object.entries(LANGUAGES)) {
    for (const [key, text] of Object.entries(LANGUAGES.en)) {
      assert.deepEqual(placeholders(dict[key as keyof typeof dict]), placeholders(text), `${lang}.${key}`);
    }
  }
});

test('the query wins, then the first supported browser language, then English', () => {
  assert.equal(pickLanguage('de', ['fr-FR']), 'de');
  assert.equal(pickLanguage(null, ['mi-NZ', 'pt-BR', 'en']), 'pt');
  assert.equal(pickLanguage('xx', ['ZH-Hans']), 'zh');
  assert.equal(pickLanguage(null, ['mi']), 'en');
});
