"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";
import PlanCard from "@/components/PlanCard";
import type { StudyPlan } from "@/lib/types";

export default function PlansPage() {
  const [plans, setPlans] = useState<StudyPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from("plans")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching plans:", error);
        } else {
          setPlans(data as unknown as StudyPlan[]);
        }
      } catch (err) {
        console.error("Supabase not configured:", err);
      }
      setLoading(false);
    };

    fetchPlans();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Saved Study Plans</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8">All your generated study plans in one place.</p>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-400 dark:text-zinc-500 text-lg">No study plans yet.</p>
            <p className="text-zinc-400 dark:text-zinc-500 text-sm mt-1">Generate your first plan from the home page.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
