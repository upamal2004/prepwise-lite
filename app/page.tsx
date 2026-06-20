"use client";

import { useEffect, useState, useCallback } from "react";
import StudyForm from "@/components/StudyForm";
import PlanCard from "@/components/PlanCard";
import { getSupabaseClient } from "@/lib/supabase";
import type { StudyPlan } from "@/lib/types";

export default function Home() {
  const [recentPlans, setRecentPlans] = useState<StudyPlan[]>([]);

  const fetchRecentPlans = useCallback(async () => {
    try {
      const supabase = getSupabaseClient();
      const { data } = await supabase
        .from("plans")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);
      setRecentPlans((data as unknown as StudyPlan[]) || []);
    } catch {
      // Supabase not configured
    }
  }, []);

  useEffect(() => {
    fetchRecentPlans();
  }, [fetchRecentPlans]);

  const features = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Dynamic Progress Tracking",
      description: "Break down your syllabus into clear milestone structures. Monitor your advancement week by week and stay on top of every topic before the exam.",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: "Precision Scheduling",
      description: "Tailored daily targets that match your exam deadline perfectly. Every session is calibrated to your available hours so nothing falls through the cracks.",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: "Optimized Retention",
      description: "Built-in pacing to reduce study burnout and maximize focus. Alternating review and new material ensures you retain more with less fatigue.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F17]">
      {/* ── Hero ── */}
      <section className="relative max-w-6xl mx-auto px-4 pt-16 sm:pt-20 pb-12 sm:pb-14 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-800 bg-[#161B26] text-xs font-medium text-slate-400 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          AI-Powered Study Planning
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight">
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

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:gap-x-10">
          {features.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-slate-400">
              <span className="w-4 h-4 text-blue-400 shrink-0">{item.icon}</span>
              <span className="text-xs sm:text-sm font-medium">{item.title}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Create & Recent Plans ── */}
      <section className="relative max-w-6xl mx-auto px-4 pb-20">
        <div className="flex flex-col lg:flex-row gap-8 sm:gap-10 items-start">
          <div className="w-full lg:w-1/2 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-slate-800 bg-[#161B26] p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-7">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-white">Create New Plan</h2>
              </div>
              <StudyForm onPlanGenerated={fetchRecentPlans} />
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
              <div className="rounded-2xl border border-dashed border-slate-800 bg-[#161B26]/50 p-8 sm:p-14 text-center">
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
