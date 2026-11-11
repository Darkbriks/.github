import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeMermaid from 'rehype-mermaid';
import { siteConfig } from './site.config';

const themeDir = fileURLToPath(new URL(`./src/themes/${siteConfig.theme}`, import.meta.url));

export default defineConfig({
  site: process.env.SITE ?? siteConfig.site,
  base: process.env.BASE ?? siteConfig.base,
  trailingSlash: 'always',
  build: { format: 'directory' },

  integrations: [
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: siteConfig.locales[0],
        locales: Object.fromEntries(siteConfig.locales.map((l) => [l, l])),
      },
    }),
  ],

  markdown: {
    syntaxHighlight: { type: 'shiki', excludeLangs: ['mermaid', 'math'] },
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
      wrap: false,
      transformers: [
        {
          name: 'code-meta',
          pre(node) {
            node.properties['data-lang'] = this.options.lang;
            const title = /title="([^"]+)"/.exec(this.options.meta?.__raw ?? '')?.[1];
            if (title) node.properties['data-title'] = title;
          },
        },
      ],
    },
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [
        [rehypeKatex, { strict: 'ignore' }],
        [
          rehypeMermaid,
          {
            strategy: 'img-svg',
            dark: true,
            launchOptions: process.env.MERMAID_BROWSER
              ? { executablePath: process.env.MERMAID_BROWSER }
              : undefined,
          },
        ],
      ],
    }),
  },

  vite: {
    resolve: {
      alias: { '@theme': themeDir },
    },
  },
});
