import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import * as Icons from 'lucide-react'
import { ArrowUpRight } from 'lucide-react'
import { divisions } from '../data/divisions'
import { getDivisionCounts, getAll } from '../lib/content'

/* Live "signal" motif — an equalizer recoloured per division. */
function Signal({ color, active }) {
  const shouldReduce = useReducedMotion()
  const bars = [0.45, 0.75, 0.5, 0.95, 0.6, 0.85, 0.4, 0.7]
  return (
    <div className="flex h-10 items-end gap-1.5" aria-hidden="true">
      {bars.map((h, i) => (
        <motion.span
          key={i}
          className="w-1.5 rounded-full"
          style={{ backgroundColor: color, opacity: active ? 0.95 : 0.4 }}
          initial={{ height: `${h * 70}%` }}
          animate={
            shouldReduce
              ? { height: `${h * 100}%` }
              : { height: [`${h * 55}%`, `${h * 100}%`, `${h * 70}%`] }
          }
          transition={
            shouldReduce
              ? {}
              : {
                  duration: (active ? 0.8 : 1.4) + i * 0.1,
                  repeat: Infinity,
                  repeatType: 'mirror',
                  ease: 'easeInOut',
                  delay: i * 0.05,
                }
          }
        />
      ))}
    </div>
  )
}

function DivisionCard({ division, index, counts }) {
  const shouldReduce = useReducedMotion()
  const [hover, setHover] = useState(false)
  const Icon = Icons[division.icon] || Icons.Layers

  return (
    <motion.article
      initial={shouldReduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 }}
      whileHover={shouldReduce ? {} : { y: -6 }}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      className="group relative flex min-h-[280px] flex-col overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 transition-shadow duration-300"
      style={{ boxShadow: hover ? '0 24px 50px -28px rgba(15,19,32,0.38)' : 'none' }}
    >
      {/* soft colour wash on hover — a tint, not an edge line */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `radial-gradient(130% 90% at 100% 0%, ${division.color}1f, transparent 55%)` }}
      />
      {/* short-code watermark */}
      <span
        className="pointer-events-none absolute -right-1 -top-4 font-display text-[5.5rem] font-extrabold leading-none"
        style={{ color: division.color, opacity: 0.07 }}
      >
        {division.short}
      </span>

      <div className="relative z-10 flex items-center justify-between">
        <span
          className="grid h-11 w-11 place-items-center rounded-xl transition-colors duration-300"
          style={{ backgroundColor: `${division.color}1a`, color: division.color }}
        >
          <Icon size={20} />
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--ink-3)]">
          {division.short}
        </span>
      </div>

      <h3 className="relative z-10 mt-5 font-display text-xl font-bold leading-tight text-[var(--ink)]">
        {division.name}
      </h3>
      <p className="relative z-10 mt-2 font-body text-sm leading-relaxed text-[var(--ink-2)]">
        {division.description}
      </p>

      <div className="relative z-10 mt-auto flex items-end justify-between pt-6">
        <div className="flex items-baseline gap-3 font-mono text-[var(--ink-2)]">
          <span className="text-sm tnum">
            <span className="text-[var(--ink)]">{division.members}</span> members
          </span>
          <span className="text-sm tnum">
            <span className="text-[var(--ink)]">{counts.projects}</span> proj
          </span>
          <span className="text-sm tnum">
            <span className="text-[var(--ink)]">{counts.research}</span> rsch
          </span>
        </div>
        <Signal color={division.color} active={hover} />
      </div>
    </motion.article>
  )
}

export default function Divisions({ divisionCounts, recruitmentClosed: rcProp } = {}) {
  const shouldReduce = useReducedMotion()
  const counts = divisionCounts ?? getDivisionCounts()
  const recruitmentClosed = rcProp ?? getAll('events').some(
    (event) => event.tag === 'Recruitment' && event.status === 'closed',
  )

  return (
    <section id="divisions" className="relative overflow-hidden bg-[var(--paper)] px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-page">
        <motion.div
          initial={shouldReduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 max-w-2xl"
        >
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--ink-3)]">
            Five divisions
          </p>
          <h2
            className="font-display font-extrabold leading-[0.95] tracking-tight text-[var(--ink)]"
            style={{ fontSize: 'clamp(2.25rem, 4.2vw, 3.75rem)' }}
          >
            Each division is its own signal.
          </h2>
          <p className="mt-5 font-body text-base leading-relaxed text-[var(--ink-2)]">
            The lab runs five specialisations under one roof. Pick the frequency that matches
            how you want to build.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {divisions.map((d, i) => (
            <DivisionCard
              key={d.id}
              division={d}
              index={i}
              counts={counts[d.name] ?? { projects: 0, research: 0 }}
            />
          ))}

          {/* CTA tile completing the 3×2 grid */}
          <motion.div
            aria-disabled={recruitmentClosed ? 'true' : undefined}
            initial={shouldReduce ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: divisions.length * 0.08 }}
            whileHover={recruitmentClosed || shouldReduce ? {} : { y: -6 }}
            className={`group relative flex min-h-[280px] flex-col justify-between overflow-hidden rounded-2xl p-6 text-white ${recruitmentClosed ? 'cursor-not-allowed opacity-65' : ''}`}
          >
            <div aria-hidden="true" className="absolute inset-0 brand-gradient" />
            <div aria-hidden="true" className="absolute inset-0 bg-black/35 transition-colors duration-300 group-hover:bg-black/20" />
            <p className="relative z-10 font-mono text-[10px] uppercase tracking-[0.24em] text-white/80">
              Not sure which fits?
            </p>
            <div className="relative z-10">
              <h3 className="font-display text-2xl font-extrabold leading-tight">
                Find your frontier.
              </h3>
              <span className="mt-4 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em]">
                {recruitmentClosed ? 'Recruitment closed · See you next year' : 'Join the lab'}
                {!recruitmentClosed && (
                  <ArrowUpRight
                    size={15}
                    className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                )}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
