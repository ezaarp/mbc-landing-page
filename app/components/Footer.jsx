import { divisions } from '../data/divisions'
import { getAll } from '../lib/content'

const CONTACT_EMAIL = 'contact@mbclaboratory.com'

const EXPLORE = [
  ['About', '/#about'],
  ['Divisions', '/#divisions'],
  ['People', '/#members'],
  ['Work', '/#work'],
  ['Awards', '/awards'],
  ['Blog', '/blog'],
  ['Recruitment', '/#recruit'],
]

export default function Footer({ recruitmentClosed: rcProp } = {}) {
  const recruitmentClosed = rcProp ?? getAll('events').some(
    (event) => event.tag === 'Recruitment' && event.status === 'closed',
  )
  return (
    <footer className="relative overflow-hidden border-t border-[var(--line)] bg-[var(--surface)] px-6 pb-10 pt-16 lg:px-10">
      <div className="mx-auto max-w-page">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          {/* brand */}
          <div className="col-span-2 max-w-xs md:col-span-1">
            <img src="/logo.png" alt="MBC Lab" className="h-9 w-auto" />
            <p className="mt-4 font-body text-sm leading-relaxed text-[var(--ink-2)]">
              Multimedia, Big Data &amp; Cyber Security Laboratory — Faculty of Electrical
              Engineering, Telkom University.
            </p>
            <span className="mt-5 block h-1.5 w-24 rounded-full brand-gradient" />
          </div>

          {/* divisions */}
          <div>
            <h4 className="mb-4 font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--ink-3)]">
              Divisions
            </h4>
            <ul className="space-y-2.5">
              {divisions.map((d) => (
                <li key={d.id}>
                  <a
                    href="/#divisions"
                    className="group flex items-center gap-2.5 font-body text-sm text-[var(--ink-2)] transition-colors hover:text-[var(--ink)]"
                  >
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
                    {d.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* explore */}
          <div>
            <h4 className="mb-4 font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--ink-3)]">
              Explore
            </h4>
            <ul className="space-y-2.5">
              {EXPLORE.map(([label, href]) => (
                <li key={href}>
                  {label === 'Recruitment' && recruitmentClosed ? (
                    <span aria-disabled="true" className="cursor-not-allowed font-body text-sm text-[var(--ink-3)]">
                      Recruitment closed
                    </span>
                  ) : (
                    <a
                      href={href}
                      className="font-body text-sm text-[var(--ink-2)] transition-colors hover:text-[var(--ink)]"
                    >
                      {label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* contact */}
          <div>
            <h4 className="mb-4 font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--ink-3)]">
              Contact
            </h4>
            <ul className="space-y-2.5 font-body text-sm text-[var(--ink-2)]">
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`} className="transition-colors hover:text-[var(--ink)]">
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li>Telkom University, Bandung</li>
            </ul>
          </div>
        </div>

        {/* giant wordmark */}
        <div
          aria-hidden="true"
          className="pointer-events-none mt-14 select-none font-display font-extrabold leading-none tracking-tight text-[var(--ink)] opacity-[0.05]"
          style={{ fontSize: 'clamp(4rem, 17vw, 15rem)' }}
        >
          MBC LAB
        </div>

        <div className="mt-6 flex flex-col items-start justify-between gap-3 border-t border-[var(--line)] pt-6 sm:flex-row sm:items-center">
          <p className="font-mono text-[11px] text-[var(--ink-3)]">
            © {new Date().getFullYear()} MBC Lab · Telkom University
          </p>
        </div>
      </div>
    </footer>
  )
}
