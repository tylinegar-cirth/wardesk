"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/auth/actions";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Logo from "@/components/ui/Logo";

const navItems = [
  { label: "Overview", href: "/admin", icon: "◆" },
  { label: "Bookings", href: "/admin/bookings", icon: "◈" },
  { label: "Advisors", href: "/admin/advisors", icon: "◇" },
  { label: "Users", href: "/admin/users", icon: "□" },
];

export default function AdminSidebar({
  userName,
}: {
  userName: string | null;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/admin"
      ? pathname === "/admin"
      : pathname.startsWith(href);

  const nav = (
    <>
      {/* Logo */}
      <div className="px-6 pt-6 pb-8">
        <Link
          href="/"
          className="font-mono text-[10px] font-bold tracking-[0.3em] uppercase text-wd-text flex items-center gap-2"
        >
          <Logo className="h-[42px] w-auto -my-2" />
          War Desk
        </Link>
        <span className="inline-block mt-2 font-mono text-[8px] tracking-[0.2em] uppercase text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded">
          Admin
        </span>
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
                ? "bg-wd-gold-glow text-wd-text border-l-2 border-wd-gold"
                : "text-wd-muted hover:text-wd-sub hover:bg-wd-overlay/[0.03]"
            }`}
          >
            <span className="text-sm">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* User + signout */}
      <div className="px-4 pb-4 border-t border-wd-border pt-4">
        <div className="flex items-center justify-between mb-1">
          <div className="font-sans text-sm text-wd-text truncate">
            {userName || "Admin"}
          </div>
          <ThemeToggle />
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="font-mono text-[9px] tracking-[0.1em] uppercase text-wd-muted hover:text-wd-sub transition-colors bg-transparent border-none p-0 cursor-pointer"
          >
            Sign out
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
          href="/"
          className="font-mono text-[10px] font-bold tracking-[0.3em] uppercase text-wd-text flex items-center gap-2"
        >
          <Logo className="h-[36px] w-auto -my-1.5" />
          War Desk
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-wd-text text-xl bg-transparent border-none p-1"
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
