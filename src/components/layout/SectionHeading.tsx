import { motion, type Variants } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { duration, easeReveal, stagger } from "@/lib/motion";
import { cn } from "@/lib/cn";

/* ════════════════════════════════════════════════════════════════════
   SECTIONHEADING — tüm bölümlerin ortak başlık bloğu (DRY)
   Yapı:  küçük "eyebrow" (yan çizgilerle) → büyük başlık (h2) → alt metin
   Neden: Menu / Gallery / Visit başlıkları aynı ritmi paylaşsın; tek yerden
          stil + animasyon → tutarlılık (QR §4 consistency, §6 hierarchy).
   Animasyon: ekrana girince stagger ile belirir; reduced-motion'da anında.
   dark:  koyu zeminde (Our Story) kullanılırsa renkleri çevirir.
   ════════════════════════════════════════════════════════════════════ */

interface Props {
  eyebrow: string;
  title: string;
  subtitle?: string;
  /** Koyu (espresso) zemin mi? Eyebrow/alt metin rengini ona göre seçer. */
  dark?: boolean;
  className?: string;
}

export default function SectionHeading({ eyebrow, title, subtitle, dark, className }: Props) {
  const reduced = usePrefersReducedMotion();

  // Ebeveyn "show" olunca çocuklar sırayla girer (Hero'daki kalıbın aynısı)
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: 0.05 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: duration.base, ease: easeReveal } },
  };

  return (
    <motion.div
      className={cn("mx-auto max-w-2xl text-center", className)}
      variants={reduced ? undefined : container}
      initial={reduced ? false : "hidden"}
      whileInView={reduced ? undefined : "show"}
      viewport={{ once: true, amount: 0.5 }}
    >
      {/* Eyebrow: iki yanında ince çizgi olan küçük, aralıklı etiket.
          Açık zeminde burgundy (kontrast AA), koyu zeminde caramel (sıcak). */}
      <motion.p
        variants={reduced ? undefined : item}
        className={cn(
          "flex items-center justify-center gap-3 text-xs font-semibold tracking-[0.3em] uppercase",
          dark ? "text-caramel" : "text-burgundy",
        )}
      >
        <span aria-hidden="true" className={cn("h-px w-8", dark ? "bg-caramel/50" : "bg-burgundy/40")} />
        {eyebrow}
        <span aria-hidden="true" className={cn("h-px w-8", dark ? "bg-caramel/50" : "bg-burgundy/40")} />
      </motion.p>

      {/* Başlık (h2) — kalın (700, index.css'ten) + dengeli satır kırma */}
      <motion.h2
        variants={reduced ? undefined : item}
        className={cn(
          "mt-5 text-4xl text-balance md:text-5xl",
          dark ? "text-cream" : "text-espresso",
        )}
      >
        {title}
      </motion.h2>

      {/* İsteğe bağlı alt metin — okunur kontrastta, ölçülü genişlik */}
      {subtitle && (
        <motion.p
          variants={reduced ? undefined : item}
          className={cn(
            "mx-auto mt-4 max-w-xl text-base leading-relaxed md:text-lg",
            dark ? "text-cream/75" : "text-espresso/70",
          )}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
