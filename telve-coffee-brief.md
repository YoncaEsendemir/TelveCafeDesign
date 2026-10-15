# TELVE COFFEE — Frontend Konsept Site / Proje Brief'i

> Tek sayfa, animasyonlu, iki dilli (EN/TR) specialty coffee konsept sitesi.
> Bu doküman Claude Code (veya herhangi bir geliştirici) için **uygulanabilir bir
> spesifikasyondur**. Sırayla okunup uygulanacak şekilde yazıldı.
>
> **Konsept:** *A Ritual, Not Just Coffee* — "Every Cup Has a Story"

---

## İçindekiler
0. [Marka](#0-marka) · 1. [Hedef & Kapsam](#1-hedef--kapsam) ·
2. [Teknoloji](#2-teknoloji) · 3. [Proje Yapısı](#3-proje-yapısı) ·
4. [Tasarım Sistemi](#4-tasarım-sistemi) · 5. [İçerik & Dil](#5-içerik--dil-i18n) ·
6. [Bölümler](#6-bölümler-uygulama-sırası) · 7. [Animasyon](#7-animasyon-rehberi) ·
8. [Erişilebilirlik](#8-erişilebilirlik-a11y) · 9. [Performans](#9-performans) ·
10. [SEO](#10-seo--meta) · 11. [Güvenlik](#11-frontend-güvenlik--kurallar-araçlar--testler) ·
12. [DoD](#12-definition-of-done-kabul-kriterleri) · 13. [Yol Haritası](#13-uygulama-yol-haritası)

---

## Yapı Haritası (bölüm → dosya → durum)

> Hangi bölümün hangi dosyada olduğu ve ilerleme durumu. Kod yazdıkça güncellenir.
> Durum: ✅ bitti · 🔨 yapılıyor · ⬜ bekliyor

| # | Bölüm | Ana dosya(lar) | Durum |
|---|---|---|---|
| — | Altyapı (Vite/TS/Tailwind/i18n/token) | `src/index.css`, `src/i18n/*`, `src/data/*` | ✅ |
| 01 | Navbar | `components/layout/Navbar.tsx` | ✅ |
| 02 | Hero (çekirdek yağmuru + buhar) | `components/hero/Hero.tsx`, `FallingBeans.tsx`, `Steam.tsx` | ⬜ |
| 03 | Signature Menu (filtre + modal) | `components/menu/*` | ⬜ |
| 04 | Our Story (koyu bölüm) | `components/story/OurStory.tsx` | ⬜ |
| 05 | Gallery | `components/gallery/Gallery.tsx` | ⬜ |
| 06 | Visit Us + Footer | `components/visit/*`, `components/layout/Footer.tsx` | ⬜ |
| — | UI yardımcıları | `components/ui/*` (Reveal, Marquee, Button) | ⬜ |

**Verilen kararlar (plan onayından):** Deploy = **cPanel/.htaccess** · `sand` açık
zeminde metin değil · koyu bölüm aksanı = `sand` · **DOMPurify yok** · menü 4 ürün.
(Ayrıntı: `LEARN.md` Gün 0.)

---

## 0. Marka

| Alan | Değer |
|---|---|
| İsim (çalışma adı) | **TELVE** — fincan dibindeki kahve telvesi; falı ondan okunur → "every cup has a story" nin birebir karşılığı |
| Alternatif | MIRRA (Güneydoğu'nun ritüelle servis edilen kahvesi) |
| Slogan | EN: *Every Cup Has a Story* · TR: *Her Fincanın Bir Hikâyesi Var* |
| Ton | Sıcak, sakin, editoryal, premium ama ferah |

> **İsmi değiştirmek tek satır:** tüm marka metni `src/data/brand.ts` içinde tutulacak.
> İsmi orada değiştirince site genelinde güncellenir.

---

## 1. Hedef & Kapsam

- **Tek sayfa**, scroll ile ilerleyen (one-page, scroll-driven) bir deneyim.
- **Yalnızca frontend.** Backend yok; tüm formlar ve harita demo amaçlı.
- Amaç: component mimarisi, animasyon, responsive ve erişilebilirlik becerisini
  sergileyen bir portfolyo projesi.
- Animasyon seviyesi: **ölçülü/orta** — dikkat dağıtmaz, his verir.
- Genel his: **sıcak + güvenli + ferah.**

---

## 2. Teknoloji

| Teknoloji | Amaç |
|---|---|
| React + TypeScript | Component mimarisi ve tip güvenliği |
| Vite | Derleme ve geliştirme ortamı |
| Tailwind CSS | Responsive tasarım + design token'ları |
| Framer Motion | Tüm animasyonlar (reveal, hover, marquee, hero) |
| Lucide React | İkonlar (menü, konum, sosyal medya) |
| Vitest + React Testing Library | Birim/entegrasyon testleri |
| vitest-axe (veya jest-axe) | Erişilebilirlik testleri |

> **GSAP kullanma.** v1 için Framer Motion yeterli; projeyi gereksiz karmaşıklaştırma.

---

## 3. Proje Yapısı

```
src/
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── hero/
│   │   ├── Hero.tsx
│   │   ├── FallingBeans.tsx      # arka planda düşen kahve çekirdekleri
│   │   └── Steam.tsx             # fincandan yükselen buhar
│   ├── menu/
│   │   ├── CoffeeMenu.tsx
│   │   ├── CoffeeCard.tsx
│   │   ├── CoffeeModal.tsx
│   │   └── FilterBar.tsx
│   ├── story/
│   │   └── OurStory.tsx          # KOYU espresso bölüm
│   ├── gallery/
│   │   └── Gallery.tsx
│   ├── visit/
│   │   ├── VisitUs.tsx
│   │   └── MapEmbed.tsx
│   └── ui/
│       ├── Marquee.tsx           # "Every Cup Has a Story" kayan şerit
│       ├── Reveal.tsx            # scroll ile ortaya çıkma sarmalayıcısı
│       ├── Button.tsx
│       └── LanguageSwitch.tsx
├── data/
│   ├── brand.ts                  # marka adı, slogan, iletişim
│   ├── menu.ts                   # ürünler (tat notu + kavurma seviyesi)
│   └── gallery.ts
├── i18n/
│   ├── en.ts
│   ├── tr.ts
│   ├── index.ts
│   └── LanguageContext.tsx
├── hooks/
│   ├── usePrefersReducedMotion.ts
│   └── useInViewReveal.ts
├── lib/
│   ├── cn.ts                     # className birleştirici
│   └── sanitize.ts               # dinamik metin için (gerekirse)
├── assets/images/
├── tests/
│   └── setup.ts
├── App.tsx
├── main.tsx
└── index.css
```

Testler ilgili component'in yanında (`CoffeeMenu.test.tsx`) tutulur.

---

## 4. Tasarım Sistemi

### 4.1 Renkler (ve rolleri)

| Token | Hex | Rol |
|---|---|---|
| `cream` | `#F6F1E8` | Ana zemin (ferahlık) |
| `white` | `#FFFFFF` | Kartlar, açık yüzeyler |
| `espresso` | `#292521` | Birincil metin **ve koyu bölüm zemini** |
| `burgundy` | `#7A3028` | Aksan: CTA, linkler, hover, vurgular |
| `sand` | `#C8B79F` | İkincil: ayraç, muted metin, kenarlıklar |

> Her renge Tailwind'de bir token olarak ekle. Koyu bölümlerde (Our Story)
> zemin `espresso`, metin `cream`, aksan `sand`/`burgundy` olur.
> Gerekirse her renkten 1–2 ton açık/koyu kademe türet (`cream-50`, `espresso-80`).

### 4.2 Tipografi

- **Başlık:** Cormorant Garamond (editoryal, sıcak) — alternatif: Playfair Display
- **Gövde:** Manrope — alternatif: Inter
- Fontları **self-host** et (CDN yerine) → hem performans hem güvenlik (bkz. §11).
- Büyük başlıklar, geniş satır aralığı, bol boşluk. Kartlarda ölçülü yuvarlatma
  (`rounded-xl`, abartma yok).

### 4.3 Boşluk / Radius / Gölge

- Boşluk ölçeği: 4px tabanlı (Tailwind varsayılanı). Bölümler arası geniş dikey
  boşluk (`py-24 md:py-32`).
- Radius: kartlar `rounded-xl`, butonlar `rounded-full` veya `rounded-lg`.
- Gölge: yumuşak ve düşük (`shadow-sm`/`shadow-md`); sert gölge yok.

### 4.4 Motion Token'ları

| Token | Değer |
|---|---|
| `duration-fast` | 200ms (hover, küçük geçişler) |
| `duration-base` | 400ms (reveal, modal) |
| `duration-slow` | 600ms (hero başlık, büyük geçişler) |
| Easing (reveal) | `cubic-bezier(0.16, 1, 0.3, 1)` (yumuşak out) |
| Easing (döngü) | `ease-in-out` |
| Stagger | 0.08–0.12s (kelime/kart sıralı giriş) |
| Marquee hızı | 20–30s / tam tur |

> **Kural:** tüm hareket `transform` + `opacity` üzerinden (GPU dostu).
> `width/height/top/left` animasyonu yapma.

---

## 5. İçerik & Dil (i18n)

- İki dil: **EN / TR.** Varsayılan dil: EN. Navbar'da dil değiştirici.
- Seçilen dil `localStorage`'da `telve.lang` anahtarıyla saklanır
  (try/catch ile sarılır — bkz. §11).
- Tüm metinler `src/i18n/en.ts` ve `tr.ts` içinde anahtar-değer olarak;
  component içinde metin hard-code edilmez.
- Hafif bir `LanguageContext` yeterli; i18n kütüphanesi şart değil.

### Menü verisi örneği (`src/data/menu.ts`)

```ts
export type RoastLevel = 1 | 2 | 3 | 4 | 5;

export interface CoffeeItem {
  id: string;
  category: "espresso" | "milk" | "cold";
  name: { en: string; tr: string };
  description: { en: string; tr: string };
  price: string;              // demo fiyat, ör. "₺85"
  roast: RoastLevel;          // 1 açık — 5 koyu
  tastingNotes: {
    en: string[];
    tr: string[];
  };
  image: string;              // optimize edilmiş webp yolu
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
    image: "/assets/images/espresso.webp",
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
    image: "/assets/images/latte.webp",
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
    image: "/assets/images/cappuccino.webp",
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
    image: "/assets/images/cold-brew.webp",
  },
];
```

### Görseller

- **Karışık yaklaşım:** Hero'da güçlü, atmosferik bir fotoğraf; kartlarda sade/temiz
  ürün görselleri.
- Kaynak: ücretsiz stok (Unsplash / Pexels) — lisansı uygun, sıcak tonlu kahve/mekân.
- Hepsi **webp**, boyutları ekrana uygun, `loading="lazy"`, mümkünse blur-up
  placeholder. Hero görseli öncelikli yüklenir (`fetchpriority="high"`).

---

## 6. Bölümler (uygulama sırası)

> Sıra: **Navbar → Hero → Menü → Hikâye → Galeri → İletişim.**

### 01 · Navbar
- Sade: marka adı (sol), bölüm linkleri (orta/sağ), dil değiştirici, "Menü" CTA.
- Scroll'da küçülen/arka planı matlaşan sticky bar (saydam → cream blur).
- Mobilde hamburger menü (tam ekran, erişilebilir, `Esc` ile kapanır).

### 02 · Hero
- Büyük başlık + slogan + 2 CTA ("Menüye Git" / "Keşfet").
- **Arka planda kahve çekirdeği animasyonu** (detay §7.1).
- Fincandan yükselen buhar + staggered başlık reveal + aşağı scroll oku.

### 03 · Signature Menu
- Ürün kartları: görsel, isim, kısa açıklama, fiyat, **tat notu çipleri**,
  **kavurma seviyesi göstergesi** (5 nokta/çubuk, dolu/boş).
- **Filtre çubuğu:** Tümü / Espresso bazlı / Sütlü / Soğuk. Filtre tamamen
  client-side; geçişler Framer Motion `layout` ile yumuşak.
- Karta tıklayınca **modal**: büyük görsel, uzun açıklama, tat notları, kavurma
  seviyesi, fiyat. `Esc` + dışına tık ile kapanır, focus trap uygulanır.

### 04 · Our Story  ← **KOYU BÖLÜM**
- Zemin `espresso`, metin `cream`. Scroll ile ortaya çıkan metin + asimetrik
  büyük fotoğraflar.
- Telve/çekirdek hikâyesi; atmosfer anlatımı. Hafif parallax (ölçülü).

### 05 · The Experience (Galeri)
- Mekân içi fotoğraf galerisi: çalışma alanı, hazırlama, atmosfer.
- Mobil uyumlu yatay kaydırıcı (swipe) + desktop'ta grid.
- Hover'da yumuşak zoom/overlay (micro-etkileşim).

### 06 · Visit Us + Footer
- Adres, açılış saatleri, Google Maps gömme (privacy-enhanced, bkz. §11).
- Telefon, e-posta, sosyal medya (Lucide ikonlar).
- Footer: marka, telif, mobil menü.
- (Bülten ve müşteri sözleri **yok** — kapsam dışı.)

---

## 7. Animasyon Rehberi

### 7.1 Hero — Kahve Çekirdeği Yağmuru + Buhar + Başlık Reveal  ⭐

Katmanlar (arkadan öne):

1. **Zemin:** cream degrade + çok hafif grain/doku. Sakin.

2. **Düşen çekirdekler (`FallingBeans.tsx`):** arka planda yavaşça aşağı süzülen
   **14–18 adet** kahve çekirdeği (tek, küçük inline SVG — tekrar kullanılır).
   Her çekirdek rastgele parametrelerle farklı:
   - Başlangıç `x`: 0–100% (rastgele)
   - Boyut: 8–22px
   - Opaklık: **0.08–0.25** (metni asla bastırmaz, sadece his verir)
   - Dönüş: −30°…+30°, düşerken hafif döner
   - Düşme süresi: 10–18s · Gecikme: 0–8s · `repeat: Infinity`
   - Sadece `translateY` (üstten girer, alttan çıkar) + `rotate` + `opacity`

   **Derinlik için 2 katman (parallax):** arkadaki küçük+soluk+yavaş, öndeki
   biraz büyük+belirgin+hızlı. Konteyner `pointer-events:none` ve
   `aria-hidden="true"`.

   > Uygulama: Framer Motion `motion.svg`, bir diziyi `.map()` ile dön.
   > ~16 öğe performans için yeterli. Çok daha fazlası gerekirse `<canvas>`'a geç.

3. **Buhar (`Steam.tsx`):** merkezdeki/yan fincan fotoğrafının üstünden 2–3 adet
   yukarı süzülen, blur'lu beyaz şerit. `translateY: -40px`, `opacity: 0.4 → 0`,
   hafif `scaleX`/yatay salınım, 4–6s döngü, farklı gecikmelerle.

4. **Başlık reveal:** başlık kelime kelime **maskeyle alttan yukarı** gelir
   (`y: 100% → 0` + `opacity 0 → 1`, stagger 0.1s, `duration-slow`, yumuşak out
   easing). Slogan başlıktan biraz sonra, CTA'lar en son (fade + rise).

5. **Scroll ipucu:** altta yumuşak zıplayan aşağı ok (`y` loop, 1.5–2s).

### 7.2 Diğer animasyonlar
- **Marquee (`Marquee.tsx`):** "Every Cup Has a Story · Her Fincanın Bir
  Hikâyesi Var ·" sonsuz yatay akan şerit; hover'da yavaşlar/durur.
- **Scroll reveal (`Reveal.tsx`):** bölümler görünür alana girince fade + rise
  (`useInView`, `once: true`). İçerikte stagger.
- **Hover micro:** kartlar hafif yukarı kalkar + gölge artar; butonlarda renk/ok
  kayması.

### 7.3 Reduced motion (ZORUNLU)
- `prefers-reduced-motion: reduce` ise: çekirdek yağmuru ve buhar **durur/gizlenir**,
  başlık ve reveal'lar **animasyonsuz** görünür, marquee durur, scroll oku sabit.
- `usePrefersReducedMotion` hook'u tek kaynak; animasyon veren tüm component'ler
  bunu kontrol eder. (Boş his olmasın: çekirdekler statik, dağınık ve soluk kalabilir.)

### 7.4 Performans kuralları
- Yalnızca `transform` + `opacity` animasyonu.
- Hero görünür alandan çıkınca animasyonları durdur (`useInView` / IntersectionObserver).
- Dekoratif katmanlar `pointer-events:none` + `aria-hidden`.
- Görseller optimize (§5). Toplam animasyon yükü düşük tutulur.

---

## 8. Erişilebilirlik (a11y)

- Tüm etkileşimler klavyeyle erişilebilir; görünür focus halkası.
- Modal: focus trap, `Esc` ile kapanma, açılınca focus içeri, kapanınca tetikleyene döner.
- Görsellerde anlamlı `alt`; dekoratif olanlar `alt=""` / `aria-hidden`.
- Renk kontrastı WCAG AA (özellikle `sand` üzeri metin ve koyu bölüm).
- Semantik HTML: `header`, `nav`, `main`, `section`, `footer`; başlık hiyerarşisi doğru.
- Dil değiştirince `<html lang>` güncellenir.

---

## 9. Performans

- Lighthouse hedefleri: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.
- Code-splitting / lazy: ağır bölümler (galeri, modal) gerektiğinde yüklenir.
- Fontlar self-host + `font-display: swap`.
- `npm run build` sonrası bundle gözden geçirilir; gereksiz bağımlılık yok.

---

## 10. SEO / Meta

- `<title>`, `meta description`, Open Graph + Twitter kartları (TELVE marka metniyle).
- Favicon + `apple-touch-icon` + `theme-color` (`#292521`).
- `lang` doğru; `robots` ve `canonical` ayarlı.
- Anlamlı başlık yapısı (tek `h1` — Hero başlığı).

---

## 11. Frontend Güvenlik — Kurallar, Araçlar & Testler

> Backend olmasa da bir frontend'in kendi saldırı yüzeyi vardır (XSS, güvensiz
> linkler, güvensiz gömme içerik, bağımlılık açıkları). Aşağıdakiler **zorunlu**.

### 11.1 Kodlama kuralları
- **XSS:** `dangerouslySetInnerHTML` **kullanma.** Zorunluysa önce `sanitize.ts`
  içinde **DOMPurify** ile temizle. React varsayılan olarak kaçışladığı için
  normal metin render'ında ek işlem gerekmez.
- **Dış linkler:** `target="_blank"` olan her link **mutlaka**
  `rel="noopener noreferrer"` taşır.
- **Google Maps:** privacy-enhanced embed kullan; iframe'e `loading="lazy"`,
  `referrerpolicy="no-referrer-when-downgrade"` ekle, mümkünse `sandbox` ile kısıtla.
- **Gizli bilgi yok:** `VITE_*` env değişkenleri **herkese açıktır** — hiçbir
  anahtar/sır frontend'e konmaz. Demo formlar gerçek bir uca veri göndermez.
- **Form girdileri:** demo da olsa client-side doğrulama + temizleme; `mailto`/URL
  üretirken girdiyi encode et (injection önle).
- **localStorage:** sadece dil tercihi; hassas veri yok. Tüm erişim try/catch
  içinde (gizli sekme/engelli depolama çökmesin).
- **Harici kaynak:** fontlar/görseller self-host veya güvenilir kaynak; CDN script
  kullanılırsa **SRI (integrity hash)** + `crossorigin` zorunlu. Tercih: CDN'den kaçın.

### 11.2 HTTP başlıkları (hosting/deploy katmanında)
Dağıtımda şu başlıklar ayarlanır (Netlify `_headers`, Vercel config veya
`index.html` meta CSP):
- **Content-Security-Policy** (örnek başlangıç):
  `default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline';
  font-src 'self'; frame-src https://www.google.com; object-src 'none';
  base-uri 'self'; frame-ancestors 'none'`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Frame-Options: DENY` (clickjacking) / CSP `frame-ancestors 'none'`
- HTTPS + HSTS (hosting tarafında).

### 11.3 Önerilen araçlar
- `npm audit` (CI'da `npm audit --audit-level=high`) + Dependabot/Renovate.
- ESLint: `eslint-plugin-react`, `react-hooks`, **`jsx-a11y`** (erişilebilirlik +
  güvenli JSX). Lockfile commit'li, sürümler sabit.
- Lighthouse "Best Practices" denetimi; konsol hatası/uyarısı sıfır.

### 11.4 Otomatik testler (Vitest + RTL + axe)
En az şu testler yazılır:

1. **Render/smoke:** her bölüm hatasız render oluyor.
2. **Menü filtresi:** bir kategori seçilince yalnızca ilgili kartlar görünüyor.
3. **Modal:** karta tık → açılıyor; `Esc` ve dış tık → kapanıyor; focus yönetimi doğru.
4. **Dil değiştirici:** EN→TR geçişinde metin değişiyor, `html lang` güncelleniyor.
5. **Güvenli link testi:** tüm `target="_blank"` linklerde `rel` içinde
   `noopener` **ve** `noreferrer` var.
6. **a11y testi:** her bölüm **axe** taramasından ihlalsiz geçiyor.
7. **Reduced-motion:** `prefers-reduced-motion` açıkken sonsuz döngü animasyonları
   render edilmiyor/çalışmıyor.

Örnek — güvenli link + a11y testi:

```tsx
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import Footer from "./Footer";

test("dış linkler güvenli (noopener + noreferrer)", () => {
  render(<Footer />);
  screen.getAllByRole("link")
    .filter((a) => a.getAttribute("target") === "_blank")
    .forEach((a) => {
      const rel = a.getAttribute("rel") ?? "";
      expect(rel).toContain("noopener");
      expect(rel).toContain("noreferrer");
    });
});

test("footer erişilebilirlik ihlali içermiyor", async () => {
  const { container } = render(<Footer />);
  expect(await axe(container)).toHaveNoViolations();
});
```

### 11.5 Güvenlik kontrol listesi (teslim öncesi)
- [ ] `dangerouslySetInnerHTML` yok (veya DOMPurify ile temizlenmiş)
- [ ] Tüm `_blank` linklerde `rel="noopener noreferrer"`
- [ ] CSP + güvenlik başlıkları ayarlı
- [ ] Maps iframe kısıtlı (lazy + referrerpolicy + sandbox)
- [ ] Frontend'de sır/anahtar yok
- [ ] localStorage try/catch, sadece dil tercihi
- [ ] CDN script varsa SRI (yoksa self-host)
- [ ] `npm audit` yüksek/kritik açık yok
- [ ] ESLint (jsx-a11y dahil) temiz
- [ ] axe: tüm bölümler ihlalsiz
- [ ] Lighthouse Best Practices ≥ 95, konsol hatası 0

---

## 12. Definition of Done (Kabul Kriterleri)

- [ ] 6 bölüm eksiksiz, tek sayfa akıyor.
- [ ] Hero'da kahve çekirdeği + buhar + başlık reveal animasyonu çalışıyor (§7.1).
- [ ] Menü: filtre + modal + tat notları + kavurma seviyesi çalışıyor.
- [ ] Our Story koyu espresso bölüm olarak uygulanmış.
- [ ] EN/TR dil değiştirici + tercih kalıcı.
- [ ] Mobil/tablet/masaüstü responsive; klavye erişilebilir.
- [ ] `prefers-reduced-motion` tam destekleniyor.
- [ ] §11 güvenlik kontrol listesi ve testleri geçiyor.
- [ ] Lighthouse hedefleri tutuyor.

---

## 13. Uygulama Yol Haritası

1. Vite + React + TS + Tailwind kurulumu; token'lar (renk/font/motion) + fontlar self-host.
2. `brand.ts`, `menu.ts`, `i18n` iskeleti + `LanguageContext`.
3. `ui/` yardımcıları: `Reveal`, `Marquee`, `Button`, `LanguageSwitch`, hook'lar.
4. Navbar → Hero (önce statik, sonra §7.1 animasyonu) .
5. Menü (kart → filtre → modal).
6. Our Story (koyu) → Galeri → Visit Us + Footer.
7. Responsive + a11y + reduced-motion geçişi.
8. §11 güvenlik: başlıklar, lint, testler, audit.
9. SEO/meta + Lighthouse + son cila.

---

*Not: Marka adı TELVE bir çalışma adıdır; `src/data/brand.ts` üzerinden
tek noktadan değiştirilebilir (alternatif: MIRRA).*
