import { getEntry, type CollectionEntry } from 'astro:content';

export type Cv = CollectionEntry<'cv'>['data'];

export async function getCv(): Promise<Cv> {
  const entry = await getEntry('cv', 'cv');
  if (!entry) throw new Error('src/content/cv/cv.yaml not found');
  return entry.data;
}
