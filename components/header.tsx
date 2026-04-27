"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  const pathname = usePathname();
  const isAdvisor = pathname === "/advisor";

  const today = new Date();
  const stamp = today
    .toLocaleString("en-US", { month: "short", year: "numeric" })
    .toLowerCase();

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
              / advisor{" "}
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
            <span>/ knowledge card</span>
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
        <Link
          href="/advisor"
          style={{
            color: isAdvisor ? "var(--accent-text)" : "inherit",
            textDecoration: "none",
          }}
        >
          advisor
        </Link>
        <span>updated · {stamp} · indexed</span>
        <ThemeToggle />
      </div>
    </header>
  );
}
