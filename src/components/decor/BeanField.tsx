import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import CoffeeBean from "@/components/decor/CoffeeBean";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/* ════════════════════════════════════════════════════════════════════
   BEANFIELD — ekranı boydan boya YUVARLANARAK geçen kahve çekirdekleri
   · Hareket CSS keyframes (`telve-bean-roll`, index.css) ile → GPU'da
     pürüzsüz. Çekirdek `translateX(-14vw → 114vw)` ile ekranı GERÇEKTEN
     geçer (eski sürüm `%` kullanıyordu → kendi boyutunca, neredeyse yerinde).
   · Üst, orta ve ALT bantlarda çekirdek var (kullanıcı: "altta da olsun").
   · Scroll parallax (Framer `useScroll`): bölüm kayarken dikey süzülür.
   · pointer-events-none + aria-hidden. reduced-motion'da statik/soluk durur.
   · `soft`: /menu gibi metinli yerde opaklığı düşürür.
   ════════════════════════════════════════════════════════════════════ */

type Dir = "normal" | "reverse";
interface Bean {
  top: string;
  size: number;
  dur: number;
  delay: number;
  dir: Dir;
  op: number;
}

// Alt banda (%70–96) bilerek çok çekirdek koyduk → altta belirgin hareket.
const BEANS: Bean[] = [
  { top: "8%", size: 42, dur: 12, delay: 0, dir: "normal", op: 0.5 },
  { top: "16%", size: 26, dur: 15, delay: 2, dir: "reverse", op: 0.38 },
  { top: "26%", size: 34, dur: 11, delay: 4, dir: "normal", op: 0.46 },
  { top: "40%", size: 20, dur: 16, delay: 1, dir: "reverse", op: 0.3 },
  { top: "52%", size: 30, dur: 13, delay: 3, dir: "normal", op: 0.42 },
  { top: "70%", size: 18, dur: 17, delay: 0, dir: "normal", op: 0.32 },
  { top: "74%", size: 48, dur: 10, delay: 0.5, dir: "reverse", op: 0.55 },
  { top: "80%", size: 28, dur: 12.5, delay: 2.5, dir: "normal", op: 0.46 },
  { top: "86%", size: 38, dur: 11, delay: 4.5, dir: "reverse", op: 0.52 },
  { top: "91%", size: 22, dur: 15.5, delay: 1.5, dir: "normal", op: 0.4 },
  { top: "96%", size: 34, dur: 13.5, delay: 3.5, dir: "reverse", op: 0.5 },
];

export default function BeanField({ soft = false }: { soft?: boolean }) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // Bölüm ekrandan geçerken 0→1 → çekirdekleri dikeyde kaydır (parallax derinlik)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [60, -60]);

  const factor = soft ? 0.55 : 1; // /menu'de daha sakin

  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      style={{ y }}
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {BEANS.map((b, i) => {
        const op = b.op * factor;
        // reduced-motion: ortada sabit, soluk dur (CSS animasyonu da media ile kapalı)
        const style = reduced
          ? { top: b.top, left: "48vw", opacity: op, position: "absolute" as const }
          : ({
              "--top": b.top,
              "--dur": `${b.dur}s`,
              "--delay": `${b.delay}s`,
              "--op": op,
              "--dir": b.dir,
            } as React.CSSProperties);
        return (
          <span key={i} className={reduced ? "block" : "telve-bean"} style={style}>
            <CoffeeBean size={b.size} gid={`field-bean-${i}`} />
          </span>
        );
      })}
    </motion.div>
  );
}
