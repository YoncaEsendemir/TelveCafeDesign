import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/** Kullanıcı işletim sisteminde "hareketi azalt" demişse true döner.
 *  Animasyon veren TÜM component'ler tek kaynak olarak bunu kontrol eder. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia(QUERY).matches,
  );

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    const onChange = () => setReduced(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
