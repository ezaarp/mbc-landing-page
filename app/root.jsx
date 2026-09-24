import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  Link,
  isRouteErrorResponse,
  useRouteError,
  useLoaderData,
} from "react-router";
import "./index.css";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import FloatingThemeToggle from "./components/FloatingThemeToggle";
import { useTheme } from "./hooks/useTheme";
import { pageMeta } from "./lib/seo";
import { getPublicItems } from "./lib/content";

export const links = () => [
  { rel: "icon", type: "image/svg+xml", href: "/mbc-app-icon.svg" },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600;12..96,700;12..96,800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=IBM+Plex+Mono:wght@400;500;600&display=swap",
  },
];

export const meta = () =>
  pageMeta({
    title: "MBC Laboratory · Telkom University",
    description:
      "MBC Laboratory is a student research laboratory at Telkom University, Bandung — five divisions, fifty-three assistants, turning coursework into real systems.",
    path: "/",
  });

export async function loader() {
  const events = await getPublicItems("events");
  const recruitmentClosed = events.some(
    (event) => event.tag === "Recruitment" && event.status === "closed",
  );
  return { recruitmentClosed };
}

// Prevents a flash of the wrong theme before React hydrates.
const themeScript = `try{if(localStorage.getItem('mbc-theme')==='dark'){document.documentElement.classList.add('dark')}}catch(e){}`;

export function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Meta />
        <Links />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { isDark, toggle } = useTheme();
  const data = useLoaderData();
  const recruitmentClosed = data?.recruitmentClosed;

  return (
    <>
      <Nav recruitmentClosed={recruitmentClosed} />
      <main className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
        <Outlet />
      </main>
      <Footer recruitmentClosed={recruitmentClosed} />
      <FloatingThemeToggle isDark={isDark} onToggle={toggle} />
    </>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const is404 = isRouteErrorResponse(error) && error.status === 404;
  return (
    <main className="mx-auto max-w-page px-6 pt-32 pb-20 text-center">
      <h1 className="font-display text-3xl font-bold text-[var(--ink)]">
        {is404 ? "Page not found" : "Something went wrong"}
      </h1>
      <Link
        to="/"
        className="mt-6 inline-block font-mono text-xs uppercase tracking-[0.2em] text-brand-blue hover:underline"
      >
        ← Back home
      </Link>
    </main>
  );
}
