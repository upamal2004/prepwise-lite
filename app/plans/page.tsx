"use client";

import { useEffect, useState } from "react";
import PlanCard from "@/components/PlanCard";
import type { StudyPlan } from "@/lib/types";

const STORAGE_KEY = "prepwise-study-plans";

export default function PlansPage() {
  const [plans, setPlans] = useState<StudyPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: StudyPlan[] = JSON.parse(raw);
        parsed.sort(
          (a, b) =>
            new Date(b.created_at!).getTime() -
            new Date(a.created_at!).getTime()
        );
        setPlans(parsed);
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }, []);

  const handleDelete = (id: string) => {
    const updated = plans.filter((p) => p.id !== id);
    setPlans(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          Saved Study Plans
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8">
          All your generated study plans in one place.
        </p>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <svg
              className="animate-spin h-8 w-8 text-blue-500"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-400 dark:text-zinc-500 text-lg">
              No study plans yet.
            </p>
            <p className="text-zinc-400 dark:text-zinc-500 text-sm mt-1">
              Generate your first plan from the home page.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onDelete={plan.id ? () => handleDelete(plan.id!) : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
