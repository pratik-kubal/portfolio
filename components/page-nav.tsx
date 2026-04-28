"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavPage {
  id: string;
  label: string;
  href: string;
  flag?: string;
}

const PAGES: NavPage[] = [
  { id: "portfolio", label: "Portfolio", href: "/" },
  { id: "advisor", label: "Advisor", href: "/advisor", flag: "NEW" },
];

export function PageNav() {
  const pathname = usePathname();
  const currentId =
    pathname === "/advisor" || pathname?.startsWith("/advisor/")
      ? "advisor"
      : "portfolio";

  return (
    <nav className="pn-stk" aria-label="Sections">
      {PAGES.map((page, i) => {
        const isCurrent = page.id === currentId;
        return (
          <Link
            key={page.id}
            href={page.href}
            className={isCurrent ? "cur" : undefined}
            aria-current={isCurrent ? "page" : undefined}
          >
            <span className="num">{String(i + 1).padStart(2, "0")}</span>
            {page.label}
            {page.flag && !isCurrent ? (
              <span className="flag">{page.flag}</span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
