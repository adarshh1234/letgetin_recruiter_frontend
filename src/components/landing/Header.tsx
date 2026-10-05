"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import Logo from "./Logo";
import Link from "./NavLink";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { UserDropdown } from "@/components/layout/UserDropdown";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#dimensions", label: "The 6 Dimensions" },
  { href: "#compare", label: "Why LetGetIn" },
  { href: "#testimonials", label: "Testimonials" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user, checkAuth, logout } = useAuthStore();
  const dashboardHref = user?.role === "recruiter" ? "/recruiter/dashboard" : "/resume";

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <header
      id="top"
      className="fixed top-0 inset-x-0 z-50 glass border-b border-white/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center h-16 md:h-20">
          <div className="flex min-w-0 items-center gap-2">
            <Logo />
            <span className="hidden md:inline-block text-[10px] font-semibold uppercase tracking-widest text-primary-glow bg-primary/5 px-2 py-0.5 rounded-full ml-1">
              Beta
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 justify-self-center absolute left-1/2 -translate-x-1/2">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-ink/80 hover:text-primary-glow transition"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <UserDropdown />
            ) : (
              <>
                <Link
                  to="/auth"
                  className="text-sm font-medium text-ink hover:text-primary-glow transition px-3 py-2"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth"
                  className="bg-gradient-brand text-primary-foreground text-sm font-semibold px-5 py-2.5 rounded-xl shadow-elegant hover:shadow-glow transition-all hover:scale-[1.02] active:scale-95"
                >
                  Get In — Free
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden p-2 rounded-lg hover:bg-white/60 transition"
            aria-label="Toggle menu"
          >
            {open ? (
              <X className="w-6 h-6 text-ink" />
            ) : (
              <Menu className="w-6 h-6 text-ink" />
            )}
          </button>
        </div>

        {open && (
          <div className="md:hidden pb-4 animate-fade-up">
            <div className="flex flex-col gap-1">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="px-3 py-2.5 text-sm font-medium text-ink hover:bg-white/60 rounded-lg transition"
                >
                  {l.label}
                </a>
              ))}
              <hr className="my-2 border-white/40" />
              {isAuthenticated ? (
                <>
                  <Link
                    to={dashboardHref}
                    onClick={() => setOpen(false)}
                    className="mt-1 bg-gradient-brand text-primary-foreground text-sm font-semibold px-5 py-3 rounded-xl text-center shadow-elegant flex items-center justify-center gap-2"
                  >
                    <span>Go to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      logout();
                    }}
                    className="px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition text-left"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/auth"
                    className="px-3 py-2.5 text-sm font-medium text-ink hover:bg-white/60 rounded-lg transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/auth"
                    className="mt-1 bg-gradient-brand text-primary-foreground text-sm font-semibold px-5 py-3 rounded-xl text-center shadow-elegant"
                  >
                    Get In — Free
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
