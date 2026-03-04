"use client";

import Link from "next/link";
import {
  mockProjects,
  mockActivity,
  mockMilestones,
  mockAssets,
  statusConfig,
} from "@/data/studio-mock";

const activeProjects = mockProjects.filter((p) => p.status !== "delivered");
const totalAssetsDelivered = mockAssets.length;
const nextMilestone = mockMilestones
  .filter((m) => m.status !== "complete")
  .sort((a, b) => a.date.localeCompare(b.date))[0];

const stats = [
  { label: "Active Projects", value: String(activeProjects.length) },
  { label: "Assets Delivered", value: String(totalAssetsDelivered) },
  {
    label: "Next Milestone",
    value: nextMilestone
      ? new Date(nextMilestone.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      : "—",
  },
  {
    label: "Next Event",
    value: "AUSA Oct 10",
  },
];

const activityIcons: Record<string, string> = {
  asset_upload: "📎",
  feedback_request: "💬",
  invoice_paid: "✓",
  milestone_complete: "◆",
  project_created: "✦",
  delivery: "📦",
};

export default function StudioDashboard() {
  return (
    <div className="p-6 md:p-10 max-w-6xl">
      {/* Header */}
      <div className="mb-10">
        <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-wd-gold mb-2">
          Studio
        </p>
        <h1 className="font-serif text-3xl text-wd-text">
          Production Dashboard
        </h1>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-wd-card border border-wd-border rounded-[14px] p-5"
          >
            <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted">
              {stat.label}
            </div>
            <div className="font-serif text-2xl text-wd-text mt-1">
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Active Projects */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-mono text-[10px] tracking-[0.35em] uppercase text-wd-sub">
            Active Projects
          </h2>
          <Link
            href="/studio-portal/projects"
            className="font-mono text-[10px] tracking-[0.05em] text-wd-gold hover:text-wd-text transition-colors"
          >
            View all &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeProjects.slice(0, 4).map((project) => {
            const sc = statusConfig[project.status] || statusConfig.in_progress;
            return (
              <Link
                key={project.id}
                href="/studio-portal/projects"
                className="bg-wd-card border border-wd-border rounded-[14px] p-6 hover:border-wd-border-hov transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{project.thumbnail}</span>
                    <div>
                      <p className="font-sans text-sm text-wd-text group-hover:text-wd-gold transition-colors">
                        {project.title}
                      </p>
                      <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-wd-muted">
                        {project.type}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`font-mono text-[8px] tracking-[0.1em] uppercase py-1 px-2 rounded border ${sc.color}`}
                  >
                    {sc.label}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mb-2">
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
                      className="h-full bg-wd-gold rounded-full transition-all duration-500"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between font-mono text-[9px] text-wd-muted">
                  <span>Due {project.dueDate}</span>
                  <span>{project.assignedTo}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Recent Activity */}
      <section>
        <h2 className="font-mono text-[10px] tracking-[0.35em] uppercase text-wd-sub mb-4">
          Recent Activity
        </h2>
        <div className="bg-wd-card border border-wd-border rounded-[14px] overflow-hidden">
          {mockActivity.map((activity, i) => (
            <div
              key={activity.id}
              className={`flex items-start gap-3 px-5 py-4 ${
                i < mockActivity.length - 1 ? "border-b border-wd-border" : ""
              }`}
            >
              <span className="text-sm mt-0.5">
                {activityIcons[activity.type] || "•"}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-sans text-sm text-wd-text">
                  {activity.text}
                </p>
                {activity.project && (
                  <span className="font-mono text-[9px] text-wd-gold">
                    {activity.project}
                  </span>
                )}
              </div>
              <span className="font-mono text-[9px] text-wd-muted flex-shrink-0">
                {activity.time}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
