/**
 * Generates soft, abstract placeholder "photos" so the site can be previewed before real photos exist.
 * Run:  bun scripts/make-placeholders.mjs        (skips albums that already have photos)
 *       bun scripts/make-placeholders.mjs --force (regenerates the placeholder albums)
 *
 * Delete the sample album folders in src/photos/ once you add real work.
 */
import sharp from 'sharp';
import { mkdir, readdir, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('../src/', import.meta.url).pathname;
const force = process.argv.includes('--force');

const palettes = {
  newborn: ['#f3e6dc', '#e8d2c4', '#d9c1b1', '#cdd5c6', '#f0e2d2', '#bfa595'],
  children: ['#f2d6a2', '#e8b487', '#a7c4c6', '#f0cbb2', '#c3d4a2', '#d98f6c'],
  weddings: ['#efe8dc', '#d8c5a4', '#98a38d', '#5d6a59', '#c7b197', '#3f4a3d'],
  custom: ['#d9a37e', '#b5815e', '#8a6a55', '#e5c7a6', '#6e7c69', '#f0dcc4'],
  about: ['#e9dccb', '#c9a27e', '#8b6f5a', '#f4ece1', '#5d5048'],
};

const albums = [
  {
    category: 'newborn', slug: 'baby-defne', count: 9,
    info: { title: 'Baby Defne', subtitle: 'Eight days new, wrapped in morning light', location: 'Studio', date: '2026-10', order: 1 },
  },
  {
    category: 'newborn', slug: 'baby-aras', count: 7,
    info: { title: 'Baby Aras', subtitle: 'A lifestyle newborn session at home', location: 'Kadıköy', date: '2026-08' },
  },
  {
    category: 'children', slug: 'mila-in-the-garden', count: 9,
    info: { title: 'Mila in the Garden', subtitle: 'Bare feet, bubbles and late summer sun', location: 'Emirgan Park', date: '2026-09' },
  },
  {
    category: 'children', slug: 'brothers-by-the-sea', count: 8,
    info: { title: 'Brothers by the Sea', subtitle: 'Two boys, one beach and endless energy', location: 'Şile', date: '2026-07' },
  },
  {
    category: 'weddings', slug: 'elif-and-can-bodrum', count: 12,
    info: {
      title: 'Elif & Can', subtitle: 'A golden-hour wedding by the Aegean', location: 'Bodrum', date: '2026-06',
      description: 'An intimate seaside celebration with sixty guests, a sunset ceremony and dancing until the early hours.',
    },
  },
  {
    category: 'weddings', slug: 'zeynep-and-emre-istanbul', count: 10,
    info: { title: 'Zeynep & Emre', subtitle: 'A Bosphorus wedding in early autumn', location: 'Istanbul', date: '2026-09' },
  },
  {
    category: 'weddings', slug: 'selin-and-mert-cappadocia', count: 9,
    info: { title: 'Selin & Mert', subtitle: 'Sunrise vows among the fairy chimneys', location: 'Cappadocia', date: '2026-05' },
  },
  {
    category: 'custom', slug: 'maternity-ayse', count: 7,
    info: { title: 'Ayşe, Maternity', subtitle: 'Waiting for the little one', location: 'Studio', date: '2026-08',
      layout: 'exhibition', captions: { '01.jpg': 'Waiting', '03.jpg': 'Morning light', '05.jpg': 'Hands' } },
  },
  {
    category: 'custom', slug: 'family-in-autumn', count: 8,
    info: { title: 'The Yılmaz Family', subtitle: 'An autumn afternoon in the woods', location: 'Belgrad Forest', date: '2026-11', layout: 'exhibition', wallTone: 'charcoal' },
  },
];

const ratios = [3 / 2, 2 / 3, 4 / 5, 2 / 3, 3 / 2, 5 / 4, 1, 16 / 10, 3 / 4, 2 / 3];
const LONG_EDGE = 1800;

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const hash = (s) => [...s].reduce((h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) | 0, 7);

/** Renders at a small size (it's all blur anyway) and lets sharp upscale smoothly. */
function art(w, h, palette, rand) {
  const pick = () => palette[Math.floor(rand() * palette.length)];
  const m = Math.max(w, h);
  const blobs = Array.from({ length: 7 + Math.floor(rand() * 5) }, () => {
    const r = m * (0.12 + rand() * 0.38);
    return `<circle cx="${(rand() * w).toFixed(1)}" cy="${(rand() * h).toFixed(1)}" r="${r.toFixed(1)}" fill="${pick()}" opacity="${(0.45 + rand() * 0.5).toFixed(2)}"/>`;
  }).join('');
  const bokeh = Array.from({ length: 10 + Math.floor(rand() * 14) }, () => {
    const r = m * (0.008 + rand() * 0.03);
    return `<circle cx="${(rand() * w).toFixed(1)}" cy="${(rand() * h * 0.7).toFixed(1)}" r="${r.toFixed(1)}" fill="#fffaf2" opacity="${(0.15 + rand() * 0.35).toFixed(2)}"/>`;
  }).join('');
  const angle = Math.floor(rand() * 360);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g" gradientTransform="rotate(${angle} .5 .5)">
      <stop offset="0" stop-color="${pick()}"/><stop offset="1" stop-color="${pick()}"/>
    </linearGradient>
    <filter id="b" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${(m * 0.07).toFixed(1)}"/></filter>
    <filter id="s" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${(m * 0.006).toFixed(1)}"/></filter>
    <radialGradient id="v" cx=".5" cy=".45" r=".75">
      <stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#1a120c" stop-opacity=".35"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <g filter="url(#b)">${blobs}</g>
  <g filter="url(#s)">${bokeh}</g>
  <rect width="100%" height="100%" fill="url(#v)"/>
</svg>`;
}

async function render(file, ratio, palette, seed) {
  const rand = rng(seed);
  const [W, H] = ratio >= 1 ? [LONG_EDGE, Math.round(LONG_EDGE / ratio)] : [Math.round(LONG_EDGE * ratio), LONG_EDGE];
  const scale = 0.25;
  const small = Buffer.from(art(Math.round(W * scale), Math.round(H * scale), palette, rand));
  // A touch of film grain so it reads less like a flat gradient.
  const noise = await sharp({ create: { width: W, height: H, channels: 3, noise: { type: 'gaussian', mean: 128, sigma: 18 } } })
    .png()
    .toBuffer();
  await sharp(small)
    .resize(W, H, { kernel: 'cubic' })
    .composite([{ input: noise, blend: 'soft-light' }])
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(file);
}

for (const album of albums) {
  const dir = join(ROOT, 'photos', album.category, album.slug);
  if (existsSync(dir)) {
    const hasPhotos = (await readdir(dir)).some((f) => /\.(jpe?g|png|webp|avif)$/i.test(f));
    if (hasPhotos && !force) {
      console.log(`skip   ${album.category}/${album.slug} (already has photos)`);
      continue;
    }
    if (force) await rm(dir, { recursive: true });
  }
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, 'album.json'), JSON.stringify(album.info, null, 2) + '\n');
  const offset = Math.abs(hash(album.slug)) % ratios.length;
  for (let i = 0; i < album.count; i++) {
    const name = String(i + 1).padStart(2, '0') + '.jpg';
    await render(join(dir, name), ratios[(i + offset) % ratios.length], palettes[album.category], hash(album.slug) + i * 101);
  }
  console.log(`made   ${album.category}/${album.slug} (${album.count} photos)`);
}

const aboutFile = join(ROOT, 'assets', 'about.jpg');
if (!existsSync(aboutFile) || force) {
  await mkdir(join(ROOT, 'assets'), { recursive: true });
  await render(aboutFile, 4 / 5, palettes.about, 4242);
  console.log('made   assets/about.jpg');
}
