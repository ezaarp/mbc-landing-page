import { useLoaderData, Link } from "react-router";
import { Trophy } from "lucide-react";
import { getPublicItemBySlug } from "../lib/content";
import { pageMeta } from "../lib/seo";
import Markdown from "../components/Markdown";
import Carousel from "../components/Carousel";

export async function loader({ params }) {
  const item = await getPublicItemBySlug("awards", params.slug);
  return { item };
}

export async function clientLoader({ params }) {
  const item = await getPublicItemBySlug("awards", params.slug);
  return { item };
}
clientLoader.hydrate = true;

export function meta({ data, location }) {
  if (!data?.item) return [{ title: "Not found · MBC Lab" }];
  const { item } = data;
  return pageMeta({
    title: `${item.title} · Awards · MBC Lab`,
    description: item.summary || `${item.award ?? "Award"} won by ${item.members ?? "MBC Lab assistants"}.`,
    path: location.pathname,
    image: item.images?.[0] ?? "/logo.png",
  });
}

export default function AwardDetail() {
  const { item } = useLoaderData();
  const images = item.images ?? [];

  return (
    <article className="mx-auto max-w-3xl px-6 pb-24 pt-28 lg:px-8">
      <Link
        to="/awards"
        className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-blue hover:underline"
      >
        ← Awards
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F5A524]/15 px-3 py-1 font-mono text-[11px] font-medium text-[#F5A524]">
          <Trophy size={13} />
          {item.award || "Award"}
        </span>
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--ink-3)]">
          {item.year}
        </span>
      </div>

      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-[var(--ink)] sm:text-4xl">
        {item.title}
      </h1>

      {item.members && (
        <div className="mt-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4">
          <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--ink-3)]">
            Team Members
          </p>
          <p className="mt-1 font-body text-sm leading-relaxed text-[var(--ink)] whitespace-pre-line">
            {item.members}
          </p>
        </div>
      )}

      {images.length > 0 && (
        <div className="mt-8">
          <Carousel images={images.slice(0, 3)} alt={item.title} />
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
