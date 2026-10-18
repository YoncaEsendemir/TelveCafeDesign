import Hero from "@/components/sections/Hero";
import Menu from "@/components/sections/Menu";
import OurStory from "@/components/sections/OurStory";
import Gallery from "@/components/sections/Gallery";
import Visit from "@/components/sections/Visit";

/* ════════════════════════════════════════════════════════════════════
   HOME — ana sayfa ("/") rotası
   Bölümleri sırayla toplar: Hero → Menü (önizleme) → Hikâye → Galeri → Ziyaret
   (Navbar + Footer App kabuğunda; burada yalnız sayfa içeriği var.)
   ════════════════════════════════════════════════════════════════════ */
export default function Home() {
  return (
    <>
      <Hero />
      <Menu />
      <OurStory />
      <Gallery />
      <Visit />
    </>
  );
}
