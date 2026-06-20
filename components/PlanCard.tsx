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
    <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-800/30">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-800/50 transition"
      >
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-blue-400 text-xs font-bold">
            {day.day}
          </span>
          <div>
            <p className="text-sm font-medium text-white">{day.focus_area}</p>
            <p className="text-xs text-slate-400">{day.date} &middot; ~{day.estimated_hours}h</p>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-slate-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-slate-800 pt-3">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Topics</p>
            <div className="flex flex-wrap gap-1.5">
              {day.topics_to_cover.map((t, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-medium"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Activities</p>
            <ul className="space-y-1.5">
              {day.activities.map((a, i) => (
                <li key={i} className="text-sm text-slate-300 flex items-start gap-2.5">
                  <span className="mt-2 h-1 w-1 rounded-full bg-blue-400 shrink-0" />
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

function WeekBlock({ week, days }: { week: number; days: DayPlan[] }) {
  const firstDate = days[0]?.date ?? "";
  const lastDate = days[days.length - 1]?.date ?? "";

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3 mb-1">
        <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500/15 to-indigo-500/15 text-blue-400 text-xs font-bold">
          {week}
        </span>
        <p className="text-sm font-semibold text-white">Week {week}</p>
        <span className="text-xs text-slate-500">
          {firstDate} — {lastDate}
        </span>
      </div>
      <div className="space-y-2 pl-3 border-l border-slate-800/60">
        {days.map((day) => (
          <DayAccordion key={day.day} day={day} />
        ))}
      </div>
    </div>
  );
}

export default function PlanCard({ plan, onDelete }: PlanCardProps) {
  const weeks = plan.schedule?.reduce<{ week: number; days: DayPlan[] }[]>((acc, day) => {
    const weekNum = day.week || Math.ceil(day.day / 7);
    const existing = acc.find((w) => w.week === weekNum);
    if (existing) {
      existing.days.push(day);
    } else {
      acc.push({ week: weekNum, days: [day] });
    }
    return acc;
  }, []);

  return (
    <div className="group rounded-2xl border border-slate-800 bg-[#161B26] overflow-hidden hover:border-slate-700 transition-all duration-300">
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-white truncate">{plan.subject}</h3>
            <p className="text-sm text-slate-400 mt-0.5 line-clamp-2">{plan.topics}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-400 text-xs font-medium border border-blue-500/10">
              {plan.days_until_exam} days
            </span>
            {onDelete && (
              <button
                onClick={onDelete}
                className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition"
                title="Delete plan"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm text-slate-400">
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Exam: {plan.exam_date}
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {plan.hours_per_day}h/day
          </span>
          {plan.schedule && (
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {plan.schedule.length} days planned
            </span>
          )}
        </div>
      </div>
      {weeks && weeks.length > 0 && (
        <div className="p-5 space-y-5">
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-gradient-to-r from-blue-500/20 to-transparent" />
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Study Roadmap
            </p>
            <div className="h-px flex-1 bg-gradient-to-l from-blue-500/20 to-transparent" />
          </div>
          {weeks.map((w) => (
            <WeekBlock key={w.week} week={w.week} days={w.days} />
          ))}
        </div>
      )}
    </div>
  );
}
