export const siteConfig = {
  author: 'Antoine Patron',

  site: 'https://darkbriks.github.io',
  base: '/',

  locales: ['fr', 'en'] as const,

  theme: 'default',

  links: [
    { kind: 'github', url: 'https://github.com/Darkbriks', label: 'GitHub' },
    { kind: 'mail', url: 'mailto:antoine.patron@proton.me', label: 'Mail' },
    { kind: 'mail', url: 'mailto:Antoine.Patron@etu.univ-grenoble-alpes.fr', label: 'Mail UGA' },
  ],
} as const;

export type Locale = (typeof siteConfig.locales)[number];
export const defaultLocale: Locale = siteConfig.locales[0];
