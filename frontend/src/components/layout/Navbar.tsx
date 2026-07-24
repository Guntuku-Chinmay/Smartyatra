"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LogOut, Compass, Map, Home, Sparkles, Bell } from "lucide-react";

import { useAuthStore } from "@/store/auth.store";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
    setIsMobileMenuOpen(false);
  };

  const navItems = isAuthenticated
    ? [
        { name: "Dashboard", href: "/dashboard", icon: Home },
        { name: "Explore", href: "/explore", icon: Compass },
        { name: "Planner", href: "/planner", icon: Map },
      ]
    : [
        { name: "Home", href: "/", icon: Home },
        { name: "Explore", href: "/explore", icon: Compass },
        { name: "Planner", href: "/planner", icon: Map },
      ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 text-2xl font-black text-blue-600 transition hover:opacity-90 font-display">
          <Sparkles className="h-6 w-6 text-blue-600 animate-pulse" />
          <span>Smartyatra</span>
        </Link>

        {/* Desktop Menu links */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative px-3 py-2 text-sm font-semibold transition-colors duration-200 hover:text-blue-600 ${
                  isActive ? "text-blue-600" : "text-slate-600"
                }`}
              >
                {item.name}
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Desktop Action Controls */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              {/* Notification icon */}
              <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />
              </button>

              {/* User Avatar */}
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-slate-200"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-black text-blue-700 uppercase">
                  {user?.name ? user.name.slice(0, 2) : "U"}
                </div>
                <span>Hi, {user?.name.split(" ")[0]}</span>
              </Link>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all hover:-translate-y-0.5"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-slate-50 text-slate-700 md:hidden cursor-pointer"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-b border-slate-100 bg-white px-6 py-6 md:hidden shadow-xl"
          >
            <div className="flex flex-col gap-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-xl p-3 font-semibold transition-colors ${
                      isActive ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              <hr className="my-2 border-slate-100" />

              {isAuthenticated ? (
                <div className="flex flex-col gap-3">
                  <Link
                    href="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl p-3 font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <User className="h-5 w-5 text-blue-600" />
                    <span>View Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl p-3 text-left font-semibold text-red-600 hover:bg-red-50 cursor-pointer"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center rounded-xl bg-blue-600 py-3.5 font-bold text-white transition hover:bg-blue-700 shadow-lg shadow-blue-500/10"
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}