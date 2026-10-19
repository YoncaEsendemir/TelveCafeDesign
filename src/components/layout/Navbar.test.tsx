import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { expect, test } from "vitest";
import { LanguageProvider } from "@/i18n/LanguageContext";
import Navbar from "./Navbar";

/* ════════════════════════════════════════════════════════════════════
   NAVBAR — DİL DEĞİŞTİRİCİ TESTİ
   Soru: Dil düğmesine basınca (1) metinler, (2) <html lang>, (3) localStorage
   doğru güncelleniyor mu? (LanguageContext + Navbar birlikte çalışıyor mu?)
   ════════════════════════════════════════════════════════════════════ */

// Navbar, <Link> (router) ve useLanguage (context) kullanır → ikisini de sağla.
function renderNavbar() {
  return render(
    <MemoryRouter>
      <LanguageProvider>
        <Navbar />
      </LanguageProvider>
    </MemoryRouter>,
  );
}

test("dil değiştirici: EN→TR metinleri, <html lang> ve localStorage'ı günceller", () => {
  // Testi İZOLE et: önceki bir testten kalan dil kaydı varsa temizle. Yoksa
  // provider açılışta localStorage'dan "tr" okuyup varsayılanı bozabilir.
  localStorage.clear();

  renderNavbar();

  // ── Başlangıç: varsayılan dil EN ──
  // CTA linki İngilizce "See Menu"; <html lang> provider tarafından "en" yapılmış.
  expect(screen.getByRole("link", { name: "See Menu" })).toBeInTheDocument();
  expect(document.documentElement.lang).toBe("en");

  // ── Dil düğmesine tıkla ──
  // Düğmenin erişilebilir adı aria-label'dan gelir (= "Change language", EN).
  // Görünen metni "TR" olsa da ekran okuyucu "Change language" duyar.
  fireEvent.click(screen.getByRole("button", { name: "Change language" }));

  // ── Sonuç 1: METİN değişti ──
  // CTA artık Türkçe "Menüyü Gör"; eski İngilizce "See Menu" DOM'dan gitmeli.
  expect(screen.getByRole("link", { name: "Menüyü Gör" })).toBeInTheDocument();
  expect(screen.queryByRole("link", { name: "See Menu" })).not.toBeInTheDocument();

  // ── Sonuç 2: <html lang> güncellendi (erişilebilirlik + SEO) ──
  expect(document.documentElement.lang).toBe("tr");

  // ── Sonuç 3: seçim localStorage'a yazıldı (sonraki ziyarette hatırlanır) ──
  expect(localStorage.getItem("telve.lang")).toBe("tr");
});
