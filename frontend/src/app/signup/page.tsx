"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { User, Mail, Lock, MapPin, Coins, Sparkles, Loader2, AlertCircle } from "lucide-react";

import { useAuthStore } from "@/store/auth.store";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  homeCity: z.string().min(2, "Starting city is required"),
  travelStyle: z.enum(["Budget", "Standard", "Luxury"]),
  budget: z.number().min(1000, "Minimum budget should be ₹1,000"),
});

type SignupInput = z.infer<typeof signupSchema>;

const availableInterests = [
  "Adventure",
  "Nature",
  "Food",
  "Culture",
  "Shopping",
  "Photography",
];

export default function SignupPage() {
  const router = useRouter();
  const signup = useAuthStore((state) => state.signup);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      homeCity: "Visakhapatnam",
      travelStyle: "Standard",
      budget: 20000,
    },
  });

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const onSubmit = async (data: SignupInput) => {
    if (selectedInterests.length === 0) {
      setError("Please select at least one interest category!");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await signup(data.name, data.email, {
        homeCity: data.homeCity,
        travelStyle: data.travelStyle,
        budget: data.budget,
        interests: selectedInterests,
      });
      router.push("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[95vh] items-center justify-center bg-[url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center px-4 py-12 relative">
      {/* Background Dark Overlay */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl overflow-hidden rounded-3xl border border-white/20 bg-white/75 p-8 shadow-2xl backdrop-blur-xl md:p-10 z-10"
      >
        {/* Brand Header */}
        <div className="text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-600 mb-4">
            <Sparkles className="h-6 w-6 text-blue-600 animate-pulse" />
          </div>
          <h1 className="font-display text-3xl font-black text-slate-900">
            Create Your Account
          </h1>
          <p className="mt-2 text-xs font-semibold text-slate-500">
            Sign up to plan, budget, and customize your travel experiences
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 p-4 text-xs font-semibold text-red-600"
          >
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Column 1: Account Info */}
            <div className="space-y-4">
              <h3 className="font-display text-sm font-black text-blue-600 border-b border-slate-200/40 pb-2">Account Details</h3>

              <div>
                <label className="block text-xs font-bold text-slate-700">
                  Full Name
                </label>
                <div className="relative mt-2">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <User className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="John Doe"
                    {...register("name")}
                    className={`w-full rounded-xl border bg-white/50 py-2.5 pl-10 pr-4 text-slate-900 placeholder-slate-400 outline-none transition duration-200 focus:bg-white focus:ring-4 ${
                      errors.name
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                        : "border-slate-200/60 focus:border-blue-500 focus:ring-blue-500/10"
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-[10px] font-semibold text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">
                  Email Address
                </label>
                <div className="relative mt-2">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    {...register("email")}
                    className={`w-full rounded-xl border bg-white/50 py-2.5 pl-10 pr-4 text-slate-900 placeholder-slate-400 outline-none transition duration-200 focus:bg-white focus:ring-4 ${
                      errors.email
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                        : "border-slate-200/60 focus:border-blue-500 focus:ring-blue-500/10"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-[10px] font-semibold text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">
                  Password
                </label>
                <div className="relative mt-2">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    {...register("password")}
                    className={`w-full rounded-xl border bg-white/50 py-2.5 pl-10 pr-4 text-slate-900 placeholder-slate-400 outline-none transition duration-200 focus:bg-white focus:ring-4 ${
                      errors.password
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                        : "border-slate-200/60 focus:border-blue-500 focus:ring-blue-500/10"
                    }`}
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-[10px] font-semibold text-red-500">{errors.password.message}</p>
                )}
              </div>
            </div>

            {/* Column 2: Travel Preferences */}
            <div className="space-y-4">
              <h3 className="font-display text-sm font-black text-blue-600 border-b border-slate-200/40 pb-2">Travel Profile</h3>

              <div>
                <label className="block text-xs font-bold text-slate-700">
                  Home/Starting City
                </label>
                <div className="relative mt-2">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="Visakhapatnam"
                    {...register("homeCity")}
                    className={`w-full rounded-xl border bg-white/50 py-2.5 pl-10 pr-4 text-slate-900 placeholder-slate-400 outline-none transition duration-200 focus:bg-white focus:ring-4 ${
                      errors.homeCity
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                        : "border-slate-200/60 focus:border-blue-500 focus:ring-blue-500/10"
                    }`}
                  />
                </div>
                {errors.homeCity && (
                  <p className="mt-1 text-[10px] font-semibold text-red-500">{errors.homeCity.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">
                  Preferred Travel Style
                </label>
                <select
                  {...register("travelStyle")}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-xs text-slate-900 outline-none transition duration-200 focus:bg-white focus:ring-4 focus:border-blue-500 focus:ring-blue-500/10"
                >
                  <option value="Budget">Budget</option>
                  <option value="Standard">Standard</option>
                  <option value="Luxury">Luxury</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">
                  Default Trip Budget (₹)
                </label>
                <div className="relative mt-2">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Coins className="h-4 w-4" />
                  </span>
                  <input
                    type="number"
                    placeholder="20000"
                    {...register("budget", { valueAsNumber: true })}
                    className={`w-full rounded-xl border bg-white/50 py-2.5 pl-10 pr-4 text-slate-900 placeholder-slate-400 outline-none transition duration-200 focus:bg-white focus:ring-4 ${
                      errors.budget
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                        : "border-slate-200/60 focus:border-blue-500 focus:ring-blue-500/10"
                    }`}
                  />
                </div>
                {errors.budget && (
                  <p className="mt-1 text-[10px] font-semibold text-red-500">{errors.budget.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Interests */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-slate-700 mb-3">
              Select Your Travel Interests (Choose at least 1)
            </label>
            <div className="flex flex-wrap gap-2.5">
              {availableInterests.map((interest) => {
                const isSelected = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`rounded-full px-5 py-2 text-xs font-bold transition-all duration-200 border cursor-pointer ${
                      isSelected
                        ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20"
                        : "bg-white/60 border-slate-200 text-slate-600 hover:bg-white"
                    }`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 disabled:opacity-50 transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Creating account...</span>
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm font-semibold text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-blue-600 hover:text-blue-700 hover:underline">
            Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
