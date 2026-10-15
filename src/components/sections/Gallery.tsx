import { motion, type Variants } from "framer-motion";
import { gallery } from "@/data/gallery";
import { useLanguage } from "@/i18n/LanguageContext";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { duration, easeReveal, stagger } from "@/lib/motion";
import { cn } from "@/lib/cn";

/* ════════════════════════════════════════════════════════════════════
   GALLERY — mekânın atmosferini gösteren görsel ızgara
   · Değişken ızgara: dikey (portrait) görsel 2 satır kaplar → kolaj hissi
   · CLS = 0: her img'de width/height → tarayıcı yeri ÖNCEDEN ayırır,
     görsel yüklenince sayfa ZIPLAMAZ
   · Hover'da yumuşak zoom (overflow-hidden + group-hover:scale)
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
    <section id="gallery" className="bg-cream px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-heading text-center text-4xl text-espresso md:text-5xl">
          {t.gallery.title}
        </h2>

        {/* auto-rows: her satırın sabit yüksekliği → row-span hesaplanabilsin.
            Dikey görsel 2 satır kaplayınca kolaj düzeni oluşur. */}
        <motion.ul
          className="mt-12 grid auto-rows-[180px] grid-cols-2 gap-4 md:auto-rows-[220px] lg:grid-cols-3"
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
                  "group overflow-hidden rounded-2xl",
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
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
