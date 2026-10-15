import { motion, type Variants } from "framer-motion";
import { gallery } from "@/data/gallery";
import { useLanguage } from "@/i18n/LanguageContext";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { duration, easeReveal, stagger } from "@/lib/motion";
import { cn } from "@/lib/cn";
import SectionHeading from "@/components/layout/SectionHeading";

/* ════════════════════════════════════════════════════════════════════
   GALLERY — mekânın atmosferini gösteren görsel ızgara
   · Değişken ızgara: dikey (portrait) görsel 2 satır kaplar → kolaj hissi
   · CLS = 0: her img'de width/height → tarayıcı yeri ÖNCEDEN ayırır
   · Hover'da yumuşak zoom + alttan beliren başlık (caption) overlay
   · whileInView ile ekrana girince sırayla belirir (reduced-motion'a saygılı)
   ════════════════════════════════════════════════════════════════════ */

export default function Gallery() {
  const { t, lang } = useLanguage();
  const reduced = usePrefersReducedMotion();

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger } },
  };
  const cell: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: duration.base, ease: easeReveal } },
  };

  return (
    <section id="gallery" className="bg-linen/40 px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow={t.gallery.eyebrow}
          title={t.gallery.title}
          subtitle={t.gallery.subtitle}
        />

        {/* auto-rows: her satırın sabit yüksekliği → row-span hesaplanabilsin.
            Dikey görsel 2 satır kaplayınca kolaj düzeni oluşur. */}
        <motion.ul
          className="mt-14 grid auto-rows-[180px] grid-cols-2 gap-4 md:auto-rows-[220px] lg:grid-cols-3"
          variants={reduced ? undefined : container}
          initial={reduced ? false : "hidden"}
          whileInView={reduced ? undefined : "show"}
          viewport={{ once: true, amount: 0.2 }}
        >
          {gallery.map((img) => {
            // Dikey (portrait) görsel mi? Öyleyse 2 satır kaplasın.
            const isPortrait = img.height > img.width;
            return (
              <motion.li
                key={img.id}
                variants={reduced ? undefined : cell}
                className={cn(
                  "group relative overflow-hidden rounded-2xl shadow-sm shadow-espresso/10",
                  isPortrait && "row-span-2",
                )}
              >
                <img
                  src={img.src}
                  alt={img.alt[lang]} // içerik görseli → ANLAMLI alt (dekoratif değil)
                  width={img.width} // width+height → en-boy oranı → CLS = 0
                  height={img.height}
                  loading="lazy" // ekrana gelene kadar yüklemeyi ertele
                  className={cn(
                    "h-full w-full object-cover transition-transform duration-500",
                    // Hover'da hafif zoom; reduced-motion açıksa zoom YOK
                    !reduced && "group-hover:scale-105",
                  )}
                />
                {/* Hover overlay: alttan koyu gradyan + beliren başlık (caption).
                    Dekoratif → aria-hidden; anlam zaten img alt'ında taşınıyor. */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 flex items-end bg-gradient-to-t from-espresso/80 via-espresso/10 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                >
                  <span className="translate-y-2 text-sm font-semibold text-cream transition-transform duration-300 group-hover:translate-y-0">
                    {img.alt[lang]}
                  </span>
                </div>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
