import type { ReactNode } from "react";

/**
 * Shared page shell so every content page uses the same max width, horizontal
 * padding, and vertical rhythm. Keeps headings aligned across pages.
 */
export function Page({ children }: { children: ReactNode }) {
  return (
    <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {children}
    </main>
  );
}

/** Consistent page title used at the top of every content page. */
export function PageHeading({ children }: { children: ReactNode }) {
  return <h1 className="text-3xl font-bold text-text-main mb-8">{children}</h1>;
}
