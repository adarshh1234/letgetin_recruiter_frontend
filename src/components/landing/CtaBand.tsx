"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "./NavLink";
import { useAuthStore } from "@/features/auth/store/useAuthStore";

export function CtaBand() {
  const { isAuthenticated, user } = useAuthStore();
  const dashboardHref = user?.role === "recruiter" ? "/recruiter/dashboard" : "/resume";

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 bg-gradient-dark relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--primary-glow)_0%,_transparent_60%)]" />
      <div className="max-w-4xl mx-auto text-center relative">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium px-4 py-1.5 rounded-full border border-white/10 mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
          </span>
          Join 120,000+ professionals
        </div>

        <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
          Ready to <span className="text-success">Get In</span>?
        </h2>
        <p className="text-white/75 text-lg md:text-xl mt-4 max-w-2xl mx-auto leading-relaxed">
          Stop claiming. Start proving. Join the network where your verified
          skills, not your CV, define your future.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {isAuthenticated ? (
            <Link
              to={dashboardHref}
              className="bg-white text-ink font-bold px-8 py-3.5 rounded-xl shadow-xl hover:scale-[1.02] active:scale-95 transition text-base inline-flex items-center gap-2"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-4 h-4 text-primary-glow" />
            </Link>
          ) : (
            <Link
              to="/auth"
              className="bg-white text-ink font-bold px-8 py-3.5 rounded-xl shadow-xl hover:scale-[1.02] active:scale-95 transition text-base"
            >
              Get In — Free
            </Link>
          )}

          <a
            href="#"
            className="bg-white/10 backdrop-blur-sm text-white font-semibold px-8 py-3.5 rounded-xl border border-white/20 hover:bg-white/20 transition-all"
          >
            Learn More
          </a>
        </div>

        <p className="text-white/40 text-sm mt-6">
          No credit card required · Free forever for individuals
        </p>
      </div>
    </section>
  );
}

export default CtaBand;
