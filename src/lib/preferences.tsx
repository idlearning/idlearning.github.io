// App-wide user preferences: language (English/Korean).
//
// The site is prerendered to static HTML, so the server render always uses the
// default language below. On the client we read the persisted choice from
// localStorage and update. A tiny script (see `preferencesHeadScript`) runs in
// <head> before paint to reflect the saved language on <html lang>.
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "ko" | "en";

const LANG_KEY = "idl-lang";

const DEFAULT_LANG: Lang = "en";

type PreferencesValue = {
  lang: Lang;
  toggleLang: () => void;
  setLang: (lang: Lang) => void;
};

const PreferencesContext = createContext<PreferencesValue | null>(null);

function readStoredLang(): Lang {
  if (typeof window === "undefined") return DEFAULT_LANG;
  const stored = window.localStorage.getItem(LANG_KEY);
  return stored === "ko" || stored === "en" ? stored : DEFAULT_LANG;
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  // Hydrate from storage once on the client.
  useEffect(() => {
    setLangState(readStoredLang());
  }, []);

  // Reflect language onto <html lang> and persist.
  useEffect(() => {
    document.documentElement.lang = lang;
    window.localStorage.setItem(LANG_KEY, lang);
  }, [lang]);

  const setLang = useCallback((next: Lang) => setLangState(next), []);
  const toggleLang = useCallback(() => setLangState((l) => (l === "ko" ? "en" : "ko")), []);

  const value = useMemo<PreferencesValue>(
    () => ({ lang, toggleLang, setLang }),
    [lang, toggleLang, setLang],
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
 * Inline script (stringified) that reflects the saved language on <html lang>
 * before first paint. Injected in the document <head>.
 */
export const preferencesHeadScript = `(function(){try{var l=localStorage.getItem('${LANG_KEY}');if(l==='ko'||l==='en'){document.documentElement.lang=l;}}catch(e){}})();`;
