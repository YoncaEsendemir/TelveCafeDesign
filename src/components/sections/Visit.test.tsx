import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { LanguageProvider } from "@/i18n/LanguageContext";
import Visit from "./Visit";

/* ════════════════════════════════════════════════════════════════════
   VISIT — GÜVENLİ DIŞ LİNK TESTİ (güvenlik)
   Soru: Yeni sekmede açılan Google Maps linki, "reverse tabnabbing"e karşı
   korumalı mı? Yani target="_blank" olan linkte rel="noopener noreferrer"
   var mı? (Yoksa açılan sayfa window.opener ile bizim sekmemizi kaçırabilir.)
   Visit router kullanmaz → sadece LanguageProvider yeterli.
   ════════════════════════════════════════════════════════════════════ */

function renderVisit() {
  return render(
    <LanguageProvider>
      <Visit />
    </LanguageProvider>,
  );
}

test("güvenlik: dış Maps linki _blank + noopener/noreferrer ve https", () => {
  renderVisit();

  // "Get Directions" linkini erişilebilir adıyla bul (varsayılan dil EN).
  const link = screen.getByRole("link", { name: "Get Directions" });

  // Yeni sekmede açılır (target="_blank").
  expect(link).toHaveAttribute("target", "_blank");

  // ASIL GÜVENLİK: rel="noopener noreferrer".
  //   noopener  → açılan sayfa window.opener ile bizim sekmemize erişemez (tabnabbing engeli)
  //   noreferrer→ hedefe Referer başlığı gönderilmez (gizlilik)
  expect(link).toHaveAttribute("rel", "noopener noreferrer");

  // Bonus: link güvenli protokolle (https) başlamalı — düz http olmamalı.
  expect(link.getAttribute("href")).toMatch(/^https:\/\//);
});
