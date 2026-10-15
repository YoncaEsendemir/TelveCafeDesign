import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Menu from "@/components/sections/Menu";
import OurStory from "@/components/sections/OurStory";
import Gallery from "@/components/sections/Gallery";
import Visit from "@/components/sections/Visit";
import { LanguageProvider } from "@/i18n/LanguageContext";

/** Sayfanın kabuğu: dil sağlayıcısı sarar, içine bölümler sırayla eklenir.
 *  Sıra: Navbar → Hero → Menu → Our Story → Gallery → Visit → Footer. */
export default function App() {
  return (
    <LanguageProvider>
      <Navbar />
      {/* main: sayfanın ana içeriği (a11y landmark). Bölümler buraya girer. */}
      <main>
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
