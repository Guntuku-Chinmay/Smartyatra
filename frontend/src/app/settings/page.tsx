"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { Sun, Moon, Bell, ShieldAlert, Trash2, Check } from "lucide-react";
import Button from "@/components/ui/Button";

export default function SettingsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [lang, setLang] = useState<string>("English");
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState(true);
  const [newsletter, setNewsletter] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-slate-600 font-semibold">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 text-slate-800">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight">Settings</h1>
        <p className="mt-2 text-slate-600 font-medium">
          Customize your application configuration, alerts, and system display.
        </p>
      </div>

      {saveSuccess && (
        <div className="mb-6 rounded-lg bg-emerald-50 border border-emerald-100 p-4 text-emerald-700 font-semibold flex items-center gap-2">
          <Check className="h-5 w-5" />
          <span>System settings updated successfully!</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Appearance Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Sun className="h-5 w-5 text-blue-600" />
            <span>Appearance & Theme</span>
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            Toggle color theme preferences and set system display language.
          </p>

          <div className="grid gap-6 md:grid-cols-2 pt-2">
            <div>
              <label className="mb-2 block font-semibold text-slate-700">Interface Theme</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-bold transition ${
                    theme === "light"
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <Sun className="h-4 w-4" />
                  <span>Light Mode</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-bold transition ${
                    theme === "dark"
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <Moon className="h-4 w-4" />
                  <span>Dark Mode</span>
                </button>
              </div>
            </div>

            <div>
              <label className="mb-2 block font-semibold text-slate-700">Display Language</label>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2.5 bg-white text-slate-800 outline-none focus:border-blue-500"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi (हिन्दी)</option>
                <option value="Spanish">Spanish (Español)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-600" />
            <span>Notification Alerts</span>
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            Choose what alerts and recommendations you would like to receive.
          </p>

          <div className="space-y-4 pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={budgetAlerts}
                onChange={(e) => setBudgetAlerts(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="font-semibold text-slate-700 text-sm">
                Enable budget expenditure warning limits
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={aiSuggestions}
                onChange={(e) => setAiSuggestions(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="font-semibold text-slate-700 text-sm">
                Receive personalized AI recommendations notifications
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={newsletter}
                onChange={(e) => setNewsletter(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="font-semibold text-slate-700 text-sm">
                Subscribe to weekly newsletter for hot travel spots
              </span>
            </label>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-2xl border border-red-200 bg-red-50/20 p-6 shadow-sm space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2 text-red-700">
            <ShieldAlert className="h-5 w-5" />
            <span>Danger Zone</span>
          </h2>
          <p className="text-sm text-red-600 font-medium">
            Irreversible operations on account credentials and trip log database storage.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Button className="bg-white border border-red-200 text-red-700 hover:bg-red-50 px-4 py-2 text-sm font-semibold flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              <span>Clear Travel Plan Cache</span>
            </Button>

            <Button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm font-bold flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              <span>Deactivate Account</span>
            </Button>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 shadow-md shadow-blue-500/20"
          >
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
