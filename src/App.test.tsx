import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { axe } from "vitest-axe";
import { expect, test } from "vitest";
import App from "./App";

// App artık <Routes> kullanıyor → router bağlamı gerekir. Testte MemoryRouter
// ile sararız (gerçek URL yerine bellekte rota tutar). Varsayılan "/" → Home.
function renderApp() {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>,
  );
}

test("başlık (h1) render oluyor", () => {
  renderApp();
  expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
});

test("erişilebilirlik ihlali yok", async () => {
  const { container } = renderApp();
  expect(await axe(container)).toHaveNoViolations();
});
