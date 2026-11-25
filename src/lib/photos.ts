/**
 * Builds the portfolio from the folder structure in src/photos:
 *
 *   src/photos/<category>/<album-slug>/01.jpg, 02.jpg, …
 *   src/photos/<category>/<album-slug>/album.json   (optional title, location, cover …)
 *
 * Add a folder → a new album appears. No code changes needed.
 */
import type { ImageMetadata } from 'astro';
import { categories, type Category, type CategoryId } from '../site.config';

export interface AlbumInfo {
  title?: string;
  subtitle?: string;
  location?: string;
  /** e.g. "2026-06" or "June 2026" — shown as-is, and used for sorting (newest first). */
  date?: string;
  description?: string;
  /** File name of the cover photo, e.g. "04.jpg". Defaults to the first photo. */
  cover?: string;
  /** Lower numbers come first. Albums without it are sorted by date. */
  order?: number;
}

export interface Photo {
  image: ImageMetadata;
  file: string;
  alt: string;
}

export interface Album {
  category: CategoryId;
  slug: string;
  title: string;
  subtitle?: string;
  location?: string;
  date?: string;
  description?: string;
  order: number;
  photos: Photo[];
  cover: Photo;
}

const imageModules = import.meta.glob<{ default: ImageMetadata }>(
  '/src/photos/*/*/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}',
  { eager: true },
);
const infoModules = import.meta.glob<AlbumInfo>('/src/photos/*/*/album.json', {
  eager: true,
  import: 'default',
});

const titleFromSlug = (slug: string) =>
  slug
    .split('-')
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ');

function buildAlbums(): Album[] {
  const validIds = new Set(categories.map((c) => c.id));
  const grouped = new Map<string, { category: CategoryId; slug: string; files: [string, ImageMetadata][] }>();

  for (const [path, mod] of Object.entries(imageModules)) {
    // "/src/photos/<category>/<slug>/<file>"
    const [, , , category, slug, file] = path.split('/');
    if (!validIds.has(category as CategoryId)) continue;
    const key = `${category}/${slug}`;
    if (!grouped.has(key)) grouped.set(key, { category: category as CategoryId, slug, files: [] });
    grouped.get(key)!.files.push([file, mod.default]);
  }

  const albums: Album[] = [];
  for (const [key, { category, slug, files }] of grouped) {
    const info = infoModules[`/src/photos/${key}/album.json`] ?? {};
    const title = info.title ?? titleFromSlug(slug);
    const categoryTitle = categories.find((c) => c.id === category)!.title;

    files.sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }));
    const photos: Photo[] = files.map(([file, image], i) => ({
      image,
      file,
      alt: `${title}, ${categoryTitle.toLowerCase()} photography, photo ${i + 1}`,
    }));

    albums.push({
      category,
      slug,
      title,
      subtitle: info.subtitle,
      location: info.location,
      date: info.date,
      description: info.description,
      order: info.order ?? Number.MAX_SAFE_INTEGER,
      photos,
      cover: photos.find((p) => p.file === info.cover) ?? photos[0],
    });
  }

  return albums.sort(
    (a, b) =>
      a.order - b.order ||
      (b.date ?? '').localeCompare(a.date ?? '') ||
      a.title.localeCompare(b.title),
  );
}

const allAlbums = buildAlbums();

export const getCategory = (id: string): Category | undefined => categories.find((c) => c.id === id);

export const getAlbums = (category?: CategoryId): Album[] =>
  category ? allAlbums.filter((a) => a.category === category) : allAlbums;

export const getAlbum = (category: string, slug: string): Album | undefined =>
  allAlbums.find((a) => a.category === category && a.slug === slug);

/** Cover photo for a category tile: the first album's cover. */
export const getCategoryCover = (category: CategoryId): Photo | undefined => getAlbums(category)[0]?.cover;

export const albumUrl = (a: Pick<Album, 'category' | 'slug'>) => `/${a.category}/${a.slug}/`;

/** Formats "2026-06" as "June 2026"; any other text is returned unchanged. */
export function formatDate(date?: string): string | undefined {
  if (!date) return undefined;
  const m = /^(\d{4})-(\d{2})$/.exec(date);
  if (!m) return date;
  return new Date(Number(m[1]), Number(m[2]) - 1, 1).toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  });
}
