/**
 * Prefixes an internal path with the site's base path, so links work both at a domain root
 * (https://example.com/about/) and in a sub-folder like GitHub Pages (https://user.github.io/hocaoglu-photography-website/about/).
 */
export function url(path = '/'): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
}
