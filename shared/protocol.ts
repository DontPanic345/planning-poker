export type CardValue = string;

export const DECKS = {
  doub: ['1', '2', '4', '8', '?', '☕'],
  fib: ['1', '2', '3', '5', '8', '13', '?', '☕'],
} as const satisfies Record<string, readonly CardValue[]>;
export type DeckName = keyof typeof DECKS;
export const DEFAULT_DECK: readonly CardValue[] = DECKS.doub;

export const MAX_DECK_SIZE = 10;
export const MAX_CARD_GRAPHEMES = 3;

export const MAX_NAME_GRAPHEMES = 3;
export const MAX_NAME_LENGTH = 32;

export interface PlayedCard {
  /** Increments on every play, so a swapped card is a new card on the table. */
  n: number;
  /** null while the coin is face-down, except for the viewer's own card. */
  v: CardValue | null;
}

export interface PlayerView {
  pid: string;
  name: string;
  seat: number;
  connected: boolean;
  card: PlayedCard | null;
}

export interface RoomView {
  you: string;
  faceUp: boolean;
  deck: CardValue[];
  /** The fireworks are loaded and launch when every played card shows the same number. */
  armed: boolean;
  /** Increments on every launch. */
  launches: number;
  players: PlayerView[];
}

export type ClientMessage =
  | { t: 'join'; secret: string; name: string; deck?: CardValue[] }
  | { t: 'rename'; name: string }
  | { t: 'play'; card: CardValue }
  | { t: 'unplay' }
  | { t: 'flip' }
  | { t: 'clear' }
  | { t: 'arm' };

export type ServerMessage = { t: 'state'; state: RoomView } | { t: 'error'; reason: string };

/** Close code sent to a socket whose player was claimed by a newer connection. */
export const CLOSE_REPLACED = 4001;

/** A deck of 2 to MAX_DECK_SIZE distinct, short card faces, or null. */
export function cleanDeck(raw: unknown): CardValue[] | null {
  if (!Array.isArray(raw) || raw.length < 2 || raw.length > MAX_DECK_SIZE) {
    return null;
  }
  const deck: CardValue[] = [];
  for (const c of raw) {
    if (typeof c !== 'string') {
      return null;
    }
    const face = c.trim();
    const length = graphemes(face).length;
    if (!length || length > MAX_CARD_GRAPHEMES || face.length > 16 || face.includes(',') || deck.includes(face)) {
      return null;
    }
    deck.push(face);
  }
  return deck;
}

/** Reads `?deck=fib`, `?deck=doub` or a list of faces such as `?deck=1,3,5,?` from a page's query string. */
export function deckFromQuery(params: URLSearchParams): CardValue[] | null {
  const deck = params.get('deck');
  if (deck === null) {
    return null;
  }
  if (Object.hasOwn(DECKS, deck)) {
    return [...DECKS[deck as DeckName]];
  }
  return cleanDeck(deck.split(','));
}

/** The query string that reproduces `deck` with deckFromQuery; empty for the default deck. */
export function deckQuery(deck: readonly CardValue[]): string {
  const same = (a: readonly CardValue[]) => a.length === deck.length && a.every((c, i) => c === deck[i]);
  if (same(DEFAULT_DECK)) {
    return '';
  }
  for (const [name, cards] of Object.entries(DECKS)) {
    if (same(cards)) {
      return `?deck=${name}`;
    }
  }
  return `?deck=${deck.map((c) => encodeURIComponent(c).replaceAll('%3F', '?')).join(',')}`;
}

export function cardNumber(v: CardValue | null): number | null {
  if (v === null) {
    return null;
  }
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });

export function graphemes(s: string): string[] {
  return Array.from(segmenter.segment(s), (g) => g.segment);
}

export function cleanName(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const name = graphemes(raw.trim().replace(/\s+/g, ''))
    .slice(0, MAX_NAME_GRAPHEMES)
    .join('');
  if (!name || name.length > MAX_NAME_LENGTH) return null;
  return name.replace(/[a-z]/g, (c) => c.toUpperCase());
}

export const ROOM_CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
export const ROOM_CODE_PATTERN = /^[A-Z0-9]{4,12}$/;
