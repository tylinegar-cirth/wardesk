"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/auth/actions";
import { exitStudioDemo } from "@/lib/auth/demo-actions";
import ThemeToggle from "@/components/ui/ThemeToggle";

const navItems = [
  { label: "Dashboard", href: "/studio-portal", icon: "◆" },
  { label: "Projects", href: "/studio-portal/projects", icon: "▣" },
  { label: "Assets", href: "/studio-portal/assets", icon: "◧" },
  { label: "Calendar", href: "/studio-portal/calendar", icon: "◇" },
];

export default function StudioPortalSidebar({ userName, isDemo }: { userName: string | null; isDemo?: boolean }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/studio-portal") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const nav = (
    <>
      {/* Logo */}
      <div className="px-4 pt-6 pb-8">
        <Link
          href="/studio"
          className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-wd-text flex items-center gap-1.5"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt=""
            className="h-[84px] w-auto -my-4 dark:invert"
          />
          <span>War Desk <span className="text-wd-gold">Studio</span></span>
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 font-mono text-[11px] tracking-[0.05em] uppercase transition-all duration-200 ${
              isActive(item.href)
                ? "bg-wd-gold-glow text-wd-gold border-l-2 border-wd-gold"
                : "text-wd-sub hover:text-wd-text hover:bg-wd-overlay/[0.04]"
            }`}
          >
            <span className="text-sm">{item.icon}</span>
            {item.label}
          </Link>
        ))}

        {/* Cross-navigation to advisory */}
        <div className="my-4 mx-3">
          <div className="h-px bg-wd-border" />
          <Link
            href="/portal"
            onClick={() => setMobileOpen(false)}
            className="font-mono text-[8px] tracking-[0.3em] uppercase text-wd-muted hover:text-wd-gold transition-colors mt-3 mb-1 px-0 block"
          >
            Advisory Portal ↗
          </Link>
        </div>
      </nav>

      {/* User + signout */}
      <div className="px-4 pb-4 border-t border-wd-border pt-4">
        <div className="flex items-center justify-between mb-1">
          <div className="font-sans text-sm text-wd-text truncate">
            {userName || "User"}
          </div>
          <ThemeToggle />
        </div>
        <form action={isDemo ? exitStudioDemo : signOut}>
          <button
            type="submit"
            className="font-mono text-[9px] tracking-[0.1em] uppercase text-wd-sub hover:text-wd-text transition-colors bg-transparent border-none p-0 cursor-pointer"
          >
            {isDemo ? "Exit demo" : "Sign out"}
          </button>
        </form>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-[240px] h-screen bg-wd-surface border-r border-wd-border fixed left-0 top-0 z-50">
        {nav}
      </aside>

      {/* Mobile header bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-wd-surface border-b border-wd-border flex items-center justify-between px-4">
        <Link
          href="/studio"
          className="font-mono text-[10px] font-bold tracking-[0.3em] uppercase text-wd-text flex items-center gap-2"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt=""
            className="h-[50px] w-auto -my-1 dark:invert"
          />
          <span>War Desk <span className="text-wd-gold">Studio</span></span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-wd-text text-xl bg-transparent border-none p-1"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? "×" : "☰"}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-14 bottom-0 w-[280px] bg-wd-surface border-r border-wd-border flex flex-col">
            {nav}
          </aside>
        </div>
      )}
    </>
  );
}
