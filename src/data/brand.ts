/** Tüm marka bilgisi tek noktada. İsmi değiştirmek için `name`'i değiştir
 *  (çalışma adı TELVE; alternatif MIRRA). */
export interface Social {
  label: string; // ör. "Instagram"
  href: string; // demo: gerçek olmayan bağlantı
}

export interface Brand {
  name: string;
  slogan: { en: string; tr: string };
  address: { en: string; tr: string };
  hours: { en: string; tr: string };
  phone: string;
  email: string;
  socials: Social[];
}

export const brand: Brand = {
  name: "TELVE",
  slogan: {
    en: "Every Cup Has a Story",
    tr: "Her Fincanın Bir Hikâyesi Var",
  },
  address: {
    en: "Kordon Boyu No. 12, Alsancak, İzmir",
    tr: "Kordon Boyu No. 12, Alsancak, İzmir",
  },
  hours: {
    en: "Every day · 08:00 – 23:00",
    tr: "Her gün · 08:00 – 23:00",
  },
  phone: "+90 232 000 00 00",
  email: "hello@telve.coffee",
  socials: [
    { label: "Instagram", href: "#" },
    { label: "X", href: "#" },
    { label: "YouTube", href: "#" },
  ],
};
