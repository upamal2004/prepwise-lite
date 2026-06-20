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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <section className="max-w-6xl mx-auto px-4 pt-16 pb-12 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Smart Study Plans,
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
            Powered by AI
          </span>
        </h1>
        <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
          Tell us what you&apos;re studying and when your exam is. We&apos;ll
          generate a personalized day-by-day plan to help you prepare.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          <div className="w-full lg:w-1/2 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-6">
                Create New Plan
              </h2>
              <StudyForm onPlanGenerated={handlePlanGenerated} />
            </div>
          </div>
          <div className="w-full lg:w-1/2 space-y-6">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              {recentPlans.length > 0 ? "Recent Plans" : "Your Plans"}
            </h2>
            {recentPlans.length > 0 ? (
              recentPlans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-700 p-12 text-center">
                <p className="text-zinc-400 dark:text-zinc-500">
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
