/** Hareket (animasyon) token'ları — tüm component'ler buradan okur.
 *  Değerler saniye cinsinden (Framer Motion birimi). */
export const duration = {
  fast: 0.2, // hover, küçük geçişler
  base: 0.4, // reveal, modal
  slow: 0.6, // hero başlık, büyük geçişler
} as const;

/** Yumuşak "out" easing — reveal ve girişlerde kullanılır. */
export const easeReveal = [0.16, 1, 0.3, 1] as const;

/** Sıralı giriş gecikmesi (kelime/kart stagger). */
export const stagger = 0.1;
