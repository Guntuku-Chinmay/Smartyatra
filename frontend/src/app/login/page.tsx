"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Sparkles, KeyRound, Mail, Loader2, AlertCircle } from "lucide-react";

import { useAuthStore } from "@/store/auth.store";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginInput = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setError(null);
    try {
      await login(data.email);
      router.push("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid credentials. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center bg-gradient-to-b from-blue-50/50 via-white to-slate-50 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 shadow-2xl shadow-slate-200/50 md:p-10"
      >
        {/* Brand Header */}
        <div className="text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 mb-4">
            <Sparkles className="h-6 w-6 text-blue-600 animate-pulse" />
          </div>
          <h1 className="font-display text-3xl font-black text-slate-900">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            Sign in to access your custom travel plans
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600"
          >
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          {/* Email input */}
          <div>
            <label className="block text-sm font-bold text-slate-700">
              Email Address
            </label>
            <div className="relative mt-2">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                placeholder="name@example.com"
                {...register("email")}
                className={`w-full rounded-xl border bg-slate-50/30 py-3 pl-10 pr-4 text-slate-900 placeholder-slate-400 outline-none transition duration-200 focus:bg-white focus:ring-4 ${
                  errors.email
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                    : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
                }`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs font-semibold text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password input */}
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-bold text-slate-700">
                Password
              </label>
              <a href="#" className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative mt-2">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <KeyRound className="h-4 w-4" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password")}
                className={`w-full rounded-xl border bg-slate-50/30 py-3 pl-10 pr-10 text-slate-900 placeholder-slate-400 outline-none transition duration-200 focus:bg-white focus:ring-4 ${
                  errors.password
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                    : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs font-semibold text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 disabled:opacity-50 transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm font-semibold text-slate-500">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-bold text-blue-600 hover:text-blue-700 hover:underline">
            Sign up
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
