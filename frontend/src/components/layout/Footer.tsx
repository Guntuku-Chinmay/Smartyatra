"use client";

import Link from "next/link";
import { Compass, Sparkles, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white pt-16 pb-8">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
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
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
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