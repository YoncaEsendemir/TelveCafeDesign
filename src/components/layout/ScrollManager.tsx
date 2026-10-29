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

// Yayındaki asıl alan adı (prod origin). SABİT tutuyoruz ki localhost
// önizlemesinde bile canonical hep gerçek domain'i göstersin — SEO'da
// canonical ASLA localhost'u değil, yayın adresini işaret etmeli.
const SITE_ORIGIN = "https://yoncaesendemir.com.tr";

export default function ScrollManager() {
  const { pathname, hash } = useLocation();

  // Rota değişince canonical linkini güncelle: /menu kendi canonical'ini alsın
  // (ana sayfanın kopyası sanılmasın). index.html'deki <link rel="canonical">'ı
  // bulup href'ini "origin + yol" yapıyoruz (hash/query hariç → temiz adres).
  useEffect(() => {
    const link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (link) link.href = SITE_ORIGIN + pathname;
  }, [pathname]);

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
