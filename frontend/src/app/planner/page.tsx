"use client";

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

      <PlannerForm />
    </main>
  );
}