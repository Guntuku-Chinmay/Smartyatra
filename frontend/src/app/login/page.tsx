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
  rememberMe: z.boolean().optional(),
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
      rememberMe: false,
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
    <div className="flex min-h-[90vh] items-center justify-center bg-[url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center px-4 py-12 relative">
      {/* Background Dark Overlay */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-white/70 p-8 shadow-2xl backdrop-blur-xl md:p-10 z-10"
      >
        {/* Brand Header */}
        <div className="text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-600 mb-4">
            <Sparkles className="h-6 w-6 text-blue-600 animate-pulse" />
          </div>
          <h1 className="font-display text-3xl font-black text-slate-900">
            Welcome Back
          </h1>
          <p className="mt-2 text-xs font-semibold text-slate-500">
            Sign in to access your custom AI itineraries
          </p>
        </div>

        {/* Social Logins */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              login("demo@smartyatra.com");
              router.push("/dashboard");
            }}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200/60 bg-white/80 py-2.5 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition cursor-pointer"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-.14 3.01-.97 4.29l3.07 2.38c1.8-1.66 2.95-4.11 2.95-6.52z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.07-2.38c-.9.6-2.04.96-3.13.96-3.23 0-5.96-2.18-6.94-5.12L3.65 17.5C5.66 21.5 9.78 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.06 14.55A7.19 7.19 0 0 1 4.75 12c0-.88.15-1.74.43-2.55L2.09 7.07A11.96 11.96 0 0 0 0 12c0 1.83.41 3.56 1.14 5.12l3.92-2.57z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.22 0 12 0 9.78 0 5.66 2.5 3.65 6.5l3.92 2.58c.98-2.94 3.71-5.13 6.94-5.13z"
              />
            </svg>
            <span>Google</span>
          </button>
          <button
            type="button"
            onClick={() => {
              login("demo@smartyatra.com");
              router.push("/dashboard");
            }}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200/60 bg-white/80 py-2.5 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition cursor-pointer"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>GitHub</span>
          </button>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200/60" />
          </div>
          <div className="relative flex justify-center text-xs uppercase font-extrabold tracking-wider">
            <span className="bg-transparent px-2 text-slate-400">Or continue with</span>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-5 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 p-4 text-xs font-semibold text-red-600"
          >
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email input */}
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
                placeholder="name@example.com"
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

          {/* Password input */}
          <div>
            <label className="block text-xs font-bold text-slate-700">
              Password
            </label>
            <div className="relative mt-2">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <KeyRound className="h-4 w-4" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password")}
                className={`w-full rounded-xl border bg-white/50 py-2.5 pl-10 pr-10 text-slate-900 placeholder-slate-400 outline-none transition duration-200 focus:bg-white focus:ring-4 ${
                  errors.password
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                    : "border-slate-200/60 focus:border-blue-500 focus:ring-blue-500/10"
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
              <p className="mt-1 text-[10px] font-semibold text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 font-semibold text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                {...register("rememberMe")}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span>Remember Me</span>
            </label>
            <Link
              href="/login"
              onClick={() => alert("Password reset link placeholder generated successfully!")}
              className="font-bold text-blue-600 hover:text-blue-700 hover:underline"
            >
              Forgot Password?
            </Link>
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
