import { motion, type Variants } from "framer-motion";
import { brand } from "@/data/brand";
import { useLanguage } from "@/i18n/LanguageContext";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { duration, easeReveal, stagger } from "@/lib/motion";

/* ════════════════════════════════════════════════════════════════════
   OUR STORY — koyu temalı anlatı bölümü
   · Zemin espresso (koyu), metin cream → sitenin "nefes alma" molası
   · YENİ KAVRAM: whileInView → öğe EKRANA GİRİNCE animasyon tetiklenir
     (Hero'daki gibi sayfa açılır açılmaz değil; kullanıcı buraya kaydırınca)
   · reduced-motion açıksa: hareket yok, içerik olduğu gibi görünür
   ════════════════════════════════════════════════════════════════════ */

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
    <section id="story" className="bg-espresso px-6 py-28 text-cream">
      {/* whileInView: bu blok ekranın %40'ı kadarı görününce "show"a geçer.
          viewport.once → sadece İLK girişte oynat (her kaydırmada tekrar değil). */}
      <motion.div
        className="mx-auto max-w-3xl text-center"
        variants={reduced ? undefined : container}
        initial={reduced ? false : "hidden"}
        whileInView={reduced ? undefined : "show"}
        viewport={{ once: true, amount: 0.4 }}
      >
        {/* Eyebrow: küçük, aralıklı marka adı (karamel — sıcak aksan) */}
        <motion.p
          variants={reduced ? undefined : item}
          className="font-body text-sm font-medium tracking-[0.4em] text-caramel uppercase"
        >
          {brand.name}
        </motion.p>

        {/* Başlık (h2) — Menu başlığıyla aynı seviyede */}
        <motion.h2
          variants={reduced ? undefined : item}
          className="font-heading mt-4 text-4xl md:text-5xl"
        >
          {t.story.title}
        </motion.h2>

        {/* İnce ayraç — karamel çizgi (sıcak vurgu) */}
        <motion.div
          variants={reduced ? undefined : item}
          className="mx-auto mt-6 h-0.5 w-16 rounded-full bg-caramel"
        />

        {/* Anlatı metni — koyu zeminde cream/80 (kontrast rahat) */}
        <motion.p
          variants={reduced ? undefined : item}
          className="mt-8 text-lg leading-relaxed text-cream/80"
        >
          {t.story.body}
        </motion.p>

        {/* Kapanış imzası — başlık fontuyla, markayı sloganıyla mühürler */}
        <motion.p
          variants={reduced ? undefined : item}
          className="font-heading mt-10 text-2xl text-caramel italic"
        >
          — {brand.slogan[lang]}
        </motion.p>
      </motion.div>
    </section>
  );
}
