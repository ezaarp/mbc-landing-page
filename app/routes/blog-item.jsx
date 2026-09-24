import { useLoaderData, Link } from "react-router";
import { Clock, User } from "lucide-react";
import { getPublicItemBySlug } from "../lib/content";
import { pageMeta } from "../lib/seo";
import Markdown from "../components/Markdown";

export async function clientLoader({ params }) {
  const item = await getPublicItemBySlug("blogs", params.slug);
  return { item };
}
clientLoader.hydrate = true;


function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export function meta({ data, location }) {
  if (!data?.item) return [{ title: "Not found · MBC Lab" }];
  const { item } = data;
  return pageMeta({
    title: `${item.title} · Blog · MBC Lab`,
    description: item.summary || `Article by ${item.byline ?? "MBC Lab"}.`,
    path: location.pathname,
    image: item.cover_image ?? "/logo.png",
  });
}

export default function BlogDetail() {
  const { item } = useLoaderData();

  return (
    <article className="mx-auto max-w-3xl px-6 pb-24 pt-28 lg:px-8">
      <Link
        to="/blog"
        className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-blue hover:underline"
      >
        ← Blog
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-4 font-mono text-xs text-[var(--ink-3)]">
        {item.byline && (
          <span className="flex items-center gap-1.5 font-medium text-[var(--ink)]">
            <User size={13} />
            {item.byline}
          </span>
        )}
        <span>{formatDate(item.published_at)}</span>
        {item.reading_time && (
          <span className="flex items-center gap-1">
            <Clock size={13} />
            {item.reading_time} min read
          </span>
        )}
      </div>

      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-[var(--ink)] sm:text-4xl">
        {item.title}
      </h1>

      {item.summary && (
        <p className="mt-4 font-body text-lg leading-relaxed text-[var(--ink-2)] italic">
          {item.summary}
        </p>
      )}

      {item.tags && item.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="rounded bg-[var(--surface-2)] px-2.5 py-0.5 font-mono text-[10px] text-[var(--ink-3)]"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {item.cover_image && (
        <div className="mt-8 overflow-hidden rounded-2xl border border-[var(--line)]">
          <img
            src={item.cover_image}
            alt={item.cover_image_alt || item.title}
            className="aspect-[16/9] w-full object-cover"
          />
        </div>
      )}

      {item.body && (
        <div className="prose prose-sm sm:prose-base mt-8">
          <Markdown>{item.body}</Markdown>
        </div>
      )}
    </article>
  );
}
