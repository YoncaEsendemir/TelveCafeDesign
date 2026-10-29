import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import { menu, type CoffeeItem } from "@/data/menu";
import { useLanguage } from "@/i18n/LanguageContext";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { duration, easeReveal } from "@/lib/motion";
import { cn } from "@/lib/cn";
import SectionHeading from "@/components/layout/SectionHeading";

/* ════════════════════════════════════════════════════════════════════
   SIGNATURE MENU — kahve kartları + kategori filtresi + detay modalı
   · Filtre: Tümü / Espresso / Sütlü / Soğuk (üstte, KAYAN aktif pill)
   · Kart (modern): görsel üstünde kategori + fiyat chip'i, hover'da görsel
     zoom + kart kalkışı; isim, kavurma göstergesi, açıklama, "detay" oku
   · Modal: karta tıklayınca açılır; Esc ile kapanır, odak yönetimi yapılır
     (Navbar'daki mobil menü a11y kalıbının AYNISI)
   ════════════════════════════════════════════════════════════════════ */

// Filtre anahtarı: ya "all" ya da bir kahve kategorisi (veri tipinden türetildi)
type FilterKey = "all" | CoffeeItem["category"];

/** Kavurma göstergesi (5 nokta, roast kadarı dolu). Kart ve modalda ortak
 *  kullanıldığı için küçük bir bileşene aldık (DRY). Noktalar dekoratif →
 *  kapsayıcıya okunur bir etiket verilir (role="img" + aria-label). */
function RoastMeter({ roast, label }: { roast: number; label: string }) {
  return (
    <div role="img" aria-label={`${label}: ${roast}/5`} className="flex items-center gap-2">
      <span aria-hidden="true" className="text-xs font-medium tracking-wide text-espresso/70 uppercase">
        {label}
      </span>
      <span aria-hidden="true" className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            className={cn(
              "h-1.5 w-4 rounded-full transition-colors",
              n <= roast ? "bg-caramel" : "bg-sand/60",
            )}
          />
        ))}
      </span>
    </div>
  );
}

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
    <section id="menu" className="bg-cream px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        {/* Ortak başlık bloğu: eyebrow + başlık + alt metin (reveal animasyonlu) */}
        <SectionHeading eyebrow={t.menu.eyebrow} title={t.menu.title} subtitle={t.menu.subtitle} />

        {/* ── Filtre düğmeleri ──────────────────────────────────────────
            Aktif olanın arkasında KAYAN bir pill (layoutId) → filtre
            değişince burgundy zemin yumuşakça yeni düğmeye kayar.
            aria-pressed: ekran okuyucuya "bu düğme seçili mi" bilgisini verir. */}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {filters.map((f) => {
            const selected = filter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                aria-pressed={selected}
                className={cn(
                  "relative rounded-full border px-5 py-2 text-sm font-semibold transition-colors",
                  selected
                    ? "border-burgundy text-white"
                    : "border-sand text-espresso/70 hover:border-burgundy hover:text-burgundy",
                )}
              >
                {/* Kayan aktif zemin — reduced-motion'da animasyonsuz düz zemin */}
                {selected &&
                  (reduced ? (
                    <span className="absolute inset-0 rounded-full bg-burgundy" />
                  ) : (
                    <motion.span
                      layoutId="menuFilterPill"
                      className="absolute inset-0 rounded-full bg-burgundy"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  ))}
                {/* Etiket zeminin ÜSTÜNDE kalsın */}
                <span className="relative z-10">{f.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── Kart ızgarası ─────────────────────────────────────────────
            motion.ul + layout: filtre değişip kartlar girip çıkarken
            kalanlar yumuşakça yerini alır. AnimatePresence: çıkan kartlar
            DOM'dan silinirken de animasyon yapsın (popLayout). */}
        <motion.ul
          layout={!reduced}
          className="mt-14 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {visible.map((item) => (
              <motion.li
                key={item.id}
                layout={!reduced}
                initial={reduced ? false : { opacity: 0, y: 20 }}
                animate={reduced ? undefined : { opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: 20, scale: 0.97 }}
                transition={{ duration: duration.base, ease: easeReveal }}
              >
                {/* MODERN KART: yumuşak yüzey + ince kenarlık + yükselen gölge.
                    Hover'da kart hafif kalkar + gölge büyür + görsel yakınlaşır
                    (temas geri bildirimi; reduced-motion'da hareket kapalı). */}
                <article
                  className={cn(
                    "group flex h-full flex-col overflow-hidden rounded-3xl border border-espresso/5 bg-surface shadow-sm shadow-espresso/5 transition duration-300",
                    !reduced && "hover:-translate-y-2 hover:shadow-2xl hover:shadow-espresso/15",
                  )}
                >
                  {/* ── Görsel + üstteki chip'ler ── */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name[lang]}
                      loading="lazy"
                      className={cn(
                        "h-full w-full object-cover transition-transform duration-700",
                        !reduced && "group-hover:scale-110",
                      )}
                    />
                    {/* Alttan koyu gradyan → chip'ler okunur + derinlik */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-espresso/55 via-transparent to-transparent"
                    />
                    {/* Kategori chip'i (sol üst) — cam efektli küçük pill */}
                    <span className="absolute left-3 top-3 rounded-full bg-espresso/55 px-3 py-1 text-xs font-semibold tracking-wide text-cream backdrop-blur-sm">
                      {t.menu.filters[item.category]}
                    </span>
                    {/* Fiyat chip'i (sağ alt) — kalın, dikkat çeken */}
                    <span className="absolute bottom-3 right-3 rounded-full bg-surface px-3 py-1 text-sm font-bold text-burgundy shadow-md shadow-espresso/20">
                      {item.price}
                    </span>
                  </div>

                  {/* ── Metin gövdesi ── */}
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-heading text-2xl text-espresso">{item.name[lang]}</h3>

                    <div className="mt-3">
                      <RoastMeter roast={item.roast} label={t.menu.roastLabel} />
                    </div>

                    <p className="mt-3 flex-1 text-sm leading-relaxed text-espresso/70">
                      {item.description[lang]}
                    </p>

                    {/* Detay butonu: oklu metin; hover'da ok sağa kayar.
                        Modalı açar, tıklanan butonu hatırlar (odak için). */}
                    <button
                      type="button"
                      onClick={(e) => openDetail(item, e)}
                      className="group/btn mt-5 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-burgundy transition-colors hover:text-burgundy-dark"
                    >
                      {t.menu.viewDetails}
                      <ArrowRight
                        size={16}
                        aria-hidden="true"
                        className="transition-transform duration-300 group-hover/btn:translate-x-1"
                      />
                    </button>
                  </div>
                </article>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        {/* Bu bölüm sadece bir ÖNİZLEME → tam menü ayrı sayfada (/menu) */}
        <div className="mt-12 text-center">
          <Link
            to="/menu"
            className="group inline-flex items-center gap-2 rounded-full border border-burgundy px-7 py-3 font-semibold text-burgundy transition hover:bg-burgundy hover:text-white"
          >
            {t.menu.viewFull}
            <ArrowRight
              size={18}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
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
            className="absolute inset-0 bg-espresso/70 backdrop-blur-sm"
          />

          {/* Diyalog paneli — backdrop'un ÜSTÜNDE (relative) */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="detail-title"
            className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-auto rounded-3xl bg-surface shadow-2xl shadow-espresso/40"
            initial={reduced ? false : { scale: 0.95, y: 12 }}
            animate={reduced ? undefined : { scale: 1, y: 0 }}
            exit={reduced ? undefined : { scale: 0.95, y: 12, opacity: 0 }}
            transition={{ duration: duration.base, ease: easeReveal }}
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              <img
                src={item.image}
                alt={item.name[lang]}
                className="h-full w-full object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-espresso/60 to-transparent"
              />
              {/* Fiyat chip'i (sağ alt) — kartla aynı dil */}
              <span className="absolute bottom-3 right-3 rounded-full bg-surface px-3 py-1 text-sm font-bold text-burgundy shadow-md shadow-espresso/20">
                {item.price}
              </span>
              {/* Kapat butonu (sağ üst) — cam efektli daire */}
              <button
                type="button"
                onClick={onClose}
                aria-label={t.menu.close}
                autoFocus // modal açılınca odak buraya gelsin
                className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-espresso/55 text-cream backdrop-blur-sm transition-colors hover:bg-espresso/80"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="p-6">
              <h3 id="detail-title" className="font-heading text-3xl text-espresso">
                {item.name[lang]}
              </h3>

              <div className="mt-4">
                <RoastMeter roast={item.roast} label={t.menu.roastLabel} />
              </div>

              <p className="mt-4 leading-relaxed text-espresso/80">{item.description[lang]}</p>

              {/* Tat notları: etiket listesi (chip). Diziyi .map() ile basıyoruz. */}
              <ul className="mt-5 flex flex-wrap gap-2">
                {item.tastingNotes[lang].map((note) => (
                  <li
                    key={note}
                    className="rounded-full border border-sand bg-linen/50 px-3 py-1 text-sm font-medium text-espresso/80"
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
