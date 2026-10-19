import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { expect, test, vi } from "vitest";
import { LanguageProvider } from "@/i18n/LanguageContext";
import MenuPage from "./MenuPage";

/* ════════════════════════════════════════════════════════════════════
   MENUPAGE — SCROLL-SPY KATEGORİ ÇUBUĞU TESTİ (bugün eklediğimiz özellik)
   Soru: Sticky kategori çubuğu render oluyor mu? İlk kategori aktif mi?
   Bir kategoriye tıklayınca aktiflik geçip o bölüme kaydırma çağrılıyor mu?
   (Gerçek scroll-spy IntersectionObserver ister; jsdom'da stub → gözlemci
   tetiklenmez. O yüzden burada TIKLAMA yoluyla aktif değişimini test ederiz.)
   ════════════════════════════════════════════════════════════════════ */

// Animasyonları kapat → reveal (whileInView) ve çıkış dertleri olmadan deterministik.
vi.mock("@/hooks/usePrefersReducedMotion", () => ({
  usePrefersReducedMotion: () => true,
}));

// MenuPage <Link> (router) + useLanguage (context) kullanır → ikisini sar.
function renderMenuPage() {
  return render(
    <MemoryRouter initialEntries={["/menu"]}>
      <LanguageProvider>
        <MenuPage />
      </LanguageProvider>
    </MemoryRouter>,
  );
}

test("kategori çubuğu: render + ilk aktif + tıklayınca aktif değişir ve kaydırır", () => {
  // scrollIntoView'u izle (casus): tıklayınca çağrıldığını kanıtlamak için.
  const scrollSpy = vi.spyOn(Element.prototype, "scrollIntoView");

  renderMenuPage();

  // 1) Üç kategori NAV DÜĞMESİ render olmalı (EN başlıklar). Not: aynı metin h2
  //    başlığında da geçer; ama role="button" ile sadece çubuktaki düğmeyi alırız.
  const hotBtn = screen.getByRole("button", { name: "Hot Coffee" });
  const coldBtn = screen.getByRole("button", { name: "Cold Coffee" });
  const dessertBtn = screen.getByRole("button", { name: "Desserts" });
  expect(hotBtn).toBeInTheDocument();
  expect(coldBtn).toBeInTheDocument();
  expect(dessertBtn).toBeInTheDocument();

  // 2) Başlangıçta ilk kategori (Hot Coffee) aktif → aria-current="true".
  //    Diğerlerinde aria-current hiç basılmaz (undefined → öznitelik yok).
  expect(hotBtn).toHaveAttribute("aria-current", "true");
  expect(dessertBtn).not.toHaveAttribute("aria-current");

  // 3) "Desserts"e tıkla → aktiflik ona geçer, Hot pasifleşir.
  fireEvent.click(dessertBtn);
  expect(dessertBtn).toHaveAttribute("aria-current", "true");
  expect(hotBtn).not.toHaveAttribute("aria-current");

  // 4) Tıklama o bölüme kaydırmayı tetiklemeli (scrollIntoView çağrıldı mı?).
  expect(scrollSpy).toHaveBeenCalled();
});
