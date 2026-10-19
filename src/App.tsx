import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollManager from "@/components/layout/ScrollManager";
import Home from "@/pages/Home";
import { LanguageProvider, useLanguage } from "@/i18n/LanguageContext";

// /menu rotasını AYRI pakete böl (code-split): ana sayfada bu kod inmez, ilk
// yüklenen JS küçülür → React daha hızlı açılır → hero daha erken görünür (LCP).
// Kullanıcı /menu'ye gidince chunk o an indirilir (Suspense fallback gösterir).
const MenuPage = lazy(() => import("@/pages/MenuPage"));

/** Skip-to-content: klavye kullanıcısı Tab'a basınca ilk çıkan öğe.
 *  Normalde gizli (sr-only), odaklanınca görünür → menüyü atlayıp
 *  doğrudan ana içeriğe (#main) atlar (a11y: WCAG skip-link). */
function SkipLink() {
  const { t } = useLanguage();
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-burgundy focus:px-5 focus:py-2 focus:text-white"
    >
      {t.nav.skip}
    </a>
  );
}

/** Sayfanın kabuğu: dil sağlayıcısı + Navbar/Footer her rotada ortak.
 *  İçerik rotaya göre değişir:  "/" → Home (bölümler),  "/menu" → MenuPage.
 *  ScrollManager: rota/hash değişince doğru yere kaydırır. */
export default function App() {
  return (
    <LanguageProvider>
      <ScrollManager />
      <SkipLink />
      <Navbar />
      {/* main: sayfanın ana içeriği (a11y landmark + skip-link hedefi). */}
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          {/* lazy MenuPage → Suspense ile sar; chunk inene kadar krem zemin (boş flaş olmasın) */}
          <Route
            path="/menu"
            element={
              <Suspense fallback={<div className="min-h-dvh bg-cream" />}>
                <MenuPage />
              </Suspense>
            }
          />
        </Routes>
      </main>
      {/* Footer main'in DIŞINDA → kendi "contentinfo" landmark'ı */}
      <Footer />
    </LanguageProvider>
  );
}
