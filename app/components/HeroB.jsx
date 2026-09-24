import { motion, useReducedMotion } from 'framer-motion'
import { getAll } from '../lib/content'
import { members } from '../data/members'
import { divisions } from '../data/divisions'

const item = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
}

export default function HeroB({ counts } = {}) {
  const shouldReduce = useReducedMotion()

  const hkiCount = counts?.projects ?? getAll('projects').length
  const paperCount = counts?.research ?? getAll('research').length
  const awardsCount = counts?.awards ?? getAll('awards').length
  const assistantsCount = members.length
  const divisionsCount = divisions.length

  const STATS = [
    { value: String(assistantsCount),  label: 'Assistants' },
    { value: String(hkiCount),         label: 'HKI Works'  },
    { value: String(paperCount),       label: 'Papers'     },
    { value: String(awardsCount),      label: 'Awards'     },
    { value: String(divisionsCount),   label: 'Divisions'  },
  ]

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-[var(--bg-base)]">

      {/* Centered atmospheric glow */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 60% 50% at 50% 44%, rgba(37,99,235,0.12) 0%, transparent 100%)'
      }} />

      {/* Top bar */}
      <motion.div
        className="relative z-10 flex items-center justify-between px-10 sm:px-14 py-7"
        initial={shouldReduce ? {} : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <img src="/logo.png" alt="MBC Lab" className="h-8 w-auto" />
        <div className="flex items-center gap-6">
          <a
            href="#about"
            className="font-mono text-[11px] tracking-[0.2em] text-[var(--text-muted)] uppercase hover:text-[var(--text-primary)] transition-colors duration-200 focus-visible:outline-none focus-visible:underline"
          >
            Explore
          </a>
        </div>
      </motion.div>

      {/* Body — gravity pulls content toward bottom */}
      <div className="relative z-10 flex-1 flex flex-col justify-end px-10 sm:px-14 pb-0">
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.09, delayChildren: 0.3 }}
        >
          <motion.p
            variants={shouldReduce ? {} : item}
            className="font-mono text-[11px] tracking-[0.32em] text-[var(--text-muted)] uppercase mb-5"
          >
            Research &amp; Development Laboratory
          </motion.p>

          <motion.h1
            variants={shouldReduce ? {} : item}
            className="font-heading font-extrabold leading-[0.91] tracking-tight text-[var(--text-primary)] mb-9"
            style={{ fontSize: 'clamp(3.75rem, 9vw, 8rem)' }}
          >
            Multimedia Application,<br />
            Big Data &amp;<br />
            <span className="text-brand-blue">Cyber Security.</span>
          </motion.h1>

          <motion.p
            variants={shouldReduce ? {} : item}
            className="font-body text-base text-[var(--text-secondary)] max-w-[38ch] leading-relaxed mb-14"
          >
            A research lab at Telkom University — five divisions, one mission: bridge academic theory with real-world technology.
          </motion.p>
        </motion.div>
      </div>

      {/* Stat strip — anchored to hero bottom */}
      <motion.div
        className="relative z-10 border-t border-[var(--border)] grid grid-cols-2 sm:grid-cols-5"
        initial={shouldReduce ? {} : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className={`flex flex-col gap-1 px-8 py-5 ${i < STATS.length - 1 ? 'border-r border-[var(--border)]' : ''} ${i >= 2 ? 'border-t sm:border-t-0 border-[var(--border)]' : ''}`}
          >
            <span className="font-mono text-2xl font-medium text-brand-glow tabular-nums">{s.value}</span>
            <span className="font-mono text-[10px] tracking-[0.22em] text-[var(--text-muted)] uppercase">{s.label}</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
