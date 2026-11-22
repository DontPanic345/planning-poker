import { test } from 'node:test';
import assert from 'node:assert/strict';
import { averageText, displayCells, modeText } from './calculator.ts';

const shown = (text: string | null) =>
  displayCells(text)
    .map((c) => c.glyph + (c.dot ? '.' : ''))
    .join('');

test('average rounds to two places', () => {
  assert.equal(averageText([1, 2, 4]), '2.33');
  assert.equal(averageText([4, 4]), '4');
  assert.equal(averageText([]), null);
});

test('mode picks the most played number', () => {
  assert.equal(modeText([2, 4, 4, 8]), '4');
  assert.equal(modeText([8]), '8');
});

test('a two-way tie shows both numbers, a wider tie shows none', () => {
  assert.equal(modeText([8, 2, 2, 8]), '2-8');
  assert.equal(modeText([1, 2, 4]), null);
  assert.equal(modeText([]), null);
});

test('the display right-aligns and dots whole numbers only', () => {
  assert.equal(shown('4'), '   4.');
  assert.equal(shown('2.33'), ' 2.33');
  assert.equal(shown('2-8'), ' 2-8');
  assert.equal(shown(null), '----');
});
