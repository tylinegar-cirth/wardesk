"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  StudioProject,
  mockAssets,
  mockMilestones,
  statusConfig,
} from "@/data/studio-mock";

type Tab = "overview" | "assets" | "feedback" | "timeline";

export default function ProjectDetailModal({
  project,
  onClose,
}: {
  project: StudioProject;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<Tab>("overview");

  const projectAssets = mockAssets.filter((a) => a.projectId === project.id);
  const projectMilestones = mockMilestones.filter(
    (m) => m.projectId === project.id
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", esc);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", esc);
    };
  }, [onClose]);

  const sc = statusConfig[project.status] || statusConfig.in_progress;
  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "assets", label: "Assets" },
    { id: "feedback", label: "Feedback" },
    { id: "timeline", label: "Timeline" },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
        className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-[32px]"
        style={{ WebkitBackdropFilter: "blur(32px) saturate(0.7)" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.97 }}
          transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-[720px] max-h-[90vh] bg-wd-surface border border-wd-border rounded-[20px] overflow-auto shadow-[0_32px_80px_rgba(0,0,0,0.6),0_0_0_1px_rgba(var(--wd-overlay),0.04)]"
        >
          {/* Header */}
          <div className="px-8 pt-7 pb-5 border-b border-wd-border">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{project.thumbnail}</span>
                <div>
                  <h2 className="font-serif text-[22px] text-wd-text">
                    {project.title}
                  </h2>
                  <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-wd-muted">
                    {project.type}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`font-mono text-[8px] tracking-[0.1em] uppercase py-1 px-2 rounded border ${sc.color}`}
                >
                  {sc.label}
                </span>
                <button
                  onClick={onClose}
                  className="bg-wd-overlay/5 border border-wd-border rounded-[10px] w-[34px] h-[34px] text-wd-muted text-base flex items-center justify-center transition-all duration-200 hover:bg-wd-overlay/10 hover:text-wd-text hover:scale-105"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-0 border-b border-wd-border -mb-5">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`font-mono text-[10px] tracking-[0.1em] uppercase py-3 px-[18px] bg-transparent border-none transition-all duration-200 ${
                    tab === t.id
                      ? "text-wd-text"
                      : "text-wd-muted hover:text-wd-sub"
                  }`}
                  style={{
                    borderBottomWidth: 2,
                    borderBottomStyle: "solid",
                    borderBottomColor:
                      tab === t.id ? "#D4A843" : "transparent",
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-7">
            {/* Overview */}
            {tab === "overview" && (
              <div>
                {/* Progress */}
                <div className="mb-6">
                  <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted mb-2">
                    Progress
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-wd-overlay/[0.06] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-wd-gold rounded-full"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span className="font-mono text-sm text-wd-text">
                      {project.progress}%
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted mb-2">
                    Description
                  </div>
                  <p className="font-sans text-sm text-wd-sub leading-[1.7]">
                    {project.description}
                  </p>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-wd-overlay/[0.02] rounded-[10px] border border-wd-border p-4">
                    <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted mb-1">
                      Due Date
                    </div>
                    <div className="font-sans text-sm text-wd-text">
                      {project.dueDate}
                    </div>
                  </div>
                  <div className="bg-wd-overlay/[0.02] rounded-[10px] border border-wd-border p-4">
                    <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted mb-1">
                      Assigned To
                    </div>
                    <div className="font-sans text-sm text-wd-text">
                      {project.assignedTo}
                    </div>
                  </div>
                  <div className="bg-wd-overlay/[0.02] rounded-[10px] border border-wd-border p-4">
                    <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted mb-1">
                      Last Update
                    </div>
                    <div className="font-sans text-sm text-wd-text">
                      {project.lastUpdate}
                    </div>
                  </div>
                </div>

                {/* Deliverables */}
                <div>
                  <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted mb-3">
                    Deliverables
                  </div>
                  <div className="space-y-2">
                    {project.deliverables.map((d, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 py-2 px-3 rounded-lg bg-wd-overlay/[0.02]"
                      >
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] ${
                            d.complete
                              ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                              : "border-wd-border text-transparent"
                          }`}
                        >
                          {d.complete && "✓"}
                        </div>
                        <span
                          className={`font-sans text-sm ${
                            d.complete ? "text-wd-sub" : "text-wd-text"
                          }`}
                        >
                          {d.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Assets */}
            {tab === "assets" && (
              <div>
                {projectAssets.length === 0 ? (
                  <p className="font-sans text-sm text-wd-muted text-center py-8">
                    No assets uploaded yet.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {projectAssets.map((asset) => (
                      <div
                        key={asset.id}
                        className="flex items-center gap-4 py-3 px-4 rounded-lg bg-wd-overlay/[0.02] border border-wd-border"
                      >
                        <span className="text-xl">{asset.thumbnail}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-sans text-sm text-wd-text truncate">
                            {asset.name}
                          </p>
                          <span className="font-mono text-[9px] text-wd-muted">
                            {asset.type} · {asset.size} · {asset.date}
                          </span>
                        </div>
                        <button className="font-mono text-[9px] tracking-[0.05em] text-wd-gold hover:text-wd-text transition-colors bg-transparent border-none p-0">
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Feedback */}
            {tab === "feedback" && (
              <div>
                <div className="bg-wd-overlay/[0.02] border border-wd-border rounded-[14px] p-6 text-center mb-4">
                  <p className="font-sans text-sm text-wd-muted">
                    No feedback threads yet. Comments will appear here.
                  </p>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="flex-1 bg-wd-overlay/[0.03] border border-wd-border rounded-lg text-wd-text font-sans text-sm px-4 py-2.5 focus:border-wd-gold/50 outline-none transition-colors placeholder:text-wd-sub"
                  />
                  <button className="font-mono text-[10px] tracking-[0.1em] uppercase py-2.5 px-5 bg-wd-gold text-wd-bg font-bold rounded-lg transition-all hover:-translate-y-0.5">
                    Post
                  </button>
                </div>
              </div>
            )}

            {/* Timeline */}
            {tab === "timeline" && (
              <div className="space-y-0">
                {projectMilestones.map((milestone, i) => (
                  <div key={milestone.id} className="flex gap-4">
                    {/* Timeline line */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-3 h-3 rounded-full border-2 flex-shrink-0 ${
                          milestone.status === "complete"
                            ? "bg-emerald-400 border-emerald-400"
                            : milestone.status === "current"
                            ? "bg-wd-gold border-wd-gold"
                            : "bg-transparent border-wd-border"
                        }`}
                      />
                      {i < projectMilestones.length - 1 && (
                        <div className="w-px flex-1 bg-wd-border min-h-[40px]" />
                      )}
                    </div>
                    {/* Content */}
                    <div className="pb-6">
                      <p className="font-sans text-sm text-wd-text">
                        {milestone.name}
                      </p>
                      <span className="font-mono text-[9px] text-wd-muted">
                        {new Date(milestone.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
                {projectMilestones.length === 0 && (
                  <p className="font-sans text-sm text-wd-muted text-center py-8">
                    No milestones set yet.
                  </p>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
