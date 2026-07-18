import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { LocalLink } from "../components/LocalLink";
import { useT } from "../lib/i18n";
import { HTML_LANG, langFromPathname } from "../lib/lang";
import { SITE_TITLE, SITE_DESCRIPTION, SITE_NAME, SITE_URL, OG_IMAGE } from "../lib/site-meta";

/** Shared button styling for the 404 / error screens. */
const PRIMARY_BUTTON =
  "inline-flex items-center justify-center rounded-md bg-idl-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:brightness-95";
const SECONDARY_BUTTON =
  "inline-flex items-center justify-center rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-text-main transition-colors hover:bg-idl-blue/10";

function NotFoundComponent() {
  const t = useT();
  return (
    <main className="flex flex-grow items-center justify-center px-4 py-24">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-idl-blue">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-text-main">{t.notFound.title}</h2>
        <p className="mt-2 text-sm text-text-muted" style={{ wordBreak: "keep-all" }}>
          {t.notFound.body}
        </p>
        <div className="mt-6">
          {/* LocalLink so a 404 under /ko keeps the visitor in Korean. */}
          <LocalLink to="/" className={PRIMARY_BUTTON}>
            {t.notFound.home}
          </LocalLink>
        </div>
      </div>
    </main>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const t = useT();
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <main className="flex flex-grow items-center justify-center px-4 py-24">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-text-main">{t.error.title}</h1>
        <p className="mt-2 text-sm text-text-muted" style={{ wordBreak: "keep-all" }}>
          {t.error.body}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className={PRIMARY_BUTTON}
          >
            {t.error.retry}
          </button>
          <LocalLink to="/" className={SECONDARY_BUTTON}>
            {t.error.home}
          </LocalLink>
        </div>
      </div>
    </main>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: SITE_TITLE },
      { name: "description", content: SITE_DESCRIPTION },
      { name: "author", content: SITE_NAME },
      { property: "og:title", content: SITE_TITLE },
      { property: "og:description", content: SITE_DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: SITE_TITLE },
      { name: "twitter:description", content: SITE_DESCRIPTION },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [
      // Pretendard is bundled into this stylesheet (see src/fonts.css), so there
      // is no third-party font request blocking first paint.
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon-idl.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/favicon-idl.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  // The URL carries the language (see src/lib/lang.ts), so <html lang> can be
  // resolved during prerender — no pre-paint script needed to patch it up.
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <html lang={HTML_LANG[langFromPathname(pathname)]}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col bg-background text-text-main antialiased">
        <SiteHeader />
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
        <SiteFooter />
      </div>
    </QueryClientProvider>
  );
}
