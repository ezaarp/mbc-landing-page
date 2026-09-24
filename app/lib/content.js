import fm from "front-matter";
import {
  fetchPublicItems,
  fetchPublicItemBySlug,
  fetchPublicHome,
  normalizeItem,
} from "./compro-api.js";

// Vite requires static, literal glob patterns — one per collection.
const MODULES = {
  projects: import.meta.glob("../content/projects/*.md", { eager: true, query: "?raw", import: "default" }),
  research: import.meta.glob("../content/research/*.md", { eager: true, query: "?raw", import: "default" }),
  events:   import.meta.glob("../content/events/*.md",   { eager: true, query: "?raw", import: "default" }),
  awards:   import.meta.glob("../content/awards/*.md",   { eager: true, query: "?raw", import: "default" }),
};

function parseGroup(modules) {
  return Object.entries(modules)
    .map(([path, raw]) => {
      const slug = path.split("/").pop().replace(/\.md$/, "");
      const { attributes, body } = fm(raw);
      return normalizeItem({ slug, ...attributes, body });
    })
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

const CONTENT = {
  projects: parseGroup(MODULES.projects),
  research: parseGroup(MODULES.research),
  events: parseGroup(MODULES.events),
  awards: parseGroup(MODULES.awards),
  blogs: [],
};

// Legacy synchronous helpers
export function getAll(group) {
  return CONTENT[group] ?? [];
}

export function getBySlug(group, slug) {
  return (CONTENT[group] ?? []).find((item) => item.slug === slug) ?? null;
}

// Live per-division tally derived from markdown frontmatter
export function getDivisionCounts() {
  const counts = {};
  const tally = (group) => {
    for (const item of CONTENT[group] ?? []) {
      const name = item.division?.trim();
      if (!name) continue;
      (counts[name] ??= { projects: 0, research: 0 })[group] += 1;
    }
  };
  tally("projects");
  tally("research");
  return counts;
}

const isProduction =
  (typeof process !== "undefined" && process.env?.NODE_ENV === "production") ||
  (typeof import.meta !== "undefined" && import.meta.env?.PROD === true);

/**
 * Async helper to fetch collection items with API preference and offline dev fallback.
 * Fixes F01 (authoritative empty array) and F11 (fetch up to 100 items so awards/research aren't truncated).
 */
export async function getPublicItems(group, params = {}) {
  // If an explicit page is requested by caller, fetch just that single page
  if (params.page !== undefined) {
    const queryParams = { limit: 100, ...params };
    const { items } = await fetchPublicItems(group, queryParams);
    return Array.isArray(items) ? items : [];
  }

  // Otherwise, fetch all pages iteratively to ensure no records beyond 100 are truncated (G09)
  const queryParams = { limit: 100, ...params, page: 1 };
  try {
    const firstPage = await fetchPublicItems(group, queryParams);
    if (!Array.isArray(firstPage.items)) {
      return [];
    }

    let allItems = [...firstPage.items];
    const totalPages = firstPage.pagination?.totalPages || 1;

    for (let p = 2; p <= totalPages; p++) {
      const nextPage = await fetchPublicItems(group, { ...queryParams, page: p });
      if (Array.isArray(nextPage.items)) {
        allItems.push(...nextPage.items);
      }
    }

    return allItems;
  } catch (err) {
    console.warn(`CMS API unavailable for ${group}:`, err.message);
    if (isProduction) {
      // In production, strictly do not fall back to stale legacy markdown files
      throw err;
    }
  }
  // Offline development fallback only
  return getAll(group);
}

/**
 * Async helper to fetch single detail by slug with API preference.
 * If API returns 404 (unpublished/deleted), throws genuine 404 without resurrecting legacy files.
 */
export async function getPublicItemBySlug(group, slug) {
  try {
    const item = await fetchPublicItemBySlug(group, slug);
    if (item) return item;
    // API returned null (404 Not Found): item is unpublished or does not exist
    throw new Response("Not Found", { status: 404 });
  } catch (err) {
    if (err instanceof Response) {
      throw err;
    }
    console.warn(`CMS API unavailable for ${group}/${slug}:`, err.message);
    if (isProduction) {
      throw err;
    }
    // Offline development fallback only
    const fallback = getBySlug(group, slug);
    if (!fallback) {
      throw new Response("Not Found", { status: 404 });
    }
    return fallback;
  }
}

/**
 * Async helper to fetch aggregate home data with fallback.
 * Fixes F01: does not fall back if API succeeds, even if featured lists are empty.
 */
export async function getPublicHomeData() {
  try {
    const data = await fetchPublicHome();
    if (data) {
      return data;
    }
  } catch (err) {
    console.warn("CMS API unavailable for home data:", err.message);
    if (isProduction) {
      throw err;
    }
  }

  // Offline development fallback only
  const projects = getAll("projects");
  const research = getAll("research");
  const awards = getAll("awards");
  const events = getAll("events");

  const recruit = events.find((e) => e.tag === "Recruitment") || events[0] || null;

  return {
    featured_projects: projects.slice(0, 4),
    featured_research: research.slice(0, 3),
    recent_awards: awards.slice(0, 4),
    upcoming_event: recruit,
    recent_blogs: [],
    division_counts: getDivisionCounts(),
    counts: {
      projects: projects.length,
      research: research.length,
      awards: awards.length,
      events: events.length,
      blogs: 0,
    },
  };
}
