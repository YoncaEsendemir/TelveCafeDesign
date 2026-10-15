import { motion, type Variants } from "framer-motion";
import { ArrowUpRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import { brand } from "@/data/brand";
import { useLanguage } from "@/i18n/LanguageContext";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { duration, easeReveal, stagger } from "@/lib/motion";
import { cn } from "@/lib/cn";
import SectionHeading from "@/components/layout/SectionHeading";

/* ════════════════════════════════════════════════════════════════════
   VISIT — iletişim / "bize gelin" bölümü
   · Sol: adres/saat/telefon/e-posta → ikon-chip'li KARTLAR (hover kalkışı)
     Telefon ve e-posta GERÇEK link: tel: ve mailto:
   · Sağ: fotoğraflı koyu panel + "Yol Tarifi" (Google Maps) CTA
   · Bilgiler tek dizide → .map() ile basılır (DRY)
   ════════════════════════════════════════════════════════════════════ */

export default function Visit() {
  const { t, lang } = useLanguage();
  const reduced = usePrefersReducedMotion();

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger } },
  };
  const row: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: duration.base, ease: easeReveal } },
  };

  // İletişim satırları TEK yerde. href olanlar link, olmayanlar düz metin.
  const rows = [
    { icon: MapPin, label: t.visit.addressLabel, value: brand.address[lang] },
    { icon: Clock, label: t.visit.hoursLabel, value: brand.hours[lang] },
    {
      icon: Phone,
      label: t.visit.phoneLabel,
      value: brand.phone,
      href: `tel:${brand.phone.replace(/\s/g, "")}`, // boşlukları at → geçerli tel:
    },
    { icon: Mail, label: t.visit.emailLabel, value: brand.email, href: `mailto:${brand.email}` },
  ];

  // "Yol Tarifi" → adresi Google Haritalar aramasına gönderir (yeni sekme)
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    brand.address[lang],
  )}`;

  return (
    <section id="visit" className="bg-cream px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow={t.visit.eyebrow}
          title={t.visit.title}
          subtitle={t.visit.subtitle}
        />

        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {/* ── Sol: iletişim KARTLARI ─────────────────────────────────── */}
          <motion.ul
            className="flex flex-col gap-4"
            variants={reduced ? undefined : container}
            initial={reduced ? false : "hidden"}
            whileInView={reduced ? undefined : "show"}
            viewport={{ once: true, amount: 0.3 }}
          >
            {rows.map(({ icon: Icon, label, value, href }) => {
              // Kart içeriği (link olsun olmasın aynı görünür) — DRY için değişken
              const inner = (
                <>
                  {/* İkon dekoratif → aria-hidden; anlamı yandaki etiket+değer taşır.
                      Yuvarlak karamel chip içinde → modern, sıcak vurgu. */}
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-caramel/15 text-burgundy">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-xs font-semibold tracking-wide text-espresso/50 uppercase">
                      {label}
                    </span>
                    <span className="mt-0.5 block text-lg font-medium text-espresso">{value}</span>
                  </span>
                </>
              );
              return (
                <motion.li key={label} variants={reduced ? undefined : row}>
                  {/* Kart: yüzey + ince kenarlık + hover kalkışı.
                      href varsa tüm kart tıklanabilir link, yoksa düz blok. */}
                  {href ? (
                    <a
                      href={href}
                      className={cn(
                        "flex items-center gap-4 rounded-2xl border border-espresso/5 bg-surface p-4 shadow-sm shadow-espresso/5 transition hover:border-burgundy/30",
                        !reduced && "hover:-translate-y-0.5 hover:shadow-lg hover:shadow-espresso/10",
                      )}
                    >
                      {inner}
                    </a>
                  ) : (
                    <div className="flex items-center gap-4 rounded-2xl border border-espresso/5 bg-surface p-4 shadow-sm shadow-espresso/5">
                      {inner}
                    </div>
                  )}
                </motion.li>
              );
            })}
          </motion.ul>

          {/* ── Sağ: fotoğraflı koyu panel + Yol Tarifi CTA ────────────── */}
          <motion.div
            className="relative flex flex-col items-center justify-center overflow-hidden rounded-3xl bg-espresso p-10 text-center text-cream"
            initial={reduced ? false : { opacity: 0, scale: 0.98 }}
            whileInView={reduced ? undefined : { opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: duration.base, ease: easeReveal }}
          >
            {/* Soluk mekan fotoğrafı + scrim + karamel parıltı */}
            <img
              src="/assets/images/gallery-seats.jpg"
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-20"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-br from-espresso/90 to-espresso/80"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(201,138,60,0.22),transparent_60%)]"
            />

            <div className="relative flex flex-col items-center">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-caramel/15 text-caramel">
                <MapPin size={28} aria-hidden="true" />
              </span>
              <p className="font-heading mt-5 text-3xl text-cream">{brand.name}</p>
              <p className="mt-2 text-cream/70">{brand.slogan[lang]}</p>

              {/* Yol Tarifi — yeni sekmede Google Haritalar (güvenli dış link) */}
              <a
                href={mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "group mt-7 inline-flex items-center gap-2 rounded-full bg-burgundy px-6 py-3 font-semibold text-white shadow-lg shadow-burgundy/30 transition hover:bg-burgundy-dark",
                  !reduced && "hover:scale-[1.03]",
                )}
              >
                {t.visit.directions}
                <ArrowUpRight
                  size={18}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
