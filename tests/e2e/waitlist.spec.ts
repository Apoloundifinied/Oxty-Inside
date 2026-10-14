import { test, expect } from "@playwright/test";

// Fluxo waitlist -> (confirmacao) -> /obrigado.
// Sem Supabase/Turnstile configurados, as actions degradam para modo dev:
// o formulario ainda retorna "ok" — o que testamos aqui e a jornada.
test("landing carrega com hero, widget de cidade e formulario de waitlist", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Passou no concurso/i })).toBeVisible();
  await expect(page.getByPlaceholder("Digite o município").first()).toBeVisible();
  await expect(page.getByRole("button", { name: /Quero ser avisado/i }).first()).toBeVisible();
});

test("inscricao na waitlist mostra mensagem de confirmacao", async ({ page }) => {
  await page.goto("/");
  const email = `e2e-${Date.now()}@exemplo.com`;
  await page.getByPlaceholder("voce@email.com").first().fill(email);
  await page.getByRole("button", { name: /Quero ser avisado/i }).first().click();
  await expect(page.getByText(/e-mail de confirma|já está na lista/i).first()).toBeVisible();
});

test("pagina de cobertura e obrigado respondem", async ({ page }) => {
  await page.goto("/cobertura");
  await expect(page.getByRole("heading", { name: "O que cobrimos" })).toBeVisible();
  await page.goto("/obrigado");
  await expect(page.getByRole("heading", { name: /Tudo certo/i })).toBeVisible();
});
