import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { menu, type CoffeeItem } from "@/data/menu";
import { useLanguage } from "@/i18n/LanguageContext";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { duration, easeReveal } from "@/lib/motion";
import { cn } from "@/lib/cn";

/* ════════════════════════════════════════════════════════════════════
   SIGNATURE MENU — kahve kartları + kategori filtresi + detay modalı
   · Filtre: Tümü / Espresso / Sütlü / Soğuk  (üstte düğmeler)
   · Kart: görsel, isim, fiyat, kavurma göstergesi, kısa açıklama, "detay"
   · Modal: karta tıklayınca açılır; Esc ile kapanır, odak yönetimi yapılır
     (Navbar'daki mobil menü a11y kalıbının AYNISI)
   ════════════════════════════════════════════════════════════════════ */

// Filtre anahtarı: ya "all" ya da bir kahve kategorisi (veri tipinden türetildi)
type FilterKey = "all" | CoffeeItem["category"];

export default function Menu() {
  const { t, lang } = useLanguage();
  const reduced = usePrefersReducedMotion();

  // Hangi filtre seçili + hangi kahve detayda açık (null = kapalı)
  const [filter, setFilter] = useState<FilterKey>("all");
  const [active, setActive] = useState<CoffeeItem | null>(null);

  // Detay açan butonu hatırla → modal kapanınca odağı ONA geri vereceğiz
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  // Filtre düğmelerini TEK yerde tut → .map() ile bas (DRY, Navbar'daki links gibi)
  const filters: { key: FilterKey; label: string }[] = [
    { key: "all", label: t.menu.filters.all },
    { key: "espresso", label: t.menu.filters.espresso },
    { key: "milk", label: t.menu.filters.milk },
    { key: "cold", label: t.menu.filters.cold },
  ];

  // Seçili filtreye göre görünecek kahveler ("all" ise hepsi)
  const visible = filter === "all" ? menu : menu.filter((m) => m.category === filter);

  // Modalı aç: tıklanan butonu kaydet, sonra aktif kahveyi set et
  const openDetail = (item: CoffeeItem, e: React.MouseEvent<HTMLButtonElement>) => {
    triggerRef.current = e.currentTarget;
    setActive(item);
  };

  // Modalı kapat: aktifi sıfırla + odağı açan butona geri ver
  const closeDetail = () => {
    setActive(null);
    triggerRef.current?.focus();
  };

  return (
    <section id="menu" className="bg-cream px-6 py-24">
      <div className="mx-auto max-w-6xl">
        {/* Bölüm başlığı (h2 → Hero'nun h1'inin altında doğru hiyerarşi) */}
        <h2 className="font-heading text-center text-4xl text-espresso md:text-5xl">
          {t.menu.title}
        </h2>

        {/* ── Filtre düğmeleri ──────────────────────────────────────────
            aria-pressed: ekran okuyucuya "bu düğme seçili mi" bilgisini verir. */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {filters.map((f) => {
            const selected = filter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                aria-pressed={selected}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm transition-colors",
                  selected
                    ? "border-burgundy bg-burgundy text-white"
                    : "border-sand text-espresso hover:border-burgundy hover:text-burgundy",
                )}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* ── Kart ızgarası ─────────────────────────────────────────────
            motion.ul + layout: filtre değişip kartlar girip çıkarken
            kalanlar yumuşakça yerini alır. AnimatePresence: çıkan kartlar
            DOM'dan silinirken de animasyon yapsın (popLayout = çıkanı
            düzenden hemen al, kalanlar boşluğu yumuşak kapatsın). */}
        <motion.ul
          layout={!reduced}
          className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {visible.map((item) => (
              <motion.li
                key={item.id}
                layout={!reduced}
                initial={reduced ? false : { opacity: 0, y: 16 }}
                animate={reduced ? undefined : { opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: 16 }}
                transition={{ duration: duration.base, ease: easeReveal }}
              >
                {/* Kart: SOL kenar düz + kalın KARAMEL aksan şeridi (sıcak),
                    SAĞ köşeler yuvarlak. Hover'da hafif kalkar + gölge
                    (temas geri bildirimi; reduced-motion'da kalkma kapalı). */}
                <article
                  className={cn(
                    "flex h-full flex-col overflow-hidden rounded-r-2xl border border-sand border-l-4 border-l-caramel bg-cream transition duration-300 hover:shadow-xl hover:shadow-espresso/10",
                    !reduced && "hover:-translate-y-1",
                  )}
                >
                  {/* Görsel kutusu — sabit oran. Gerçek webp'ler sonra eklenecek;
                      şimdilik alt metni anlamlı (kahve adı), zemin sand/30. */}
                  <div className="aspect-[4/3] w-full bg-sand/30">
                    <img
                      src={item.image}
                      alt={item.name[lang]}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-heading text-2xl text-espresso">
                        {item.name[lang]}
                      </h3>
                      <span className="font-body text-burgundy">{item.price}</span>
                    </div>

                    {/* Kavurma göstergesi: 5 nokta, roast kadarı dolu.
                        Noktalar dekoratif → kapsayıcıya okunur bir etiket verdik. */}
                    <div
                      role="img"
                      className="mt-3 flex items-center gap-1.5"
                      aria-label={`${t.menu.roastLabel}: ${item.roast}/5`}
                    >
                      <span aria-hidden="true" className="text-xs text-espresso/60">
                        {t.menu.roastLabel}
                      </span>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <span
                          key={n}
                          aria-hidden="true"
                          className={cn(
                            "h-2 w-2 rounded-full",
                            n <= item.roast ? "bg-caramel" : "bg-sand",
                          )}
                        />
                      ))}
                    </div>

                    <p className="mt-3 flex-1 text-sm text-espresso/70">
                      {item.description[lang]}
                    </p>

                    {/* Detay butonu: modalı açar, tıklanan butonu hatırlar */}
                    <button
                      type="button"
                      onClick={(e) => openDetail(item, e)}
                      className="mt-5 self-start rounded-full border border-burgundy px-4 py-2 text-sm text-burgundy transition-colors hover:bg-burgundy hover:text-white"
                    >
                      {t.menu.viewDetails}
                    </button>
                  </div>
                </article>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>

      {/* ── Detay modalı ──────────────────────────────────────────────── */}
      <DetailModal item={active} onClose={closeDetail} reduced={reduced} />
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   DETAY MODALI — erişilebilir diyalog
   Navbar'daki mobil menüyle AYNI kalıp:
   · AnimatePresence → açılıp kapanırken animasyon
   · Esc ile kapanma + body scroll kilidi (useEffect + cleanup)
   · role="dialog" aria-modal + aria-labelledby → ekran okuyucu "diyalog" der
   · autoFocus kapat butonunda → açılınca odak içeri gelir
   ════════════════════════════════════════════════════════════════════ */
function DetailModal({
  item,
  onClose,
  reduced,
}: {
  item: CoffeeItem | null;
  onClose: () => void;
  reduced: boolean;
}) {
  const { t, lang } = useLanguage();

  // Esc ile kapat + arka plan scroll'unu kilitle (yalnızca modal açıkken)
  useEffect(() => {
    if (!item) return; // kapalıysa hiçbir dinleyici kurma
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [item, onClose]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduced ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: duration.fast }}
        >
          {/* Arka karartma (backdrop): tıklanınca modal kapanır */}
          <button
            type="button"
            aria-label={t.menu.close}
            onClick={onClose}
            className="absolute inset-0 bg-espresso/70"
          />

          {/* Diyalog paneli — backdrop'un ÜSTÜNDE (relative) */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="detail-title"
            className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-auto rounded-2xl bg-cream"
            initial={reduced ? false : { scale: 0.96, y: 8 }}
            animate={reduced ? undefined : { scale: 1, y: 0 }}
            transition={{ duration: duration.base, ease: easeReveal }}
          >
            <div className="aspect-[16/9] w-full bg-sand/30">
              <img
                src={item.image}
                alt={item.name[lang]}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <h3 id="detail-title" className="font-heading text-3xl text-espresso">
                  {item.name[lang]}
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label={t.menu.close}
                  autoFocus // modal açılınca odak buraya gelsin
                  className="text-espresso transition-colors hover:text-burgundy"
                >
                  <X size={24} aria-hidden="true" />
                </button>
              </div>

              <p className="mt-1 text-burgundy">{item.price}</p>

              {/* Kavurma göstergesi (karttakiyle aynı mantık) */}
              <div
                role="img"
                className="mt-4 flex items-center gap-1.5"
                aria-label={`${t.menu.roastLabel}: ${item.roast}/5`}
              >
                <span aria-hidden="true" className="text-sm text-espresso/60">
                  {t.menu.roastLabel}
                </span>
                {[1, 2, 3, 4, 5].map((n) => (
                  <span
                    key={n}
                    aria-hidden="true"
                    className={cn(
                      "h-2.5 w-2.5 rounded-full",
                      n <= item.roast ? "bg-caramel" : "bg-sand",
                    )}
                  />
                ))}
              </div>

              <p className="mt-4 text-espresso/80">{item.description[lang]}</p>

              {/* Tat notları: etiket listesi (chip). Diziyi .map() ile basıyoruz. */}
              <ul className="mt-5 flex flex-wrap gap-2">
                {item.tastingNotes[lang].map((note) => (
                  <li
                    key={note}
                    className="rounded-full border border-sand px-3 py-1 text-sm text-espresso/80"
                  >
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
