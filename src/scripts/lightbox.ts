/**
 * Full-screen lightbox for every element marked with `data-lightbox`.
 * Its direct `<a>` links (href = large image, data-pswp-width/height = its size) become the slides.
 */
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

document.querySelectorAll<HTMLElement>('[data-lightbox]').forEach((gallery) => {
  const lightbox = new PhotoSwipeLightbox({
    gallery,
    children: 'a[data-pswp-width]',
    pswpModule: () => import('photoswipe'),
    bgOpacity: 0.97,
    showHideAnimationType: 'zoom',
    imageClickAction: 'zoom',
    tapAction: 'toggle-controls',
    preload: [1, 2],
    paddingFn: (viewport) =>
      viewport.x > 900 ? { top: 40, bottom: 40, left: 72, right: 72 } : { top: 0, bottom: 0, left: 0, right: 0 },
  });
  lightbox.init();
});
