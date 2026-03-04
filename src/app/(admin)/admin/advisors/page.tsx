"use client";

import { useState, useEffect, useCallback } from "react";
import { createBrowserClient } from "@supabase/ssr";
import StatusBadge from "@/components/shared/StatusBadge";
import {
  adminUpdateAdvisor,
  adminLinkAdvisorUser,
  adminCreateAdvisor,
} from "@/lib/actions/admin";

interface AdvisorRow {
  id: string;
  name: string;
  title: string;
  branch: string;
  category: string;
  stars: number;
  focus: string[];
  clearance: string;
  rate: number;
  bio: string | null;
  image_url: string | null;
  years_service: number;
  availability_status: string;
  user_id: string | null;
}

export default function AdminAdvisorsPage() {
  const [advisors, setAdvisors] = useState<AdvisorRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [linkingAdvisor, setLinkingAdvisor] = useState<string | null>(null);
  const [linkEmail, setLinkEmail] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // New advisor form
  const [newName, setNewName] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newBranch, setNewBranch] = useState("Army");
  const [newCategory, setNewCategory] = useState("Army");
  const [newStars, setNewStars] = useState(3);
  const [newRate, setNewRate] = useState(500);
  const [newClearance, setNewClearance] = useState("TS/SCI");
  const [newYears, setNewYears] = useState(20);
  const [newBio, setNewBio] = useState("");
  const [addingAdvisor, setAddingAdvisor] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const loadAdvisors = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("advisors")
      .select("*")
      .order("name", { ascending: true });
    setAdvisors((data as AdvisorRow[]) || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadAdvisors();
  }, [loadAdvisors]);

  async function handleStatusChange(
    advisorId: string,
    status: string
  ) {
    const result = await adminUpdateAdvisor(advisorId, {
      availability_status: status,
    });
    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else {
      loadAdvisors();
    }
  }

  async function handleLinkUser(advisorId: string) {
    if (!linkEmail) return;
    const result = await adminLinkAdvisorUser(advisorId, linkEmail);
    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else {
      setMessage({ type: "success", text: "User linked successfully!" });
      setLinkingAdvisor(null);
      setLinkEmail("");
      loadAdvisors();
    }
  }

  async function handleAddAdvisor() {
    setAddingAdvisor(true);
    const result = await adminCreateAdvisor({
      name: newName,
      title: newTitle,
      branch: newBranch,
      category: newCategory,
      stars: newStars,
      focus: [],
      clearance: newClearance,
      rate: newRate,
      bio: newBio,
      image_url: "",
      years_service: newYears,
    });

    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else {
      setMessage({ type: "success", text: "Advisor created!" });
      setShowAddModal(false);
      setNewName("");
      setNewTitle("");
      setNewBio("");
      loadAdvisors();
    }
    setAddingAdvisor(false);
  }

  return (
    <div className="p-8 md:p-12 max-w-6xl">
      <div className="flex justify-between items-start mb-10">
        <div>
          <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-wd-gold mb-3">
            Advisor Management
          </p>
          <h1 className="font-serif text-3xl text-wd-text">Advisor Roster</h1>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="font-mono text-[10px] tracking-[0.1em] uppercase py-2.5 px-5 bg-wd-gold text-wd-bg font-bold rounded-lg transition-all duration-300 hover:-translate-y-0.5 shadow-[0_2px_12px_rgba(212,168,67,0.15)] hover:shadow-[0_4px_20px_rgba(212,168,67,0.35)]"
        >
          + Add Advisor
        </button>
      </div>

      {message && (
        <div
          className={`mb-6 p-3 rounded-lg font-sans text-sm ${
            message.type === "success"
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "bg-red-500/10 text-red-400 border border-red-500/20"
          }`}
        >
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-20 bg-wd-card border border-wd-border rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {advisors.map((advisor) => (
            <div
              key={advisor.id}
              className="bg-wd-card border border-wd-border rounded-xl p-5"
            >
              <div className="flex items-start gap-4">
                {/* Photo */}
                <div className="w-12 h-12 rounded-full bg-wd-surface border border-wd-border flex items-center justify-center overflow-hidden flex-shrink-0">
                  {advisor.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={advisor.image_url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-wd-muted text-lg">
                      {advisor.name?.charAt(0) || "?"}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <p className="font-sans text-sm text-wd-text font-medium">
                        {advisor.name}
                      </p>
                      <p className="font-sans text-xs text-wd-muted">
                        {advisor.title} · {advisor.branch}
                      </p>
                    </div>
                    <StatusBadge status={advisor.availability_status} />
                  </div>

                  <div className="flex items-center gap-3 mt-2 text-wd-sub font-mono text-[10px] flex-wrap">
                    <span>{"★".repeat(advisor.stars)}</span>
                    <span>${advisor.rate}/hr</span>
                    <span>{advisor.years_service}yr</span>
                    <span>{advisor.clearance}</span>
                    {advisor.user_id ? (
                      <span className="text-emerald-400">✓ Linked</span>
                    ) : (
                      <span className="text-wd-muted">No account</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-3 flex-wrap">
                    <select
                      value={advisor.availability_status}
                      onChange={(e) =>
                        handleStatusChange(advisor.id, e.target.value)
                      }
                      className="bg-white/[0.03] border border-wd-border rounded-md text-wd-text font-mono text-[10px] px-2 py-1 focus:border-wd-gold/50 outline-none"
                    >
                      <option value="available">Available</option>
                      <option value="limited">Limited</option>
                      <option value="unavailable">Unavailable</option>
                    </select>

                    {!advisor.user_id && (
                      <>
                        {linkingAdvisor === advisor.id ? (
                          <div className="flex gap-2 items-center">
                            <input
                              type="email"
                              value={linkEmail}
                              onChange={(e) => setLinkEmail(e.target.value)}
                              placeholder="user@email.com"
                              className="bg-white/[0.03] border border-wd-border rounded-md text-wd-text font-sans text-xs px-2 py-1 focus:border-wd-gold/50 outline-none w-48"
                            />
                            <button
                              onClick={() => handleLinkUser(advisor.id)}
                              className="font-mono text-[9px] uppercase text-emerald-400 hover:text-emerald-300 bg-transparent border-none"
                            >
                              Link
                            </button>
                            <button
                              onClick={() => {
                                setLinkingAdvisor(null);
                                setLinkEmail("");
                              }}
                              className="font-mono text-[9px] uppercase text-wd-muted hover:text-wd-sub bg-transparent border-none"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setLinkingAdvisor(advisor.id)}
                            className="font-mono text-[9px] tracking-[0.05em] uppercase py-1 px-3 bg-white/[0.05] text-wd-text border border-wd-border rounded-md hover:bg-white/[0.08] transition-colors"
                          >
                            Link Account
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Advisor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowAddModal(false)}
          />
          <div className="relative w-full max-w-lg bg-wd-surface border border-wd-border rounded-2xl p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="font-serif text-xl text-wd-text mb-6">
              Add New Advisor
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted block mb-1.5">
                    Name *
                  </label>
                  <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-white/[0.03] border border-wd-border rounded-lg text-wd-text font-sans text-sm px-3 py-2 focus:border-wd-gold/50 outline-none"
                  />
                </div>
                <div>
                  <label className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted block mb-1.5">
                    Title *
                  </label>
                  <input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-white/[0.03] border border-wd-border rounded-lg text-wd-text font-sans text-sm px-3 py-2 focus:border-wd-gold/50 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted block mb-1.5">
                    Branch
                  </label>
                  <select
                    value={newBranch}
                    onChange={(e) => {
                      setNewBranch(e.target.value);
                      setNewCategory(e.target.value);
                    }}
                    className="w-full bg-white/[0.03] border border-wd-border rounded-lg text-wd-text font-sans text-sm px-3 py-2 focus:border-wd-gold/50 outline-none"
                  >
                    {[
                      "Army",
                      "Navy",
                      "Air Force",
                      "Space Force",
                      "SOF",
                      "Intel",
                      "Cyber",
                      "OSD",
                    ].map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted block mb-1.5">
                    Stars
                  </label>
                  <select
                    value={newStars}
                    onChange={(e) => setNewStars(Number(e.target.value))}
                    className="w-full bg-white/[0.03] border border-wd-border rounded-lg text-wd-text font-sans text-sm px-3 py-2 focus:border-wd-gold/50 outline-none"
                  >
                    {[1, 2, 3, 4].map((s) => (
                      <option key={s} value={s}>
                        {s}-Star
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted block mb-1.5">
                    Rate ($/hr)
                  </label>
                  <input
                    type="number"
                    value={newRate}
                    onChange={(e) => setNewRate(Number(e.target.value))}
                    className="w-full bg-white/[0.03] border border-wd-border rounded-lg text-wd-text font-sans text-sm px-3 py-2 focus:border-wd-gold/50 outline-none"
                  />
                </div>
                <div>
                  <label className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted block mb-1.5">
                    Years Service
                  </label>
                  <input
                    type="number"
                    value={newYears}
                    onChange={(e) => setNewYears(Number(e.target.value))}
                    className="w-full bg-white/[0.03] border border-wd-border rounded-lg text-wd-text font-sans text-sm px-3 py-2 focus:border-wd-gold/50 outline-none"
                  />
                </div>
                <div>
                  <label className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted block mb-1.5">
                    Clearance
                  </label>
                  <select
                    value={newClearance}
                    onChange={(e) => setNewClearance(e.target.value)}
                    className="w-full bg-white/[0.03] border border-wd-border rounded-lg text-wd-text font-sans text-sm px-3 py-2 focus:border-wd-gold/50 outline-none"
                  >
                    <option value="TS/SCI">TS/SCI</option>
                    <option value="TS">TS</option>
                    <option value="Secret">Secret</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted block mb-1.5">
                  Bio
                </label>
                <textarea
                  value={newBio}
                  onChange={(e) => setNewBio(e.target.value)}
                  rows={3}
                  className="w-full bg-white/[0.03] border border-wd-border rounded-lg text-wd-text font-sans text-sm px-3 py-2 focus:border-wd-gold/50 outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddAdvisor}
                disabled={addingAdvisor || !newName || !newTitle}
                className="font-mono text-[11px] tracking-[0.1em] uppercase py-3 px-8 bg-wd-gold text-wd-bg font-bold rounded-lg transition-all duration-300 disabled:opacity-50"
              >
                {addingAdvisor ? "Creating..." : "Create Advisor"}
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="font-mono text-[11px] tracking-[0.1em] uppercase py-3 px-8 bg-transparent text-wd-muted border border-wd-border rounded-lg hover:text-wd-sub transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
