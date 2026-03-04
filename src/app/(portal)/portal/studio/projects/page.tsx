"use client";

import { useState } from "react";
import { mockProjects, statusConfig } from "@/data/studio-mock";
import ProjectDetailModal from "@/components/studio/ProjectDetailModal";
import type { StudioProject } from "@/data/studio-mock";

const statusFilters = ["All", "in_progress", "review", "delivered", "production", "briefing"];
const typeFilters = ["All", "Booth", "Film", "Campaign"];

const statusLabels: Record<string, string> = {
  All: "All",
  in_progress: "Active",
  review: "In Review",
  delivered: "Delivered",
  production: "Production",
  briefing: "Briefing",
};

export default function StudioProjectsPage() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState<StudioProject | null>(null);

  const filtered = mockProjects.filter((p) => {
    if (statusFilter !== "All" && p.status !== statusFilter) return false;
    if (typeFilter !== "All" && p.type !== typeFilter) return false;
    return true;
  });

  return (
    <>
      <div className="p-6 md:p-10 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-wd-gold mb-2">
            Projects
          </p>
          <h1 className="font-serif text-3xl text-wd-text">
            Your Productions
          </h1>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-6 mb-8">
          <div className="flex flex-wrap gap-1.5">
            {statusFilters.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`font-mono text-[10px] tracking-[0.05em] uppercase py-2 px-3 rounded-lg border transition-all duration-200 ${
                  statusFilter === s
                    ? "border-wd-gold bg-wd-gold-glow text-wd-gold"
                    : "border-wd-border bg-wd-overlay/[0.02] text-wd-muted hover:border-wd-border-hov hover:text-wd-sub"
                }`}
              >
                {statusLabels[s] || s}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {typeFilters.map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`font-mono text-[10px] tracking-[0.05em] uppercase py-2 px-3 rounded-lg border transition-all duration-200 ${
                  typeFilter === t
                    ? "border-wd-gold bg-wd-gold-glow text-wd-gold"
                    : "border-wd-border bg-wd-overlay/[0.02] text-wd-muted hover:border-wd-border-hov hover:text-wd-sub"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((project) => {
            const sc =
              statusConfig[project.status] || statusConfig.in_progress;
            return (
              <button
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="bg-wd-card border border-wd-border rounded-[14px] p-6 hover:border-wd-border-hov hover:-translate-y-0.5 transition-all text-left group"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">{project.thumbnail}</span>
                  <span
                    className={`font-mono text-[8px] tracking-[0.1em] uppercase py-1 px-2 rounded border ${sc.color}`}
                  >
                    {sc.label}
                  </span>
                </div>
                <h3 className="font-sans text-sm text-wd-text group-hover:text-wd-gold transition-colors mb-1">
                  {project.title}
                </h3>
                <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-wd-muted block mb-3">
                  {project.type}
                </span>

                {/* Progress */}
                <div className="mb-3">
                  <div className="flex justify-between mb-1">
                    <span className="font-mono text-[9px] text-wd-muted">
                      Progress
                    </span>
                    <span className="font-mono text-[9px] text-wd-text">
                      {project.progress}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-wd-overlay/[0.06] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-wd-gold rounded-full"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between font-mono text-[9px] text-wd-muted">
                  <span>Due {project.dueDate}</span>
                  <span>{project.assignedTo}</span>
                </div>
              </button>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="bg-wd-card border border-wd-border rounded-[14px] p-10 text-center">
            <p className="font-sans text-sm text-wd-muted">
              No projects match the selected filters.
            </p>
          </div>
        )}
      </div>

      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  );
}
