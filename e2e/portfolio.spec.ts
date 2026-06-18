import { test, expect } from "@playwright/test";

test.describe("pratik-kubal.com v2", () => {
  test("renders the hero with final content", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Pratik Kubal", level: 1 }),
    ).toBeVisible();
    await expect(
      page.getByText("software Engineer based in Philadelphia"),
    ).toBeVisible();
  });

  test("theme toggle swaps data-theme across Light / Dark / Noir", async ({
    page,
  }) => {
    await page.goto("/");
    const html = page.locator("html");
    await page.getByRole("button", { name: "Dark" }).click();
    await expect(html).toHaveAttribute("data-theme", "dark");
    await page.getByRole("button", { name: "Noir" }).click();
    await expect(html).toHaveAttribute("data-theme", "bw");
    await page.getByRole("button", { name: "Light" }).click();
    await expect(html).toHaveAttribute("data-theme", "light");
  });

  test("Bella opens with the greeting and starter chips", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open chat with Bella" }).click();
    await expect(
      page.getByText("I help recruiters get quick, honest answers"),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Strongest tech stack?" }),
    ).toBeVisible();
  });

  test("highlight-to-ask shows the Ask Bella popover", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      const el = document.querySelector(".pk-hero-body");
      if (!el) return;
      const r = document.createRange();
      r.selectNodeContents(el);
      const s = window.getSelection()!;
      s.removeAllRanges();
      s.addRange(r);
      document.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
    });
    await expect(
      page.getByRole("button", { name: "Ask Bella about the selected text" }),
    ).toBeVisible();
  });

  test("legal pages render in the v2 design", async ({ page }) => {
    for (const [path, title] of [
      ["/privacy", "Privacy Policy"],
      ["/cookies", "Cookie Policy"],
      ["/terms", "Terms of Use"],
    ] as const) {
      await page.goto(path);
      await expect(page.getByRole("heading", { name: title })).toBeVisible();
    }
  });
});
