import { useLoaderData, Link } from "react-router";
import { getPublicItemBySlug } from "../lib/content";
import { pageMeta } from "../lib/seo";
import Markdown from "../components/Markdown";
import Carousel from "../components/Carousel";

export async function loader({ params }) {
  const item = await getPublicItemBySlug("research", params.slug);
  return { item };
}

export async function clientLoader({ params }) {
  const item = await getPublicItemBySlug("research", params.slug);
  return { item };
}
clientLoader.hydrate = true;

export function meta({ data, location }) {
  if (!data?.item) return [{ title: "Not found · MBC Lab" }];
  const { item } = data;
  const venueYear = [item.venue, item.year].filter(Boolean).join(" · ");
  return pageMeta({
    title: `${item.title} · MBC Lab`,
    description: [item.authors, venueYear].filter(Boolean).join(" — "),
    path: location.pathname,
    image: item.images?.[0] ?? "/logo.png",
  });
}

export default function ResearchDetail() {
  const { item } = useLoaderData();
  const links = item.links ?? {};
  return (
    <article className="mx-auto max-w-3xl px-6 pb-24 pt-28 lg:px-8">
      <Link to="/research" className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-blue hover:underline">← Research</Link>
      {item.division && (
        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--ink-3)]">{item.division}</p>
      )}
      <h1 className={`${item.division ? "mt-2" : "mt-6"} font-display text-3xl font-bold tracking-tight text-[var(--ink)] sm:text-4xl`}>{item.title}</h1>
      {item.authors && <p className="mt-3 font-body text-base italic leading-relaxed text-[var(--ink-2)]">{item.authors}</p>}
      <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--ink-3)]">
        {item.venue}{item.venue && item.year ? " · " : ""}{item.year}
      </p>
      <div className="mt-8">
        <Carousel images={(item.images ?? []).slice(1, 3)} alt={item.title} />
      </div>
      <div className="prose prose-sm sm:prose-base mt-8">
        <Markdown>{item.body}</Markdown>
      </div>
      {(links.doi || links.pdf) && (
        <div className="mt-8 flex flex-wrap gap-3">
          {links.doi && <a href={links.doi} target="_blank" rel="noopener noreferrer" className="font-mono text-xs uppercase tracking-wide text-brand-blue hover:underline">DOI ↗</a>}
          {links.pdf && <a href={links.pdf} target="_blank" rel="noopener noreferrer" className="font-mono text-xs uppercase tracking-wide text-brand-blue hover:underline">PDF ↗</a>}
        </div>
      )}
    </article>
  );
}
