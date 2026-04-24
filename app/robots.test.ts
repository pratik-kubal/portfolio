import { describe, it, expect } from "vitest";
import robots from "./robots";

describe("robots", () => {
  it("allows all user agents to crawl /", () => {
    const config = robots();
    const rules = Array.isArray(config.rules) ? config.rules : [config.rules];
    const allBots = rules.find((r) => r.userAgent === "*");
    expect(allBots?.allow).toContain("/");
  });

  it("disallows crawling of API routes", () => {
    const config = robots();
    const rules = Array.isArray(config.rules) ? config.rules : [config.rules];
    const allBots = rules.find((r) => r.userAgent === "*");
    const disallow = Array.isArray(allBots?.disallow)
      ? allBots.disallow
      : [allBots?.disallow];
    expect(disallow).toContain("/api/");
  });

  it("sets sitemap URL pointing to the production domain", () => {
    const config = robots();
    expect(config.sitemap).toBe("https://pratik-kubal.com/sitemap.xml");
  });
});
