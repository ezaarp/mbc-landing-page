import { useLoaderData, Link } from "react-router";
import { getPublicItemBySlug } from "../lib/content";
import { pageMeta } from "../lib/seo";
import Markdown from "../components/Markdown";
import Carousel from "../components/Carousel";

export async function loader({ params }) {
  const item = await getPublicItemBySlug("projects", params.slug);
  return { item };
}

export async function clientLoader({ params }) {
  const item = await getPublicItemBySlug("projects", params.slug);
  return { item };
}
clientLoader.hydrate = true;

export function meta({ data, location }) {
  if (!data?.item) return [{ title: "Not found · MBC Lab" }];
  const { item } = data;
  return pageMeta({
    title: `${item.title} · MBC Lab`,
    description: item.summary ?? `${item.division} project by MBC Lab.`,
    path: location.pathname,
    image: item.images?.[0] ?? "/logo.png",
  });
}

export default function ProjectDetail() {
  const { item } = useLoaderData();
  const links = item.links ?? {};
  return (
    <article className="mx-auto max-w-3xl px-6 pb-24 pt-28 lg:px-8">
      <Link to="/projects" className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-blue hover:underline">← Projects</Link>
      <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--ink-3)]">{item.division} · {item.year}</p>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-[var(--ink)] sm:text-4xl">{item.title}</h1>
      {item.summary && <p className="mt-3 font-body text-lg leading-relaxed text-[var(--ink-2)]">{item.summary}</p>}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {(item.tags ?? []).map((t) => (
          <span key={t} className="rounded bg-[var(--surface-2)] px-2 py-0.5 font-mono text-[10px] text-[var(--ink-3)]">{t}</span>
        ))}
      </div>
      <div className="mt-8">
        <Carousel images={(item.images ?? []).slice(1, 3)} alt={item.title} />
      </div>
      <div className="prose prose-sm sm:prose-base mt-8">
        <Markdown>{item.body}</Markdown>
      </div>
      {(links.github || links.demo || links.hki) && (
        <div className="mt-8 flex flex-wrap gap-3">
          {links.github && <a href={links.github} target="_blank" rel="noopener noreferrer" className="font-mono text-xs uppercase tracking-wide text-brand-blue hover:underline">GitHub ↗</a>}
          {links.demo && <a href={links.demo} target="_blank" rel="noopener noreferrer" className="font-mono text-xs uppercase tracking-wide text-brand-blue hover:underline">Demo ↗</a>}
          {links.hki && <a href={links.hki} target="_blank" rel="noopener noreferrer" className="font-mono text-xs uppercase tracking-wide text-brand-blue hover:underline">HKI ↗</a>}
        </div>
      )}
    </article>
  );
}
