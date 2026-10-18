# TELVE ☕

Specialty coffee kafesi için tek sayfa (+ /menu rotası) tanıtım web sitesi. Türkçe/İngilizce dilli, duyarlı (responsive) ve animasyonlu.

## Teknolojiler

- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS v4** — stil
- **React Router v7** — `/` (ana sayfa) ve `/menu` rotaları
- **Framer Motion** — animasyonlar
- **Lucide React** — ikonlar
- **Vitest** + Testing Library — testler

## İçerik

- **Bölümler:** Hero, Deneyim, Hikâye (OurStory), Galeri, Menü (`src/components/sections/`)
- **Sayfalar:** `Home` ve `MenuPage` (`src/pages/`)
- **Menü verisi:** kahve + tatlı çeşitleri (`src/data/fullMenu.ts`)
- **Animasyon/dekor:** kahve çekirdeği & demleme animasyonları (`src/components/decor/`)
- **Dil dosyaları:** `src/i18n/tr.ts`, `src/i18n/en.ts`
- **Görseller:** `public/assets/images/`

## Komutlar

```bash
npm run dev        # geliştirme sunucusu
npm run build      # prod derleme (tsc + vite)
npm run preview    # derlemeyi önizle
npm run test       # testleri çalıştır
npm run lint       # oxlint
npm run typecheck  # tip kontrolü
```
