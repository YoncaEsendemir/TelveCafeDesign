import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/* ════════════════════════════════════════════════════════════════════
   COFFEEPOUR — aşağı akan kahve DAMLALARI + yükselen buhar (dekor)
   · "Hikâyemiz" (OurStory) koyu bölümünün arkasında
   · 5 noktada (yatay) sürekli akan damla sütunu — her sütun arka arkaya
     düşen damlalardan oluşur (gecikmeli) → kesintisiz, bol akış.
   · Hareket CSS keyframes (`telve-drip`, `telve-steam`, index.css) ile.
   · pointer-events-none + aria-hidden. reduced-motion'da hiç render edilmez.
   ════════════════════════════════════════════════════════════════════ */

const STREAMS = ["10%", "30%", "50%", "72%", "90%"] as const; // 5 akış noktası
const DRIPS_PER_STREAM = 6; // her sütunda eşzamanlı akan damla sayısı
const DRIP_DUR = 2.2; // bir damlanın düşme süresi (sn)

const STEAM = [
  { left: "40%", delay: 0, dur: 6 },
  { left: "50%", delay: 1.3, dur: 7 },
  { left: "60%", delay: 0.7, dur: 6.5 },
] as const;

export default function CoffeePour() {
  const reduced = usePrefersReducedMotion();
  if (reduced) return null; // hareket kapalıysa dekoru hiç kurma

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* 5 noktada akan karamel damla sütunları */}
      {STREAMS.map((left, si) =>
        Array.from({ length: DRIPS_PER_STREAM }).map((_, di) => (
          <span
            key={`drip-${si}-${di}`}
            className="telve-drip"
            style={
              {
                "--left": left,
                "--dur": `${DRIP_DUR}s`,
                // Damlaları sütun içinde eşit aralıklı başlat → kesintisiz akış
                "--delay": `${(di * DRIP_DUR) / DRIPS_PER_STREAM + si * 0.12}s`,
              } as React.CSSProperties
            }
          />
        )),
      )}

      {/* Ortada yükselen buhar tutamları */}
      {STEAM.map((s, i) => (
        <span
          key={`steam-${i}`}
          className="telve-steam"
          style={
            {
              "--left": s.left,
              "--dur": `${s.dur}s`,
              "--delay": `${s.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
