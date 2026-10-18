import { motion, type Variants } from "framer-motion";
import { Droplets, Flame, Sprout } from "lucide-react";
import { brand } from "@/data/brand";
import { useLanguage } from "@/i18n/LanguageContext";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { duration, easeReveal, stagger } from "@/lib/motion";
import SectionHeading from "@/components/layout/SectionHeading";
import CoffeePour from "@/components/decor/CoffeePour";

/* ════════════════════════════════════════════════════════════════════
   OUR STORY — koyu temalı anlatı bölümü ("nefes alma" molası)
   · Zemin espresso (koyu) + soluk çekirdek dokusu + karamel parıltı
   · whileInView → öğe EKRANA GİRİNCE animasyon tetiklenir
   · Öne çıkanlar (highlights): ikonlu 3 chip → zanaatı özetler (modern)
   · reduced-motion açıksa: hareket yok, içerik olduğu gibi görünür
   ════════════════════════════════════════════════════════════════════ */

// Öne çıkanların ikonları (metin i18n'den gelir, ikon sırayla eşlenir)
const HIGHLIGHT_ICONS = [Flame, Sprout, Droplets] as const;

export default function OurStory() {
  const { t, lang } = useLanguage();
  const reduced = usePrefersReducedMotion();

  // Hero'daki kalıbın aynısı: ebeveyn "show" olunca çocuklar sırayla girer
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: 0.1 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: duration.slow, ease: easeReveal } },
  };

  return (
    <section id="story" className="relative overflow-hidden bg-espresso px-6 py-28 text-cream md:py-36">
      {/* Soluk çekirdek dokusu (dekoratif) — koyu zemine derinlik verir */}
      <img
        src="/assets/images/gallery-beans.jpg"
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-[0.10]"
      />
      {/* Karamel parıltı: ortada sıcak ışık havuzu */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(201,138,60,0.18),transparent_62%)]"
      />
      {/* Dökülen kahve + buhar (dekor) — reduced-motion'da kendini kapatır */}
      <CoffeePour />

      <div className="relative mx-auto max-w-3xl text-center">
        {/* Ortak başlık bloğu (koyu varyant: eyebrow caramel) */}
        <SectionHeading eyebrow={t.story.eyebrow} title={t.story.title} dark />

        {/* İnce ayraç + anlatı + öne çıkanlar + imza — ikinci reveal grubu */}
        <motion.div
          variants={reduced ? undefined : container}
          initial={reduced ? false : "hidden"}
          whileInView={reduced ? undefined : "show"}
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* İnce ayraç — karamel çizgi (sıcak vurgu) */}
          <motion.div
            variants={reduced ? undefined : item}
            className="mx-auto mt-8 h-0.5 w-16 rounded-full bg-caramel"
          />

          {/* Anlatı metni — koyu zeminde cream/80 (kontrast rahat) */}
          <motion.p
            variants={reduced ? undefined : item}
            className="mt-8 text-lg leading-relaxed text-cream/80"
          >
            {t.story.body}
          </motion.p>

          {/* Öne çıkanlar: ikonlu 3 chip (zanaatın özeti). Diziyi .map()'liyoruz. */}
          <motion.ul
            variants={reduced ? undefined : item}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            {t.story.highlights.map((h, i) => {
              const Icon = HIGHLIGHT_ICONS[i] ?? Flame;
              return (
                <li
                  key={h}
                  className="inline-flex items-center gap-2 rounded-full border border-caramel/30 bg-cream/5 px-4 py-2 text-sm font-semibold text-cream/90 backdrop-blur-sm"
                >
                  <Icon size={16} aria-hidden="true" className="text-caramel" />
                  {h}
                </li>
              );
            })}
          </motion.ul>

          {/* Kapanış imzası — başlık fontuyla, markayı sloganıyla mühürler */}
          <motion.p
            variants={reduced ? undefined : item}
            className="font-heading mt-12 text-2xl text-caramel italic"
          >
            — {brand.slogan[lang]}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
