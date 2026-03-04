"use client";

import { useState } from "react";

export default function ManageBillingButton() {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      console.error("Failed to open billing portal");
    }
    setLoading(false);
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="font-mono text-[10px] tracking-[0.1em] uppercase px-5 py-2.5 bg-wd-overlay/[0.04] text-wd-sub border border-wd-border rounded-lg hover:border-wd-gold/30 hover:text-wd-gold transition-all disabled:opacity-50"
    >
      {loading ? "Opening..." : "Manage billing"}
    </button>
  );
}
