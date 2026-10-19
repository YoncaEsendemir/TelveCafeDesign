import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { expect, test, vi } from "vitest";
import App from "../App";

/* ════════════════════════════════════════════════════════════════════
   REDUCED-MOTION SMOKE TESTİ (erişilebilirlik)
   Soru: Kullanıcı "hareketi azalt" (prefers-reduced-motion: reduce) açtığında
   uygulama ÇÖKMEDEN render oluyor mu? Animasyonlu her bileşenin `reduced` dalı
   (statik fallback) sağlam mı?
   Smoke test = en temel sağlamlık: "sayfa ayakta mı?" (h1 görünüyor mu?)
   Ayrı dosya → window.matchMedia override'ı diğer testlere sızmaz (izolasyon).
   ════════════════════════════════════════════════════════════════════ */

test("reduced-motion AÇIKken uygulama çökmeden render olur", () => {
  // matchMedia'yı "reduce AÇIK" olacak şekilde taklit et → hook `true` döner.
  // Hook addEventListener/removeEventListener da çağırdığı için onları da veriyoruz.
  window.matchMedia = (query: string) =>
    ({
      matches: true, // ← kritik: "hareketi azalt" açık
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }) as unknown as MediaQueryList;

  // App kendi içinde LanguageProvider'ı barındırır → sadece router yeterli (App.test ile aynı).
  render(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>,
  );

  // Reduced dalları (animasyonsuz statik içerik) çalışsa bile sayfa sağlam:
  // ana başlık (h1) DOM'da olmalı. Çökme olsaydı render patlardı.
  expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
});
