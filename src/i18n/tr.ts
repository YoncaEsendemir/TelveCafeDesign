import type { en } from "./en";

/** Türkçe sözlük. `: typeof en` → EN ile birebir aynı anahtarlara sahip
 *  olmazsan TypeScript hata verir. Eksik çeviri derlemede yakalanır. */
export const tr: typeof en = {
  nav: {
    menu: "Menü",
    story: "Hikâye",
    gallery: "Galeri",
    visit: "Ziyaret",
    cta: "Menüyü Gör",
    openMenu: "Menüyü aç",
    closeMenu: "Menüyü kapat",
    skip: "İçeriğe geç",
  },
  hero: {
    title: "Her Fincanın Bir Hikâyesi Var",
    subtitle: "Sadece kahve değil, bir ritüel.",
    ctaMenu: "Menüye Git",
    ctaDiscover: "Keşfet",
    scroll: "Aşağı kaydır",
  },
  menu: {
    eyebrow: "Zanaatımız",
    title: "İmza Menü",
    subtitle:
      "Dört fincan, her biri kendi karakterinde — yoğun bir sabah shot'ından 18 saatlik soğuk demlemeye.",
    filters: {
      all: "Tümü",
      espresso: "Espresso",
      milk: "Sütlü",
      cold: "Soğuk",
    },
    roastLabel: "Kavurma",
    viewDetails: "Detayları gör",
    viewFull: "Tüm Menüyü Gör",
    close: "Kapat",
  },
  menuPage: {
    eyebrow: "Menümüz",
    title: "Tüm Menü",
    subtitle: "Sıcak, soğuk ve tatlı — sofranın tamamı, önünüzde.",
    back: "Ana Sayfaya Dön",
    priceNote: "Tüm fiyatlara KDV dahildir.",
  },
  story: {
    eyebrow: "İlk dökümden beri",
    title: "Hikâyemiz",
    body:
      "TELVE, fincanın bittiği yerde başlar — dipteki telvede, her hikâyenin okunduğu yerde. Yavaş kavururuz, sabırla dökeriz; içeceği değil, ritüeli sunarız.",
    highlights: ["Yavaş Kavrulmuş", "Tek Kaynak", "Elde Dökülmüş"],
  },
  gallery: {
    eyebrow: "TELVE'nin İçi",
    title: "Deneyim",
    subtitle: "Sıcak ışık, sakin köşeler ve her fincanın ardındaki yavaş zanaat.",
  },
  visit: {
    eyebrow: "Buyurun",
    title: "Bize Gelin",
    subtitle: "Bizi Kordon'da bulun — kapımız her zaman sıcak.",
    addressLabel: "Adres",
    hoursLabel: "Saatler",
    phoneLabel: "Telefon",
    emailLabel: "E-posta",
    directions: "Yol Tarifi",
  },
  footer: {
    rights: "Tüm hakları saklıdır.",
  },
  lang: {
    en: "EN",
    tr: "TR",
    switch: "Dili değiştir",
  },
};
