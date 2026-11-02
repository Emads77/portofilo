// Loads the built site at three widths, saves screenshots, and fails on layout bugs.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const root = path.resolve('dist');
const out = path.resolve('screenshots');
const widths = [375, 768, 1440];
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2', '.woff': 'font/woff' };

const server = http.createServer((req, res) => {
  const rel = decodeURIComponent(req.url.split('?')[0]);
  const file = path.join(root, rel === '/' ? 'index.html' : rel);
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file)) {
    res.writeHead(404);
    return res.end();
  }
  res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
  res.end(fs.readFileSync(file));
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const url = `http://127.0.0.1:${server.address().port}/`;

fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const problems = [];

for (const width of widths) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(out, `${width}.png`), fullPage: true });

  const found = await page.evaluate(() => {
    const issues = [];
    const viewport = document.documentElement.clientWidth;
    const name = (el) => `<${el.tagName.toLowerCase()}${el.className ? ` class="${el.className}"` : ''}>`;
    const visible = (el) => {
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return r.width > 0 && r.height > 0 && s.display !== 'none' && s.visibility !== 'hidden';
    };

    if (document.documentElement.scrollWidth > viewport) {
      issues.push(`horizontal scroll: ${document.documentElement.scrollWidth}px wide in a ${viewport}px viewport`);
    }

    for (const parent of document.querySelectorAll('body, body *')) {
      const kids = [...parent.children].filter((el) => visible(el) && !['SCRIPT', 'STYLE'].includes(el.tagName));
      for (let a = 0; a < kids.length; a++) {
        for (let b = a + 1; b < kids.length; b++) {
          const ra = kids[a].getBoundingClientRect();
          const rb = kids[b].getBoundingClientRect();
          const x = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left);
          const y = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top);
          if (x > 1 && y > 1) issues.push(`overlap: ${name(kids[a])} and ${name(kids[b])}`);
        }
      }
    }

    for (const el of document.querySelectorAll('h1, h2, h3, p, li, a, dt, dd, span, button')) {
      if (!visible(el) || getComputedStyle(el).display === 'inline' || !el.textContent.trim()) continue;
      if (el.scrollHeight > el.clientHeight + 2) issues.push(`clipped text: ${name(el)} "${el.textContent.trim().slice(0, 40)}"`);
    }
    return issues;
  });

  problems.push(...found.map((issue) => `${width}px: ${issue}`));

  const a11y = await new AxeBuilder({ page }).analyze();
  for (const issue of a11y.violations) {
    problems.push(`${width}px: accessibility: ${issue.id} (${issue.nodes.length}): ${issue.help}`);
  }
  await context.close();
}

await browser.close();
server.close();

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log(`OK at ${widths.join(', ')}px. Screenshots are in ${out}`);
