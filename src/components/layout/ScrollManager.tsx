import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/* ════════════════════════════════════════════════════════════════════
   SCROLLMANAGER — rota/hash değişince sayfayı doğru yere kaydırır
   · react-router sayfa değişince otomatik kaydırmaz → bunu biz yaparız
   · Hash varsa (ör. "/#story"): o id'li bölüme yumuşakça kaydır
   · Hash yoksa (ör. "/menu"): sayfanın en üstüne çık
   · reduced-motion'a saygı: açıksa anında (behavior "auto")
   · jsdom'da scrollTo/scrollIntoView tam yok → try/catch ile güvenli
   Görünür bir şey render etmez (null döner); App içinde bir kez durur.
   ════════════════════════════════════════════════════════════════════ */

export default function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // "Hareketi azalt" açıksa ani, değilse yumuşak kaydır
    const smooth =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior: ScrollBehavior = smooth ? "smooth" : "auto";

    try {
      if (hash) {
        const el = document.getElementById(hash.slice(1));
        if (el) {
          el.scrollIntoView({ behavior, block: "start" });
          return;
        }
      }
      window.scrollTo({ top: 0, left: 0, behavior });
    } catch {
      /* test/jsdom ortamında scroll API'si yok — yoksay */
    }
  }, [pathname, hash]);

  return null;
}
