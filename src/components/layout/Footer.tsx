import { brand } from "@/data/brand";
import { useLanguage } from "@/i18n/LanguageContext";

/* ════════════════════════════════════════════════════════════════════
   FOOTER — sayfa altbilgisi
   · <footer> etiketi → tarayıcı/ekran okuyucu için "contentinfo" landmark'ı
     (otomatik; ayrıca rol yazmaya gerek yok)
   · Sosyal linkler brand.socials dizisinden .map() ile basılır
   · Telif yılı new Date().getFullYear() → her yıl kendiliğinden güncellenir
   ════════════════════════════════════════════════════════════════════ */

// Telif yılı: modül yüklenince BİR KEZ hesaplanır. Render içinde new Date()
// çağırmak "impure" sayılır (her render'da değişebilir) — buraya aldık.
const YEAR = new Date().getFullYear();

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="relative bg-espresso px-6 py-12 text-cream">
      {/* Üstte ince karamel aksan şeridi — sıcak marka vurgusu */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-caramel to-transparent"
      />
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
        {/* Marka adı + slogan */}
        <div className="text-center md:text-left">
          <p className="font-heading text-2xl font-bold">
            {brand.name}
            <span aria-hidden="true" className="ml-0.5 text-caramel">.</span>
          </p>
          <p className="text-sm text-cream/60">{brand.slogan.en}</p>
        </div>

        {/* Sosyal linkler — gerçek projede href'ler güncellenecek (şimdilik #) */}
        <nav aria-label="Social media">
          <ul className="flex gap-6">
            {brand.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  className="text-sm font-medium text-cream/80 transition-colors hover:text-caramel"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Telif satırı */}
      <p className="mt-8 text-center text-xs text-cream/50">
        © {YEAR} {brand.name}. {t.footer.rights}
      </p>
    </footer>
  );
}
