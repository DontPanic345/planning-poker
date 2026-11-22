import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cleanDeck, DECKS, deckFromQuery, deckQuery } from './protocol.ts';

const query = (s: string) => deckFromQuery(new URLSearchParams(s));

test('named decks and lists of faces come from the deck param', () => {
  assert.deepEqual(query('?deck=fib'), DECKS.fib);
  assert.deepEqual(query('?deck=doub'), DECKS.doub);
  assert.deepEqual(query('?deck=XS,S,M,L,XL'), ['XS', 'S', 'M', 'L', 'XL']);
  assert.equal(query('?deck=nope'), null);
  assert.equal(query(''), null);
});

test('a custom deck needs two to ten distinct short faces', () => {
  assert.equal(cleanDeck(['1']), null);
  assert.equal(cleanDeck(['1', '1']), null);
  assert.equal(cleanDeck(['1', 'LONG']), null);
  assert.equal(cleanDeck(['1', '']), null);
  assert.equal(cleanDeck(['1', 'a,b']), null);
  assert.equal(cleanDeck(Array.from({ length: 11 }, (_, i) => String(i))), null);
  assert.deepEqual(cleanDeck([' 1', '☕', '100']), ['1', '☕', '100']);
});

test('deckQuery round-trips through deckFromQuery', () => {
  assert.equal(deckQuery(DECKS.doub), '');
  assert.equal(deckQuery(DECKS.fib), '?deck=fib');
  assert.equal(deckQuery(['XS', 'S', '?']), '?deck=XS,S,?');
  for (const deck of [[...DECKS.fib], ['½', '1', '?', '☕'], ['S&M', '#1', '50%']]) {
    assert.deepEqual(query(deckQuery(deck)), deck);
  }
});
