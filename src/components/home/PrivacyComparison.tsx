"use client";

import React from "react";
import { CheckCircle2, XCircle, ShieldCheck, Lock, Zap, WifiOff } from "lucide-react";

const COMPARISON_ROWS = [
  {
    feature: "Document Storage & Transmission",
    gopdf: "100% In-Memory RAM (0 bytes transmitted)",
    cloud: "Uploaded to third-party cloud servers",
    isGoPdfAdvantage: true,
  },
  {
    feature: "Processing & Upload Wait Time",
    gopdf: "0 ms upload latency (Instant CPU execution)",
    cloud: "10 to 45 seconds depending on file size & bandwidth",
    isGoPdfAdvantage: true,
  },
  {
    feature: "Offline Compatibility",
    gopdf: "Fully functional offline without internet",
    cloud: "Requires constant high-speed connection",
    isGoPdfAdvantage: true,
  },
  {
    feature: "Confidentiality & Compliance (GDPR/HIPAA)",
    gopdf: "Guaranteed private — no external processor",
    cloud: "Requires trusting remote privacy policies",
    isGoPdfAdvantage: true,
  },
  {
    feature: "Watermarks & Hidden Paywalls",
    gopdf: "Zero watermarks, 100% free unlimited usage",
    cloud: "Hourly limits, watermarks, or subscription tiers",
    isGoPdfAdvantage: true,
  },
];

export function PrivacyComparison() {
  return (
    <section className="py-12 sm:py-16 border-t border-slate-200/80 dark:border-slate-800">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-widest mb-3">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>The Client-Side Difference</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Why GoPDF is Fundamentally Safer
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Compare our in-browser execution model against traditional cloud-based PDF conversion tools.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-hidden rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#131b2e] shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60">
                  <th className="py-4 px-5 sm:px-6 font-bold text-slate-700 dark:text-slate-300">
                    Feature
                  </th>
                  <th className="py-4 px-5 sm:px-6 font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/40">
                    GoPDF (Client-Side)
                  </th>
                  <th className="py-4 px-5 sm:px-6 font-semibold text-slate-500 dark:text-slate-400">
                    Traditional Cloud PDF Tools
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {COMPARISON_ROWS.map((row, i) => (
                  <tr
                    key={i}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-3.5 px-5 sm:px-6 font-semibold text-slate-900 dark:text-slate-200">
                      {row.feature}
                    </td>
                    <td className="py-3.5 px-5 sm:px-6 font-bold text-emerald-700 dark:text-emerald-300 bg-blue-50/20 dark:bg-blue-950/20">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{row.gopdf}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 sm:px-6 text-slate-600 dark:text-slate-400">
                      <div className="flex items-start gap-2">
                        <XCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                        <span>{row.cloud}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
