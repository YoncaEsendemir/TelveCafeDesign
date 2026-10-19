import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { fullMenu, type MenuEntry } from "@/data/fullMenu";
import { brand } from "@/data/brand";
import { useLanguage } from "@/i18n/LanguageContext";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { duration, easeReveal, stagger } from "@/lib/motion";
import { cn } from "@/lib/cn";
import CoffeeBean from "@/components/decor/CoffeeBean";
import BeanField from "@/components/decor/BeanField";
import SectionHeading from "@/components/layout/SectionHeading";

/* ════════════════════════════════════════════════════════════════════
   MENUPAGE — "/menu" tam menü sayfası (modern kafe menüsü)
   · Kategoriler: Sıcak · Soğuk · Tatlılar (data/fullMenu)
   · ÜSTTE yapışkan (sticky) kategori çubuğu → scroll-spy ile aktif kategori
     kendiliğinden vurgulanır; tıklayınca o kategoriye yumuşak kayar
     (aktif pill ana sayfadaki filtre diliyle AYNI → layoutId ile kayar)
   · Editoryal kategori başlığı: numara chip'i + başlık + tanıtım + adet
   · Ürün kartı: büyük foto/çekirdek karosu + isim + fiyat pill'i + açıklama
     İmza ürünlerde amber vurgu (ring + rozet) → göz önce oraya gider
   · "Ürün satışı" değil, basılı menü havası; backend/admin YOK — veri sabit
   · Reveal + sticky çubuk reduced-motion'a saygılı; arkada hafif BeanField
   ════════════════════════════════════════════════════════════════════ */

/** Minik imza yıldızı (lucide'a bağımlı olmasın diye satır içi SVG). */
function Star({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.1 6.47L12 17.9l-5.8 3.05 1.1-6.47-4.7-4.58 6.5-.95L12 2.5z" />
    </svg>
  );
}

/** Tek bir menü satırı (kart). Foto varsa gösterir, yoksa çekirdek karosu.
 *  İmza ürün (tag'li) → amber vurgulu kart + rozet. */
function MenuItem({ item, reduced }: { item: MenuEntry; reduced: boolean }) {
  const { lang } = useLanguage();
  const isSignature = Boolean(item.tag);

  return (
    <article
      className={cn(
        "group relative flex gap-4 rounded-2xl border p-3.5 shadow-sm shadow-espresso/5 transition duration-300",
        isSignature
          ? "border-caramel/50 bg-caramel/[0.06] hover:border-caramel"
          : "border-sand/50 bg-surface hover:border-caramel/50",
        !reduced && "hover:-translate-y-0.5 hover:shadow-md hover:shadow-espresso/10",
      )}
    >
      {/* Sol: foto karesi ya da çekirdek-monogram karosu (96px, daha belirgin) */}
      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-linen">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name[lang]}
            width={320}
            height={320}
            loading="lazy"
            className={cn(
              "h-full w-full object-cover transition-transform duration-500",
              !reduced && "group-hover:scale-105",
            )}
          />
        ) : (
          // Fotosuz ürün: sıcak gradyan zeminde çekirdek (sade ve bütünlüklü)
          <div
            aria-hidden="true"
            className="grid h-full w-full place-items-center bg-gradient-to-br from-linen to-sand/50 opacity-80"
          >
            <CoffeeBean size={28} gid={`menu-bean-${item.id}`} />
          </div>
        )}
      </div>

      {/* Sağ: isim + fiyat satırı, açıklama, (imza) rozet */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 font-heading text-xl leading-tight text-espresso">
            {item.name[lang]}
          </h3>
          {/* Fiyat: yuvarlak pill → basılı menüdeki noktalı ayraçtan modern */}
          <span className="shrink-0 rounded-full bg-linen px-3 py-1 font-body text-sm font-bold text-burgundy">
            {item.price}
          </span>
        </div>

        <p className="mt-1.5 text-sm leading-snug text-espresso/65">{item.desc[lang]}</p>

        {item.tag && (
          <span
            className={cn(
              "mt-2.5 inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wide uppercase",
              isSignature
                ? "bg-caramel/20 text-mocha"
                : "border border-caramel/40 bg-caramel/10 text-mocha",
            )}
          >
            {isSignature && <Star />}
            {item.tag[lang]}
          </span>
        )}
      </div>
    </article>
  );
}

export default function MenuPage() {
  const { t, lang } = useLanguage();
  const reduced = usePrefersReducedMotion();

  // Scroll-spy: o an ekranın üst bandında hangi kategori var → sticky çubukta vurgula
  const [activeCat, setActiveCat] = useState(fullMenu[0]?.id ?? "");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  // Gerçek bir rota olduğu için sekme başlığını güncelle (çıkınca geri al)
  useEffect(() => {
    const prev = document.title;
    document.title = `${t.menuPage.title} — ${brand.name}`;
    return () => {
      document.title = prev;
    };
  }, [t.menuPage.title]);

  // IntersectionObserver ile aktif kategoriyi izle: ekranın üstüne yakın ince
  // bir bant kuruyoruz (-45% üst / -50% alt); o anda bu bandı dolduran bölüm aktif.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-cat");
            if (id) setActiveCat(id);
          }
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    const els = Object.values(sectionRefs.current).filter(Boolean) as HTMLElement[];
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Kategori çubuğundan tıklayınca o bölüme kaydır (reduced-motion → anında)
  const goToCat = (id: string) => {
    setActiveCat(id); // iyimser: hemen vurgula, observer sonra teyit eder
    sectionRefs.current[id]?.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "start",
    });
  };

  // Kart ızgarası reveal (diğer bölümlerdeki kalıbın aynısı)
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger * 0.5 } },
  };
  const cell: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: duration.base, ease: easeReveal } },
  };

  return (
    // NOT: `overflow-hidden` YOK → sticky çubuk viewport'a göre yapışabilsin.
    // (BeanField kendi içinde overflow-hidden ile çekirdekleri zaten kırpıyor.)
    <section className="relative bg-cream px-6 pb-24 pt-28 md:pb-32 md:pt-36">
      {/* Arka planda yuvarlanan çekirdekler (dekor) — menüde sakin (soft) */}
      <BeanField soft />

      <div className="relative mx-auto max-w-4xl">
        {/* Geri dön linki */}
        <Link
          to="/"
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-espresso/60 transition-colors hover:text-burgundy"
        >
          <ArrowLeft
            size={16}
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:-translate-x-1"
          />
          {t.menuPage.back}
        </Link>

        {/* Başlık bloğu */}
        <div className="mt-6">
          <SectionHeading
            eyebrow={t.menuPage.eyebrow}
            title={t.menuPage.title}
            subtitle={t.menuPage.subtitle}
          />
        </div>

        {/* ── Yapışkan kategori çubuğu (scroll-spy) ───────────────────────
            Navbar'ın hemen altına yapışır. Aktif kategorinin arkasındaki
            burgundy pill layoutId ile yumuşakça kayar (ana sayfa filtresiyle
            AYNI dil → tutarlılık). reduced-motion'da düz zemin. */}
        <div className="sticky top-[4.5rem] z-30 mt-10 flex justify-center">
          <nav
            aria-label={t.menuPage.eyebrow}
            className="flex max-w-full flex-wrap justify-center gap-1 rounded-full border border-sand/60 bg-surface/85 p-1.5 shadow-sm shadow-espresso/5 backdrop-blur-md"
          >
            {fullMenu.map((cat) => {
              const selected = activeCat === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => goToCat(cat.id)}
                  aria-current={selected ? "true" : undefined}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                    selected ? "text-cream" : "text-espresso/70 hover:text-burgundy",
                  )}
                >
                  {selected &&
                    (reduced ? (
                      <span className="absolute inset-0 rounded-full bg-burgundy" />
                    ) : (
                      <motion.span
                        layoutId="menuCatPill"
                        className="absolute inset-0 rounded-full bg-burgundy"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    ))}
                  <span className="relative z-10">{cat.title[lang]}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Kategoriler */}
        <div className="mt-14 space-y-20">
          {fullMenu.map((cat, i) => (
            <section
              key={cat.id}
              ref={(el) => {
                sectionRefs.current[cat.id] = el;
              }}
              data-cat={cat.id}
              aria-labelledby={`cat-${cat.id}`}
              className="scroll-mt-36"
            >
              {/* Editoryal kategori başlığı: numara chip'i + başlık + adet */}
              <div className="flex items-end justify-between gap-4 border-b border-sand/60 pb-4">
                <div className="flex items-center gap-4">
                  <span
                    aria-hidden="true"
                    className="font-heading text-2xl tabular-nums text-caramel/70 md:text-3xl"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h2
                      id={`cat-${cat.id}`}
                      className="font-heading text-3xl text-espresso md:text-4xl"
                    >
                      {cat.title[lang]}
                    </h2>
                    <p className="mt-1 text-sm text-espresso/60">{cat.blurb[lang]}</p>
                  </div>
                </div>
                <span className="hidden shrink-0 rounded-full border border-sand px-3 py-1 text-xs font-semibold tabular-nums text-espresso/50 sm:inline-block">
                  {cat.items.length}
                </span>
              </div>

              <motion.ul
                className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2"
                variants={reduced ? undefined : container}
                initial={reduced ? false : "hidden"}
                whileInView={reduced ? undefined : "show"}
                viewport={{ once: true, amount: 0.15 }}
              >
                {cat.items.map((item) => (
                  <motion.li key={item.id} variants={reduced ? undefined : cell}>
                    <MenuItem item={item} reduced={reduced} />
                  </motion.li>
                ))}
              </motion.ul>
            </section>
          ))}
        </div>

        {/* Fiyat notu */}
        <p className="mt-16 text-center text-xs text-espresso/45">{t.menuPage.priceNote}</p>
      </div>
    </section>
  );
}
