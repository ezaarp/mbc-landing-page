import { motion, useReducedMotion } from 'framer-motion'
import { divisions } from '../data/divisions'
import { getAll } from '../lib/content'

const TOTAL_MEMBERS = divisions.reduce((sum, d) => sum + d.members, 0)
const MAX_MEMBERS = Math.max(...divisions.map((d) => d.members))

function RosterRow({ division, index }) {
  const shouldReduce = useReducedMotion()
  const pct = (division.members / MAX_MEMBERS) * 100
  return (
    <div className="flex items-center gap-4 border-b border-[var(--line)] py-3.5 last:border-b-0">
      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: division.color }} />
      <span className="w-40 shrink-0 truncate font-body text-sm text-[var(--ink)] sm:w-48">
        {division.name}
      </span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--surface-2)]">
        <motion.span
          className="block h-full rounded-full"
          style={{ backgroundColor: division.color }}
          initial={shouldReduce ? false : { width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 + index * 0.08 }}
        />
      </div>
      <span className="w-8 shrink-0 text-right font-mono text-sm tnum text-[var(--ink)]">
        {division.members}
      </span>
    </div>
  )
}

export default function About({ counts } = {}) {
  const shouldReduce = useReducedMotion()

  const hkiCount = counts?.projects ?? getAll('projects').length
  const paperCount = counts?.research ?? getAll('research').length
  const awardsCount = counts?.awards ?? getAll('awards').length

  return (
    <section id="about" className="relative overflow-hidden bg-[var(--paper)] px-6 py-24 lg:px-10">
      <div className="mx-auto grid max-w-page grid-cols-1 gap-14 lg:grid-cols-[1fr_460px] lg:gap-20">
        {/* narrative */}
        <motion.div
          initial={shouldReduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--ink-3)]">
            About the lab
          </p>
          <h2
            className="font-display font-extrabold leading-[0.95] tracking-tight text-[var(--ink)]"
            style={{ fontSize: 'clamp(2.25rem, 4.4vw, 4rem)' }}
          >
            A laboratory that<br />actually ships.
          </h2>
          <div className="mt-7 max-w-xl space-y-5 font-body text-base leading-relaxed text-[var(--ink-2)]">
            <p>
              MBC Lab is an official research and development laboratory under the Faculty of
              Electrical Engineering at Telkom University, Bandung. We are run by students, for students —
              a place where coursework becomes shipped software.
            </p>
            <p>
              Across five divisions, our assistants register intellectual property, publish
              papers, and partner with industry and government. The work is real; so is the
              mentorship that produces it.
            </p>
          </div>

          <div className="mt-9 flex flex-wrap gap-x-10 gap-y-4">
            {[
              [String(hkiCount), 'HKI works'],
              [String(paperCount), 'published papers'],
              [String(awardsCount), 'awards'],
            ].map(([v, l]) => (
              <div key={l} className="flex items-baseline gap-2">
                <span className="font-display text-2xl font-bold tnum text-[var(--ink)]">{v}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink-3)]">
                  {l}
                </span>
              </div>
            ))}
          </div>

        </motion.div>

        {/* roster card */}
        <motion.div
          initial={shouldReduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="self-start rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 lg:sticky lg:top-24"
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--ink-3)]">
              Lab roster by division
            </span>
            <span className="h-1.5 w-16 rounded-full spectrum-bg" />
          </div>

          {divisions.map((d, i) => (
            <RosterRow key={d.id} division={d} index={i} />
          ))}

          <div className="mt-4 flex items-center justify-between border-t border-[var(--line-2)] pt-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--ink-3)]">
              Total assistants
            </span>
            <span className="font-display text-2xl font-bold tnum text-[var(--ink)]">
              {TOTAL_MEMBERS}
            </span>
          </div>
        </motion.div>
      </div>

      {/* full-width group photo */}
      <motion.figure
        initial={shouldReduce ? false : { opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="group mx-auto mt-16 max-w-page overflow-hidden rounded-3xl border border-[var(--line)]"
      >
        <img
          src="/photos/all-member-2.jpeg"
          alt="MBC Lab assistants, 2026/2027"
          loading="lazy"
          className="aspect-[21/9] w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
        />
      </motion.figure>
    </section>
  )
}
