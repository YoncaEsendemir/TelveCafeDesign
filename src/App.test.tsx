import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { expect, test } from "vitest";
import App from "./App";

test("başlık (h1) render oluyor", () => {
  render(<App />);
  expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
});

test("erişilebilirlik ihlali yok", async () => {
  const { container } = render(<App />);
  expect(await axe(container)).toHaveNoViolations();
});
