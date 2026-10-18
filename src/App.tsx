import { Route, Routes } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollManager from "@/components/layout/ScrollManager";
import Home from "@/pages/Home";
import MenuPage from "@/pages/MenuPage";
import { LanguageProvider, useLanguage } from "@/i18n/LanguageContext";

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
          <Route path="/menu" element={<MenuPage />} />
        </Routes>
      </main>
      {/* Footer main'in DIŞINDA → kendi "contentinfo" landmark'ı */}
      <Footer />
    </LanguageProvider>
  );
}
