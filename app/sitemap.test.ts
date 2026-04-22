import { describe, it, expect } from "vitest";
import sitemap from "./sitemap";

describe("sitemap", () => {
  it("returns entries for all public routes", () => {
    const entries = sitemap();
    const urls = entries.map((e) => e.url);
    expect(urls).toContain("https://pratik-kubal.com");
  });

  it("sets home page priority to 1", () => {
    const entries = sitemap();
    const home = entries.find((e) => e.url === "https://pratik-kubal.com");
    expect(home?.priority).toBe(1);
  });

  it("includes lastModified for all entries", () => {
    const entries = sitemap();
    entries.forEach((entry) => {
      expect(entry.lastModified).toBeInstanceOf(Date);
    });
  });

  it("sets changeFrequency for all entries", () => {
    const entries = sitemap();
    entries.forEach((entry) => {
      expect(entry.changeFrequency).toBeDefined();
    });
  });
});
