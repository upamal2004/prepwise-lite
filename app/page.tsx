"use client";

import { useEffect, useState } from "react";
import StudyForm from "@/components/StudyForm";
import PlanCard from "@/components/PlanCard";
import type { StudyPlan } from "@/lib/types";

const STORAGE_KEY = "prepwise-study-plans";

export default function Home() {
  const [recentPlans, setRecentPlans] = useState<StudyPlan[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const plans: StudyPlan[] = JSON.parse(raw);
      plans.sort(
        (a, b) =>
          new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime()
      );
      setRecentPlans(plans.slice(0, 3));
    } catch {
      // ignore
    }
  }, []);

  const handlePlanGenerated = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const plans: StudyPlan[] = JSON.parse(raw);
      plans.sort(
        (a, b) =>
          new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime()
      );
      setRecentPlans(plans.slice(0, 3));
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17]">
      <section className="relative max-w-6xl mx-auto px-4 pt-20 pb-14 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-800 bg-[#161B26] text-xs font-medium text-slate-400 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          AI-Powered Study Planning
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
          Smart Study Plans,
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
            Powered by AI
          </span>
        </h1>
        <p className="mt-5 text-base sm:text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
          Tell us what you&apos;re studying and when your exam is. We&apos;ll
          generate a personalized day-by-day plan to help you prepare.
        </p>
      </section>

      <section className="relative max-w-6xl mx-auto px-4 pb-20">
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          <div className="w-full lg:w-1/2 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-slate-800 bg-[#161B26] p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-7">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-white">
                  Create New Plan
                </h2>
              </div>
              <StudyForm onPlanGenerated={handlePlanGenerated} />
            </div>
          </div>
          <div className="w-full lg:w-1/2 space-y-5">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-slate-800 to-transparent" />
              <h2 className="text-lg font-semibold text-white">
                {recentPlans.length > 0 ? "Recent Plans" : "Your Plans"}
              </h2>
              <div className="h-px flex-1 bg-gradient-to-l from-slate-800 to-transparent" />
            </div>
            {recentPlans.length > 0 ? (
              recentPlans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-800 bg-[#161B26]/50 p-14 text-center">
                <div className="w-12 h-12 rounded-xl bg-slate-800/50 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-slate-500 text-sm">
                  No plans yet. Generate your first study plan above!
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
