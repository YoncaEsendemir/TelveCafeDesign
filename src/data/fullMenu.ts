/** TAM MENÜ verisi — "/menu" sayfası bunu okur (restoran/kafe menüsü gibi).
 *  Kategorilere ayrılmış; her ürün: isim + kısa açıklama + fiyat (+ opsiyonel
 *  foto ve küçük etiket). Fotoğrafı olan ürünler "öne çıkan örnek"tir; diğerleri
 *  zarif metin satırı olarak görünür. Backend/admin YOK — menü burada sabit
 *  tutulur (proje kararı: yalnızca frontend). İsmi/fiyatı buradan değiştir. */
export interface MenuEntry {
  id: string;
  name: { en: string; tr: string };
  desc: { en: string; tr: string };
  price: string; // demo fiyat, ör. "₺120"
  image?: string; // opsiyonel foto yolu (öne çıkan örnek ürünlerde)
  tag?: { en: string; tr: string }; // opsiyonel küçük etiket (ör. "Signature")
}

export interface MenuSection {
  id: string;
  title: { en: string; tr: string };
  blurb: { en: string; tr: string }; // kategori altı kısa tanıtım cümlesi
  items: MenuEntry[];
}

const SIGNATURE = { en: "Signature", tr: "İmza" };

export const fullMenu: MenuSection[] = [
  {
    id: "hot",
    title: { en: "Hot Coffee", tr: "Sıcak Kahveler" },
    blurb: {
      en: "Pulled fresh, served warm — the heart of the ritual.",
      tr: "Taze çekilir, sıcak sunulur — ritüelin kalbi.",
    },
    items: [
      {
        id: "espresso",
        name: { en: "Espresso", tr: "Espresso" },
        desc: {
          en: "A dense, honest shot — the ritual in its purest form.",
          tr: "Yoğun ve dürüst bir shot — ritüelin en saf hali.",
        },
        price: "₺70",
        image: "/assets/images/espresso.webp",
      },
      {
        id: "turkish",
        name: { en: "Turkish Coffee", tr: "Türk Kahvesi" },
        desc: {
          en: "Slow-cooked in copper, read from the grounds — our namesake.",
          tr: "Bakırda yavaş pişer, telvesinden okunur — adımızın kaynağı.",
        },
        price: "₺65",
        tag: SIGNATURE,
      },
      {
        id: "americano",
        name: { en: "Americano", tr: "Americano" },
        desc: {
          en: "Espresso lengthened with hot water — clean and clear.",
          tr: "Sıcak suyla uzatılmış espresso — berrak ve temiz.",
        },
        price: "₺80",
      },
      {
        id: "flat-white",
        name: { en: "Flat White", tr: "Flat White" },
        desc: {
          en: "Double ristretto under velvety, thin microfoam.",
          tr: "İnce kadife köpük altında çift ristretto.",
        },
        price: "₺95",
      },
      {
        id: "latte",
        name: { en: "Latte", tr: "Latte" },
        desc: {
          en: "Silky microfoam over a mellow base.",
          tr: "Yumuşak bir tabanın üzerinde ipeksi süt köpüğü.",
        },
        price: "₺95",
        image: "/assets/images/latte.webp",
      },
      {
        id: "cappuccino",
        name: { en: "Cappuccino", tr: "Cappuccino" },
        desc: {
          en: "Foam, espresso and warmth in equal measure.",
          tr: "Köpük, espresso ve sıcaklığın dengeli buluşması.",
        },
        price: "₺90",
        image: "/assets/images/cappuccino.webp",
      },
      {
        id: "mocha",
        name: { en: "Mocha", tr: "Mocha" },
        desc: {
          en: "Espresso and dark chocolate, softened with steamed milk.",
          tr: "Espresso ve bitter çikolata, buharlı sütle yumuşatılmış.",
        },
        price: "₺105",
      },
      {
        id: "filter",
        name: { en: "Filter Coffee", tr: "Filtre Kahve" },
        desc: {
          en: "Single-origin, hand poured — bright and aromatic.",
          tr: "Tek kaynak, elde dökülmüş — canlı ve aromatik.",
        },
        price: "₺85",
      },
    ],
  },
  {
    id: "cold",
    title: { en: "Cold Coffee", tr: "Soğuk Kahveler" },
    blurb: {
      en: "Low and slow, poured over ice — patient and smooth.",
      tr: "Sabırla demlenir, buz üstüne dökülür — yumuşak ve ferah.",
    },
    items: [
      {
        id: "cold-brew",
        name: { en: "Cold Brew", tr: "Cold Brew" },
        desc: {
          en: "Slow-steeped for 18 hours. Smooth, low-acid, patient.",
          tr: "18 saat soğuk demleme. Yumuşak, düşük asit, sabırlı.",
        },
        price: "₺100",
        image: "/assets/images/cold-brew.webp",
        tag: SIGNATURE,
      },
      {
        id: "iced-latte",
        name: { en: "Iced Latte", tr: "Buzlu Latte" },
        desc: {
          en: "Chilled milk, a double shot, and plenty of ice.",
          tr: "Soğuk süt, çift shot ve bolca buz.",
        },
        price: "₺100",
      },
      {
        id: "iced-americano",
        name: { en: "Iced Americano", tr: "Buzlu Americano" },
        desc: {
          en: "Espresso over ice and cold water — crisp and clean.",
          tr: "Buz ve soğuk su üstüne espresso — berrak ve ferah.",
        },
        price: "₺90",
      },
      {
        id: "affogato",
        name: { en: "Affogato", tr: "Affogato" },
        desc: {
          en: "A hot shot poured over cold vanilla ice cream.",
          tr: "Soğuk vanilyalı dondurmanın üstüne sıcak shot.",
        },
        price: "₺110",
      },
    ],
  },
  {
    id: "dessert",
    title: { en: "Desserts", tr: "Tatlılar" },
    blurb: {
      en: "Made in-house to meet the cup — sweet, not heavy.",
      tr: "Fincana eşlik etsin diye evde yapılır — tatlı ama ağır değil.",
    },
    items: [
      {
        id: "cheesecake",
        name: { en: "Classic Cheesecake", tr: "Klasik Cheesecake" },
        desc: {
          en: "Creamy baked cheesecake on a buttery biscuit base.",
          tr: "Tereyağlı bisküvi tabanında kremsi fırın cheesecake.",
        },
        price: "₺120",
        image: "/assets/images/dessert-cheesecake.webp",
        tag: SIGNATURE,
      },
      {
        id: "brownie",
        name: { en: "Walnut Brownie", tr: "Cevizli Brownie" },
        desc: {
          en: "Dense dark-chocolate brownie, warm with toasted walnuts.",
          tr: "Yoğun bitter çikolatalı brownie, kavrulmuş cevizle sıcak.",
        },
        price: "₺110",
        image: "/assets/images/dessert-brownie.webp",
      },
      {
        id: "san-sebastian",
        name: { en: "San Sebastián Cheesecake", tr: "San Sebastián Cheesecake" },
        desc: {
          en: "Burnt-top Basque cheesecake — caramelised and soft.",
          tr: "Üstü yanık Bask usulü cheesecake — karamelize ve yumuşak.",
        },
        price: "₺130",
        image: "/assets/images/dessert-sansebastian.webp",
      },
      {
        id: "carrot-cake",
        name: { en: "Carrot Cake", tr: "Havuçlu Kek" },
        desc: {
          en: "Spiced carrot layers with cream-cheese frosting.",
          tr: "Baharatlı havuçlu katlar, labneli krema ile.",
        },
        price: "₺115",
      },
      {
        id: "pistachio-cookie",
        name: { en: "Pistachio Cookie", tr: "Antep Fıstıklı Kurabiye" },
        desc: {
          en: "Buttery shortbread crowned with Antep pistachio.",
          tr: "Tereyağlı kurabiye, Antep fıstığıyla taçlanmış.",
        },
        price: "₺70",
      },
    ],
  },
];
