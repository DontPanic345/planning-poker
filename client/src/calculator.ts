import { t } from './i18n.ts';
import type { Geometry, Point } from './layout.ts';

const DIGITS = 4;
const SVG_NS = 'http://www.w3.org/2000/svg';
const DRAG_THRESHOLD = 5;
const TABLE_DEFAULT: Spot = { u: 0, v: 0.55 };
const ASPECT = 0.84;

/** Segments a–g: top, top-right, bottom-right, bottom, bottom-left, top-left, middle. */
const GLYPHS: Record<string, string> = {
  '0': 'abcdef',
  '1': 'bc',
  '2': 'abdeg',
  '3': 'abcdg',
  '4': 'bcfg',
  '5': 'acdfg',
  '6': 'acdefg',
  '7': 'abc',
  '8': 'abcdefg',
  '9': 'abcdfg',
  '-': 'g',
  ' ': '',
};

/** Where the calculator sits on the table, relative to the felt's centre and radii. */
interface Spot {
  u: number;
  v: number;
}

interface Cell {
  glyph: string;
  dot: boolean;
}

function hex(x0: number, y0: number, x1: number, y1: number, t: number): string {
  const h = t / 2;
  const pts =
    y0 === y1
      ? [
          [x0, y0],
          [x0 + h, y0 - h],
          [x1 - h, y0 - h],
          [x1, y0],
          [x1 - h, y0 + h],
          [x0 + h, y0 + h],
        ]
      : [
          [x0, y0],
          [x0 + h, y0 + h],
          [x0 + h, y1 - h],
          [x0, y1],
          [x0 - h, y1 - h],
          [x0 - h, y0 + h],
        ];
  return pts.map(([x, y]) => `${x},${y}`).join(' ');
}

const T = 2.2;
const SEGMENTS: Record<string, string> = {
  a: hex(1.7, 1, 10.3, 1, T),
  b: hex(11, 1.7, 11, 9.3, T),
  c: hex(11, 10.7, 11, 18.3, T),
  d: hex(1.7, 19, 10.3, 19, T),
  e: hex(1, 10.7, 1, 18.3, T),
  f: hex(1, 1.7, 1, 9.3, T),
  g: hex(1.7, 10, 10.3, 10, T),
};

export type Reading = 'avg' | 'mode';

/** Rounded to as many of two decimal places as the display has room for. */
export function averageText(numbers: number[]): string | null {
  if (!numbers.length) {
    return null;
  }
  const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
  const whole = String(Math.round(mean)).length;
  const places = Math.max(0, Math.min(2, DIGITS - whole));
  return String(Math.round(mean * 10 ** places) / 10 ** places);
}

/** The most played number; a two-way tie reads as `2-4`, and a wider tie has no mode. */
export function modeText(numbers: number[]): string | null {
  const counts = new Map<number, number>();
  for (const n of numbers) {
    counts.set(n, (counts.get(n) ?? 0) + 1);
  }
  const top = Math.max(0, ...counts.values());
  const modes = [...counts]
    .filter(([, c]) => c === top)
    .map(([n]) => n)
    .sort((a, b) => a - b);
  if (!modes.length || modes.length > 2) {
    return null;
  }
  return modes.join('-');
}

/** Right-aligned, with the trailing decimal point a calculator shows on a whole number. */
export function displayCells(text: string | null): Cell[] {
  if (text === null) {
    return Array.from({ length: DIGITS }, () => ({ glyph: '-', dot: false }));
  }
  const cells: Cell[] = [];
  for (const ch of text) {
    if (ch === '.') {
      cells[cells.length - 1].dot = true;
    } else {
      cells.push({ glyph: ch, dot: false });
    }
  }
  if (/^\d+$/.test(text)) {
    cells[cells.length - 1].dot = true;
  }
  if (cells.length > DIGITS) {
    return displayCells(null);
  }
  while (cells.length < DIGITS) {
    cells.unshift({ glyph: ' ', dot: false });
  }
  return cells.slice(-DIGITS);
}

export interface CalculatorOptions {
  el: HTMLElement;
  shelf: HTMLElement;
  load(key: string): string | null;
  save(key: string, value: string | null): void;
  /** Distance from the top of the window to the shelf. */
  shelfTop(): number;
}

export function mountCalculator(opts: CalculatorOptions) {
  const { el, shelf } = opts;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let spot = parseSpot(opts.load('pp:calc'));
  let reading: Reading = opts.load('pp:calc-reading') === 'mode' ? 'mode' : 'avg';
  let numbers: number[] | null = null;
  let g: Geometry | null = null;
  let shown = '';
  let scrambleTimer = 0;
  let drag: { id: number; start: Point; offset: Point; moved: boolean } | null = null;

  const svg = el.querySelector<SVGSVGElement>('.calc-digits')!;
  svg.setAttribute('viewBox', `0 0 ${DIGITS * 15 + 1} 22`);
  const cellEls = Array.from({ length: DIGITS }, (_, i) => {
    const group = document.createElementNS(SVG_NS, 'g');
    group.setAttribute('transform', `translate(${i * 15 + 2.5} 1) skewX(-6)`);
    const segs: Record<string, SVGElement> = {};
    for (const [name, points] of Object.entries(SEGMENTS)) {
      const poly = document.createElementNS(SVG_NS, 'polygon');
      poly.setAttribute('points', points);
      poly.classList.add('seg');
      group.append(poly);
      segs[name] = poly;
    }
    const dot = document.createElementNS(SVG_NS, 'circle');
    dot.setAttribute('cx', '13.6');
    dot.setAttribute('cy', '19');
    dot.setAttribute('r', '1.25');
    dot.classList.add('seg');
    group.append(dot);
    svg.append(group);
    return { segs, dot };
  });

  function paint(cells: Cell[]) {
    cells.forEach((cell, i) => {
      const lit = GLYPHS[cell.glyph] ?? '';
      for (const [name, seg] of Object.entries(cellEls[i].segs)) {
        seg.classList.toggle('on', lit.includes(name));
      }
      cellEls[i].dot.classList.toggle('on', cell.dot);
    });
  }

  function show() {
    let text: string | null = null;
    if (numbers) {
      text = reading === 'mode' ? modeText(numbers) : averageText(numbers);
    }
    const cells = displayCells(text);
    const key = JSON.stringify(cells);
    if (key === shown) {
      return;
    }
    const first = shown === '';
    shown = key;
    clearInterval(scrambleTimer);
    if (first || reduceMotion.matches) {
      paint(cells);
      return;
    }
    let ticks = 0;
    scrambleTimer = window.setInterval(() => {
      ticks++;
      if (ticks > 6) {
        clearInterval(scrambleTimer);
        paint(cells);
        return;
      }
      paint(cells.map((c) => (c.glyph === ' ' ? c : { glyph: String(Math.floor(Math.random() * 10)), dot: c.dot })));
    }, 55);
  }

  function size(geo: Geometry) {
    const w = Math.min(104, Math.max(58, geo.tableCardH * 0.9));
    return { w, h: w * ASPECT };
  }

  function shelfRect(geo: Geometry) {
    const { w, h } = size(geo);
    const trayW = w * 0.82;
    const trayH = h * 1.18;
    const top = opts.shelfTop();
    return { left: geo.W - trayW, top, width: trayW, height: trayH, cy: top + trayH / 2 };
  }

  function place(p: Point, rot: number) {
    el.style.transform = `translate(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px) translate(-50%, -50%) rotate(${rot}deg)`;
  }

  function tablePoint(geo: Geometry, s: Spot): Point {
    const { w, h } = size(geo);
    const x = geo.cx + s.u * geo.tx;
    const y = geo.cy + s.v * geo.ty;
    return {
      x: Math.min(geo.W - w / 2 - 4, Math.max(w / 2 + 4, x)),
      y: Math.min(geo.H - h / 2 - 4, Math.max(h / 2 + 4, y)),
    };
  }

  function layout() {
    if (!g) {
      return;
    }
    const { w } = size(g);
    const tray = shelfRect(g);
    el.style.setProperty('--cw', `${w}px`);
    shelf.style.setProperty('--cw', `${w}px`);
    shelf.style.top = `${tray.top}px`;
    shelf.style.width = `${tray.width + 12}px`;
    shelf.style.height = `${tray.height}px`;
    el.classList.toggle('shelved', !spot);
    el.classList.toggle('mode', reading === 'mode');
    switchEl.setAttribute('aria-label', reading === 'mode' ? t('showingMode') : t('showingAvg'));
    el.title = spot ? t('calcShelve') : t('calcDrag');
    el.setAttribute('aria-label', spot ? t('calcShelve') : t('calcTake'));
    if (drag?.moved) {
      return;
    }
    if (spot) {
      place(tablePoint(g, spot), -3);
    } else {
      place({ x: g.W - w * 0.2, y: tray.cy }, -8);
    }
  }

  function settle(next: Spot | null) {
    spot = next;
    opts.save('pp:calc', spot && JSON.stringify(spot));
    layout();
  }

  const switchEl = el.querySelector<HTMLButtonElement>('.calc-switch')!;
  const longest = Math.max(...Array.from(switchEl.querySelectorAll('[data-reading]'), (s) => [...(s.textContent ?? '')].length));
  switchEl.style.setProperty('--chars', String(Math.max(4, longest)));
  switchEl.addEventListener('pointerdown', (ev) => ev.stopPropagation());
  switchEl.addEventListener('keydown', (ev) => ev.stopPropagation());
  switchEl.addEventListener('click', () => {
    reading = reading === 'avg' ? 'mode' : 'avg';
    opts.save('pp:calc-reading', reading);
    layout();
    show();
  });

  el.addEventListener('pointerdown', (ev) => {
    if (ev.button !== 0 || !g) {
      return;
    }
    const rect = el.getBoundingClientRect();
    drag = {
      id: ev.pointerId,
      start: { x: ev.clientX, y: ev.clientY },
      offset: { x: ev.clientX - (rect.left + rect.width / 2), y: ev.clientY - (rect.top + rect.height / 2) },
      moved: false,
    };
    el.setPointerCapture(ev.pointerId);
  });

  el.addEventListener('pointermove', (ev) => {
    if (!drag || drag.id !== ev.pointerId) {
      return;
    }
    if (!drag.moved && Math.hypot(ev.clientX - drag.start.x, ev.clientY - drag.start.y) < DRAG_THRESHOLD) {
      return;
    }
    drag.moved = true;
    el.classList.add('dragging');
    place({ x: ev.clientX - drag.offset.x, y: ev.clientY - drag.offset.y }, 0);
  });

  const endDrag = (ev: PointerEvent) => {
    if (!drag || drag.id !== ev.pointerId || !g) {
      return;
    }
    const { moved, offset } = drag;
    drag = null;
    el.classList.remove('dragging');
    if (!moved) {
      settle(spot ? null : TABLE_DEFAULT);
      return;
    }
    const tray = shelfRect(g);
    const x = ev.clientX - offset.x;
    const y = ev.clientY - offset.y;
    if (x > tray.left - 16 && y > tray.top - 16 && y < tray.top + tray.height + 16) {
      settle(null);
    } else {
      settle({ u: (x - g.cx) / g.tx, v: (y - g.cy) / g.ty });
    }
  };
  el.addEventListener('pointerup', endDrag);
  el.addEventListener('pointercancel', (ev) => {
    if (drag?.id === ev.pointerId) {
      drag = null;
      el.classList.remove('dragging');
      layout();
    }
  });

  el.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      settle(spot ? null : TABLE_DEFAULT);
    }
  });

  return {
    /** `faceUp` is null while the cards are face-down. */
    render(geo: Geometry, faceUp: number[] | null) {
      numbers = faceUp;
      const first = !g;
      g = geo;
      if (first) {
        el.style.transition = 'none';
      }
      layout();
      if (first) {
        void el.offsetWidth;
        el.style.transition = '';
      }
      show();
    },
  };
}

function parseSpot(raw: string | null): Spot | null {
  try {
    const s = JSON.parse(raw ?? 'null');
    if (s && Number.isFinite(s.u) && Number.isFinite(s.v)) {
      return { u: s.u, v: s.v };
    }
  } catch {}
  return null;
}
