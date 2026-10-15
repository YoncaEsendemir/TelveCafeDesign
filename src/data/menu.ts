export type RoastLevel = 1 | 2 | 3 | 4 | 5;

export interface CoffeeItem {
  id: string;
  category: "espresso" | "milk" | "cold";
  name: { en: string; tr: string };
  description: { en: string; tr: string };
  price: string; // demo fiyat, ör. "₺85"
  roast: RoastLevel; // 1 açık — 5 koyu
  tastingNotes: {
    en: string[];
    tr: string[];
  };
  image: string; // optimize edilmiş webp yolu
}

export const menu: CoffeeItem[] = [
  {
    id: "espresso",
    category: "espresso",
    name: { en: "Espresso", tr: "Espresso" },
    description: {
      en: "A dense, honest shot — the ritual in its purest form.",
      tr: "Yoğun ve dürüst bir shot — ritüelin en saf hali.",
    },
    price: "₺70",
    roast: 5,
    tastingNotes: {
      en: ["Dark Chocolate", "Caramel", "Toasted Nut"],
      tr: ["Bitter Çikolata", "Karamel", "Kavrulmuş Fındık"],
    },
    image: "/assets/images/espresso.svg",
  },
  {
    id: "latte",
    category: "milk",
    name: { en: "Latte", tr: "Latte" },
    description: {
      en: "Silky microfoam over a mellow base.",
      tr: "Yumuşak bir tabanın üzerinde ipeksi süt köpüğü.",
    },
    price: "₺95",
    roast: 3,
    tastingNotes: {
      en: ["Milk Chocolate", "Vanilla", "Brown Sugar"],
      tr: ["Sütlü Çikolata", "Vanilya", "Esmer Şeker"],
    },
    image: "/assets/images/latte.svg",
  },
  {
    id: "cappuccino",
    category: "milk",
    name: { en: "Cappuccino", tr: "Cappuccino" },
    description: {
      en: "Balanced foam, espresso and warmth in equal measure.",
      tr: "Köpük, espresso ve sıcaklığın dengeli buluşması.",
    },
    price: "₺90",
    roast: 4,
    tastingNotes: {
      en: ["Cocoa", "Hazelnut", "Honey"],
      tr: ["Kakao", "Fındık", "Bal"],
    },
    image: "/assets/images/cappuccino.svg",
  },
  {
    id: "cold-brew",
    category: "cold",
    name: { en: "Cold Brew", tr: "Cold Brew" },
    description: {
      en: "Slow-steeped for 18 hours. Smooth, low-acid, patient.",
      tr: "18 saat soğuk demleme. Yumuşak, düşük asit, sabırlı.",
    },
    price: "₺100",
    roast: 2,
    tastingNotes: {
      en: ["Berry", "Cane Sugar", "Citrus"],
      tr: ["Kırmızı Meyve", "Kamış Şekeri", "Narenciye"],
    },
    image: "/assets/images/cold-brew.svg",
  },
];
