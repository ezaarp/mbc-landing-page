import { useLoaderData, Link } from "react-router";
import { getBySlug } from "../lib/content";
import { pageMeta } from "../lib/seo";
import Markdown from "../components/Markdown";
import Carousel from "../components/Carousel";

function load({ params }) {
  const item = getBySlug("events", params.slug);
  if (!item) throw new Response("Not Found", { status: 404 });
  return { item };
}

// `loader` prerenders real slugs at build; `clientLoader` resolves from bundled
// content in the browser so unknown slugs (404 shell) hit the branded ErrorBoundary.
export const loader = load;
export const clientLoader = load;

export function meta({ data, location }) {
  if (!data?.item) return [{ title: "Not found · MBC Lab" }];
  const { item } = data;
  return pageMeta({
    title: `${item.title} · MBC Lab`,
    description: item.summary ?? `${item.title} — ${item.location ?? "MBC Lab"}.`,
    path: location.pathname,
    image: item.images?.[0] ?? "/logo.png",
  });
}

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function EventDetail() {
  const { item } = useLoaderData();
  const images = item.images ?? [];
  const portal = item.links?.portal;
  const isClosed = item.status === "closed";
  return (
    <article className="mx-auto max-w-3xl px-6 pb-24 pt-28 lg:px-8">
      <Link to="/events" className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-blue hover:underline">← Events</Link>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--ink-3)]">{formatDate(item.date)}</span>
        <span
          className={`rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide ${
            item.status === "upcoming"
              ? "border-brand-blue text-brand-blue"
              : "border-[var(--line-2)] text-[var(--ink-3)]"
          }`}
        >
          {item.status}
        </span>
      </div>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-[var(--ink)] sm:text-4xl">{item.title}</h1>
      {item.location && <p className="mt-3 font-body text-base leading-relaxed text-[var(--ink-2)]">{item.location}</p>}
      {item.summary && <p className="mt-2 font-body text-lg leading-relaxed text-[var(--ink-2)]">{item.summary}</p>}

      {isClosed ? (
        <span
          aria-disabled="true"
          className="mt-6 inline-flex cursor-not-allowed items-center gap-2 rounded-full bg-[var(--surface-2)] px-6 py-3 font-mono text-xs uppercase tracking-[0.16em] text-[var(--ink-3)]"
        >
          Recruitment closed · See you next year
        </span>
      ) : portal && (
        <a
          href={portal}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-6 inline-flex items-center gap-2 rounded-full bg-brand-blue px-6 py-3 font-mono text-xs uppercase tracking-[0.16em] text-white transition-transform duration-200 hover:scale-[1.03]"
        >
          Apply at the recruitment portal
          <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
        </a>
      )}

      {/* Event posters are portrait/varied — show the first image at its natural
          aspect ratio (the shared Carousel crops to 16:10, which is wrong here). */}
      {images[0] && (
        <img
          src={images[0]}
          alt={`${item.title} poster`}
          loading="lazy"
          className="mt-8 mx-auto w-full max-w-md rounded-xl border border-[var(--line)]"
        />
      )}
      {images.length > 1 && (
        <div className="mt-4">
          <Carousel images={images.slice(1, 3)} alt={item.title} />
        </div>
      )}

      <div className="prose prose-sm sm:prose-base mt-8">
        <Markdown>{item.body}</Markdown>
      </div>
    </article>
  );
}
