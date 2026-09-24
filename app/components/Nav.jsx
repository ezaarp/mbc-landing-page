import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { getAll } from '../lib/content'

// Anchors navigate to the home page + section; routes use <Link>.
const LINKS = [
  { href: '/#about', label: 'About' },
  { href: '/#divisions', label: 'Divisions' },
  { href: '/#members', label: 'People' },
  { to: '/projects', label: 'Projects' },
  { to: '/research', label: 'Research' },
  { to: '/awards', label: 'Awards' },
  { to: '/blog', label: 'Blog' },
]

export default function Nav({ recruitmentClosed: rcProp } = {}) {
  const recruitmentClosed = rcProp ?? getAll('events').some(
    (event) => event.tag === 'Recruitment' && event.status === 'closed',
  )
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()
  const { pathname } = useLocation()
  const onHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  // The transparent/white treatment only reads well over the home hero.
  // On every other route — or once the mobile menu is open — use the solid
  // treatment so the links and hamburger stay legible.
  const solid = scrolled || !onHome || open

  const linkClass = (active) =>
    `font-mono text-[11px] uppercase tracking-[0.18em] transition-colors duration-200 ${
      active
        ? 'text-[var(--ink-2)] hover:text-[var(--ink)]'
        : 'text-white/80 hover:text-white'
    }`

  const renderLink = (l, className, onClick) =>
    l.to ? (
      <Link key={l.to} to={l.to} className={className} onClick={onClick}>
        {l.label}
      </Link>
    ) : (
      <a key={l.href} href={l.href} className={className} onClick={onClick}>
        {l.label}
      </a>
    )

  return (
    <motion.header
      initial={{ y: -48, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
      className="fixed inset-x-0 top-0 z-40 backdrop-blur-md transition-colors duration-300"
      style={{
        backgroundColor: solid ? 'color-mix(in srgb, var(--paper) 82%, transparent)' : 'transparent',
        borderBottom: `1px solid ${solid ? 'var(--line)' : 'transparent'}`,
      }}
    >
      <div className="mx-auto flex max-w-page items-center justify-between px-6 py-4 lg:px-10">
        <Link to="/" className="flex items-center gap-3" aria-label="MBC Lab — home">
          <img src="/logo.png" alt="MBC Lab" className="h-7 w-auto" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => renderLink(l, linkClass(solid)))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {recruitmentClosed ? (
            <span
              aria-disabled="true"
              className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-full bg-brand-blue/45 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-white/55 sm:gap-2 sm:px-4 sm:py-2 sm:text-[11px] sm:tracking-[0.16em]"
            >
              Recruitment closed
            </span>
          ) : (
            <a
              href="/#recruit"
              className="group inline-flex items-center gap-1.5 rounded-full bg-brand-blue px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-white transition-transform duration-200 hover:scale-[1.04] sm:gap-2 sm:px-4 sm:py-2 sm:text-[11px] sm:tracking-[0.16em]"
            >
              Join the lab
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-red transition-transform duration-300 group-hover:scale-150" />
            </a>
          )}

          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className={`grid h-11 w-11 place-items-center rounded-full transition-colors duration-200 md:hidden ${
              solid ? 'text-[var(--ink)] hover:bg-[var(--surface-2)]' : 'text-white hover:bg-white/10'
            }`}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            key="mobile-menu"
            initial={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-[var(--line)] bg-[var(--surface)] md:hidden"
          >
            <div className="mx-auto flex max-w-page flex-col px-6 py-2">
              {LINKS.map((l) =>
                renderLink(
                  l,
                  'flex min-h-[48px] items-center font-mono text-[12px] uppercase tracking-[0.18em] text-[var(--ink-2)] transition-colors duration-200 hover:text-[var(--ink)]',
                  () => setOpen(false),
                ),
              )}
              {recruitmentClosed ? (
                <span
                  aria-disabled="true"
                  className="mt-3 mb-3 flex min-h-[48px] cursor-not-allowed items-center justify-center rounded-full bg-brand-blue/45 px-4 font-mono text-[12px] uppercase tracking-[0.16em] text-white/55"
                >
                  Recruitment closed
                </span>
              ) : (
                <a
                  href="/#recruit"
                  onClick={() => setOpen(false)}
                  className="mt-3 mb-3 flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-brand-blue px-4 font-mono text-[12px] uppercase tracking-[0.16em] text-white"
                >
                  Join the lab
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-red" />
                </a>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
