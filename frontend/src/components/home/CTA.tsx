"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, CalendarDays, ChevronDown, MessageSquare } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How does the AI itinerary generation work?",
    answer: "Smartyatra uses advanced Generative AI combined with local attraction catalogs. It analyzes your travel dates, budget, starting point, and travel interests to build an optimized daily schedule in seconds.",
  },
  {
    question: "How are travel budgets calculated?",
    answer: "We use a customized budget forecasting algorithm that maps travel styles (Budget, Standard, Luxury) against traveler count, transportation mode, and local accommodation averages to provide an accurate breakdown.",
  },
  {
    question: "Can I print or share my travel itineraries?",
    answer: "Absolutely! Every generated itinerary contains interactive sharing controls and a print-optimized PDF format so you can carry your plans offline.",
  },
  {
    question: "Is the route sequencing accurate?",
    answer: "Yes, we solve the Travelling Salesperson Problem (TSP) using precise geolocation coordinates for attractions, ensuring your route minimizes backtracking and transit delays.",
  },
];

const testimonials = [
  {
    quote: "Smartyatra saved us hours of driving during our Araku valley tour. The route sequencer is a game changer!",
    author: "Rajesh K.",
    location: "Visakhapatnam",
  },
  {
    quote: "The budget forecasting matched our actual spending almost perfectly. The AI destination matches were spot on.",
    author: "Sneha M.",
    location: "Hyderabad",
  },
];

export default function CTA() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-blue-50/50 space-y-24">
      {/* Testimonials */}
      <div className="mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
            Loved by <span className="gradient-text">Modern Travelers</span>
          </h2>
          <p className="mt-4 text-base text-slate-500 font-semibold">
            See how Smartyatra helps adventurers build unforgettable, stress-free journeys.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {testimonials.map((test, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm flex flex-col justify-between"
            >
              <div className="flex gap-2 text-blue-600 mb-6">
                <MessageSquare className="h-6 w-6 fill-current opacity-20" />
                <p className="text-sm font-semibold text-slate-600 italic leading-relaxed">
                  &ldquo;{test.quote}&rdquo;
                </p>
              </div>
              <div className="border-t border-slate-50 pt-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-black text-slate-800">{test.author}</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">{test.location}</p>
                </div>
                <div className="flex gap-0.5 text-amber-400">
                  {"★".repeat(5).split("").map((s, i) => (
                    <span key={i} className="text-sm">★</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="mt-4 text-base text-slate-500 font-semibold">
            Everything you need to know about Smartyatra travel engine.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm transition hover:border-slate-200"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="flex w-full items-center justify-between p-5 text-left font-bold text-slate-800 transition hover:bg-slate-50 cursor-pointer"
                >
                  <span className="text-sm">{faq.question}</span>
                  <ChevronDown
                    className={`h-4.5 w-4.5 text-slate-400 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-blue-600" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-slate-50 bg-slate-50/30"
                    >
                      <p className="p-5 text-xs font-semibold text-slate-500 leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Box */}
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-16 text-center text-white shadow-2xl shadow-blue-900/10 md:px-12 md:py-20"
        >
          {/* Ambient circles */}
          <div className="absolute -top-24 -left-24 h-60 w-60 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-24 -right-24 h-60 w-60 rounded-full bg-blue-500/20 blur-2xl" />

          <div className="relative z-10 mx-auto max-w-3xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md mb-8">
              <CalendarDays className="h-7 w-7 text-white" />
            </div>

            <h2 className="font-display text-3xl font-black tracking-tight md:text-5xl">
              Ready to Design Your Perfect Travel Plan?
            </h2>

            <p className="mt-4 text-sm md:text-base text-blue-100 font-semibold leading-relaxed">
              Create customized budget estimation, optimized route mapping, and personalized itinerary generation with AI.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link href="/planner">
                <button className="flex items-center gap-2 rounded-xl bg-white hover:bg-slate-100 text-blue-700 font-bold px-7 py-3.5 shadow-lg shadow-black/10 hover:shadow-black/15 transition-all hover:-translate-y-0.5 cursor-pointer">
                  <Sparkles className="h-5 w-5 text-blue-600 animate-pulse" />
                  <span>Start Planner Wizard</span>
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}