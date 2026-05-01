"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PageNav } from "@/components/page-nav";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  const pathname = usePathname();
  const isAdvisor = pathname === "/solutions";

  return (
    <header className="v3-hdr">
      <div>
        <Link
          href="/"
          style={{
            color: "inherit",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "baseline",
            gap: 8,
          }}
        >
          <b>Pratik Kubal</b>
          {isAdvisor ? (
            <span>
              / solutions{" "}
              <em
                style={{
                  fontStyle: "italic",
                  color: "var(--accent-text)",
                }}
              >
                · est. 2025
              </em>
            </span>
          ) : (
            <span>/ About Me</span>
          )}
        </Link>
      </div>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <ThemeToggle />
        <PageNav />
      </div>
    </header>
  );
}
