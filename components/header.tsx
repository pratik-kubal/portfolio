"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
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
          <span>/ knowledge card</span>
        </Link>
      </div>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <span>updated · {stamp} · indexed</span>
        <ThemeToggle />
      </div>
    </header>
  );
}
