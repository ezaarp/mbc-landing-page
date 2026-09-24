import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router";
import { Clock, User, ArrowUpRight } from "lucide-react";

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function RecentBlogs({ blogs = [] }) {
  const shouldReduce = useReducedMotion();

  if (!blogs || blogs.length === 0) return null;

  return (
    <section id="blog" className="border-t border-[var(--line)] bg-[var(--paper)] px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-page">
        <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <motion.div
            initial={shouldReduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--ink-3)]">
              Lab Insights
            </p>
            <h2
              className="font-display font-extrabold leading-[0.95] tracking-tight text-[var(--ink)]"
              style={{ fontSize: "clamp(2rem, 3.8vw, 3.25rem)" }}
            >
              Recent articles &amp; notes
            </h2>
          </motion.div>

          <Link
            to="/blog"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-brand-blue hover:underline"
          >
            View all articles
            <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {blogs.slice(0, 3).map((blog, i) => (
            <motion.div
              key={blog.slug}
              initial={shouldReduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                to={`/blog/${blog.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 transition-all hover:border-brand-blue/50"
              >
                {blog.cover_image && (
                  <img
                    src={blog.cover_image}
                    alt={blog.title}
                    loading="lazy"
                    className="mb-4 aspect-[16/10] w-full rounded-xl object-cover"
                  />
                )}

                <div className="flex items-center gap-3 font-mono text-[11px] text-[var(--ink-3)]">
                  {blog.byline && (
                    <span className="flex items-center gap-1">
                      <User size={12} />
                      {blog.byline}
                    </span>
                  )}
                  {blog.reading_time && (
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {blog.reading_time} min
                    </span>
                  )}
                  <span className="ml-auto">{formatDate(blog.published_at)}</span>
                </div>

                <h3 className="mt-3 font-display text-base font-bold leading-snug text-[var(--ink)] group-hover:text-brand-blue">
                  {blog.title}
                </h3>

                {blog.summary && (
                  <p className="mt-2 flex-1 font-body text-xs leading-relaxed text-[var(--ink-2)] line-clamp-3">
                    {blog.summary}
                  </p>
                )}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
