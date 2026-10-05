"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import {
  LayoutDashboard,
  FileText,
  Sparkles,
  LogOut,
  ChevronDown,
  User as UserIcon,
  ShieldCheck,
} from "lucide-react";

export function UserDropdown() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    router.push("/auth");
  };

  const displayName = user?.fullName || user?.username || "User Account";
  const email = user?.email || "";
  const firstLetter = (displayName || email || "U").charAt(0).toUpperCase();
  const avatarUrl = user?.avatarUrl || user?.avatar;
  const isRecruiter = user?.role === "recruiter";
  const dashboardHref = isRecruiter ? "/recruiter/dashboard" : "/resume";
  const profileHref = isRecruiter ? "/recruiter/profile" : "/profile";
  const roleBadge = isRecruiter ? "Verified Recruiter" : "Verified User";

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* User Avatar Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2.5 p-1 rounded-full hover:bg-surface-alt transition-all group focus:outline-none"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-primary-glow/40 group-hover:ring-primary-glow transition"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-gradient-brand text-primary-foreground font-bold text-sm flex items-center justify-center shadow-glow ring-2 ring-primary-glow/40 group-hover:scale-105 transition-transform">
            {firstLetter}
          </div>
        )}
        <div className="hidden md:flex flex-col text-left">
          <span className="text-xs font-bold text-ink leading-none">
            {displayName}
          </span>
          <span className="text-[10px] text-ink-soft leading-tight mt-0.5 truncate max-w-[120px]">
            {email}
          </span>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-ink-soft transition-transform duration-200 ${
            isOpen ? "rotate-180 text-primary-glow" : ""
          }`}
        />
      </button>

      {/* Production Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-surface border border-border shadow-elegant py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-border bg-surface-alt/40 rounded-t-2xl">
            <div className="flex items-center gap-3">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-10 h-10 rounded-full object-cover ring-1 ring-border"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-brand text-primary-foreground font-extrabold text-base flex items-center justify-center shadow-glow">
                  {firstLetter}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-ink truncate">
                  {displayName}
                </p>
                <p className="text-[11px] text-ink-soft truncate">{email}</p>
                <div className="inline-flex items-center gap-1 text-[9px] font-semibold text-success bg-success/10 px-2 py-0.5 rounded-full mt-1">
                  <ShieldCheck className="w-2.5 h-2.5" /> {roleBadge}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="px-1.5 py-1.5 space-y-0.5">
            <Link
              href={dashboardHref}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-ink hover:text-primary-glow hover:bg-surface-alt rounded-xl transition"
            >
              <LayoutDashboard className="w-4 h-4 text-primary-glow" />
              <span>Dashboard</span>
            </Link>

            <Link
              href={profileHref}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-ink hover:text-primary-glow hover:bg-surface-alt rounded-xl transition"
            >
              <UserIcon className="w-4 h-4 text-primary-glow" />
              <span>My Profile</span>
            </Link>
          </div>

          {/* Divider */}
          <div className="my-1 border-t border-border" />

          {/* Logout Action */}
          <div className="px-1.5 py-1">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10 rounded-xl transition text-left"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
