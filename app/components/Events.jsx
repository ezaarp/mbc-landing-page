import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router'
import { ArrowUpRight, Check } from 'lucide-react'
import { getAll } from '../lib/content'

const CONTACT_EMAIL = 'contact@mbclaboratory.com'

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

const PERKS = [
  'Work on real R&D projects, not toy assignments',
  'Co-author papers and register intellectual property',
  'Partner with industry and city government',
  'Mentorship across all five divisions',
]

// faux barcode — bar widths in px
const BARCODE = [3, 1, 2, 4, 1, 2, 1, 3, 1, 4, 2, 1, 3, 1, 2, 4, 1, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 1, 4, 2, 1, 3]

export default function Events({ event } = {}) {
  const shouldReduce = useReducedMotion()
  const all = getAll('events')
  const recruit = event ?? (all.find((e) => e.tag === 'Recruitment') ?? all[0])
  if (!recruit) return null

  const isClosed = recruit.status === 'closed'
  const when = formatDate(recruit.date) || 'To be announced'
  const where = recruit.location || 'Telkom University, Bandung'
  const portal = recruit.links?.portal

  return (
    <section id="recruit" className="px-6 py-24 lg:px-10">
      <motion.div
        initial={shouldReduce ? false : { opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="grain-overlay relative mx-auto max-w-page overflow-hidden rounded-[28px]"
        style={{ backgroundColor: '#0B0E16', color: '#ECEFF4' }}
      >
        {/* ticket colour band */}
        <div aria-hidden="true" className="absolute inset-x-0 top-0 z-10 h-1.5 brand-gradient" />
        {/* ambient glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 z-0 h-80 w-80 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(31,111,214,0.35), transparent 70%)' }}
        />

        <div className="relative z-20 flex flex-col lg:flex-row">
          {/* ── main ticket ─────────────────────────────────── */}
          <div className="flex-1 p-8 sm:p-12 lg:p-14">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/80">
              <span className={`h-1.5 w-1.5 rounded-full ${isClosed ? 'bg-white/35' : 'animate-pulse bg-brand-red'}`} />
              {recruit.tag ?? 'Recruitment'} · {isClosed ? 'Applications closed' : 'Applications open'}
            </span>

            <h2
              className="mt-6 font-display font-extrabold uppercase leading-[0.95] tracking-tight"
              style={{ fontSize: 'clamp(2.4rem, 4.6vw, 4rem)' }}
            >
              {isClosed ? (
                <>
                  Recruitment is <span className="text-brand">closed</span>.<br />
                  See you next year.
                </>
              ) : (
                <>
                  Apply to <span className="text-brand">MBC Lab</span>,<br />
                  2026/2027.
                </>
              )}
            </h2>

            <p className="mt-6 max-w-md font-body text-base leading-relaxed text-white/70">
              {isClosed
                ? 'Thank you for your interest in MBC Lab. We open recruitment once a year — we hope to see you in the next cycle.'
                : 'We open recruitment once a year for new assistants across all five divisions. Bring curiosity; leave with shipped work, a network, and a credential.'}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {isClosed ? (
                <span
                  aria-disabled="true"
                  className="inline-flex cursor-not-allowed items-center gap-2 rounded-full bg-white/15 px-6 py-3 font-mono text-xs uppercase tracking-[0.16em] text-white/45"
                >
                  Applications closed
                </span>
              ) : (
                <a
                  href={portal ?? `mailto:${CONTACT_EMAIL}?subject=MBC%20Lab%20Recruitment%202026/2027`}
                  {...(portal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-mono text-xs uppercase tracking-[0.16em] text-[#0B0E16] transition-transform duration-200 hover:scale-[1.03]"
                >
                  {portal ? 'Apply now' : 'Ask about recruitment'}
                  <ArrowUpRight
                    size={15}
                    className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              )}
              <div className="flex items-center gap-5 rounded-full border border-white/15 px-5 py-3 font-mono text-[11px] text-white/70">
                <span>
                  <span className="text-white/40">When </span>
                  {when}
                </span>
                <span className="hidden h-3 w-px bg-white/20 sm:block" />
                <span className="hidden sm:inline">
                  <span className="text-white/40">Where </span>
                  {where}
                </span>
              </div>
            </div>

            <div className="mt-5">
              {isClosed ? (
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">
                  Recruitment details archived
                </span>
              ) : (
                <Link
                  to={`/events/${recruit.slug}`}
                  className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/70 underline-offset-4 hover:text-white hover:underline"
                >
                  See details →
                </Link>
              )}
            </div>
          </div>

          {/* ── perforation (tear line + punched notches) ───── */}
          <div className="relative w-full shrink-0 lg:w-0">
            {/* desktop: vertical tear */}
            <div
              aria-hidden="true"
              className="absolute inset-y-10 left-0 hidden border-l-2 border-dashed border-white/25 lg:block"
            />
            <span aria-hidden="true" className="absolute -top-3 left-0 z-30 hidden h-6 w-6 -translate-x-1/2 rounded-full bg-[var(--paper)] lg:block" />
            <span aria-hidden="true" className="absolute -bottom-3 left-0 z-30 hidden h-6 w-6 -translate-x-1/2 rounded-full bg-[var(--paper)] lg:block" />
            {/* mobile: horizontal tear */}
            <div aria-hidden="true" className="mx-8 border-t-2 border-dashed border-white/25 lg:hidden" />
            <span aria-hidden="true" className="absolute -left-3 top-0 z-30 h-6 w-6 -translate-y-1/2 rounded-full bg-[var(--paper)] lg:hidden" />
            <span aria-hidden="true" className="absolute -right-3 top-0 z-30 h-6 w-6 -translate-y-1/2 rounded-full bg-[var(--paper)] lg:hidden" />
          </div>

          {/* ── tear-off stub ───────────────────────────────── */}
          <div className="flex flex-col p-8 sm:p-12 lg:w-[360px] lg:p-14">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/45">What you get</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/45">Admit one</span>
            </div>

            <ul className="mt-5 space-y-4">
              {PERKS.map((perk, i) => (
                <motion.li
                  key={perk}
                  initial={shouldReduce ? false : { opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.1 + i * 0.08 }}
                  className="flex items-start gap-3 font-body text-sm leading-relaxed text-white/85"
                >
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white/10">
                    <Check size={12} className="text-brand-blue" />
                  </span>
                  {perk}
                </motion.li>
              ))}
            </ul>

            {/* barcode + serial */}
            <div className="mt-auto pt-10">
              <div className="flex h-10 items-stretch gap-[2px]" aria-hidden="true">
                {BARCODE.map((w, i) => (
                  <span key={i} style={{ width: `${w}px` }} className="bg-white/80" />
                ))}
              </div>
              <p className="mt-2.5 font-mono text-[10px] uppercase tracking-[0.24em] text-white/40">
                No. MBC-2627 · Season pass
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
