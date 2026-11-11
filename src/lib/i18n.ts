import { siteConfig, defaultLocale, type Locale } from '../../site.config';

export const locales = siteConfig.locales;

export type Localized = string | Partial<Record<Locale, string>>;

/** Resolves a localized value to a string in the given language, falling back to the default locale or any available value. */
export function t(value: Localized | undefined, lang: Locale): string {
  if (value === undefined) return '';
  if (typeof value === 'string') return value;
  return value[lang] ?? value[defaultLocale] ?? Object.values(value)[0] ?? '';
}

export function isLocale(x: string | undefined): x is Locale {
  return (locales as readonly string[]).includes(x ?? '');
}

export const langPaths = () => locales.map((lang) => ({ params: { lang } }));

/** Returns a URL path for the given parts, prefixed with the base URL and ensuring proper slashes. */
export function href(...parts: string[]): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const path = parts.filter(Boolean).join('/').replace(/^\/+|\/+$/g, '');
  return `${base}/${path}${path ? '/' : ''}`;
}

export const routes = {
  home: (lang: Locale) => href(lang),
  project: (lang: Locale, slug: string) => href(lang, 'projects', slug),
  cv: (lang: Locale) => href(lang, 'cv'),
};

export function otherLocales(lang: Locale): Locale[] {
  return locales.filter((l) => l !== lang);
}

export function formatDate(value: string | Date, lang: Locale, presentLabel = ''): string {
  if (value === 'present') return presentLabel;
  if (value instanceof Date) {
    return value.toLocaleDateString(lang, { year: 'numeric', month: 'long' });
  }
  const [y, m] = value.split('-');
  if (!m) return y;
  return new Date(Number(y), Number(m) - 1).toLocaleDateString(lang, { year: 'numeric', month: 'short' });
}
