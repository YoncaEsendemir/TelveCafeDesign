import { motion, type Variants } from "framer-motion";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { brand } from "@/data/brand";
import { useLanguage } from "@/i18n/LanguageContext";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { duration, easeReveal, stagger } from "@/lib/motion";

/* ════════════════════════════════════════════════════════════════════
   VISIT — iletişim / "bize gelin" bölümü
   · Sol: adres, saatler, telefon, e-posta (ikon + etiket + değer)
     Telefon ve e-posta GERÇEK link: tel: ve mailto: → tıklanınca arar/yazar
   · Sağ: koyu dekoratif panel (konum + slogan)
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

  return (
    <section id="visit" className="bg-cream px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-heading text-center text-4xl text-espresso md:text-5xl">
          {t.visit.title}
        </h2>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {/* ── Sol: iletişim bilgileri ─────────────────────────────── */}
          <motion.ul
            className="flex flex-col gap-6"
            variants={reduced ? undefined : container}
            initial={reduced ? false : "hidden"}
            whileInView={reduced ? undefined : "show"}
            viewport={{ once: true, amount: 0.3 }}
          >
            {rows.map(({ icon: Icon, label, value, href }) => (
              <motion.li key={label} variants={reduced ? undefined : row} className="flex gap-4">
                {/* İkon dekoratif → aria-hidden; anlamı yandaki etiket+değer taşır */}
                <span className="mt-1 text-burgundy">
                  <Icon size={22} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm tracking-wide text-espresso/60 uppercase">{label}</p>
                  {href ? (
                    <a
                      href={href}
                      className="text-lg text-espresso transition-colors hover:text-burgundy"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="text-lg text-espresso">{value}</p>
                  )}
                </div>
              </motion.li>
            ))}
          </motion.ul>

          {/* ── Sağ: koyu dekoratif panel ───────────────────────────── */}
          <motion.div
            className="flex flex-col items-center justify-center rounded-r-2xl border-l-4 border-l-caramel bg-espresso p-10 text-center text-cream"
            initial={reduced ? false : { opacity: 0, scale: 0.98 }}
            whileInView={reduced ? undefined : { opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: duration.base, ease: easeReveal }}
          >
            <MapPin size={36} aria-hidden="true" className="text-caramel" />
            <p className="font-heading mt-4 text-3xl">{brand.name}</p>
            <p className="mt-2 text-cream/70">{brand.slogan[lang]}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
