"use client";

export default function PlannerForm() {
  return (
    <form className="space-y-8 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block font-medium">
            Destination
          </label>

          <input
            className="w-full rounded-lg border border-slate-300 p-3"
            placeholder="Goa"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Budget
          </label>

          <input
            type="number"
            className="w-full rounded-lg border border-slate-300 p-3"
            placeholder="20000"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Start Date
          </label>

          <input
            type="date"
            className="w-full rounded-lg border border-slate-300 p-3"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            End Date
          </label>

          <input
            type="date"
            className="w-full rounded-lg border border-slate-300 p-3"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Travelers
          </label>

          <input
            type="number"
            min={1}
            className="w-full rounded-lg border border-slate-300 p-3"
            placeholder="2"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Travel Style
          </label>

          <select className="w-full rounded-lg border border-slate-300 p-3">
            <option>Budget</option>
            <option>Standard</option>
            <option>Luxury</option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-3 block font-medium">
          Interests
        </label>

        <div className="flex flex-wrap gap-3">
          {[
            "Adventure",
            "Nature",
            "Food",
            "Culture",
            "Shopping",
            "Photography",
          ].map((interest) => (
            <button
              key={interest}
              type="button"
              className="rounded-full border border-slate-300 px-4 py-2 hover:bg-slate-100"
            >
              {interest}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700"
      >
        Generate AI Trip
      </button>
    </form>
  );
}