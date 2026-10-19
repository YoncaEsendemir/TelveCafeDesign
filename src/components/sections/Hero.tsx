import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import heroImg from "@/assets/hero.webp";
import { brand } from "@/data/brand";
import { useLanguage } from "@/i18n/LanguageContext";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { duration, stagger } from "@/lib/motion";
import { cn } from "@/lib/cn";
import CoffeeBean from "@/components/decor/CoffeeBean";

/* ════════════════════════════════════════════════════════════════════
   HERO — sitenin ilk ekranı (tam yükseklik karşılama bölümü)
   İçerik:   marka adı (eyebrow) + büyük başlık (kelime kelime reveal)
             + alt metin + 2 buton (CTA) + "aşağı kaydır" işareti
   Dekor:    gerçek kafe fotoğrafı (yavaş ken-burns zoom) + sıcak kahve
             gradyanı + karamel parıltı + düşen çekirdekler + buhar
   Kural:    tüm animasyonlar "hareketi azalt" (reduced-motion) açıksa durur
   ════════════════════════════════════════════════════════════════════ */

/* ── Düşen çekirdeklerin ayarları ───────────────────────────────────
   left: yatay konum · size: boyut · delay/dur: zamanlama · drift: salınım
   opacity + blur: DERİNLİK hissi (uzaktakiler soluk ve bulanık). */
const BEANS = [
  { left: "8%", size: 26, delay: 0, dur: 11, drift: 14, opacity: 0.9, blur: 0 },
  { left: "18%", size: 15, delay: 2.5, dur: 14, drift: -10, opacity: 0.5, blur: 1.5 },
  { left: "32%", size: 30, delay: 1.2, dur: 10, drift: 10, opacity: 0.95, blur: 0 },
  { left: "46%", size: 18, delay: 3.5, dur: 15, drift: -16, opacity: 0.55, blur: 1.5 },
  { left: "61%", size: 22, delay: 0.5, dur: 12.5, drift: 13, opacity: 0.8, blur: 0.5 },
  { left: "73%", size: 28, delay: 2.2, dur: 11.5, drift: -12, opacity: 0.9, blur: 0 },
  { left: "86%", size: 16, delay: 1.6, dur: 13.5, drift: 9, opacity: 0.55, blur: 1.5 },
  { left: "94%", size: 13, delay: 3, dur: 16, drift: -8, opacity: 0.4, blur: 2 },
] as const;

/* ── Buhar tutamlarının ayarları (başlığın altında yükselir) ──────── */
const STEAM = [
  { left: "42%", delay: 0, dur: 6 },
  { left: "50%", delay: 1.5, dur: 7 },
  { left: "58%", delay: 0.8, dur: 6.5 },
] as const;

export default function Hero() {
  const { t } = useLanguage(); // seçili dilin metin sözlüğü
  const reduced = usePrefersReducedMotion(); // "hareketi azalt" açık mı?

  // Başlığı kelimelere böl → her kelimeyi ayrı ayrı animasyonla göstereceğiz
  const words = t.hero.title.split(" ");

  /* ── Variants: isimli animasyon durumları ───────────────────────────
     Ebeveyn "show" olunca çocuklara yayılır → kelime kelime reveal. */
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger * 0.7, delayChildren: 0.15 } },
  };
  const word: Variants = {
    hidden: { opacity: 0, y: "0.5em" },
    show: {
      opacity: 1,
      y: 0,
      // Yay (spring) fiziği → metnin yerine oturuşu daha canlı/doğal (QR §7)
      transition: { type: "spring", stiffness: 120, damping: 16 },
    },
  };

  return (
    <section
      id="top"
      className="relative flex min-h-dvh items-center justify-center overflow-hidden"
    >
      {/* ── Arka plan görseli (dekoratif) — yavaş ken-burns zoom ───────── */}
      <motion.img
        src={heroImg}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
        initial={reduced ? false : { scale: 1.02 }}
        animate={reduced ? undefined : { scale: 1.12 }}
        transition={
          reduced
            ? undefined
            : { duration: 22, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }
        }
      />
      {/* Sıcak scrim: espresso → mocha → espresso (kahve gradyanı, okunurluk için) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-br from-espresso/92 via-mocha/60 to-espresso/95"
      />
      {/* Alt karartma: metin + scroll okunun oturduğu zemini güçlendirir */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-espresso to-transparent"
      />
      {/* Karamel parıltı: başlığın arkasında sıcak bir ışık havuzu (göz alıcılık) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(224,168,88,0.30),transparent_60%)]"
      />

      {/* ── Buhar efekti (dekoratif) ─────────────────────────────────── */}
      {!reduced && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-28 z-0 flex justify-center"
        >
          {STEAM.map((s, i) => (
            <motion.span
              key={i}
              className="absolute block h-24 w-2 rounded-full bg-cream/25 blur-md"
              style={{ left: s.left }}
              animate={{ y: [0, -70], opacity: [0, 0.5, 0], scaleX: [1, 1.7] }}
              transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: "easeOut" }}
            />
          ))}
        </div>
      )}

      {/* ── Düşen kahve çekirdekleri (dekoratif, derinlikli) ──────────── */}
      {!reduced && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
          {BEANS.map((b, i) => (
            <motion.span
              key={i}
              className="absolute top-0 block"
              style={{ left: b.left, opacity: b.opacity, filter: `blur(${b.blur}px)` }}
              animate={{ y: ["-14vh", "114vh"], x: [0, b.drift, 0], rotate: [0, 360] }}
              transition={{ duration: b.dur, delay: b.delay, repeat: Infinity, ease: "linear" }}
            >
              <CoffeeBean size={b.size} gid={`bean-grad-${i}`} />
            </motion.span>
          ))}
        </div>
      )}

      {/* ── İçerik — z-10 ile dekorun üstünde ─────────────────────────── */}
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        {/* Eyebrow: iki yanında ince karamel çizgi olan marka adı */}
        <motion.p
          className="flex items-center justify-center gap-4 font-body text-sm font-semibold tracking-[0.4em] text-caramel uppercase"
          initial={reduced ? false : { opacity: 0 }}
          animate={reduced ? undefined : { opacity: 1 }}
          transition={{ duration: duration.base }}
        >
          <span aria-hidden="true" className="h-px w-10 bg-caramel/50" />
          {brand.name}
          <span aria-hidden="true" className="h-px w-10 bg-caramel/50" />
        </motion.p>

        {/* Başlık: büyük + kalın (700) + kelime kelime yay reveal.
            Son kelime karamel → göze tek bir sıcak vurgu (odak). */}
        <motion.h1
          className="mt-6 text-5xl font-bold text-balance text-cream sm:text-6xl md:text-8xl"
          variants={reduced ? undefined : container}
          initial={reduced ? false : "hidden"}
          animate={reduced ? undefined : "show"}
        >
          {words.map((w, i) => {
            const isLast = i === words.length - 1;
            return (
              <motion.span
                key={i}
                variants={reduced ? undefined : word}
                className={cn("inline-block", isLast && "text-caramel")}
              >
                {w}
                {i < words.length - 1 ? " " : ""}
              </motion.span>
            );
          })}
        </motion.h1>

        {/* Alt metin */}
        <motion.p
          className="mx-auto mt-6 max-w-xl text-lg text-cream/85"
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: duration.base, delay: reduced ? 0 : 0.5 }}
        >
          {t.hero.subtitle}
        </motion.p>

        {/* İki CTA — birincil (dolu, oklu, kayan) + ikincil (cam çerçeve) */}
        <motion.div
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: duration.base, delay: reduced ? 0 : 0.7 }}
        >
          <Link
            to="/menu"
            className={cn(
              "group inline-flex items-center gap-2 rounded-full bg-burgundy px-7 py-3.5 font-semibold text-white shadow-xl shadow-burgundy/30 transition",
              "hover:bg-burgundy-dark",
              !reduced && "hover:scale-[1.03]", // basış/temas ölçek geri bildirimi (QR §7)
            )}
          >
            {t.hero.ctaMenu}
            {/* Ok hover'da sağa kayar — "ilerle" hissi (mikro-etkileşim) */}
            <ArrowRight
              size={18}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
          <a
            href="#story"
            className={cn(
              "rounded-full border border-cream/30 bg-cream/5 px-7 py-3.5 font-semibold text-cream backdrop-blur-sm transition hover:border-caramel hover:bg-caramel/10",
              !reduced && "hover:scale-[1.03]",
            )}
          >
            {t.hero.ctaDiscover}
          </a>
        </motion.div>
      </div>

      {/* ── "Aşağı kaydır" işareti (alt ortada) ───────────────────────── */}
      <a
        href="#menu"
        aria-label={t.hero.scroll}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-caramel/80 transition-colors hover:text-caramel"
      >
        <motion.span
          className="block"
          animate={reduced ? undefined : { y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={24} aria-hidden="true" />
        </motion.span>
      </a>
    </section>
  );
}
