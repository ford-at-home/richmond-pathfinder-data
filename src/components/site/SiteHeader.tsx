import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { primaryNav, siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-background/95 backdrop-blur-[2px]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-sm focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <div className="mx-auto flex max-w-[80rem] items-stretch gap-6 px-5 lg:px-8">
        <Link
          to="/"
          className="flex flex-col justify-center py-3 pr-6 no-underline"
          aria-label={`${siteConfig.name} — home`}
        >
          <span className="eyebrow">Richmond, Virginia region</span>
          <span className="font-display text-[1.05rem] font-semibold leading-tight text-foreground">
            {siteConfig.name}
          </span>
        </Link>

        <nav aria-label="Primary" className="ml-auto hidden items-stretch lg:flex">
          {primaryNav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="relative flex items-center px-3.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{
                className: "text-foreground",
                "aria-current": "page",
              }}
            >
              {({ isActive }) => (
                <>
                  <span>{item.label}</span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-x-3 bottom-0 h-[2px] transition-colors",
                      isActive ? "bg-highlight" : "bg-transparent",
                    )}
                  />
                </>
              )}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="ml-auto inline-flex items-center gap-2 self-center rounded-sm border border-rule px-3 py-2 text-sm text-foreground lg:hidden"
        >
          {open ? <X className="size-4" aria-hidden="true" /> : <Menu className="size-4" aria-hidden="true" />}
          <span>{open ? "Close" : "Menu"}</span>
        </button>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          aria-label="Primary mobile"
          className="border-t border-rule bg-surface lg:hidden"
        >
          <ul className="mx-auto max-w-[80rem] px-5 py-2">
            {primaryNav.map((item) => (
              <li key={item.to} className="border-b border-border last:border-b-0">
                <Link
                  to={item.to}
                  activeOptions={{ exact: item.to === "/" }}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-sm text-foreground"
                  activeProps={{ className: "text-primary", "aria-current": "page" }}
                >
                  <span className="font-medium">{item.label}</span>
                  <span className="mt-0.5 block annotation">{item.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
