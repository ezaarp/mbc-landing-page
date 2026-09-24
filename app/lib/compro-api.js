/**
 * Compro CMS API Client for LabLink Content Endpoints
 */

const DEFAULT_API_URL = "https://lablink.mbclaboratory.com";

export function getApiBaseUrl() {
  if (typeof process !== "undefined" && process.env?.CMS_API_URL) {
    return process.env.CMS_API_URL.replace(/\/+$/, "");
  }
  if (typeof import.meta !== "undefined" && import.meta.env?.VITE_CMS_API_URL) {
    return import.meta.env.VITE_CMS_API_URL.replace(/\/+$/, "");
  }
  return DEFAULT_API_URL;
}

export async function apiFetch(path, options = {}) {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${path}`;
  const timeoutMs = options.timeoutMs ?? 5000;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...(options.headers || {}),
      },
    });
    clearTimeout(timeoutId);
    return res;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

/**
 * Normalizes a CMS published item or snapshot into the format expected by Compro components.
 */
export function normalizeItem(item) {
  if (!item) return null;
  const metadata = item.metadata || {};
  const additionalImages = Array.isArray(metadata.images) ? metadata.images : [];
  const images = [];
  if (item.cover_image) images.push(item.cover_image);
  for (const img of additionalImages) {
    if (img && !images.includes(img)) images.push(img);
  }

  return {
    ...item,
    summary: item.excerpt ?? item.summary ?? "",
    body: item.content_markdown ?? item.body ?? "",
    images: images.length > 0 ? images : (metadata.images || []),
    links: metadata.links || item.links || {},
    order: item.sort_order ?? item.order ?? 0,
    tags: Array.isArray(item.tags) ? item.tags : [],
  };
}

/**
 * Fetches published items for a collection with optional filters.
 */
export async function fetchPublicItems(type, params = {}) {
  const query = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") {
      query.set(k, String(v));
    }
  }
  const qs = query.toString() ? `?${query.toString()}` : "";
  const res = await apiFetch(`/api/public/compro/v1/${type}${qs}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch public ${type}: HTTP ${res.status}`);
  }
  const json = await res.json();
  const items = (json.data || []).map(normalizeItem);
  return { items, pagination: json.pagination };
}

/**
 * Fetches single published item by slug.
 */
export async function fetchPublicItemBySlug(type, slug) {
  const res = await apiFetch(`/api/public/compro/v1/${type}/${encodeURIComponent(slug)}`);
  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    throw new Error(`Failed to fetch public ${type}/${slug}: HTTP ${res.status}`);
  }
  const json = await res.json();
  return normalizeItem(json.data);
}

/**
 * Fetches aggregate public home payload.
 */
export async function fetchPublicHome() {
  const res = await apiFetch(`/api/public/compro/v1/home`);
  if (!res.ok) {
    throw new Error(`Failed to fetch public home: HTTP ${res.status}`);
  }
  const json = await res.json();
  const d = json.data || {};
  return {
    featured_projects: (d.featured_projects || []).map(normalizeItem),
    featured_research: (d.featured_research || []).map(normalizeItem),
    recent_awards: (d.recent_awards || []).map(normalizeItem),
    upcoming_event: d.upcoming_event ? normalizeItem(d.upcoming_event) : null,
    recent_blogs: (d.recent_blogs || []).map(normalizeItem),
    division_counts: d.division_counts || {},
    counts: d.counts || {},
  };
}

/**
 * Fetches public taxonomy.
 */
export async function fetchPublicTaxonomy() {
  const res = await apiFetch(`/api/public/compro/v1/taxonomy`);
  if (!res.ok) {
    throw new Error(`Failed to fetch taxonomy: HTTP ${res.status}`);
  }
  const json = await res.json();
  return json.data || { categories: [], tags: [] };
}

/**
 * Fetches public sitemap paths.
 */
export async function fetchPublicSitemap() {
  const res = await apiFetch(`/api/public/compro/v1/sitemap`);
  if (!res.ok) {
    throw new Error(`Failed to fetch sitemap: HTTP ${res.status}`);
  }
  const json = await res.json();
  return json.data || [];
}
