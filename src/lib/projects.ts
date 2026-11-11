import { getCollection, type CollectionEntry } from 'astro:content';
import { defaultLocale, type Locale } from '../../site.config';
import { locales } from './i18n';

export type ProjectMeta = CollectionEntry<'projects'>['data'];
export type ProjectText = CollectionEntry<'projectTexts'>;

export interface Project {
  slug: string;
  meta: ProjectMeta;
  lang: Locale;
  text: ProjectText;
  translated: boolean;
  availableIn: Locale[];
}

const showDrafts = import.meta.env.DEV;

export async function getProjects(lang: Locale): Promise<Project[]> {
  const [metas, texts] = await Promise.all([getCollection('projects'), getCollection('projectTexts')]);
  const byId = new Map(texts.map((e) => [e.id, e]));

  const out: Project[] = [];
  for (const { id: slug, data: meta } of metas) {
    if (meta.draft && !showDrafts) continue;
    const availableIn = locales.filter((l) => byId.has(`${slug}/${l}`));
    const chosen =
      byId.get(`${slug}/${lang}`) ??
      byId.get(`${slug}/${defaultLocale}`) ??
      (availableIn[0] && byId.get(`${slug}/${availableIn[0]}`));
    if (!chosen) {
      console.warn(`[portfolio] project "${slug}" has no text in any language`);
      continue;
    }
    out.push({ slug, meta, lang, text: chosen, translated: chosen.id.endsWith(`/${lang}`), availableIn });
  }

  return out.sort((a, b) => b.meta.order - a.meta.order || +b.meta.date - +a.meta.date);
}

export async function projectPaths() {
  const paths = [];
  for (const lang of locales) {
    for (const project of await getProjects(lang)) {
      paths.push({ params: { lang, slug: project.slug }, props: { project } });
    }
  }
  return paths;
}
