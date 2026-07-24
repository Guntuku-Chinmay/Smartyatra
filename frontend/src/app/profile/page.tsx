"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { User as UserIcon, Shield, Key, Check, Mail, Coins, MapPin, Sparkles, Loader2 } from "lucide-react";

import { useAuthStore } from "@/store/auth.store";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  budget: z.number().min(1000, "Minimum budget is ₹1,000"),
  homeCity: z.string().min(2, "Home city is required"),
  travelStyle: z.string(),
});

type ProfileInput = z.infer<typeof profileSchema>;

const availableInterests = [
  "Adventure",
  "Nature",
  "Food",
  "Culture",
  "Shopping",
  "Photography",
];

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, user, updateProfile, updatePreferences } = useAuthStore();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // Set default values when user loads
  useEffect(() => {
    if (user) {
      setValue("name", user.name);
      setValue("email", user.email);
      setValue("budget", user.preferences.budget);
      setValue("homeCity", user.preferences.homeCity);
      setValue("travelStyle", user.preferences.travelStyle);
      
      const interests = user.preferences.interests || [];
      setTimeout(() => {
        setSelectedInterests(interests);
      }, 0);
    }
  }, [user, setValue]);

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const onSubmit = async (data: ProfileInput) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    updateProfile(data.name, data.email);
    updatePreferences({
      budget: data.budget,
      homeCity: data.homeCity,
      travelStyle: data.travelStyle,
      interests: selectedInterests,
    });
    setIsSubmitting(false);

    setSuccessMsg("Profile and preferences updated successfully!");
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  if (!isAuthenticated || !user) {
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
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-10">
        <h1 className="font-display text-4xl font-black text-slate-900">Your Profile</h1>
        <p className="mt-2 text-sm font-semibold text-slate-500">
          Manage your personal details and custom AI travel preferences.
        </p>
      </div>

      {successMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-xl bg-emerald-50 border border-emerald-100 p-4 text-emerald-700 font-bold flex items-center gap-2 text-sm"
        >
          <Check className="h-5 w-5" />
          <span>{successMsg}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8 md:grid-cols-3">
        {/* Left Card: User Info Summary */}
        <div className="md:col-span-1 space-y-6">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 mb-4">
              <UserIcon className="h-10 w-10" />
            </div>
            <h2 className="font-display text-xl font-bold text-slate-900">{user.name}</h2>
            <p className="text-xs text-slate-400 font-semibold mt-1">{user.email}</p>
            
            <div className="mt-6 pt-6 border-t border-slate-50 grid grid-cols-2 gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <div>
                <p>Starting City</p>
                <p className="text-slate-800 text-sm font-black mt-1">
                  {user.preferences.homeCity}
                </p>
              </div>
              <div>
                <p>Style</p>
                <p className="text-slate-800 text-sm font-black mt-1">
                  {user.preferences.travelStyle}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm space-y-4 font-bold text-xs text-slate-400 uppercase tracking-wider">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-50 border border-blue-100 text-blue-600">
                <Shield className="h-4 w-4" />
              </span>
              <span>Secure Session</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-50 border border-blue-100 text-blue-600">
                <Key className="h-4 w-4" />
              </span>
              <span>Local Encryption</span>
            </div>
          </div>
        </div>

        {/* Right Card: Preferences Edit Form */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm space-y-6">
            <h3 className="font-display text-lg font-bold text-slate-800 border-b border-slate-50 pb-3">Personal Details</h3>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-bold text-slate-700">Full Name</label>
                <div className="relative mt-2">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <UserIcon className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    {...register("name")}
                    className={`w-full rounded-xl border bg-slate-50/30 py-2.5 pl-10 pr-4 text-slate-900 placeholder-slate-400 outline-none transition duration-200 focus:bg-white focus:ring-4 ${
                      errors.name
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                        : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
                    }`}
                  />
                </div>
                {errors.name && <p className="mt-1 text-xs font-semibold text-red-500">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700">Email Address</label>
                <div className="relative mt-2">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    {...register("email")}
                    className={`w-full rounded-xl border bg-slate-50/30 py-2.5 pl-10 pr-4 text-slate-900 placeholder-slate-400 outline-none transition duration-200 focus:bg-white focus:ring-4 ${
                      errors.email
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                        : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
                    }`}
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs font-semibold text-red-500">{errors.email.message}</p>}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm space-y-6">
            <h3 className="font-display text-lg font-bold text-slate-800 border-b border-slate-50 pb-3">Travel Preferences</h3>

            <div className="grid gap-6 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-bold text-slate-700">Default Budget (₹)</label>
                <div className="relative mt-2">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Coins className="h-4 w-4" />
                  </span>
                  <input
                    type="number"
                    {...register("budget", { valueAsNumber: true })}
                    className={`w-full rounded-xl border bg-slate-50/30 py-2.5 pl-10 pr-4 text-slate-900 placeholder-slate-400 outline-none transition duration-200 focus:bg-white focus:ring-4 ${
                      errors.budget
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                        : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
                    }`}
                  />
                </div>
                {errors.budget && (
                  <p className="mt-1 text-xs font-semibold text-red-500">{errors.budget.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700">Starting City</label>
                <div className="relative mt-2">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    {...register("homeCity")}
                    className={`w-full rounded-xl border bg-slate-50/30 py-2.5 pl-10 pr-4 text-slate-900 placeholder-slate-400 outline-none transition duration-200 focus:bg-white focus:ring-4 ${
                      errors.homeCity
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                        : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
                    }`}
                  />
                </div>
                {errors.homeCity && (
                  <p className="mt-1 text-xs font-semibold text-red-500">{errors.homeCity.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700">Travel Style</label>
                <select
                  {...register("travelStyle")}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50/30 px-4 py-2.5 text-sm text-slate-900 outline-none transition duration-200 focus:bg-white focus:ring-4 focus:border-blue-500 focus:ring-blue-500/10"
                >
                  <option value="Budget">Budget</option>
                  <option value="Standard">Standard</option>
                  <option value="Luxury">Luxury</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">Interests</label>
              <div className="flex flex-wrap gap-2.5">
                {availableInterests.map((interest) => {
                  const isSelected = selectedInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`rounded-full px-5 py-2 text-xs font-bold border transition duration-200 cursor-pointer ${
                        isSelected
                          ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 disabled:opacity-50 transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Saving changes...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  <span>Save Profile Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
