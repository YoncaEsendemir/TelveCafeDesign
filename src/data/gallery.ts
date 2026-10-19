/** Galeri görselleri. width/height ZORUNLU: tarayıcı yeri önceden ayırır,
 *  böylece görsel yüklenince sayfa zıplamaz (CLS = 0).
 *  Görseller Pexels'ten (ticari-serbest, atıf gerekmez), KVKK için repoya
 *  indirildi (hotlink yok) ve içlerinde tanınabilir yüz yok. */
export interface GalleryImage {
  id: string;
  src: string; // optimize edilmiş görsel yolu
  alt: { en: string; tr: string };
  width: number;
  height: number;
}

export const gallery: GalleryImage[] = [
  {
    id: "bar",
    src: "/assets/images/gallery-bar.webp",
    alt: { en: "Barista pulling a shot at the espresso machine", tr: "Espresso makinesinde shot çeken barista" },
    width: 1200,
    height: 801,
  },
  {
    id: "pour",
    src: "/assets/images/gallery-pour.webp",
    alt: { en: "Dosing fresh grounds into a pour-over filter", tr: "Pour-over filtreye taze öğütülmüş kahve dökülüyor" },
    width: 1000,
    height: 1500,
  },
  {
    id: "seats",
    src: "/assets/images/gallery-seats.webp",
    alt: { en: "Sunlit wooden corner table by the window", tr: "Pencere kenarında güneş alan ahşap köşe masa" },
    width: 1200,
    height: 1796,
  },
  {
    id: "beans",
    src: "/assets/images/gallery-beans.webp",
    alt: { en: "Close-up of freshly roasted coffee beans", tr: "Taze kavrulmuş kahve çekirdeklerinin yakın çekimi" },
    width: 1200,
    height: 800,
  },
];
