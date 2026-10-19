import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { expect, test, vi } from "vitest";
import { LanguageProvider } from "@/i18n/LanguageContext";
import Menu from "./Menu";

/* ════════════════════════════════════════════════════════════════════
   MENU — FİLTRE TESTİ
   Soru: Bir kategoriye tıklayınca gerçekten sadece o kategorideki kahveler
   mi kalıyor? (Menu.tsx'teki `visible = menu.filter(...)` mantığı doğru mu?)
   ════════════════════════════════════════════════════════════════════ */

// Animasyonları kapat: reduced-motion hook'unu her zaman `true` döndür.
// NEDEN: Açık animasyonda Framer Motion AnimatePresence "çıkış (exit)" animasyonu
// yapar → filtrelenen kart hemen DOM'dan silinmeyip bir süre kalabilir, bu da
// testi kararsız (flaky) yapar. reduced modda exit YOK → kartlar anında eklenir/
// çıkar, biz de filtre MANTIĞINI saf şekilde test ederiz (animasyonu değil).
// vi.mock dosyanın en üstüne "hoist" edilir (çağrı sırası önemsiz).
vi.mock("@/hooks/usePrefersReducedMotion", () => ({
  usePrefersReducedMotion: () => true,
}));

// Menu, <Link> (router) ve useLanguage (context) kullanıyor → ikisini de sağlamalıyız.
// Varsayılan dil "en" (localStorage boş) → etiketler İngilizce gelir.
function renderMenu() {
  return render(
    <MemoryRouter>
      <LanguageProvider>
        <Menu />
      </LanguageProvider>
    </MemoryRouter>,
  );
}

test("filtre: 'Milk' seçilince yalnızca sütlü kahveler kalır", () => {
  renderMenu();

  // 1) Başlangıç: 4 kahvenin hepsi görünür. Kart isimleri h3 (role="heading").
  expect(screen.getByRole("heading", { name: "Espresso" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Latte" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Cappuccino" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Cold Brew" })).toBeInTheDocument();

  // 2) "Milk" filtre DÜĞMESİNE tıkla (düğme = role="button"; kart = role="heading"
  //    → "Espresso" ismi ikisinde de geçse bile rol sayesinde karışmaz).
  fireEvent.click(screen.getByRole("button", { name: "Milk" }));

  // 3) Sonuç: sadece sütlü olanlar (Latte + Cappuccino) kalmalı.
  expect(screen.getByRole("heading", { name: "Latte" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Cappuccino" })).toBeInTheDocument();

  // 4) Espresso ve Cold Brew kartları DOM'dan çıkmış olmalı.
  //    "yok olmalı" → queryBy* kullan (bulamazsa null döner, hata atmaz).
  expect(screen.queryByRole("heading", { name: "Espresso" })).not.toBeInTheDocument();
  expect(screen.queryByRole("heading", { name: "Cold Brew" })).not.toBeInTheDocument();
});

/* ════════════════════════════════════════════════════════════════════
   MENU — MODAL AÇ/KAPA + ESC TESTİ
   Soru: Detay butonu erişilebilir bir diyalog (role="dialog") açıyor mu?
   Ve Esc tuşuyla kapanıyor mu? (DetailModal'ın a11y kalıbı doğru mu?)
   async → kapanışta waitFor beklediğimiz için test asenkron.
   ════════════════════════════════════════════════════════════════════ */
test("modal: detay açılır (role=dialog) ve Esc ile kapanır", async () => {
  renderMenu();

  // 1) Başlangıçta açık modal YOK.
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

  // 2) Her kartta bir "View details" düğmesi var (4 adet) → getAllByRole dizi döner,
  //    ilkini (Espresso kartı) tıkla.
  const detailButtons = screen.getAllByRole("button", { name: "View details" });
  fireEvent.click(detailButtons[0]);

  // 3) Modal açıldı mı? role="dialog" DOM'da olmalı (aria-modal'lı erişilebilir diyalog).
  expect(screen.getByRole("dialog")).toBeInTheDocument();

  // 4) Esc tuşuna bas. Dinleyici document üzerinde (DetailModal useEffect) → document'a gönder.
  fireEvent.keyDown(document, { key: "Escape" });

  // 5) Kapanış animasyonu (AnimatePresence exit) async olabilir → waitFor ile bekle.
  //    waitFor: içteki beklenti geçene kadar kısa aralıklarla tekrar dener (zaman aşımına
  //    kadar). Geçerse test başarılı, geçmezse hata.
  await waitFor(() => {
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
