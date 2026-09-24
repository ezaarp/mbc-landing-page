import { readdir } from "node:fs/promises";
import path from "node:path";

const CMS_API_URL = process.env.CMS_API_URL || "https://lablink.mbclaboratory.com";

async function localSlugs(group) {
  try {
    const dir = path.join(process.cwd(), "app", "content", group);
    const files = await readdir(dir);
    return files.filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));
  } catch {
    return [];
  }
}

/** @type {import('@react-router/dev/config').Config} */
export default {
  // Cloudflare Pages requires static output (ssr: false) with prerendered HTML
  ssr: false,
  async prerender() {
    const staticRoutes = ["/", "/projects", "/research", "/events", "/awards", "/blog"];
    let apiRoutes = [];


    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(`${CMS_API_URL}/api/public/compro/v1/sitemap`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.data)) {
          apiRoutes = json.data.map((i) => i.url);
        }
      }
    } catch {
      // CMS offline during build
    }

    if (apiRoutes.length > 0) {
      return Array.from(new Set([...staticRoutes, ...apiRoutes]));
    }

    const [p, r, e, a] = await Promise.all([
      localSlugs("projects"),
      localSlugs("research"),
      localSlugs("events"),
      localSlugs("awards"),
    ]);

    return [
      ...staticRoutes,
      ...p.map((s) => `/projects/${s}`),
      ...r.map((s) => `/research/${s}`),
      ...e.map((s) => `/events/${s}`),
      ...a.map((s) => `/awards/${s}`),
    ];
  },
};
