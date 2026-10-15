# LEARN.md — TELVE Coffee Öğrenme Günlüğü

> Bu dosya projenin **öğrenme günlüğü**. Her geliştirme adımında ne yaptığımızı,
> neden öyle yaptığımızı ve hangi kavramı kullandığımızı kısa tutarak kaydediyoruz.
> Kural: kodun kendisini tekrar yazmıyoruz — **kavramı ve mantığı** saklıyoruz.
> (Çalışma biçimi: `ClaudeLearnCO.md`.)

**Girdi formatı**
- **Ne yaptık** · **Neden** · **Önemli kavramlar** · **Mantık** · **Özellikle öğren**

---

## Gün 0 — 2026-10-15 · Planlama & Karar Fazı

**Ne yaptık**
Brief'i (`telve-coffee-brief.md`) senior frontend gözüyle inceledik, eksikleri
çıkardık ve koda başlamadan kritik kararları netleştirdik. Henüz uygulama kodu yok.

**Neden**
Yanlış renk/kontrast veya yanlış deploy varsayımıyla kod yazmak, sonradan baştan
düzeltme demektir. Kararları önce vermek = daha az tekrar iş.

**Önemli kavramlar**
- **WCAG kontrast oranı:** İki renk arasındaki okunabilirlik ölçüsü. Normal metin
  için AA ≥ 4.5:1 gerekir. Renk "güzel" olması yetmez, **ölçülebilir** olmalı.
- **CSP (Content-Security-Policy):** Tarayıcıya "sadece şu kaynaklardan kod/stil
  yükle" diyen güvenlik başlığı. XSS'i zorlaştırır.
- **`.htaccess`:** Apache (cPanel) sunucusunda, o klasör için kural tanımlayan
  dosya. Güvenlik başlıkları burada verilir (Netlify/Vercel değil, çünkü cPanel).
- **CLS (Cumulative Layout Shift):** Sayfa yüklenirken içeriğin zıplaması.
  Görsele önceden boyut vermezsen olur; Lighthouse puanını düşürür.
- **i18n tip eşlemesi:** `type Dict = typeof en` → TR sözlüğü EN ile birebir aynı
  anahtarlara sahip olmazsa TypeScript hata verir. Eksik çeviriyi derlemede yakalar.

**Mantık (aldığımız kararlar)**
1. `sand` rengi açık zeminde (cream) metin olarak **kullanılmaz** (1.7:1 — okunmaz);
   sadece kenarlık/ayraç. Koyu bölümde (espresso) ise aksan olarak **mükemmel** (7.8:1).
2. Koyu "Our Story" bölümünde aksan `sand`, `burgundy` değil (burgundy espresso
   üstünde 1.65:1 → görünmez).
3. Deploy = **cPanel** → güvenlik başlıkları `public_html/.htaccess` ile verilecek.
4. **DOMPurify eklenmeyecek** — ham HTML basmıyoruz, React zaten kaçışlıyor.
5. Menü 4 üründe kalıyor; Tailwind kullanılacak.

**Özellikle öğren**
- "Güzel renk" ≠ "erişilebilir renk" — her metin/zemin çiftinin kontrastını say.
- Araç (cPanel/Netlify/Vercel) **mimari kararı değiştirir** (başlıklar nereye yazılır).
- Gereksiz bağımlılık = gereksiz risk; ihtiyaç yoksa ekleme (DOMPurify örneği).

---
## Gün 1 — 2026-10-15 · Proje İskeleti (Foundation)

**Ne yaptık**
Vite + React + TS şablonunu kurduk; Tailwind v4, Framer Motion, Lucide ve test
araçlarını ekledik. Tasarım token'ları, veri (brand/menu/gallery), i18n altyapısı
ve yardımcılar (cn, motion, reduced-motion hook) hazır. Build + testler geçiyor.

**Neden**
Bölümleri (Navbar, Hero...) yazmadan önce ortak zemin olmalı: renkler tek yerden,
metinler tek yerden, animasyon değerleri tek yerden gelsin. Böylece component'ler
sade kalır ve tutarlılık bozulmaz.

**Önemli kavramlar**
- **Tailwind v4 "CSS-first" token:** `src/index.css` içindeki `@theme { --color-* }`
  bloğu otomatik olarak `bg-cream`, `text-espresso`, `font-heading` gibi sınıflar
  üretir. (Eski v3'teki `tailwind.config.js` yerine geçti.)
- **Path alias `@/`:** `vite.config.ts` + `tsconfig`'te tanımlı → `../../data` yerine
  `@/data/menu` yazarız. Taşımada import kırılmaz.
- **i18n tip eşlemesi:** `tr.ts`'te `export const tr: typeof en` → TR, EN ile aynı
  anahtarlara sahip olmazsa **derleme hata verir**. (`en.ts`'ten `as const`
  kaldırdık; yoksa TR'nin de İngilizce metnin aynısını yazmasını isterdi.)
- **React Context:** `LanguageProvider` dili tutar, `useLanguage()` her component'e
  `t` sözlüğünü verir. Böylece "prop drilling" (propu elden ele taşıma) olmaz.
- **`usePrefersReducedMotion`:** `matchMedia` ile OS'un "hareketi azalt" ayarını
  dinler; animasyonlu tüm component'ler buradan karar verecek.

**Mantık**
`main.tsx` → `App` → `LanguageProvider` → (bölümler). Veri ve metin akışı:
`data/*.ts` (sabit veri) + `i18n/*` (dile göre metin) → component props.

**Özellikle öğren**
- Token'ı değeri değil, **ismi** kullan: `bg-burgundy` yaz, `#7a3028` yazma. Renk
  değişince tek yerden değişir.
- Çeviri eksikse testi beklemeden **TypeScript** yakalar (tip güvenliği = erken hata).
- `try/catch`'siz `localStorage` gizli sekmede siteyi çökertebilir — her erişimi sardık.

**Brief'ten sapmalar (not)**
- Linter: ESLint+jsx-a11y yerine şablonun getirdiği **oxlint** (Rust, hızlı; a11y
  kuralları var). İleride gerekirse ESLint'e geçeriz.
- `framer-motion` paketi **v14** olarak kuruldu (import adı yine `framer-motion`).
- Tailwind **config dosyası yok** — token'lar CSS içinde (`@theme`).
- `DOMPurify` / `sanitize.ts` **yok** (karar gereği).

**Durum:** `npm run dev` çalışır; `npm run build` ✓; `npm test` ✓ (2/2, axe dahil).

---
## Gün 2 — 2026-10-15 · Navbar (Aşama 1) + Dosyadan Veri Alma

**Ne yaptık**
İlk bölüm Navbar'ın statik halini yazdık (marka + 4 anchor link + dil butonu + CTA),
`App`'e bağladık. Tek sayfa olduğu için yönlendirme **anchor link** ile (router yok).

**Önemli kavramlar**
- **named import:** `import { brand } from "@/data/brand"` → `{ brand }`, dosyadaki
  `export const brand` ile aynı isim olmalı. `@/` = `src/` kısayolu.
- **Sabit veri vs dile bağlı metin:** sabit (brand, menu) → doğrudan import;
  dile göre değişen → `useLanguage()`'tan `t` (dil değişince canlı güncellenir).
- **JSX `return`:** `function C(){ <div/> }` hiçbir şey döndürmez. `return (...)`
  şart. Ok fonksiyonunda `=> (...)` otomatik return, `=> {...}` değil.
- **Anchor navigasyon:** `<a href="#menu">` aynı sayfadaki `id="menu"` bölümüne gider.
  Tek-sayfa siteler için modern/standart yol; react-router-dom gereksiz.
- **Semantik link:** nav öğeleri `<a>`, asla `<h2>/<h3>` — başlık sayfa planını bozar.

**Özellikle öğren**
- "Daha modern" her zaman "daha fazla kütüphane" değildir; tek sayfada anchor > router.
- Component bir **fonksiyon**, JSX'i mutlaka `return` et.

**Ek — logo animasyonu & test mock'u**
- Marka `motion.a` yapıldı (Framer Motion): giriş fade+iniş, hover scale 1.05;
  `prefers-reduced-motion` açıksa `initial={false}` ile animasyon kapanır.
- jsdom'da `window.matchMedia` YOK → hook test ortamında patladı. `tests/setup.ts`'te
  mock'ladık. **Ders:** tarayıcı API'si kullanan hook'lar testte mock ister.

**Durum:** typecheck ✓ · test 2/2 ✓. Sırada Navbar Aşama 2 (scroll'da sticky+blur).

---
## Gün 3 — 2026-10-15 · Navbar Tamamlandı (sticky + mobil menü)

**Ne yaptık**
Navbar'ın tamamı bitti: scroll'da sticky + blur, masaüstü linkleri, mobil tam-ekran
hamburger menü (Esc ile kapanır, scroll kilidi, odak yönetimi), dil + CTA.

**Önemli kavramlar**
- **`useState`:** component'in hatırladığı değer (scrolled, mobileOpen). Değişince
  React yeniden render eder.
- **`useEffect` + temizlik:** yan etki (scroll/keydown dinleyici) kurar; `return`
  ile **temizler**. Temizlemezsen dinleyici birikir (bellek sızıntısı).
- **Event listener:** `window.addEventListener("scroll", ...)` → kaydırmayı dinle,
  state'i güncelle. `{ passive: true }` = performans (tarayıcıyı bekletme).
- **DRY + `.map()`:** linkleri bir dizi yapıp hem masaüstü hem mobilde `.map()` ile
  bastık; aynı `<a>`'yı elle 8 kez yazmadık.
- **`AnimatePresence`:** bir öğe DOM'dan çıkarken de (kapanırken) animasyon yapar.
  Normalde React öğeyi anında siler; bu onu "çıkış animasyonu" bitene dek tutar.
- **`useRef`:** bir DOM öğesine (hamburger butonu) referans; menü kapanınca
  `ref.current?.focus()` ile odağı geri verdik.
- **Mobil menü a11y:** `aria-expanded` (açık/kapalı bilgisi), `Esc` ile kapanma,
  açılınca odak içeri (`autoFocus`), kapanınca tetikleyene dönüş, `body overflow
  hidden` (arka plan kaymasın).

**Mantık**
scroll olayı → `scrolled` state → `cn()` ile class değişir (şeffaf ↔ cream/blur).
hamburger → `mobileOpen=true` → AnimatePresence menüyü gösterir → link/Esc → kapanır.

**Özellikle öğren**
- Her `addEventListener`'ın bir `removeEventListener`'ı olmalı (useEffect cleanup).
- Modal/menü açılınca odağı içeri al, kapanınca geri ver — klavye kullanıcısı kaybolmasın.
- Aynı şeyi tekrar yazıyorsan (link listesi) → diziye al, `.map()` ile bas.

**Durum:** typecheck ✓ · test 2/2 ✓ · lint temiz · build ✓. Sırada **Hero**.

---
<!-- Yeni günler buraya eklenecek. Mevcut kavramları tekrar etme; sadece yeni bilgi. -->
