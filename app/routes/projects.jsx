import { useMemo, useState } from "react";
import { useLoaderData, Link } from "react-router";
import { getPublicItems } from "../lib/content";
import { divisions } from "../data/divisions";
import { pageMeta } from "../lib/seo";
import DivisionFilter from "../components/DivisionFilter";

export function meta() {
  return pageMeta({
    title: "Projects · MBC Lab",
    description: "Projects built across MBC Lab's divisions.",
    path: "/projects",
  });
}

export async function loader() {
  const items = await getPublicItems("projects");
  return { items };
}

export async function clientLoader() {
  const items = await getPublicItems("projects");
  return { items };
}
clientLoader.hydrate = true;

export default function Projects() {
  const { items } = useLoaderData();
  const [active, setActive] = useState(null);

  // Division options, ordered by the canonical divisions list, limited to those
  // actually present among the projects.
  const options = useMemo(() => {
    const present = new Set(items.map((i) => i.division).filter(Boolean));
    return divisions.map((d) => d.name).filter((name) => present.has(name));
  }, [items]);

  const shown = active ? items.filter((p) => p.division === active) : items;

  return (
    <section className="mx-auto max-w-page px-6 pb-20 pt-28 lg:px-10">
      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--ink-3)]">Projects</p>
      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-[var(--ink)] sm:text-4xl">
        What the lab has built
      </h1>
      <DivisionFilter options={options} active={active} onChange={setActive} />
      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p) => (
          <Link
            key={p.slug}
            to={`/projects/${p.slug}`}
            className="group flex flex-col rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5 transition-colors hover:border-[var(--ink-3)]"
          >
            {p.images?.[0] && (
              <img src={p.images[0]} alt={p.title} loading="lazy" className="mb-4 aspect-[16/10] w-full rounded-md object-cover" />
            )}
            <div className="flex items-center justify-between gap-2 font-mono text-[11px]">
              <span className="text-brand-blue">{p.division}</span>
              <span className="text-[var(--ink-3)]">{p.year}</span>
            </div>
            <h3 className="mt-2 font-display text-lg font-bold leading-snug text-[var(--ink)] group-hover:text-brand-blue">
              {p.title}
            </h3>
            <p className="mt-2 flex-1 font-body text-sm leading-relaxed text-[var(--ink-2)]">{p.summary}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {(p.tags ?? []).slice(0, 4).map((t) => (
                <span key={t} className="rounded bg-[var(--surface-2)] px-2 py-0.5 font-mono text-[10px] text-[var(--ink-3)]">{t}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
