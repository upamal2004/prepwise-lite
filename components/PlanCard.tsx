"use client";

import { useState } from "react";
import type { StudyPlan, DayPlan } from "@/lib/types";

interface PlanCardProps {
  plan: StudyPlan;
  onDelete?: () => void;
}

function DayAccordion({ day }: { day: DayPlan }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition"
      >
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-bold">
            {day.day}
          </span>
          <div>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{day.focus_area}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{day.date} &middot; ~{day.estimated_hours}h</p>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-zinc-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-zinc-200 dark:border-zinc-700 pt-3">
          <div>
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Topics</p>
            <div className="flex flex-wrap gap-1.5">
              {day.topics_to_cover.map((t, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Activities</p>
            <ul className="space-y-1">
              {day.activities.map((a, i) => (
                <li key={i} className="text-sm text-zinc-700 dark:text-zinc-300 flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PlanCard({ plan, onDelete }: PlanCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 overflow-hidden shadow-sm">
      <div className="p-5 border-b border-zinc-200 dark:border-zinc-700">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{plan.subject}</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">{plan.topics}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium">
              {plan.days_until_exam} days
            </span>
            {onDelete && (
              <button
                onClick={onDelete}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                title="Delete plan"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>
        <div className="flex gap-4 mt-3 text-sm text-zinc-500 dark:text-zinc-400">
          <span>Exam: {plan.exam_date}</span>
          <span>&middot;</span>
          <span>{plan.hours_per_day}h/day</span>
          {plan.schedule && (
            <>
              <span>&middot;</span>
              <span>{plan.schedule.length} days planned</span>
            </>
          )}
        </div>
      </div>
      {plan.schedule && plan.schedule.length > 0 && (
        <div className="p-5 space-y-2">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
            Study Schedule
          </p>
          {plan.schedule.map((day) => (
            <DayAccordion key={day.day} day={day} />
          ))}
        </div>
      )}
    </div>
  );
}
