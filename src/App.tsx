import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Menu from "@/components/sections/Menu";
import OurStory from "@/components/sections/OurStory";
import Gallery from "@/components/sections/Gallery";
import Visit from "@/components/sections/Visit";
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

/** Sayfanın kabuğu: dil sağlayıcısı sarar, içine bölümler sırayla eklenir.
 *  Sıra: Navbar → Hero → Menu → Our Story → Gallery → Visit → Footer. */
export default function App() {
  return (
    <LanguageProvider>
      <SkipLink />
      <Navbar />
      {/* main: sayfanın ana içeriği (a11y landmark + skip-link hedefi). */}
      <main id="main">
        <Hero />
        <Menu />
        <OurStory />
        <Gallery />
        <Visit />
      </main>
      {/* Footer main'in DIŞINDA → kendi "contentinfo" landmark'ı */}
      <Footer />
    </LanguageProvider>
  );
}
