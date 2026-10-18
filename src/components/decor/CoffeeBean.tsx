/* ════════════════════════════════════════════════════════════════════
   COFFEEBEAN — tek bir kahve çekirdeği (SVG), dekoratif
   · Kavrulmuş görünüm: karamel → mocha gradyan + ortada koyu oluk
   · Her çekirdeğin gradyanı benzersiz bir id ister → `gid` ile veririz
     (aynı id birden çok svg'de olursa tarayıcı gradyanı karıştırır)
   · Hero ve BeanField (arka plan çekirdek alanı) ortak kullanır → DRY
   ════════════════════════════════════════════════════════════════════ */

export default function CoffeeBean({ size, gid }: { size: number; gid: string }) {
  return (
    <svg width={size} height={size * 1.28} viewBox="0 0 28 36" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-caramel-bright)" />
          <stop offset="100%" stopColor="var(--color-mocha)" />
        </linearGradient>
      </defs>
      {/* Çekirdek gövdesi (oval) */}
      <path
        d="M14 1 C 23 1 27 9 27 18 C 27 28 21 35 14 35 C 7 35 1 28 1 18 C 1 9 5 1 14 1 Z"
        fill={`url(#${gid})`}
      />
      {/* Ortadaki kıvrımlı oluk (çekirdeğin çizgisi) */}
      <path
        d="M14 3 C 10 11 18 20 14 33"
        stroke="var(--color-espresso)"
        strokeOpacity="0.55"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
