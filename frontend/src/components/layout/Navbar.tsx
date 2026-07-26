"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, User, LogOut, Compass, Map, Home, Sparkles, Bell, Settings, Bookmark, CheckCircle2, Sun, Moon } from "lucide-react";

import { useAuthStore } from "@/store/auth.store";
import Dropdown from "@/components/ui/Dropdown";
import Sheet from "@/components/ui/Sheet";
import { useDarkMode } from "@/hooks/useDarkMode";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useDarkMode();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const navItems = isAuthenticated
    ? [
        { name: "Dashboard", href: "/dashboard", icon: Home },
        { name: "Explore", href: "/explore", icon: Compass },
        { name: "Planner", href: "/planner", icon: Map },
        { name: "Saved Trips", href: "/dashboard?tab=saved", icon: Bookmark },
      ]
    : [
        { name: "Home", href: "/", icon: Home },
        { name: "Explore", href: "/explore", icon: Compass },
        { name: "Planner", href: "/planner", icon: Map },
      ];

  const notificationItems = [
    {
      label: "Goa trip generated successfully by SmartAI!",
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
      onClick: () => router.push("/dashboard"),
    },
    {
      label: "Visakhapatnam flight recommendations updated.",
      icon: <Sparkles className="h-4 w-4 text-blue-500" />,
      onClick: () => router.push("/explore"),
    },
  ];

  const userMenuItems = [
    {
      label: "My Profile",
      icon: <User className="h-4 w-4 text-slate-400" />,
      onClick: () => router.push("/profile"),
    },
    {
      label: "Account Settings",
      icon: <Settings className="h-4 w-4 text-slate-400" />,
      onClick: () => router.push("/settings"),
    },
    {
      label: "Logout",
      icon: <LogOut className="h-4 w-4 text-rose-500" />,
      onClick: handleLogout,
      variant: "danger" as const,
    },
  ];

  const isHomeTransparent = pathname === "/" && !isScrolled;

  const getLinkColor = (isActive: boolean) => {
    if (isActive) return "text-blue-500 dark:text-blue-400";
    if (isHomeTransparent) return "text-white/90 hover:text-white";
    return "text-slate-600 dark:text-slate-300 hover:text-blue-600";
  };

  const getIconBtnColor = () => {
    if (isHomeTransparent) return "text-white/90 hover:bg-white/10";
    return "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900";
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? "border-b border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 shadow-md py-1" 
        : "bg-transparent border-transparent py-3"
    }`}>
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        
        {/* Brand Logo */}
        <Link href="/" className={`flex items-center gap-2 text-2xl font-black transition hover:opacity-90 font-display ${
          isHomeTransparent ? "text-white" : "text-blue-600 dark:text-blue-500"
        }`}>
          <Sparkles className={`h-6 w-6 animate-pulse ${
            isHomeTransparent ? "text-blue-300" : "text-blue-600"
          }`} />
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
                className={`relative px-3 py-2 text-sm font-semibold transition-colors duration-200 ${getLinkColor(isActive)}`}
              >
                {item.name}
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-550 rounded-full"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Desktop Action Controls */}
        <div className="hidden md:flex items-center gap-4">
          
          {/* Dark Mode toggle button */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl transition cursor-pointer ${getIconBtnColor()}`}
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5" />}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              
              {/* Notification icon */}
              <Dropdown
                align="right"
                trigger={
                  <button className={`relative p-2 rounded-xl transition cursor-pointer ${getIconBtnColor()}`}>
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-slate-950" />
                  </button>
                }
                items={notificationItems}
              />

              {/* User Avatar */}
              <Dropdown
                align="right"
                trigger={
                  <div className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold transition cursor-pointer select-none ${
                    isHomeTransparent 
                      ? "border-white/20 bg-white/10 hover:bg-white/20 text-white" 
                      : "border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-slate-200"
                  }`}>
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-xs font-black text-blue-700 dark:text-blue-300 uppercase">
                      {user?.name ? user.name.slice(0, 2) : "U"}
                    </div>
                    <span>Hi, {user?.name.split(" ")[0]}</span>
                  </div>
                }
                items={userMenuItems}
              />
            </div>
          ) : (
            <Link
              href="/login"
              className={`rounded-xl font-bold px-6 py-2.5 transition-all hover:-translate-y-0.5 shadow-md ${
                isHomeTransparent 
                  ? "bg-white text-blue-900 hover:bg-slate-100 shadow-white/5" 
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/10"
              }`}
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setIsMobileOpen(true)}
          className={`flex h-10 w-10 items-center justify-center rounded-xl md:hidden cursor-pointer ${
            isHomeTransparent ? "text-white hover:bg-white/10" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900"
          }`}
        >
          <Menu className="h-6 w-6" />
        </button>
      </nav>

      {/* Mobile menu drawer */}
      <Sheet isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} title="Menu" side="right">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-3.5 py-2">
            <span className="text-xs font-bold text-slate-400">Theme</span>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-2 text-xs font-bold transition cursor-pointer text-slate-700 dark:text-slate-350"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="h-4 w-4 text-amber-500" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          </div>
          
          <hr className="my-1 border-slate-100 dark:border-slate-800/80" />

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 rounded-xl p-3.5 font-bold transition-colors ${
                  isActive 
                    ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400" 
                    : "text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-900"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}

          <hr className="my-2 border-slate-100 dark:border-slate-800/80" />

          {isAuthenticated ? (
            <div className="flex flex-col gap-3">
              <Link
                href="/profile"
                onClick={() => setIsMobileOpen(false)}
                className="flex items-center gap-3 rounded-xl p-3.5 font-bold text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-900"
              >
                <User className="h-5 w-5 text-slate-400" />
                <span>View Profile</span>
              </Link>
              <Link
                href="/settings"
                onClick={() => setIsMobileOpen(false)}
                className="flex items-center gap-3 rounded-xl p-3.5 font-bold text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-900"
              >
                <Settings className="h-5 w-5 text-slate-400" />
                <span>Account Settings</span>
              </Link>
              <button
                onClick={() => {
                  setIsMobileOpen(false);
                  handleLogout();
                }}
                className="flex w-full items-center gap-3 rounded-xl p-3.5 text-left font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
              >
                <LogOut className="h-5 w-5 text-red-500" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center justify-center rounded-xl bg-blue-600 py-3.5 font-bold text-white transition hover:bg-blue-700 shadow-lg shadow-blue-500/10"
            >
              Sign In
            </Link>
          )}
        </div>
      </Sheet>
    </header>
  );
}