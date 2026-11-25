/**
 * All of the site's text and contact details live here.
 * Edit this file to change names, phone numbers, category descriptions, FAQs, etc.
 */

export const site = {
  name: 'Ismail Photography',
  /** Short line under the name on the home page. */
  tagline: 'Newborn, children & wedding photography',
  /** Used for search engines and link previews. */
  description:
    'Timeless newborn, children, wedding and portrait photography. Natural light, gentle sessions and images you will keep for a lifetime.',
  city: 'Istanbul',

  email: 'hello@example.com',
  /** Shown as text on the contact page. */
  phoneDisplay: '+90 500 000 00 00',
  /** Digits only, with country code. Leave empty ('') to hide the WhatsApp buttons. */
  whatsapp: '905000000000',
  instagramUrl: 'https://instagram.com/yourhandle',
  instagramHandle: '@yourhandle',

  /**
   * Where the contact form is sent. Create a free form at https://formspree.io and paste its URL here,
   * e.g. 'https://formspree.io/f/abcdwxyz'. While it's empty, the form opens the visitor's email app instead.
   */
  formEndpoint: '',
};

export type CategoryId = 'newborn' | 'children' | 'weddings' | 'custom';

export interface Category {
  /** Must match the folder name in src/photos/ and becomes the URL (/newborn, /weddings …). */
  id: CategoryId;
  /** Short name for menus and tiles. */
  title: string;
  /** Page heading. */
  heading: string;
  /** One line for the home page tile. */
  blurb: string;
  /** Paragraph at the top of the category page. */
  intro: string;
}

/** Order here = order in the menu and on the home page. */
export const categories: Category[] = [
  {
    id: 'newborn',
    title: 'Newborn',
    heading: 'Newborn Photography',
    blurb: 'The first, fleeting days',
    intro:
      'Newborn sessions are calm, unhurried and led entirely by your baby. We work in a warm studio or in your home during the first two weeks, when babies are sleepiest, using soft natural light and simple, timeless setups.',
  },
  {
    id: 'children',
    title: 'Children',
    heading: 'Children Photography',
    blurb: 'Curious, wild and wonderful',
    intro:
      'No stiff poses, no "say cheese". Children sessions are playful and relaxed: we explore, run, laugh and let their personality lead, outdoors or at home, so the photos look like your child really is.',
  },
  {
    id: 'weddings',
    title: 'Weddings',
    heading: 'Wedding Photography',
    blurb: 'Your day, told as a story',
    intro:
      'From the quiet moments of getting ready to the last dance, I document your wedding as it unfolds: honest emotion, beautiful light and the small details you might otherwise miss. Each wedding below is its own story.',
  },
  {
    id: 'custom',
    title: 'Custom',
    heading: 'Custom Sessions',
    blurb: 'Maternity, family & more',
    intro:
      'Maternity, family portraits, engagements, birthdays or something entirely your own. Tell me what you have in mind and we will plan a session around it.',
  },
];

/**
 * PLACEHOLDERS: replace these with real reviews from your clients before going live.
 */
export const testimonials = [
  {
    quote:
      'Replace this with a real client review. A short, specific quote about how the session felt works best.',
    name: 'Client name',
    session: 'Newborn session',
  },
  {
    quote:
      'Replace this with a real client review. Mention something concrete, like how relaxed the children were.',
    name: 'Client name',
    session: 'Family session',
  },
  {
    quote:
      'Replace this with a real client review. Couples love reading what other couples felt on the day.',
    name: 'Client names',
    session: 'Wedding',
  },
];

export const faqs = [
  {
    q: 'When should we book a newborn session?',
    a: 'Ideally during pregnancy. The session itself usually takes place 5–14 days after birth, and we pick the exact day once your baby arrives.',
  },
  {
    q: 'How long does a session take?',
    a: 'Children and family sessions take about 1 hour. Newborn sessions take 2–3 hours, because we pause for feeding and cuddles whenever needed.',
  },
  {
    q: 'When will we receive our photos?',
    a: 'Portrait sessions are delivered within 2 weeks, weddings within 6 weeks, in a private online gallery you can download from and share.',
  },
  {
    q: 'Do you travel?',
    a: 'Yes. Sessions within the city are included, and destination weddings are very welcome. Just ask.',
  },
];
