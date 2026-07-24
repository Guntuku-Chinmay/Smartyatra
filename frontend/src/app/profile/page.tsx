"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Shield, Key, Check } from "lucide-react";

import { useAuthStore } from "@/store/auth.store";
import Button from "@/components/ui/Button";

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

  const onSubmit = (data: ProfileInput) => {
    updateProfile(data.name, data.email);
    updatePreferences({
      budget: data.budget,
      homeCity: data.homeCity,
      travelStyle: data.travelStyle,
      interests: selectedInterests,
    });

    setSuccessMsg("Profile and preferences updated successfully!");
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  if (!isAuthenticated || !user) {
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
        <h1 className="text-4xl font-extrabold tracking-tight">Your Profile</h1>
        <p className="mt-2 text-slate-600 font-medium">
          Manage your personal details and custom AI travel preference selectors.
        </p>
      </div>

      {successMsg && (
        <div className="mb-6 rounded-lg bg-emerald-50 border border-emerald-100 p-4 text-emerald-700 font-semibold flex items-center gap-2">
          <Check className="h-5 w-5" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8 md:grid-cols-3">
        {/* Left Card: User Info Summary */}
        <div className="md:col-span-1 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-4">
              <User className="h-10 w-10" />
            </div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-sm text-slate-500 font-medium">{user.email}</p>
            <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4 text-xs font-bold text-slate-400">
              <div>
                <p>HOME CITY</p>
                <p className="text-slate-700 text-sm font-extrabold mt-0.5">
                  {user.preferences.homeCity}
                </p>
              </div>
              <div>
                <p>STYLE</p>
                <p className="text-slate-700 text-sm font-extrabold mt-0.5">
                  {user.preferences.travelStyle}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4 font-medium text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-600" />
              <span>Secure Account</span>
            </div>
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4 text-blue-600" />
              <span>Password Encryption</span>
            </div>
          </div>
        </div>

        {/* Right Card: Preferences Edit Form */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
            <h3 className="text-lg font-bold border-b border-slate-100 pb-3">Personal Details</h3>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block font-semibold text-slate-700">Full Name</label>
                <input
                  type="text"
                  {...register("name")}
                  className={`w-full rounded-lg border p-3 outline-none transition focus:border-blue-500 text-slate-800 ${
                    errors.name ? "border-red-500" : "border-slate-300"
                  }`}
                />
                {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
              </div>

              <div>
                <label className="mb-2 block font-semibold text-slate-700">Email Address</label>
                <input
                  type="email"
                  {...register("email")}
                  className={`w-full rounded-lg border p-3 outline-none transition focus:border-blue-500 text-slate-800 ${
                    errors.email ? "border-red-500" : "border-slate-300"
                  }`}
                />
                {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
            <h3 className="text-lg font-bold border-b border-slate-100 pb-3">Travel Preferences</h3>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-1">
                <label className="mb-2 block font-semibold text-slate-700">Default Budget (₹)</label>
                <input
                  type="number"
                  {...register("budget", { valueAsNumber: true })}
                  className={`w-full rounded-lg border p-3 outline-none transition focus:border-blue-500 text-slate-800 ${
                    errors.budget ? "border-red-500" : "border-slate-300"
                  }`}
                />
                {errors.budget && (
                  <p className="mt-1 text-xs text-red-400">{errors.budget.message}</p>
                )}
              </div>

              <div className="md:col-span-1">
                <label className="mb-2 block font-semibold text-slate-700">Starting City</label>
                <input
                  type="text"
                  {...register("homeCity")}
                  className={`w-full rounded-lg border p-3 outline-none transition focus:border-blue-500 text-slate-800 ${
                    errors.homeCity ? "border-red-500" : "border-slate-300"
                  }`}
                />
                {errors.homeCity && (
                  <p className="mt-1 text-xs text-red-400">{errors.homeCity.message}</p>
                )}
              </div>

              <div className="md:col-span-1">
                <label className="mb-2 block font-semibold text-slate-700">Travel Style</label>
                <select
                  {...register("travelStyle")}
                  className="w-full rounded-lg border border-slate-300 p-3 bg-white text-slate-800 outline-none focus:border-blue-500"
                >
                  <option value="Budget">Budget</option>
                  <option value="Standard">Standard</option>
                  <option value="Luxury">Luxury</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-3 block font-semibold text-slate-700">Interests</label>
              <div className="flex flex-wrap gap-2.5">
                {availableInterests.map((interest) => {
                  const isSelected = selectedInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`rounded-full px-4 py-2 text-xs font-bold border transition duration-200 ${
                        isSelected
                          ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20"
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
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
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 shadow-md shadow-blue-500/20"
            >
              Save Profile Changes
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
