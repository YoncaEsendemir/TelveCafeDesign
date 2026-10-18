import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
  const { pathname } = useLocation(); // hangi rotadayız (/ mı /menu mu)

  // İki durum (state): sayfa kaydı mı, mobil menü açık mı
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Hamburger butonuna "ref" → menü kapanınca odağı ona geri vereceğiz
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Bölüm linkleri TEK yerde (DRY). "/#menu" → ana sayfadaki bölüme git;
  // başka rotadaysak önce "/"e döner, ScrollManager oraya kaydırır.
  const links = [
    { to: "/#menu", label: t.nav.menu },
    { to: "/#story", label: t.nav.story },
    { to: "/#gallery", label: t.nav.gallery },
    { to: "/#visit", label: t.nav.visit },
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

  /* ── HEADER HATASI DÜZELTMESİ ───────────────────────────────────────
     Eskiden en üstte (Hero'nun KOYU zemini üstünde) linkler koyu
     (text-espresso) idi → koyu-üstüne-koyu, neredeyse görünmezdi.
     Çözüm: "onDark" → sayfa tepedeyken açık renk metin + üstte yumuşak
     koyu gradyan perde (gerçek kontrast); kaydırınca krem zemin + koyu metin. */
  // Sadece ANA SAYFANIN tepesindeyken koyu Hero üstünde açık metin gerekir.
  // Kaydırınca ya da /menu gibi açık zeminli rotada: dolu (krem) navbar.
  const isHome = pathname === "/";
  const solid = scrolled || !isHome;
  const onDark = !solid;
  // İnteraktif metin rengi + hover rengi, duruma göre
  const linkText = onDark
    ? "text-cream/90 hover:text-white"
    : "text-espresso/80 hover:text-burgundy";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        solid
          ? "border-b border-sand/60 bg-cream/85 shadow-sm shadow-espresso/5 backdrop-blur-md"
          : // ana sayfa tepesinde: perdeli gradyan → açık metin her zaman okunur
            "bg-gradient-to-b from-espresso/55 via-espresso/20 to-transparent",
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo — animasyonlu + aksan noktası. Renk duruma göre. */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: -8 }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: duration.base, ease: easeReveal }}
        >
          <Link
            to="/"
            className={cn(
              "group flex items-center font-heading text-2xl font-bold tracking-tight transition-transform",
              onDark ? "text-cream" : "text-espresso",
              !reduced && "hover:scale-[1.04]",
            )}
          >
            {brand.name}
            {/* Marka adının sonundaki karamel nokta — küçük imza detayı */}
            <span aria-hidden="true" className="ml-0.5 text-caramel">.</span>
          </Link>
        </motion.div>

        {/* ───── MASAÜSTÜ menü (md ve üstünde görünür) ───── */}
        <nav aria-label={t.nav.menu} className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "group relative text-sm font-semibold transition-colors",
                linkText,
              )}
            >
              {l.label}
              {/* Hover'da soldan açılan karamel alt çizgi (mikro-etkileşim) */}
              <span
                aria-hidden="true"
                className="absolute -bottom-1.5 left-0 h-0.5 w-full origin-left scale-x-0 rounded-full bg-caramel transition-transform duration-300 group-hover:scale-x-100"
              />
            </Link>
          ))}

          {/* Dil değiştirici — çerçeveli küçük pill (durumla uyumlu renk) */}
          <button
            type="button"
            onClick={toggleLang}
            aria-label={t.lang.switch}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-semibold tracking-wide transition-colors",
              onDark
                ? "border-cream/40 text-cream/90 hover:border-cream hover:text-white"
                : "border-sand text-espresso/80 hover:border-burgundy hover:text-burgundy",
            )}
          >
            {lang === "en" ? t.lang.tr : t.lang.en}
          </button>

          {/* Birincil CTA — dolu burgundy + gölge + basış ölçeği (her zeminde okunur).
              Artık AYRI menü sayfasına (/menu) götürür. */}
          <Link
            to="/menu"
            className={cn(
              "rounded-full bg-burgundy px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-burgundy/25 transition hover:bg-burgundy-dark",
              !reduced && "hover:scale-[1.04] active:scale-[0.97]",
            )}
          >
            {t.nav.cta}
          </Link>
        </nav>

        {/* ───── MOBİL hamburger butonu (md altında görünür) ───── */}
        <button
          ref={toggleRef}
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label={t.nav.openMenu}
          aria-expanded={mobileOpen} // ekran okuyucuya "açık/kapalı" bilgisi
          className={cn("md:hidden", onDark ? "text-cream" : "text-espresso")}
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
              <span className="font-heading text-2xl font-bold text-espresso">
                {brand.name}
                <span aria-hidden="true" className="ml-0.5 text-caramel">.</span>
              </span>
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

            <nav
              aria-label={t.nav.menu}
              className="flex flex-col gap-6 px-6 py-8 text-2xl font-semibold"
            >
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={closeMobile} // linke tıklayınca menü kapansın
                  className="text-espresso transition-colors hover:text-burgundy"
                >
                  {l.label}
                </Link>
              ))}
              <button
                type="button"
                onClick={toggleLang}
                aria-label={t.lang.switch}
                className="self-start rounded-full border border-sand px-4 py-1.5 text-base text-espresso/80 transition-colors hover:border-burgundy hover:text-burgundy"
              >
                {lang === "en" ? t.lang.tr : t.lang.en}
              </button>
              <Link
                to="/menu"
                onClick={closeMobile}
                className="self-start rounded-full bg-burgundy px-6 py-2.5 text-base font-semibold text-white shadow-lg shadow-burgundy/25 transition-colors hover:bg-burgundy-dark"
              >
                {t.nav.cta}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
