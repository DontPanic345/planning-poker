import type { Point } from './layout.ts';

interface Rocket {
  from: Point;
  to: Point;
  start: number;
  dur: number;
  color: string;
  kind: 'peony' | 'ring' | 'willow';
  burst: boolean;
}

interface Spark {
  x: number;
  y: number;
  px: number;
  py: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
  size: number;
  color: string;
  drag: number;
  gravity: number;
  twinkle: boolean;
}

const GOLD = '#ffd166';
const rand = (lo: number, hi: number) => lo + Math.random() * (hi - lo);
const pick = <T>(xs: readonly T[]) => xs[Math.floor(Math.random() * xs.length)];

export function mountSky(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let rockets: Rocket[] = [];
  let sparks: Spark[] = [];
  let frame = 0;
  let last = 0;

  function fit() {
    const dpr = Math.min(2, devicePixelRatio || 1);
    const w = Math.round(innerWidth * dpr);
    const h = Math.round(innerHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function burst(r: Rocket) {
    const unit = Math.min(innerWidth, innerHeight);
    const big = reduceMotion.matches ? 0.6 : 1;
    const count = Math.round((r.kind === 'ring' ? 46 : 80) * big);
    const reach = unit * rand(0.16, 0.24);
    const second = Math.random() < 0.35 ? pick([GOLD, '#ffffff', r.color]) : r.color;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + rand(-0.05, 0.05);
      const speed = r.kind === 'ring' ? reach * 2.1 : reach * 2.4 * Math.sqrt(Math.random());
      const willow = r.kind === 'willow';
      sparks.push({
        x: r.to.x,
        y: r.to.y,
        px: r.to.x,
        py: r.to.y,
        vx: Math.cos(a) * speed,
        vy: Math.sin(a) * speed,
        age: 0,
        life: willow ? rand(1.8, 2.6) : rand(1.1, 1.7),
        size: rand(1.6, 2.6),
        color: willow ? GOLD : i % 3 === 0 ? second : r.color,
        drag: willow ? 2.6 : 2.2,
        gravity: unit * (willow ? 0.32 : 0.22),
        twinkle: willow || Math.random() < 0.25,
      });
    }
    sparks.push({
      x: r.to.x,
      y: r.to.y,
      px: r.to.x,
      py: r.to.y,
      vx: 0,
      vy: 0,
      age: 0,
      life: 0.25,
      size: reach * 0.5,
      color: '#ffffff',
      drag: 0,
      gravity: 0,
      twinkle: false,
    });
  }

  function step(now: number) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    fit();
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';

    for (const r of rockets) {
      const t = (now - r.start) / r.dur;
      if (t < 0 || r.burst) {
        continue;
      }
      if (t >= 1) {
        r.burst = true;
        burst(r);
        continue;
      }
      const e = 1 - (1 - t) * (1 - t);
      const x = r.from.x + (r.to.x - r.from.x) * e;
      const y = r.from.y + (r.to.y - r.from.y) * e;
      sparks.push({
        x,
        y,
        px: x,
        py: y,
        vx: rand(-12, 12),
        vy: rand(10, 40),
        age: 0,
        life: rand(0.25, 0.5),
        size: rand(1, 1.8),
        color: GOLD,
        drag: 3,
        gravity: 60,
        twinkle: true,
      });
      ctx.fillStyle = '#fff6d8';
      ctx.beginPath();
      ctx.arc(x, y, 2.4, 0, Math.PI * 2);
      ctx.fill();
    }
    rockets = rockets.filter((r) => !r.burst);

    for (const s of sparks) {
      s.age += dt;
      s.px = s.x;
      s.py = s.y;
      const k = Math.exp(-s.drag * dt);
      s.vx *= k;
      s.vy = s.vy * k + s.gravity * dt;
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      const left = 1 - s.age / s.life;
      if (left <= 0) {
        continue;
      }
      let alpha = left ** 1.4;
      if (s.twinkle && left < 0.6 && Math.random() < 0.4) {
        alpha *= 0.15;
      }
      ctx.globalAlpha = alpha;
      if (s.vx === 0 && s.vy === 0) {
        const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size);
        glow.addColorStop(0, 'rgba(255,255,255,0.55)');
        glow.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        continue;
      }
      ctx.strokeStyle = s.color;
      ctx.lineWidth = s.size;
      ctx.beginPath();
      ctx.moveTo(s.px - s.vx * dt * 2, s.py - s.vy * dt * 2);
      ctx.lineTo(s.x, s.y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    sparks = sparks.filter((s) => s.age < s.life);

    if (rockets.length || sparks.length) {
      frame = requestAnimationFrame(step);
    } else {
      frame = 0;
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      canvas.classList.remove('live');
    }
  }

  return {
    /** Fires a volley from `from`, starting after `delay` ms. */
    launch(from: Point, colors: readonly string[], delay = 0) {
      const now = performance.now() + delay;
      const W = innerWidth;
      const H = innerHeight;
      const plan = reduceMotion.matches ? [0, 600] : [0, 320, 620, 950, 1250, 1600, 2050, 2080];
      plan.forEach((offset, i) => {
        rockets.push({
          from: { x: from.x + rand(-6, 6), y: from.y },
          to: { x: W * (0.5 + (i % 2 ? 1 : -1) * rand(0.08, 0.36)), y: H * rand(0.1, 0.4) },
          start: now + offset,
          dur: rand(850, 1150),
          color: pick(colors),
          kind: i >= plan.length - 2 ? 'willow' : pick(['peony', 'peony', 'ring'] as const),
          burst: false,
        });
      });
      canvas.classList.add('live');
      if (!frame) {
        last = performance.now();
        frame = requestAnimationFrame(step);
      }
    },
  };
}
