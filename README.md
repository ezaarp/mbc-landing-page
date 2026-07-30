# MBC Lab — Landing Page

Official landing page for the **Multimedia, Big Data & Cyber Security Laboratory** at Telkom University, Bandung.

---

## Stack

- **React 18** + **Vite**
- **Tailwind CSS v3**
- **Framer Motion** — scroll animations, accordion, reduced-motion support
- **Lucide React** — icons
- **Fonts:** Syne (heading), DM Sans (body), IBM Plex Mono (mono) via Google Fonts

---

## Getting Started

```bash
npm install
npm run dev       # dev server → http://localhost:5173
npm run build     # production build → dist/
npm run preview   # preview production build
```

---

## Project Structure

```
src/
├── components/
│   ├── HeroB.jsx            # Hero section with stats strip
│   ├── About.jsx            # Expandable division rows + roster table
│   ├── Events.jsx           # Upcoming events cards
│   ├── Achievements.jsx     # 3-column ledger: projects / research / partnerships
│   ├── Footer.jsx           # Logo, contact info
│   └── FloatingThemeToggle.jsx
├── data/
│   ├── divisions.js         # 5 division definitions
│   ├── events.js            # Upcoming events (currently: recruitment)
│   └── achievements.js      # Projects, research papers, partnerships
├── hooks/
│   └── useTheme.js          # Dark/light mode toggle (persisted to localStorage)
├── index.css                # CSS variables for theming
└── App.jsx
public/
└── logo.png                 # MBC Lab logo
```

---

## Theming

Light/dark via CSS custom properties on `<html class="dark">`. Toggle persists to `localStorage`.

| Variable | Light | Dark |
|---|---|---|
| `--bg-base` | `#EDF1F7` | `#070B14` |
| `--bg-surface` | `#E4EAF4` | `#0B1120` |
| `--bg-card` | `#FFFFFF` | `#111B2E` |
| `--text-primary` | `#0D1524` | `#DDE6F0` |
| `--text-secondary` | `#3A5270` | `#5C7A99` |
| `--text-muted` | `#7A90A8` | `#2E4560` |
| `--border` | `#C8D4E4` | `#1B2C42` |

---

## Sections

### Hero
Stats: 51 assistants · 8 HKI works · 3 papers · 5 divisions.

### About
5 divisions with click-to-expand rows and a roster table.

| Division | Members | Projects |
|---|---|---|
| Cyber Security | 9 | 3 |
| Big Data | 12 | 1 |
| GIS | 9 | 3 |
| Game Tech | 9 | 4 |
| Practicum | 12 | 0 |
| **Total** | **51** | **8** |

### Events
Currently: **Open Recruitment MBC Lab 2026/2027** — closed. See you next year.

### Achievements
**Projects (8 HKI):** Hiring The Rookie, Cisandung, Sojurn X Divide, Cycle Chess, Big Data ML Toolkit, WebGIS Pariwisata Bandung, WebGIS Pariwisata Jakarta, Belajar Bareng Edisi 8.

**Research (3 papers):** IEEE Access (federated learning), ISPRS Journal (urban heat island), IEEE Conference on Games (procedural generation).

**Partnerships:** Telkom Indonesia, Digistar Club, Bandung City Government.

---

## Updating Data

| What | File |
|---|---|
| Division descriptions | `src/data/divisions.js` |
| Recruitment event details | `src/data/events.js` |
| Projects / research / partnerships | `src/data/achievements.js` |
| Member counts | `src/components/About.jsx` → `DIV_META` |
| Hero stats | `src/components/HeroB.jsx` → `STATS` |

---

## Contact

mbclabr@gmail.com · Telkom University, Bandung
# mbc-landing-page
