"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { useAuthStore } from "@/store/auth.store";
import Button from "@/components/ui/Button";

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
      homeCity: "Mumbai",
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
    <div className="flex min-h-[90vh] items-center justify-center bg-radial from-slate-900 via-slate-950 to-black px-4 py-12 text-white">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-xl md:p-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Create Your Account
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Sign up to plan, budget, and optimize your travel experiences
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Column 1: Account Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-blue-400">Account Details</h3>

              <div>
                <label className="block text-sm font-semibold text-slate-300">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  {...register("name")}
                  className={`mt-2 w-full rounded-lg border bg-slate-950 px-4 py-2.5 text-slate-100 placeholder-slate-500 outline-none transition duration-200 focus:ring-2 ${
                    errors.name
                      ? "border-red-500 focus:ring-red-500/20"
                      : "border-slate-800 focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  {...register("email")}
                  className={`mt-2 w-full rounded-lg border bg-slate-950 px-4 py-2.5 text-slate-100 placeholder-slate-500 outline-none transition duration-200 focus:ring-2 ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500/20"
                      : "border-slate-800 focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  className={`mt-2 w-full rounded-lg border bg-slate-950 px-4 py-2.5 text-slate-100 placeholder-slate-500 outline-none transition duration-200 focus:ring-2 ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500/20"
                      : "border-slate-800 focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            {/* Column 2: Travel Preferences */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-blue-400">Travel Profile</h3>

              <div>
                <label className="block text-sm font-semibold text-slate-300">
                  Home/Starting City
                </label>
                <input
                  type="text"
                  placeholder="Mumbai"
                  {...register("homeCity")}
                  className={`mt-2 w-full rounded-lg border bg-slate-950 px-4 py-2.5 text-slate-100 outline-none transition duration-200 focus:ring-2 ${
                    errors.homeCity
                      ? "border-red-500 focus:ring-red-500/20"
                      : "border-slate-800 focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                />
                {errors.homeCity && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.homeCity.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300">
                  Preferred Travel Style
                </label>
                <select
                  {...register("travelStyle")}
                  className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-slate-100 outline-none transition focus:border-blue-500"
                >
                  <option value="Budget">Budget</option>
                  <option value="Standard">Standard</option>
                  <option value="Luxury">Luxury</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300">
                  Default Trip Budget (₹)
                </label>
                <input
                  type="number"
                  placeholder="20000"
                  {...register("budget", { valueAsNumber: true })}
                  className={`mt-2 w-full rounded-lg border bg-slate-950 px-4 py-2.5 text-slate-100 outline-none transition duration-200 focus:ring-2 ${
                    errors.budget
                      ? "border-red-500 focus:ring-red-500/20"
                      : "border-slate-800 focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                />
                {errors.budget && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.budget.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Interests */}
          <div className="pt-2">
            <label className="block text-sm font-semibold text-slate-300 mb-3">
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
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition duration-200 border ${
                      isSelected
                        ? "bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-500/20"
                        : "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-900"
                    }`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center py-3 bg-gradient-to-r from-blue-600 to-indigo-600 font-bold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 mt-4"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 animate-spin text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating account...
              </span>
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-blue-400 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
