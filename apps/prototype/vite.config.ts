import { defineConfig, type Plugin, type Connect } from 'vite';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dir = dirname(fileURLToPath(import.meta.url));

function animSettingsPlugin(): Plugin {
  const filePath = resolve(__dir, 'anim-settings.json');

  return {
    name: 'anim-settings',
    configureServer(server) {
      const handler: Connect.NextHandleFunction = (req, res, next) => {
        if (!req.url?.startsWith('/api/settings')) return next();

        if (req.method === 'GET') {
          const data = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : '{}';
          res.setHeader('Content-Type', 'application/json');
          res.end(data);
          return;
        }

        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
          req.on('end', () => {
            try {
              fs.writeFileSync(filePath, JSON.stringify(JSON.parse(body), null, 2));
              res.setHeader('Content-Type', 'application/json');
              res.end('{"ok":true}');
            } catch {
              res.statusCode = 400;
              res.end('{"error":"invalid json"}');
            }
          });
          return;
        }

        res.statusCode = 405;
        res.end();
      };

      server.middlewares.use(handler);
    },
  };
}

const INCLUDE_RE = /<!--\s*@include\s+([\w./-]+)\s*-->/g;

function htmlIncludePlugin(): Plugin {
  return {
    name: 'html-include',
    enforce: 'pre',
    transformIndexHtml(html, ctx) {
      const baseDir = ctx.filename
        ? dirname(ctx.filename)
        : __dir;
      return html.replace(INCLUDE_RE, (_match, partial: string) => {
        const candidates = [
          resolve(baseDir, partial),
          resolve(__dir, 'shared', partial),
          resolve(__dir, partial),
        ];
        for (const candidate of candidates) {
          if (fs.existsSync(candidate)) {
            return fs.readFileSync(candidate, 'utf-8');
          }
        }
        throw new Error(`[html-include] Could not resolve partial: ${partial}`);
      });
    },
  };
}

const HTML_PAGES = [
  'index', 'about', 'login', 'email', 'verification', 'api-key', 'name',
  'plugins', 'plugin-content', 'plugin-build', 'favourites', 'tools', 'settings',
  'button', 'input', 'tab-bar', 'list-item', 'search-input', 'sub-header',
  'docs',
];

export default defineConfig({
  plugins: [htmlIncludePlugin(), animSettingsPlugin()],
  resolve: {
    alias: {
      '@kosmo/ui/styles.css': resolve(__dir, '../../packages/kosmo-ui/src/index.css'),
      '@kosmo/ui/tokens.css': resolve(__dir, '../../packages/kosmo-ui/src/tokens/index.css'),
      '@kosmo/ui/tokens': resolve(__dir, '../../packages/kosmo-ui/src/tokens/index.ts'),
      '@kosmo/ui': resolve(__dir, '../../packages/kosmo-ui/src/index.ts'),
    },
  },
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        HTML_PAGES.map((name) => [name, resolve(__dir, `${name}.html`)]),
      ),
    },
  },
});
