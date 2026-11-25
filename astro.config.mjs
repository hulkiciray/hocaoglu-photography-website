// @ts-check
import { defineConfig } from 'astro/config';
import { readdir, readFile, unlink } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Astro copies the untouched original photos into the build even though the site only uses the resized
 * versions. Originals can contain camera EXIF data (including GPS location — important for photos of
 * children) and are needlessly large, so this removes every image that no page actually references.
 */
function removeUnusedOriginals() {
  return {
    name: 'remove-unused-original-images',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        const files = await readdir(root, { recursive: true });
        let text = '';
        for (const f of files) {
          if (/\.(html|js|css|xml|json|txt)$/.test(f)) text += await readFile(join(root, f), 'utf8');
        }
        let removed = 0;
        for (const f of files) {
          if (!f.startsWith('_astro') || !/\.(jpe?g|png|webp|avif|tiff?|heic)$/i.test(f)) continue;
          const name = f.split(/[\\/]/).pop();
          if (name && !text.includes(name)) {
            await unlink(join(root, f));
            removed++;
          }
        }
        logger.info(`Removed ${removed} unused original image(s) from the build.`);
      },
    },
  };
}

export default defineConfig({
  // Live address. Hosted on GitHub Pages in the /ismail-website/ sub-folder.
  // With your own domain later: set `site` to it (e.g. 'https://ismailphotography.com') and remove `base`.
  site: 'https://hulkiciray.github.io',
  base: '/ismail-website',
  // Turn off the floating dev toolbar so it doesn't cover the photos while you work.
  devToolbar: { enabled: false },
  integrations: [removeUnusedOriginals()],
});
