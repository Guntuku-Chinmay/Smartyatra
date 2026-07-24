"use client";

import Link from "next/link";
import { Compass, Sparkles, Github, Twitter, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          {/* Logo & Description */}
          <div className="sm:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-2xl font-extrabold text-blue-600 transition hover:opacity-90 font-display">
              Smartyatra
            </Link>
            <p className="mt-4 max-w-xs text-sm font-medium leading-relaxed text-slate-500">
              The intelligent travel planning platform powered by Generative AI and Travelling Salesperson route optimization solvers.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-slate-900">Platform</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/dashboard" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/explore" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">
                  Explore Destinations
                </Link>
              </li>
              <li>
                <Link href="/planner" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">
                  Trip Planner
                </Link>
              </li>
            </ul>
          </div>

          {/* AI Services */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-slate-900">AI Services</h4>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                <span>Itinerary Engine</span>
              </li>
              <li className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                <Compass className="h-3.5 w-3.5 text-indigo-500" />
                <span>TSP Route Solver</span>
              </li>
              <li className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                <span>Budget Forecaster</span>
              </li>
            </ul>
          </div>

          {/* Settings */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-slate-900">Settings</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/profile" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">
                  Profile Details
                </Link>
              </li>
              <li>
                <Link href="/settings" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">
                  App Settings
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-slate-100 pt-8 text-center sm:flex sm:items-center sm:justify-between">
          <p className="text-xs font-semibold text-slate-400">
            &copy; {new Date().getFullYear()} Smartyatra. All rights reserved.
          </p>
          <p className="mt-2 text-xs font-semibold text-slate-400 sm:mt-0">
            Built with Next.js, FastAPI & Google Gemini.
          </p>
        </div>
      </div>
    </footer>
  );
}