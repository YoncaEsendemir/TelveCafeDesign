import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Dict, Lang } from "./index";
import { DEFAULT_LANG, dictionaries } from "./index";

const STORAGE_KEY = "telve.lang";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Dict; // seçili dilin sözlüğü
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

/** Kayıtlı dili localStorage'dan okur. Gizli sekme / engelli depolamada
 *  çökmemek için try/catch içinde. */
function readStoredLang(): Lang {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (value === "en" || value === "tr") return value;
  } catch {
    /* depolama erişilemez — varsayılana düş */
  }
  return DEFAULT_LANG;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readStoredLang);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* yazılamadıysa yoksay */
    }
  }, []);

  // <html lang> her dil değişiminde güncellenir (erişilebilirlik + SEO)
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value: LanguageContextValue = { lang, setLang, t: dictionaries[lang] };

  return <LanguageContext value={value}>{children}</LanguageContext>;
}

/** Dili ve sözlüğü okumak için: const { t, lang, setLang } = useLanguage() */
export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within <LanguageProvider>");
  return ctx;
}
