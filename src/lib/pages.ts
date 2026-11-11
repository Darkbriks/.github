import { getEntry, type CollectionEntry } from 'astro:content';
import { defaultLocale, type Locale } from '../../site.config';

export type PageText = CollectionEntry<'pages'>;

export async function getPageText(page: string, lang: Locale): Promise<PageText | undefined> {
  return (await getEntry('pages', `${page}/${lang}`)) ?? (await getEntry('pages', `${page}/${defaultLocale}`));
}
