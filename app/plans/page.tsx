"use client";

import { useEffect, useState, useCallback } from "react";
import PlanCard from "@/components/PlanCard";
import { getSupabaseClient } from "@/lib/supabase";
import type { StudyPlan } from "@/lib/types";

export default function PlansPage() {
  const [plans, setPlans] = useState<StudyPlan[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlans = useCallback(async () => {
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
      console.error("Supabase error:", err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handleDelete = async (id: string) => {
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.from("plans").delete().eq("id", id);
      if (error) {
        console.error("Supabase delete error:", error);
        return;
      }
      setPlans((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleClearAll = async () => {
    if (plans.length === 0) return;
    const confirmed = window.confirm(
      `Are you sure you want to delete all ${plans.length} study plans? This cannot be undone.`
    );
    if (!confirmed) return;
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.from("plans").delete().not("id", "is", null);
      if (error) {
        console.error("Supabase clear-all error:", error);
        return;
      }
      setPlans([]);
    } catch (err) {
      console.error("Clear all error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17]">
      <div className="relative max-w-4xl mx-auto px-4 py-14">
        <div className="flex items-center gap-4 mb-2">
          <div className="h-px flex-1 bg-gradient-to-r from-blue-500/20 to-transparent" />
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div className="h-px flex-1 bg-gradient-to-l from-blue-500/20 to-transparent" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white text-center mt-4">
          Saved Study Plans
        </h1>
        <p className="text-slate-400 text-center mt-2 mb-10">
          All your generated study plans in one place.
        </p>

        {loading ? (
          <div className="flex items-center justify-center py-16 sm:py-24">
            <div className="relative">
              <div className="w-10 h-10 rounded-full border-2 border-slate-800 border-t-blue-500 animate-spin" />
            </div>
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-16 sm:py-24">
            <div className="w-16 h-16 rounded-2xl bg-[#161B26] border border-slate-800 flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-slate-400 text-lg">No study plans yet.</p>
            <p className="text-slate-500 text-sm mt-1">
              Generate your first plan from the home page.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-end mb-5">
              <button
                onClick={handleClearAll}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-900/40 text-red-400 text-xs font-medium hover:bg-red-500/10 hover:border-red-700/60 transition"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear All
              </button>
            </div>
            <div className="space-y-5">
              {plans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  onDelete={plan.id ? () => handleDelete(plan.id!) : undefined}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
