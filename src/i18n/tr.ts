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
  },
  hero: {
    title: "Her Fincanın Bir Hikâyesi Var",
    subtitle: "Sadece kahve değil, bir ritüel.",
    ctaMenu: "Menüye Git",
    ctaDiscover: "Keşfet",
    scroll: "Aşağı kaydır",
  },
  menu: {
    title: "İmza Menü",
    filters: {
      all: "Tümü",
      espresso: "Espresso",
      milk: "Sütlü",
      cold: "Soğuk",
    },
    roastLabel: "Kavurma",
    viewDetails: "Detayları gör",
    close: "Kapat",
  },
  story: {
    title: "Hikâyemiz",
    body:
      "TELVE, fincanın bittiği yerde başlar — dipteki telvede, her hikâyenin okunduğu yerde. Yavaş kavururuz, sabırla dökeriz; içeceği değil, ritüeli sunarız.",
  },
  gallery: {
    title: "Deneyim",
  },
  visit: {
    title: "Bize Gelin",
    addressLabel: "Adres",
    hoursLabel: "Saatler",
    phoneLabel: "Telefon",
    emailLabel: "E-posta",
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
