import "@testing-library/jest-dom/vitest";
import * as axeMatchers from "vitest-axe/matchers";
import { expect, vi } from "vitest";

// axe'in `toHaveNoViolations` matcher'ını Vitest'e ekler
expect.extend(axeMatchers);

// jsdom'da olmayan tarayıcı API'lerini mock'la.
// matchMedia → usePrefersReducedMotion hook'u bunu kullanıyor.
if (!window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  });
}

// scrollTo / scrollIntoView → ScrollManager (react-router rota/hash kaydırma)
// bunları çağırır; jsdom'da gerçek yok ("Not implemented" uyarısı basar).
// No-op stub'larla sessizleştiriyoruz (testte gerçek kaydırma gerekmez).
window.scrollTo = vi.fn();
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = vi.fn();
}

// IntersectionObserver → Framer Motion'ın `whileInView`'ı (OurStory) bunu kullanır.
// jsdom'da yok; observe/unobserve/disconnect no-op bir sınıfla taklit ediyoruz
// (testte animasyon tetiklenmesine gerek yok, sadece çökmemeli).
if (!("IntersectionObserver" in window)) {
  class IntersectionObserverStub {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
    takeRecords = vi.fn(() => []);
    root = null;
    rootMargin = "";
    thresholds = [];
  }
  vi.stubGlobal("IntersectionObserver", IntersectionObserverStub);
}
