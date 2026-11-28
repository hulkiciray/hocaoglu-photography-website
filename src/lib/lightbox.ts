import { getImage } from 'astro:assets';
import type { Photo } from './photos';

const FULL_WIDTH = 2400;

/** Large WebP version of a photo for the full-screen lightbox, with its exact pixel size. */
export async function lightboxImage(photo: Photo) {
  const width = Math.min(FULL_WIDTH, photo.image.width);
  const height = Math.round((photo.image.height * width) / photo.image.width);
  const full = await getImage({ src: photo.image, width, format: 'webp', quality: 85 });
  return { src: full.src, width, height };
}
