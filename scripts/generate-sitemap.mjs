// Generates public/sitemap.xml from LabLink CMS public sitemap API with local file fallback.
// Runs before `react-router build`; Vite copies public/ into build/client,
// so the sitemap ships at https://mbclaboratory.com/sitemap.xml.
import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const BASE = "https://mbclaboratory.com";
const CMS_API_URL = process.env.CMS_API_URL || "http://localhost:3000";

const staticPaths = ["/", "/projects", "/research", "/events", "/awards", "/blog"];

let entries = [];
let apiSucceeded = false;

try {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);
  const res = await fetch(`${CMS_API_URL}/api/public/compro/v1/sitemap`, {
    signal: controller.signal,
  });
  clearTimeout(timeoutId);

  if (res.ok) {
    const json = await res.json();
    if (Array.isArray(json.data)) {
      apiSucceeded = true;
      entries = json.data.map((item) => ({
        url: `${BASE}${item.url}`,
        lastmod: item.lastmod ? item.lastmod.split("T")[0] : undefined,
      }));
    }
  }
} catch {
  // CMS API unreachable
}

if (apiSucceeded) {
  console.log(`sitemap: API authoritative response with ${entries.length} dynamic URLs`);
} else {
  // G09: Only fallback to filesystem if in offline/dev mode, never in production
  const allowFilesystemFallback =
    process.env.ALLOW_OFFLINE_SITEMAP === "true" ||
    process.env.NODE_ENV !== "production";

  if (allowFilesystemFallback) {
    console.warn("sitemap: CMS API unavailable. Using local filesystem fallback (offline/dev mode).");
    const groups = ["projects", "research", "events", "awards"];
    async function slugs(g) {
      try {
        const files = await readdir(path.join(process.cwd(), "app", "content", g));
        return files.filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));
      } catch {
        return [];
      }
    }

    const localPaths = [];
    for (const g of groups) {
      for (const s of await slugs(g)) {
        localPaths.push(`/${g}/${s}`);
      }
    }

    entries = localPaths.map((p) => ({ url: `${BASE}${p}` }));
  } else {
    console.warn("sitemap: CMS API unavailable. In production, refusing to resurrect local files without API authority.");
  }
}

// Prepend static paths if not already included
for (const sp of staticPaths) {
  const fullUrl = `${BASE}${sp}`;
  if (!entries.some((e) => e.url === fullUrl)) {
    entries.unshift({ url: fullUrl });
  }
}

const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  entries
    .map((e) => {
      if (e.lastmod) {
        return `  <url>\n    <loc>${e.url}</loc>\n    <lastmod>${e.lastmod}</lastmod>\n  </url>`;
      }
      return `  <url>\n    <loc>${e.url}</loc>\n  </url>`;
    })
    .join("\n") +
  `\n</urlset>\n`;

await writeFile(path.join(process.cwd(), "public", "sitemap.xml"), xml);
console.log(`sitemap: ${entries.length} urls total`);
