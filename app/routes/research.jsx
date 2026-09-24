import { useMemo, useState } from "react";
import { useLoaderData, Link } from "react-router";
import { getPublicItems } from "../lib/content";
import { divisions } from "../data/divisions";
import { pageMeta } from "../lib/seo";
import DivisionFilter from "../components/DivisionFilter";

export function meta() {
  return pageMeta({
    title: "Research · MBC Lab",
    description: "Papers and research from MBC Lab.",
    path: "/research",
  });
}

export async function loader() {
  const items = await getPublicItems("research");
  return { items };
}

export async function clientLoader() {
  const items = await getPublicItems("research");
  return { items };
}
clientLoader.hydrate = true;

export default function Research() {
  const { items } = useLoaderData();
  const [active, setActive] = useState(null);

  // Division options, ordered by the canonical divisions list, limited to those
  // actually present among the research papers.
  const options = useMemo(() => {
    const present = new Set(items.map((i) => i.division).filter(Boolean));
    return divisions.map((d) => d.name).filter((name) => present.has(name));
  }, [items]);

  const shown = active ? items.filter((r) => r.division === active) : items;

  return (
    <section className="mx-auto max-w-page px-6 pb-20 pt-28 lg:px-10">
      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--ink-3)]">Research</p>
      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-[var(--ink)] sm:text-4xl">
        Papers & publications
      </h1>
      <DivisionFilter options={options} active={active} onChange={setActive} />
      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {shown.map((r) => (
          <Link
            key={r.slug}
            to={`/research/${r.slug}`}
            className="group flex flex-col rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5 transition-colors hover:border-[var(--ink-3)]"
          >
            {r.images?.[0] && (
              <img src={r.images[0]} alt={r.title} loading="lazy" className="mb-4 aspect-[16/10] w-full rounded-md object-cover" />
            )}
            {r.division && (
              <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-brand-blue">{r.division}</p>
            )}
            <h3 className="font-display text-lg font-bold leading-snug text-[var(--ink)] group-hover:text-brand-blue">
              {r.title}
            </h3>
            <p className="mt-2 font-body text-sm italic leading-relaxed text-[var(--ink-2)]">{r.authors}</p>
            <div className="mt-3 flex items-center justify-between gap-2 font-mono text-[11px]">
              <span className="text-brand-blue">{r.venue}</span>
              <span className="text-[var(--ink-3)]">{r.year}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
