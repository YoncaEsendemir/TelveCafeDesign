/** Galeri görselleri. width/height ZORUNLU: tarayıcı yeri önceden ayırır,
 *  böylece görsel yüklenince sayfa zıplamaz (CLS = 0). */
export interface GalleryImage {
  id: string;
  src: string; // optimize webp
  alt: { en: string; tr: string };
  width: number;
  height: number;
}

export const gallery: GalleryImage[] = [
  {
    id: "bar",
    src: "/assets/images/gallery-bar.webp",
    alt: { en: "Barista pulling a shot at the bar", tr: "Barda shot çeken barista" },
    width: 1200,
    height: 900,
  },
  {
    id: "pour",
    src: "/assets/images/gallery-pour.webp",
    alt: { en: "Slow pour-over brewing", tr: "Yavaş pour-over demleme" },
    width: 900,
    height: 1200,
  },
  {
    id: "seats",
    src: "/assets/images/gallery-seats.webp",
    alt: { en: "Warm corner seating", tr: "Sıcak köşe oturma alanı" },
    width: 1200,
    height: 900,
  },
  {
    id: "beans",
    src: "/assets/images/gallery-beans.webp",
    alt: { en: "Freshly roasted beans", tr: "Taze kavrulmuş çekirdekler" },
    width: 1200,
    height: 800,
  },
];
