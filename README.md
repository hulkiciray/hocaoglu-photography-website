# Ismail Photography website

A fast, gallery-style portfolio site built with [Astro](https://astro.build): newborn, children, wedding and custom
sessions, each made of albums, with a justified photo grid and a full-screen lightbox.

## Run it

Requires [Bun](https://bun.sh) (or Node 18.20+ with `npm`).

```bash
bun install          # once
bun run dev          # local preview at http://localhost:4321
bun run build        # production site → dist/
bun run preview      # preview the production build
```

## Adding photos (the only thing you'll do regularly)

Every folder in `src/photos/` is an album:

```
src/photos/
  newborn/
    baby-defne/          ← album folder (becomes /newborn/baby-defne/)
      album.json         ← optional: title, location, date, cover…
      01.jpg
      02.jpg
  children/  weddings/  custom/
```

1. Create a folder inside the right category, named in lowercase with dashes (`ayse-and-mehmet-izmir`).
2. Copy the photos in. They're shown in file-name order, so `01.jpg`, `02.jpg`… gives you control.
   Export at around **2400–3000 px on the long edge**. The site makes all the smaller sizes automatically.
3. Optionally add an `album.json`:

   ```json
   {
     "title": "Ayşe & Mehmet",
     "subtitle": "A garden wedding in spring",
     "location": "İzmir",
     "date": "2026-04",
     "description": "Longer text shown at the top of the album.",
     "cover": "07.jpg",
     "order": 1
   }
   ```

   All fields are optional. Without a title, the folder name is used. Albums are sorted by `order`, then newest `date`.

4. **Exhibition wall (optional).** To hang an album like framed prints in a gallery (white mats, spotlights,
   museum labels), add to its `album.json`:

   ```json
   {
     "layout": "exhibition",
     "wallTone": "charcoal",
     "captions": { "01.jpg": "Waiting", "03.jpg": "Morning light" }
   }
   ```

   - `wallTone`: `"linen"` (light wall, default) or `"charcoal"` (dark viewing room).
   - `captions`: the italic title on each photo's label. Photos without one show the album title.
   - Works best for albums of 6–12 photos. The home page's "Selected works" section always uses this wall.

A category with **one** album shows its photos directly; with **several**, it shows album cards.

**The sample albums are placeholders.** Delete them once you add real work:

```bash
rm -rf src/photos/*/*     # removes ALL albums, so only run this before adding your own
```

…and replace `src/assets/about.jpg` with a real portrait. (`bun run placeholders` regenerates the samples.)

## Changing text

Everything (name, tagline, phone, WhatsApp, Instagram, category descriptions, testimonials, FAQ) is in
**`src/site.config.ts`**. The about page story is in `src/pages/about.astro`.

Before launch:

- [ ] Replace the placeholder testimonials with real client reviews.
- [ ] Set real email / phone / WhatsApp / Instagram in `site.config.ts`.
- [ ] Set up the contact form: create a free form at [formspree.io](https://formspree.io) and paste its URL into
      `formEndpoint`. Until then, the form opens the visitor's email app.
- [ ] Set the real domain in `astro.config.mjs` (`site:`).
- [ ] Make sure you have parents' / couples' permission for every photo you publish.

## Privacy & image handling

- Visitors only ever get resized, re-encoded copies (AVIF/WebP/JPEG) with **camera metadata (EXIF, incl. GPS) removed**.
- A small build step in `astro.config.mjs` deletes the untouched originals that Astro would otherwise copy into `dist/`.

## Deploying

The output in `dist/` is a plain static site. Free options:

- **Cloudflare Pages / Netlify / Vercel:** connect the Git repo with build command `bun run build` and output folder `dist`.
- Or drag-and-drop the `dist/` folder into Netlify.
