import { useLoaderData, Link } from "react-router";
import { Trophy } from "lucide-react";
import { getPublicItems } from "../lib/content";
import { pageMeta } from "../lib/seo";

export function meta() {
  return pageMeta({
    title: "Awards · MBC Lab",
    description: "Competitions, hackathons, and scientific achievements won by MBC Lab assistants.",
    path: "/awards",
  });
}

export async function loader() {
  const items = await getPublicItems("awards");
  return { items };
}

export default function Awards() {
  const { items } = useLoaderData();

  return (
    <section className="mx-auto max-w-page px-6 pb-20 pt-28 lg:px-10">
      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--ink-3)]">
        Achievements
      </p>
      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-[var(--ink)] sm:text-4xl">
        Awards &amp; Recognition
      </h1>
      <p className="mt-3 max-w-2xl font-body text-base text-[var(--ink-2)]">
        National and international competitions, hackathons, and honors achieved by MBC Laboratory assistants.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((award) => (
          <Link
            key={award.slug}
            to={`/awards/${award.slug}`}
            className="group flex flex-col rounded-xl border border-[var(--line)] bg-[var(--surface)] p-6 transition-all hover:border-[#F5A524]/60 hover:shadow-sm"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F5A524]/10 px-2.5 py-0.5 font-mono text-[10px] font-medium text-[#F5A524]">
                <Trophy size={12} />
                {award.award || "Award"}
              </span>
              <span className="font-mono text-xs tnum text-[var(--ink-3)]">{award.year}</span>
            </div>

            <h3 className="mt-3 font-display text-lg font-bold leading-snug text-[var(--ink)] group-hover:text-brand-blue">
              {award.title}
            </h3>

            {award.members && (
              <p className="mt-2 flex-1 font-body text-xs leading-relaxed text-[var(--ink-2)] whitespace-pre-line">
                {award.members}
              </p>
            )}

            <div className="mt-4 flex items-center justify-between border-t border-[var(--line)] pt-3 text-[11px] font-mono uppercase tracking-wider text-brand-blue">
              <span>View details</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
