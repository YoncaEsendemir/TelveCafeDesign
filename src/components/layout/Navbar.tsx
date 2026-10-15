import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu as MenuIcon, X } from "lucide-react";
import { brand } from "@/data/brand";
import { useLanguage } from "@/i18n/LanguageContext";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";
import { duration, easeReveal } from "@/lib/motion";

export default function Navbar() {
  // Veri + dil: hook seçili dilin sözlüğünü (t) ve dil durumunu verir
  const { t, lang, setLang } = useLanguage();
  const reduced = usePrefersReducedMotion(); // "hareketi azalt" açık mı?

  // İki durum (state): sayfa kaydı mı, mobil menü açık mı
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Hamburger butonuna "ref" → menü kapanınca odağı ona geri vereceğiz
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Linkleri TEK yerde tut → hem masaüstü hem mobilde .map() ile kullan (DRY)
  const links = [
    { href: "#menu", label: t.nav.menu },
    { href: "#story", label: t.nav.story },
    { href: "#gallery", label: t.nav.gallery },
    { href: "#visit", label: t.nav.visit },
  ];

  const toggleLang = () => setLang(lang === "en" ? "tr" : "en");

  // ── Aşama 2: sayfa 8px'den fazla kayınca navbar arka planı matlaşsın ──
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll(); // ilk yüklemedeki durumu da ayarla
    window.addEventListener("scroll", onScroll, { passive: true });
    // temizlik: component kalkınca dinleyiciyi kaldır (bellek sızıntısı olmasın)
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Mobil menü açıkken: Esc ile kapan + arka plan scroll'unu kilitle ──
  useEffect(() => {
    if (!mobileOpen) return; // menü kapalıysa hiçbir şey yapma
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        toggleRef.current?.focus(); // odağı hamburger'e geri ver
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden"; // arkadaki sayfa kaymasın
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = ""; // eski haline döndür
    };
  }, [mobileOpen]);

  // ── Masaüstüne geçince (≥768px) açık kalan mobil menüyü kapat ──
  // (yoksa scroll kilidi masaüstünde takılı kalabilir)
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (mq.matches) setMobileOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Menüyü kapat + odağı hamburger'e geri ver (klavye erişilebilirliği)
  const closeMobile = () => {
    setMobileOpen(false);
    toggleRef.current?.focus();
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        // scrolled ise: yarı saydam cream + blur + alt kenarlık; değilse şeffaf
        scrolled ? "border-b border-sand bg-cream/80 backdrop-blur-md" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo — animasyonlu (reduced-motion açıksa animasyon kapanır) */}
        <motion.a
          href="#top"
          className="font-heading text-2xl text-espresso"
          initial={reduced ? false : { opacity: 0, y: -8 }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          whileHover={reduced ? undefined : { scale: 1.05 }}
          transition={{ duration: duration.base, ease: easeReveal }}
        >
          {brand.name}
        </motion.a>

        {/* ───── MASAÜSTÜ menü (md ve üstünde görünür) ───── */}
        <nav aria-label={t.nav.menu} className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-espresso transition-colors hover:text-burgundy"
            >
              {l.label}
            </a>
          ))}
          <button
            type="button"
            onClick={toggleLang}
            aria-label={t.lang.switch}
            className="text-espresso transition-colors hover:text-burgundy"
          >
            {lang === "en" ? t.lang.tr : t.lang.en}
          </button>
          <a
            href="#menu"
            className="rounded-full bg-burgundy px-4 py-2 text-white transition-colors hover:bg-burgundy-dark"
          >
            {t.nav.cta}
          </a>
        </nav>

        {/* ───── MOBİL hamburger butonu (md altında görünür) ───── */}
        <button
          ref={toggleRef}
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label={t.nav.openMenu}
          aria-expanded={mobileOpen} // ekran okuyucuya "açık/kapalı" bilgisi
          className="text-espresso md:hidden"
        >
          <MenuIcon size={28} aria-hidden="true" />
        </button>
      </div>

      {/* ───── MOBİL tam-ekran menü ───── */}
      {/* AnimatePresence: açılıp KAPANIRKEN de animasyon yapabilmek için */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col bg-cream md:hidden"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: duration.fast }}
          >
            <div className="flex items-center justify-between px-6 py-4">
              <span className="font-heading text-2xl text-espresso">{brand.name}</span>
              <button
                type="button"
                onClick={closeMobile}
                aria-label={t.nav.closeMenu}
                className="text-espresso"
                autoFocus // menü açılınca odak buraya gelsin
              >
                <X size={28} aria-hidden="true" />
              </button>
            </div>

            <nav aria-label={t.nav.menu} className="flex flex-col gap-6 px-6 py-8 text-xl">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={closeMobile} // linke tıklayınca menü kapansın
                  className="text-espresso transition-colors hover:text-burgundy"
                >
                  {l.label}
                </a>
              ))}
              <button
                type="button"
                onClick={toggleLang}
                aria-label={t.lang.switch}
                className="self-start text-espresso transition-colors hover:text-burgundy"
              >
                {lang === "en" ? t.lang.tr : t.lang.en}
              </button>
              <a
                href="#menu"
                onClick={closeMobile}
                className="self-start rounded-full bg-burgundy px-5 py-2 text-white transition-colors hover:bg-burgundy-dark"
              >
                {t.nav.cta}
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
