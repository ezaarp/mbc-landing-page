import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { getAll } from '../lib/content'

const ROWS = [
  { division: 'Cyber Security', members: 43, projects: 12, color: 'text-red-400',    bg: 'rgba(239,68,68,0.06)'   },
  { division: 'Big Data',       members: 38, projects: 18, color: 'text-blue-400',   bg: 'rgba(96,165,250,0.06)'  },
  { division: 'GIS',            members: 28, projects:  9, color: 'text-green-400',  bg: 'rgba(74,222,128,0.06)'  },
  { division: 'Game Tech',      members: 51, projects: 15, color: 'text-purple-400', bg: 'rgba(192,132,252,0.06)' },
  { division: 'Practicum',      members: 44, projects:  8, color: 'text-yellow-400', bg: 'rgba(251,191,36,0.06)'  },
]

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11, delayChildren: 0.2 } },
}
const item = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export default function HeroA({ recruitmentClosed: rcProp } = {}) {
  const shouldReduce = useReducedMotion()
  const [active, setActive] = useState(0)
  const recruitmentClosed = rcProp ?? getAll('events').some(
    (event) => event.tag === 'Recruitment' && event.status === 'closed',
  )

  useEffect(() => {
    if (shouldReduce) return
    const id = setInterval(() => setActive(i => (i + 1) % ROWS.length), 1700)
    return () => clearInterval(id)
  }, [shouldReduce])

  return (
    <div className="relative min-h-screen flex items-center overflow-hidden crosshatch-grid">
      {/* Left-weighted atmospheric glow */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 55% 55% at 28% 50%, rgba(37,99,235,0.08) 0%, transparent 100%)'
      }} />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-transparent to-[#070B14]/70 pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 lg:px-14 flex flex-col lg:flex-row items-center gap-14 lg:gap-20 py-20">

        {/* ── Left: text ── */}
        <motion.div
          className="flex-1 flex flex-col items-start gap-7"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {/* Logo + mono label */}
          <motion.div variants={shouldReduce ? {} : item} className="flex items-center gap-3">
            <img src="/logo.png" alt="MBC Lab" className="h-7 w-auto opacity-75" />
            <span className="font-mono text-[11px] tracking-[0.28em] text-[#4A6580] uppercase">MBC Lab</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={shouldReduce ? {} : item}
            className="font-heading font-extrabold leading-[0.93] tracking-tight text-[#DDE6F0]"
            style={{ fontSize: 'clamp(3rem, 5.5vw, 5.25rem)' }}
          >
            Research &amp;<br />
            Development<br />
            <span className="text-brand-blue">Laboratory.</span>
          </motion.h1>

          {/* Sub-desc */}
          <motion.div variants={shouldReduce ? {} : item} className="space-y-0.5">
            <p className="font-mono text-sm text-[#4A6580]">Multimedia Application · Big Data · Cyber Security</p>
            <p className="font-mono text-sm text-[#4A6580]">Faculty of Informatics — Telkom University, Bandung</p>
          </motion.div>

          {/* CTAs */}
          <motion.div variants={shouldReduce ? {} : item} className="flex items-center gap-3">
            <a
              href="#about"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-blue text-white font-heading font-bold text-sm rounded-lg hover:bg-brand-glow transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-brand-glow focus-visible:outline-none"
            >
              Explore <ArrowRight size={14} />
            </a>
            {recruitmentClosed ? (
              <span
                aria-disabled="true"
                className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg border border-[#1B2C42] px-6 py-2.5 font-heading text-sm font-bold text-[#6F8093]"
              >
                Recruitment closed
              </span>
            ) : (
              <a
                href="mailto:mbc@telkomuniversity.ac.id"
                className="inline-flex items-center gap-2 rounded-lg border border-[#1B2C42] px-6 py-2.5 font-heading text-sm font-bold text-[#DDE6F0] transition-colors duration-200 hover:border-brand-blue/60 hover:text-brand-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-glow"
              >
                Join Us
              </a>
            )}
          </motion.div>
        </motion.div>

        {/* ── Right: data table ── */}
        <motion.div
          className="w-full lg:w-auto lg:min-w-[360px] xl:min-w-[400px]"
          initial={shouldReduce ? {} : { opacity: 0, x: 36 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.45 }}
        >
          <div className="bg-[#0B1120]/90 border border-[#1B2C42] rounded-2xl overflow-hidden backdrop-blur-sm">

            {/* Header row */}
            <div className="grid grid-cols-[1fr_56px_48px] px-5 py-2.5 border-b border-[#1B2C42]">
              <span className="font-mono text-[10px] tracking-[0.22em] text-[#2E4560] uppercase">Division</span>
              <span className="font-mono text-[10px] tracking-[0.22em] text-[#2E4560] uppercase text-right">Mbr</span>
              <span className="font-mono text-[10px] tracking-[0.22em] text-[#2E4560] uppercase text-right">Proj</span>
            </div>

            {/* Data rows */}
            {ROWS.map((row, i) => (
              <div
                key={row.division}
                className="grid grid-cols-[1fr_56px_48px] px-5 py-3.5 border-b border-[#1B2C42]/50 transition-colors duration-500"
                style={{ backgroundColor: i === active ? row.bg : 'transparent' }}
              >
                <span
                  className="font-mono text-sm transition-colors duration-500"
                  style={{ color: i === active ? undefined : '#7A90A8' }}
                >
                  <span className={i === active ? row.color : ''}>{row.division}</span>
                </span>
                <span className={`font-mono text-sm text-right tabular-nums transition-colors duration-500 ${i === active ? 'text-[#DDE6F0]' : 'text-[#3A5270]'}`}>
                  {row.members}
                </span>
                <span className={`font-mono text-sm text-right tabular-nums transition-colors duration-500 ${i === active ? 'text-[#DDE6F0]' : 'text-[#3A5270]'}`}>
                  {row.projects}
                </span>
              </div>
            ))}

            {/* Totals */}
            <div className="grid grid-cols-[1fr_56px_48px] px-5 py-3 bg-[#111B2E]/70">
              <span className="font-mono text-[10px] tracking-[0.22em] text-[#2E4560] uppercase">Total</span>
              <span className="font-mono text-sm text-right tabular-nums text-brand-glow">200+</span>
              <span className="font-mono text-sm text-right tabular-nums text-brand-glow">50+</span>
            </div>
          </div>

          <p className="font-mono text-[10px] tracking-[0.18em] text-[#2E4560] text-center mt-3 uppercase">
            Active Lab Roster · {new Date().getFullYear()}
          </p>
        </motion.div>
      </div>

      {/* Scroll cue */}
      {!shouldReduce && (
        <motion.a
          href="#about"
          aria-label="Scroll to About"
          className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-[#2E4560] hover:text-brand-blue transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-glow rounded"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="font-mono text-[9px] tracking-[0.3em] uppercase">Scroll</span>
          <div className="w-px h-5 bg-current opacity-50" />
        </motion.a>
      )}
    </div>
  )
}
