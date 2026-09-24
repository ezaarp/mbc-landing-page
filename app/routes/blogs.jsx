import { useLoaderData, Link } from "react-router";
import { Clock, User } from "lucide-react";
import { getPublicItems } from "../lib/content";
import { pageMeta } from "../lib/seo";

export function meta() {
  return pageMeta({
    title: "Blog & Insights · MBC Lab",
    description: "Articles, technical notes, and updates from the assistants of MBC Laboratory.",
    path: "/blog",
  });
}

export async function loader() {
  const items = await getPublicItems("blogs");
  return { items };
}

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function Blogs() {
  const { items } = useLoaderData();

  return (
    <section className="mx-auto max-w-page px-6 pb-20 pt-28 lg:px-10">
      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--ink-3)]">
        Insights &amp; Stories
      </p>
      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-[var(--ink)] sm:text-4xl">
        Lab Blog
      </h1>
      <p className="mt-3 max-w-2xl font-body text-base text-[var(--ink-2)]">
        Technical write-ups, project deep dives, and stories from the laboratory.
      </p>

      {items.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-12 text-center">
          <p className="font-mono text-sm text-[var(--ink-3)]">No articles published yet. Stay tuned!</p>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((b) => (
            <Link
              key={b.slug}
              to={`/blog/${b.slug}`}
              className="group flex flex-col rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5 transition-all hover:border-brand-blue/50 hover:shadow-sm"
            >
              {b.cover_image && (
                <img
                  src={b.cover_image}
                  alt={b.title}
                  loading="lazy"
                  className="mb-4 aspect-[16/10] w-full rounded-lg object-cover"
                />
              )}

              <div className="flex items-center gap-3 font-mono text-[11px] text-[var(--ink-3)]">
                {b.byline && (
                  <span className="flex items-center gap-1">
                    <User size={12} />
                    {b.byline}
                  </span>
                )}
                {b.reading_time && (
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {b.reading_time} min read
                  </span>
                )}
              </div>

              <h3 className="mt-3 font-display text-lg font-bold leading-snug text-[var(--ink)] group-hover:text-brand-blue">
                {b.title}
              </h3>

              {b.summary && (
                <p className="mt-2 flex-1 font-body text-sm leading-relaxed text-[var(--ink-2)] line-clamp-3">
                  {b.summary}
                </p>
              )}

              <div className="mt-4 flex items-center justify-between border-t border-[var(--line)] pt-3 text-[11px] font-mono text-[var(--ink-3)]">
                <span>{formatDate(b.published_at)}</span>
                <span className="text-brand-blue group-hover:translate-x-0.5 transition-transform">Read →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
