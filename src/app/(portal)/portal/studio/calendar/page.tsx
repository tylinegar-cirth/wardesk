"use client";

import { useState } from "react";
import { mockMilestones } from "@/data/studio-mock";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const dayHeaders = ["S", "M", "T", "W", "T", "F", "S"];

function getDays(d: Date) {
  const y = d.getFullYear(),
    m = d.getMonth();
  const first = new Date(y, m, 1);
  const last = new Date(y, m + 1, 0);
  const ds: (Date | null)[] = [];
  for (let i = 0; i < first.getDay(); i++) ds.push(null);
  for (let i = 1; i <= last.getDate(); i++) ds.push(new Date(y, m, i));
  return ds;
}

function sameDay(a: Date | null, b: Date | null) {
  return (
    a &&
    b &&
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()
  );
}

const milestoneColors: Record<string, string> = {
  complete: "bg-emerald-400",
  current: "bg-wd-gold",
  upcoming: "bg-wd-muted",
};

export default function StudioCalendarPage() {
  const [view, setView] = useState<"month" | "list">("month");
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 2, 1)); // March 2026
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const days = getDays(currentMonth);

  // Get milestones for a specific date
  function getMilestonesForDate(date: Date) {
    return mockMilestones.filter((m) => {
      const md = new Date(m.date);
      return sameDay(md, date);
    });
  }

  // Get milestones for the current month view
  function getMilestonesForMonth() {
    return mockMilestones
      .filter((m) => {
        const md = new Date(m.date);
        return (
          md.getMonth() === currentMonth.getMonth() &&
          md.getFullYear() === currentMonth.getFullYear()
        );
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  // All milestones sorted for list view
  const allMilestones = [...mockMilestones].sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  const selectedMilestones = selectedDate
    ? getMilestonesForDate(selectedDate)
    : [];

  return (
    <div className="p-6 md:p-10 max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-wd-gold mb-2">
            Calendar
          </p>
          <h1 className="font-serif text-3xl text-wd-text">
            Production Timeline
          </h1>
        </div>

        {/* View toggle */}
        <div className="flex gap-1 bg-wd-card border border-wd-border rounded-lg p-1">
          {(["month", "list"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`font-mono text-[10px] tracking-[0.05em] uppercase py-2 px-4 rounded-md transition-all duration-200 ${
                view === v
                  ? "bg-wd-gold-glow text-wd-gold"
                  : "text-wd-muted hover:text-wd-sub"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Month View */}
      {view === "month" && (
        <div className="bg-wd-card border border-wd-border rounded-[14px] p-6">
          {/* Month nav */}
          <div className="flex justify-between items-center mb-5">
            <button
              className="bg-wd-overlay/[0.04] border border-wd-border text-wd-muted text-base py-1.5 px-3.5 rounded-lg transition-all duration-200 hover:bg-wd-overlay/[0.08] hover:text-wd-text"
              onClick={() =>
                setCurrentMonth(
                  new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() - 1
                  )
                )
              }
            >
              ←
            </button>
            <span className="font-serif text-lg text-wd-text">
              {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
            <button
              className="bg-wd-overlay/[0.04] border border-wd-border text-wd-muted text-base py-1.5 px-3.5 rounded-lg transition-all duration-200 hover:bg-wd-overlay/[0.08] hover:text-wd-text"
              onClick={() =>
                setCurrentMonth(
                  new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() + 1
                  )
                )
              }
            >
              →
            </button>
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-0.5 mb-4">
            {dayHeaders.map((d, i) => (
              <div
                key={i}
                className="text-center font-mono text-[9px] text-wd-muted p-2"
              >
                {d}
              </div>
            ))}
            {days.map((d, i) => {
              const milestones = d ? getMilestonesForDate(d) : [];
              const isSelected = sameDay(d, selectedDate);
              return (
                <button
                  key={i}
                  onClick={() => d && setSelectedDate(d)}
                  disabled={!d}
                  className={`font-sans text-xs p-2.5 border-none bg-transparent rounded-lg transition-all duration-150 relative ${
                    isSelected
                      ? "bg-wd-gold text-wd-bg"
                      : !d
                      ? "text-transparent cursor-default"
                      : "text-wd-text hover:bg-wd-overlay/5"
                  }`}
                >
                  {d ? d.getDate() : ""}
                  {milestones.length > 0 && (
                    <div className="flex gap-0.5 justify-center mt-0.5">
                      {milestones.map((m) => (
                        <div
                          key={m.id}
                          className={`w-1 h-1 rounded-full ${
                            isSelected
                              ? "bg-wd-bg"
                              : milestoneColors[m.status] || "bg-wd-muted"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected date milestones */}
          {selectedDate && selectedMilestones.length > 0 && (
            <div className="border-t border-wd-border pt-4 mt-2">
              <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted mb-3">
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="space-y-2">
                {selectedMilestones.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center gap-3 py-2 px-3 rounded-lg bg-wd-overlay/[0.02]"
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        milestoneColors[m.status]
                      }`}
                    />
                    <div className="flex-1">
                      <p className="font-sans text-sm text-wd-text">
                        {m.name}
                      </p>
                      <span className="font-mono text-[9px] text-wd-gold">
                        {m.project}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Month milestones summary */}
          {!selectedDate && getMilestonesForMonth().length > 0 && (
            <div className="border-t border-wd-border pt-4 mt-2">
              <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted mb-3">
                This Month
              </div>
              <div className="space-y-2">
                {getMilestonesForMonth().map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center gap-3 py-2 px-3 rounded-lg bg-wd-overlay/[0.02]"
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        milestoneColors[m.status]
                      }`}
                    />
                    <div className="flex-1">
                      <p className="font-sans text-sm text-wd-text">
                        {m.name}
                      </p>
                      <span className="font-mono text-[9px] text-wd-gold">
                        {m.project}
                      </span>
                    </div>
                    <span className="font-mono text-[9px] text-wd-muted">
                      {new Date(m.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* List View */}
      {view === "list" && (
        <div className="bg-wd-card border border-wd-border rounded-[14px] overflow-hidden">
          {allMilestones.map((milestone, i) => {
            const date = new Date(milestone.date);
            return (
              <div
                key={milestone.id}
                className={`flex items-center gap-4 px-6 py-4 ${
                  i < allMilestones.length - 1
                    ? "border-b border-wd-border"
                    : ""
                }`}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                    milestoneColors[milestone.status]
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-sm text-wd-text">
                    {milestone.name}
                  </p>
                  <span className="font-mono text-[9px] text-wd-gold">
                    {milestone.project}
                  </span>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-mono text-[10px] text-wd-text">
                    {date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <span className="font-mono text-[9px] text-wd-muted">
                    {date.getFullYear()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
