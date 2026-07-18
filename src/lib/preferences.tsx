// App-wide user preferences: language (English/Korean).
//
// The URL is the single source of truth — `/people` is English, `/ko/people` is
// Korean (see src/lib/lang.ts). That replaces the previous localStorage toggle,
// which had two problems: the Korean site was invisible to search engines
// because only the English HTML was ever prerendered, and a Korean page could
// not be linked to or shared.
//
// Deriving language from the router also means SSR and the client always agree,
// so there is no hydration mismatch and no pre-paint flash to patch over.
import { useRouterState } from "@tanstack/react-router";

import { langFromPathname, localizedPath, stripLangPrefix, type Lang } from "./lang";

export type { Lang };

/** The current pathname, tracked through client-side navigations. */
function usePathname(): string {
  return useRouterState({ select: (s) => s.location.pathname });
}

/** The language the current URL is served in. */
export function useLang(): Lang {
  return langFromPathname(usePathname());
}

type PreferencesValue = {
  lang: Lang;
  /** The current page's logical path, i.e. with any language prefix removed. */
  logicalPath: string;
  /** URL of the current page in the other language, for the header switcher. */
  counterpartPath: string;
};

export function usePreferences(): PreferencesValue {
  const pathname = usePathname();
  const lang = langFromPathname(pathname);
  const logicalPath = stripLangPrefix(pathname);
  return {
    lang,
    logicalPath,
    counterpartPath: localizedPath(logicalPath, lang === "ko" ? "en" : "ko"),
  };
}
