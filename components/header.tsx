"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  const pathname = usePathname();
  const isConsulting = pathname === "/consulting";

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
          {isConsulting ? (
            <span>
              / consulting{" "}
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
          href="/consulting"
          style={{
            color: isConsulting ? "var(--accent-text)" : "inherit",
            textDecoration: "none",
          }}
        >
          consulting
        </Link>
        <span>updated · {stamp} · indexed</span>
        <ThemeToggle />
      </div>
    </header>
  );
}
