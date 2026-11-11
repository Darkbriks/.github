import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const localized = z.union([z.string(), z.object({ fr: z.string(), en: z.string() }).partial()]);

const linkKind = z.enum(['repo', 'video', 'demo', 'doc', 'paper', 'download', 'other']);

const projects = defineCollection({
  loader: glob({
    pattern: '*/project.yaml',
    base: './src/content/projects',
    generateId: ({ entry }) => entry.split('/')[0],
  }),
  schema: ({ image }) =>
    z.object({
      date: z.coerce.date(),
      status: z.enum(['done', 'wip', 'paused', 'archived']).default('done'),
      tags: z.array(z.string()).default([]),
      cover: image().optional(),
      coverAlt: localized.optional(),
      links: z
        .array(z.object({ kind: linkKind, url: z.string().url(), label: localized.optional() }))
        .default([]),
      featured: z.boolean().default(false),
      order: z.number().default(0),
      draft: z.boolean().default(false),
    }),
});

const projectTexts = defineCollection({
  loader: glob({
    pattern: '*/{fr,en}.{md,mdx}',
    base: './src/content/projects',
    generateId: ({ entry }) => entry.replace(/\.mdx?$/, ''),
  }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
  }),
});

/* ------------------------------------------------------------------ CV */

const yearMonth = z.union([z.string().regex(/^\d{4}(-\d{2})?$/), z.literal('present')]);

const cvEntry = z.object({
  title: localized,
  org: localized.optional(),
  location: localized.optional(),
  url: z.string().url().optional(),
  start: yearMonth.optional(),
  end: yearMonth.optional(),
  description: localized.optional(),
  highlights: z.array(localized).default([]),
});

const cv = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/cv' }),
  schema: z.object({
    name: z.string(),
    headline: localized,
    location: localized.optional(),
    email: z.string().email().optional(),
    links: z.array(z.object({ kind: z.string(), url: z.string().url(), label: localized })).default([]),
    summary: localized.optional(),
    education: z.array(cvEntry).default([]),
    experience: z.array(cvEntry).default([]),
    skills: z.array(z.object({ group: localized, items: z.array(z.string()) })).default([]),
    languages: z.array(z.object({ name: localized, level: localized })).default([]),
    interests: z.array(localized).default([]),
    pdf: z.record(z.string(), z.string()).optional(),
  }),
});

export const collections = { projects, projectTexts, cv };
