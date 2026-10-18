import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { fullMenu, type MenuEntry } from "@/data/fullMenu";
import { brand } from "@/data/brand";
import { useLanguage } from "@/i18n/LanguageContext";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { duration, easeReveal, stagger } from "@/lib/motion";
import { cn } from "@/lib/cn";
import CoffeeBean from "@/components/decor/CoffeeBean";
import BeanField from "@/components/decor/BeanField";
import SectionHeading from "@/components/layout/SectionHeading";

/* ════════════════════════════════════════════════════════════════════
   MENUPAGE — "/menu" tam menü sayfası (restoran/kafe menüsü gibi)
   · Kategoriler: Sıcak Kahveler · Soğuk Kahveler · Tatlılar (data/fullMenu)
   · Her ürün yatay kart: (varsa) foto + isim + fiyat + kısa açıklama + etiket
   · Fotoğrafı olmayan ürün → zarif çekirdek-monogram karo (metin menüsü hissi)
   · "Ürün satışı" değil, basılı menü havası. Backend/admin YOK — veri sabit.
   · Reveal animasyonları reduced-motion'a saygılı; arka planda hafif BeanField
   ════════════════════════════════════════════════════════════════════ */

/** Tek bir menü satırı (kart). Foto varsa gösterir, yoksa çekirdek karosu. */
function MenuItem({ item, reduced }: { item: MenuEntry; reduced: boolean }) {
  const { lang } = useLanguage();
  return (
    <article className="group flex gap-4 rounded-2xl border border-sand/50 bg-surface p-3 shadow-sm shadow-espresso/5 transition duration-300 hover:border-caramel/50 hover:shadow-md hover:shadow-espresso/10">
      {/* Sol: foto karesi ya da çekirdek-monogram karosu */}
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-linen">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name[lang]}
            width={320}
            height={320}
            loading="lazy"
            className={cn(
              "h-full w-full object-cover transition-transform duration-500",
              !reduced && "group-hover:scale-105",
            )}
          />
        ) : (
          // Fotosuz ürün: linen zeminde küçük çekirdek (sade ve bütünlüklü)
          <div aria-hidden="true" className="grid h-full w-full place-items-center opacity-70">
            <CoffeeBean size={22} gid={`menu-bean-${item.id}`} />
          </div>
        )}
      </div>

      {/* Sağ: isim + fiyat satırı, açıklama, opsiyonel etiket */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-heading text-xl text-espresso">{item.name[lang]}</h3>
          {/* Noktalı ayraç (basılı menü hissi) — dekoratif */}
          <span aria-hidden="true" className="mx-2 hidden flex-1 translate-y-[-3px] border-b border-dotted border-sand sm:block" />
          <span className="shrink-0 font-body font-bold text-burgundy">{item.price}</span>
        </div>
        <p className="mt-1 text-sm leading-snug text-espresso/65">{item.desc[lang]}</p>
        {item.tag && (
          <span className="mt-2 inline-flex w-fit items-center rounded-full border border-caramel/40 bg-caramel/10 px-2.5 py-0.5 text-xs font-semibold tracking-wide text-mocha uppercase">
            {item.tag[lang]}
          </span>
        )}
      </div>
    </article>
  );
}

export default function MenuPage() {
  const { t, lang } = useLanguage();
  const reduced = usePrefersReducedMotion();

  // Gerçek bir rota olduğu için sekme başlığını güncelle (çıkınca geri al)
  useEffect(() => {
    const prev = document.title;
    document.title = `${t.menuPage.title} — ${brand.name}`;
    return () => {
      document.title = prev;
    };
  }, [t.menuPage.title]);

  // Kart ızgarası reveal (diğer bölümlerdeki kalıbın aynısı)
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger * 0.5 } },
  };
  const cell: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: duration.base, ease: easeReveal } },
  };

  return (
    <section className="relative overflow-hidden bg-cream px-6 pb-24 pt-28 md:pb-32 md:pt-36">
      {/* Arka planda yuvarlanan çekirdekler (dekor) — menüde sakin (soft) */}
      <BeanField soft />

      <div className="relative mx-auto max-w-4xl">
        {/* Geri dön linki */}
        <Link
          to="/"
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-espresso/60 transition-colors hover:text-burgundy"
        >
          <ArrowLeft
            size={16}
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:-translate-x-1"
          />
          {t.menuPage.back}
        </Link>

        {/* Başlık bloğu */}
        <div className="mt-6">
          <SectionHeading
            eyebrow={t.menuPage.eyebrow}
            title={t.menuPage.title}
            subtitle={t.menuPage.subtitle}
          />
        </div>

        {/* Kategoriler */}
        <div className="mt-16 space-y-16">
          {fullMenu.map((cat) => (
            <section key={cat.id} aria-labelledby={`cat-${cat.id}`}>
              {/* Kategori başlığı + kısa tanıtım */}
              <div className="border-b border-sand/60 pb-3">
                <h2 id={`cat-${cat.id}`} className="font-heading text-3xl text-espresso md:text-4xl">
                  {cat.title[lang]}
                </h2>
                <p className="mt-1 text-sm text-espresso/60">{cat.blurb[lang]}</p>
              </div>

              <motion.ul
                className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2"
                variants={reduced ? undefined : container}
                initial={reduced ? false : "hidden"}
                whileInView={reduced ? undefined : "show"}
                viewport={{ once: true, amount: 0.15 }}
              >
                {cat.items.map((item) => (
                  <motion.li key={item.id} variants={reduced ? undefined : cell}>
                    <MenuItem item={item} reduced={reduced} />
                  </motion.li>
                ))}
              </motion.ul>
            </section>
          ))}
        </div>

        {/* Fiyat notu */}
        <p className="mt-16 text-center text-xs text-espresso/45">{t.menuPage.priceNote}</p>
      </div>
    </section>
  );
}
