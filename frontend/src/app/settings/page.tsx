"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sun, Moon, Bell, ShieldAlert, Trash2, Check, Sparkles, Loader2, Globe } from "lucide-react";

import { useAuthStore } from "@/store/auth.store";

export default function SettingsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [lang, setLang] = useState<string>("English");
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState(true);
  const [newsletter, setNewsletter] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const handleSave = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSubmitting(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-slate-500 font-semibold">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-10">
        <h1 className="font-display text-4xl font-black text-slate-900">Settings</h1>
        <p className="mt-2 text-sm font-semibold text-slate-500">
          Customize your application configuration, alerts, and system display.
        </p>
      </div>

      {saveSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-xl bg-emerald-50 border border-emerald-100 p-4 text-emerald-700 font-bold flex items-center gap-2 text-sm"
        >
          <Check className="h-5 w-5" />
          <span>System settings updated successfully!</span>
        </motion.div>
      )}

      <div className="space-y-6">
        {/* Appearance Card */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-display text-lg font-bold flex items-center gap-2 text-slate-800">
            <Sun className="h-5 w-5 text-blue-600 animate-spin" style={{ animationDuration: "12s" }} />
            <span>Appearance & Theme</span>
          </h2>
          <p className="text-xs font-semibold text-slate-400">
            Toggle color theme preferences and set system display language.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 pt-2">
            <div>
              <label className="block text-sm font-bold text-slate-700">Interface Theme</label>
              <div className="flex gap-3 mt-2.5">
                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                    theme === "light"
                      ? "border-blue-600 bg-blue-50/50 text-blue-600 shadow-sm"
                      : "border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  <Sun className="h-4 w-4" />
                  <span>Light Mode</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                    theme === "dark"
                      ? "border-blue-600 bg-blue-50/50 text-blue-600 shadow-sm"
                      : "border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  <Moon className="h-4 w-4" />
                  <span>Dark Mode</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700">Display Language</label>
              <div className="relative mt-2">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Globe className="h-4 w-4" />
                </span>
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/30 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:bg-white focus:ring-4 focus:border-blue-500 focus:ring-blue-500/10"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi (हिन्दी)</option>
                  <option value="Spanish">Spanish (Español)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Card */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-display text-lg font-bold flex items-center gap-2 text-slate-800">
            <Bell className="h-5 w-5 text-blue-600" />
            <span>Notification Alerts</span>
          </h2>
          <p className="text-xs font-semibold text-slate-400">
            Choose what alerts and recommendations you would like to receive.
          </p>

          <div className="space-y-4 pt-2">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={budgetAlerts}
                onChange={(e) => setBudgetAlerts(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="font-semibold text-slate-700 text-xs">
                Enable budget expenditure warning limits
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={aiSuggestions}
                onChange={(e) => setAiSuggestions(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="font-semibold text-slate-700 text-xs">
                Receive personalized AI recommendations notifications
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={newsletter}
                onChange={(e) => setNewsletter(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="font-semibold text-slate-700 text-xs">
                Subscribe to weekly newsletter for hot travel spots
              </span>
            </label>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-3xl border border-rose-100 bg-rose-50/20 p-6 shadow-sm space-y-4">
          <h2 className="font-display text-lg font-bold flex items-center gap-2 text-rose-700">
            <ShieldAlert className="h-5 w-5" />
            <span>Danger Zone</span>
          </h2>
          <p className="text-xs font-semibold text-rose-600/80">
            Irreversible operations on account credentials and trip log database storage.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button className="flex items-center gap-2 rounded-xl border border-rose-200 bg-white hover:bg-rose-50 text-rose-700 font-bold px-4 py-2.5 text-xs transition-colors cursor-pointer shadow-sm">
              <Trash2 className="h-4 w-4" />
              <span>Clear Travel Plan Cache</span>
            </button>

            <button className="flex items-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2.5 text-xs transition-colors cursor-pointer shadow-sm">
              <Trash2 className="h-4 w-4" />
              <span>Deactivate Account</span>
            </button>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 disabled:opacity-50 transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Saving settings...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                <span>Save Settings</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
