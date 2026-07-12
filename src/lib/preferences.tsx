// App-wide user preferences: color theme (light/dark) and language (Korean/English).
//
// The site is prerendered to static HTML, so the server render always uses the
// defaults below. On the client we read the persisted choice from localStorage
// and update. A tiny no-flash script (see `preferencesHeadScript`) runs in
// <head> before paint to apply the saved theme class, avoiding a light->dark
// flash on load.
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark";
export type Lang = "ko" | "en";

const THEME_KEY = "idl-theme";
const LANG_KEY = "idl-lang";

const DEFAULT_THEME: Theme = "light";
const DEFAULT_LANG: Lang = "ko";

type PreferencesValue = {
  theme: Theme;
  lang: Lang;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  toggleLang: () => void;
  setLang: (lang: Lang) => void;
};

const PreferencesContext = createContext<PreferencesValue | null>(null);

function readStoredTheme(): Theme {
  if (typeof window === "undefined") return DEFAULT_THEME;
  const stored = window.localStorage.getItem(THEME_KEY);
  if (stored === "light" || stored === "dark") return stored;
  // Fall back to the OS preference on first visit.
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function readStoredLang(): Lang {
  if (typeof window === "undefined") return DEFAULT_LANG;
  const stored = window.localStorage.getItem(LANG_KEY);
  return stored === "ko" || stored === "en" ? stored : DEFAULT_LANG;
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(DEFAULT_THEME);
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  // Hydrate from storage once on the client.
  useEffect(() => {
    setThemeState(readStoredTheme());
    setLangState(readStoredLang());
  }, []);

  // Reflect theme onto <html> and persist.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  // Reflect language onto <html lang> and persist.
  useEffect(() => {
    document.documentElement.lang = lang;
    window.localStorage.setItem(LANG_KEY, lang);
  }, [lang]);

  const setTheme = useCallback((next: Theme) => setThemeState(next), []);
  const toggleTheme = useCallback(
    () => setThemeState((t) => (t === "dark" ? "light" : "dark")),
    [],
  );
  const setLang = useCallback((next: Lang) => setLangState(next), []);
  const toggleLang = useCallback(() => setLangState((l) => (l === "ko" ? "en" : "ko")), []);

  const value = useMemo<PreferencesValue>(
    () => ({ theme, lang, toggleTheme, setTheme, toggleLang, setLang }),
    [theme, lang, toggleTheme, setTheme, toggleLang, setLang],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences(): PreferencesValue {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error("usePreferences must be used within a PreferencesProvider");
  return ctx;
}

/** Convenience hook returning just the current language. */
export function useLang(): Lang {
  return usePreferences().lang;
}

/**
 * Inline script (stringified) that applies the saved theme before first paint,
 * so there is no flash of the wrong theme. Injected in the document <head>.
 */
export const preferencesHeadScript = `(function(){try{var t=localStorage.getItem('${THEME_KEY}');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}if(t==='dark'){document.documentElement.classList.add('dark');}var l=localStorage.getItem('${LANG_KEY}');if(l==='ko'||l==='en'){document.documentElement.lang=l;}}catch(e){}})();`;
