// vitest-axe'in matcher tiplerini Vitest 5'in `expect` tipine tanıtır.
// (Çalışma zamanı kaydı setup.ts'te; bu dosya sadece TypeScript içindir.)
import "vitest";
import type { AxeMatchers } from "vitest-axe/matchers";

declare module "vitest" {
  interface Assertion extends AxeMatchers {}
  interface AsymmetricMatchersContaining extends AxeMatchers {}
}
