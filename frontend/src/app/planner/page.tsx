"use client";

import { Suspense } from "react";
import PlannerForm from "@/components/planner/PlannerForm";

export default function PlannerPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold">
          AI Trip Planner
        </h1>

        <p className="mt-3 text-slate-600">
          Plan your perfect journey with AI-powered recommendations.
        </p>
      </div>

      <Suspense fallback={
        <div className="w-full max-w-3xl mx-auto rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-md animate-pulse">
          <div className="h-6 w-1/3 rounded bg-slate-200 mx-auto mb-4"></div>
          <div className="h-10 w-full rounded bg-slate-200 mb-6"></div>
          <div className="h-10 w-full rounded bg-slate-200"></div>
        </div>
      }>
        <PlannerForm />
      </Suspense>
    </main>
  );
}