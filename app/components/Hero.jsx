import { useState, useRef, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { getAll } from '../lib/content'
import { members } from '../data/members'
import { divisions } from '../data/divisions'

// Real group photo; until it loads, the dark section background shows.
const GROUP_PHOTO = '/photos/all-member-1.jpeg'

function HeroBackground() {
  const shouldReduce = useReducedMotion()
  const imgRef = useRef(null)
  const [loaded, setLoaded] = useState(false)

  // The photo often finishes loading before React attaches onLoad (cached, or
  // already complete after SSR hydration) — check completeness on mount so the
  // image isn't left stuck invisible behind the fallback mosaic.
  useEffect(() => {
    const el = imgRef.current
    if (el && el.complete && el.naturalWidth > 0) setLoaded(true)
  }, [])

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden bg-[#080A0F]">
      <motion.img
        ref={imgRef}
        src={GROUP_PHOTO}
        alt=""
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(false)}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.8s ease' }}
        initial={false}
        animate={shouldReduce ? {} : { scale: [1.04, 1.12] }}
        transition={shouldReduce ? {} : { duration: 24, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
      />
    </div>
  )
}

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
}
const rise = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

export default function Hero({ counts } = {}) {
  const shouldReduce = useReducedMotion()

  const hkiCount = counts?.projects ?? getAll('projects').length
  const paperCount = counts?.research ?? getAll('research').length
  const awardsCount = counts?.awards ?? getAll('awards').length
  const assistantsCount = members.length
  const divisionsCount = divisions.length

  const STATS = [
    [String(assistantsCount), 'assistants'],
    [String(divisionsCount), 'divisions'],
    [String(hkiCount), 'HKI works'],
    [String(paperCount), 'papers'],
    [String(awardsCount), 'awards'],
  ]

  return (
    <section
      id="top"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080A0F] text-white"
    >
      <HeroBackground />

      {/* legibility scrim: vertical gradient + darkened centre + faint brand glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(8,10,15,0.82) 0%, rgba(8,10,15,0.55) 34%, rgba(8,10,15,0.6) 64%, rgba(8,10,15,0.93) 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 82% 56% at 50% 44%, rgba(8,10,15,0.55), transparent 76%)' }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 40%, rgba(31,111,214,0.22), transparent 72%)' }}
      />

      {/* ── centered content ──────────────────────────────── */}
      <motion.div
        variants={shouldReduce ? undefined : container}
        initial={shouldReduce ? false : 'hidden'}
        animate="visible"
        className="relative z-10 mx-auto max-w-4xl px-6 text-center"
      >
        <motion.div variants={shouldReduce ? undefined : rise} className="mb-7 flex items-center justify-center gap-3">
          <span className="h-px w-8 brand-gradient" />
          <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/75">
            Multimedia Application · Big Data · Cyber Security
          </span>
          <span className="h-px w-8 brand-gradient" />
        </motion.div>

        <motion.h1
          variants={shouldReduce ? undefined : rise}
          className="font-display font-extrabold uppercase leading-[0.88] tracking-tight"
          style={{ fontSize: 'clamp(3.2rem, 9vw, 7.5rem)', textShadow: '0 2px 50px rgba(0,0,0,0.5)' }}
        >
          <span className="text-brand">MBC</span>
          <br />
          Laboratory
        </motion.h1>

        <motion.p
          variants={shouldReduce ? undefined : rise}
          className="mx-auto mt-8 max-w-[52ch] font-body text-base leading-relaxed text-white/80 sm:text-lg"
        >
          The Multimedia Application, Big Data &amp; Cyber Security laboratory at Telkom University —
          a student research group turning coursework into security tools, data platforms, maps,
          and games.
        </motion.p>

        <motion.div
          variants={shouldReduce ? undefined : rise}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#members"
            className="group inline-flex items-center gap-2 rounded-full bg-brand-blue px-6 py-3 font-mono text-xs uppercase tracking-[0.16em] text-white transition-transform duration-200 hover:scale-[1.03]"
          >
            Meet the team
            <ArrowUpRight
              size={15}
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
          <a
            href="#divisions"
            className="inline-flex items-center gap-2 rounded-full border border-white/35 px-6 py-3 font-mono text-xs uppercase tracking-[0.16em] text-white transition-colors duration-200 hover:border-white hover:bg-white/10"
          >
            Explore divisions
          </a>
        </motion.div>
      </motion.div>

      {/* ── stat strip, anchored bottom. Centered via a flex wrapper: Framer's
           y-transform on the dl would otherwise cancel a -translate-x-1/2. ── */}
      <div className="absolute inset-x-0 bottom-14 z-10 flex justify-center px-6">
        <motion.dl
          initial={shouldReduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="flex max-w-full flex-wrap items-center justify-center gap-x-6 gap-y-2 rounded-2xl border border-white/15 bg-black/30 px-6 py-3 backdrop-blur-md"
        >
          {STATS.map(([v, l], i) => (
            <div key={l} className="flex items-center gap-2">
              {i > 0 && <span className="mr-5 hidden h-1 w-1 rounded-full bg-brand-red sm:block" />}
              <span className="font-mono text-lg font-medium tnum text-white">{v}</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/55">{l}</span>
            </div>
          ))}
        </motion.dl>
      </div>

      {/* scroll cue */}
      <motion.a
        href="#about"
        aria-label="Scroll to about"
        initial={shouldReduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60"
      >
        <motion.span
          animate={shouldReduce ? {} : { y: [0, 7, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="block"
        >
          <ArrowDown size={18} />
        </motion.span>
      </motion.a>
    </section>
  )
}
