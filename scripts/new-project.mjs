#!/usr/bin/env node
// npm run new -- my-new-project
import { mkdir, writeFile, access } from 'node:fs/promises';
import { join } from 'node:path';

const slug = process.argv[2];
if (!slug || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
  console.error('Usage : npm run new -- <slug-in-lowercase-with-dashes>');
  process.exit(1);
}

const dir = join('src', 'content', 'projects', slug);
try {
  await access(dir);
  console.error(`${dir} already exists. Please choose another slug.`);
  process.exit(1);
} catch {}

await mkdir(dir, { recursive: true });
const today = new Date().toISOString().slice(0, 10);

await writeFile(
  join(dir, 'project.yaml'),
  `date: ${today}
status: wip            # done | wip | paused | archived
tags: []
# cover: ./cover.png
# coverAlt: { fr: ..., en: ... }
links: []
#  - kind: repo         # repo | video | demo | doc | paper | download | other
#    url: https://github.com/...
draft: true
`,
);

for (const [lang, title, summary] of [
  ['fr', 'Titre du projet', 'Une phrase de présentation.'],
  ['en', 'Project title', 'One-sentence summary.'],
]) {
  await writeFile(join(dir, `${lang}.mdx`), `---\ntitle: ${title}\nsummary: ${summary}\n---\n\n`);
}

console.log(`Project ${slug} created in ${dir} with draft=true. Edit project.yaml to change status and draft.`);
