"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/landing/Logo";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { StorageProviderFactory } from "@/features/resume/storage/factory";
import {
  Sparkles,
  LogOut,
  X,
  ChevronRight,
  ChevronDown,
  Compass,
  User,
  HardDrive,
  LayoutGrid,
  BrainCircuit,
  GraduationCap,
  BookOpenCheck,
  PanelLeftClose,
  PanelLeftOpen,
  Network,
  Users,
  Store,
  Rocket,
  Briefcase,
  ChevronsUpDown,
  ShieldCheck,
  UserCheck,
  Building2,
  Calendar,
  ListTodo,
  Trophy,
  Zap,
  Bot,
  Languages,
  Landmark,
  Brain,
  Mic,
  ClipboardCheck,
  Hourglass,
  IdCard,
  Wallet,
  TrendingUp,
  Award,
  Video,
  FileText,
  type LucideIcon,
} from "lucide-react";

interface NavSubItem {
  name: string;
  shortName: string;
  href: string;
  icon: LucideIcon;
  description?: string;
  badge?: string;
  soon?: boolean;
}

interface NavItem {
  name: string;
  shortName: string;
  href: string;
  icon: LucideIcon;
  description: string;
  badge?: string;
  soon?: boolean;
  nestedItems?: NavSubItem[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

interface DashboardSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  onCreateNew?: () => void;
}

export function DashboardSidebar({
  isOpen = false,
  onClose,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile menu on click outside or escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsProfileOpen(false);
      }
    }
    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isProfileOpen]);

  // Load collapsed preference from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("dashboard_sidebar_collapsed");
      if (saved !== null) {
        setIsCollapsed(saved === "true");
      }
    } catch {
      // ignore SSR/localStorage errors
    }
  }, []);

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("dashboard_sidebar_collapsed", String(next));
      } catch {}
      return next;
    });
  };

  const navSections: NavSection[] = [
    {
      title: "JOB",
      items: [
        {
          name: "AI Apply",
          shortName: "AI Apply",
          href: "/ai-apply",
          icon: Rocket,
          description: "Configure preferences and auto-apply to matching jobs",
        },
        {
          name: "Explore Opportunities",
          shortName: "Explore",
          href: "/explore",
          icon: Compass,
          description: "Explore matched job opportunities",
        },
        {
          name: "My Applications",
          shortName: "Applications",
          href: "/applications",
          icon: FileText,
          description: "Track applied jobs, dynamic stages & offers",
        },
        {
          name: "My Jobs",
          shortName: "Jobs",
          href: "/resume",
          icon: Briefcase,
          description: "Jobs, resumes, cover letters & video profile",
        },
        {
          name: "Resume Translator",
          shortName: "Translator",
          href: "/interviews/translator",
          icon: Languages,
          description: "Translate resumes for global opportunities",
        },
      ],
    },
    {
      title: "INTERVIEW",
      items: [
        {
          name: "AI Assessment",
          shortName: "Assessment",
          href: "/interviews/assessment",
          icon: ClipboardCheck,
          description: "AI skill assessments & technical evaluations",
        },
        {
          name: "AI Interview Practice",
          shortName: "AI Practice",
          href: "/interviews/ai-practice",
          icon: Bot,
          description: "AI-powered mock interview practice",
        },
      ],
    },
    {
      title: "INTERVIEW BUDDY",
      items: [
        {
          name: "Interview Schedule",
          shortName: "Schedule",
          href: "/interviews/schedule",
          icon: Calendar,
          description: "Manage interview calendar & slots",
        },
      ],
    },
    {
      title: "PROFILE+",
      items: [
        {
          name: "My Profile",
          shortName: "Profile",
          href: "/profile",
          icon: User,
          description: "Manage your professional identity",
        },
        {
          name: "My Drive",
          shortName: "Drive",
          href: "/drive",
          icon: HardDrive,
          description: "Cloud resume & asset storage",
        },
      ],
    },
    {
      title: "COLLAB+",
      items: [
        {
          name: "My Network",
          shortName: "Network",
          href: "/network",
          icon: Network,
          description: "Professional networking & connections",
        },
        {
          name: "My Hub",
          shortName: "Hub",
          href: "/myhub",
          icon: LayoutGrid,
          description: "Command center for all your activities",
        },
        {
          name: "My Team",
          shortName: "Team",
          href: "/team",
          icon: Users,
          description: "Collaborate with your team & colleagues",
        },
      ],
    },
    {
      title: "WORKSPACE",
      items: [
        {
          name: "Calendar",
          shortName: "Calendar",
          href: "/calendar",
          icon: Calendar,
          description: "Schedule & event timeline",
        },
        {
          name: "Task Mite",
          shortName: "Task Mite",
          href: "/tasks",
          icon: ListTodo,
          description: "Personal tasks & progress tracking",
        },
        {
          name: "My Twin",
          shortName: "Twin",
          href: "/my-twin",
          icon: Sparkles,
          description: "Your personal AI career twin",
        },
        {
          name: "App Mart",
          shortName: "App Mart",
          href: "/market",
          icon: Store,
          description: "Discover & integrate third-party apps",
        },
      ],
    },
    {
      title: "CAREER+",
      items: [
        {
          name: "Genius Test",
          shortName: "G-Test",
          href: "/geniustest",
          icon: BrainCircuit,
          description: "Adaptive AI skill assessments",
        },
        {
          name: "Career Guidance",
          shortName: "Guidance",
          href: "/career-guidance",
          icon: Compass,
          description: "Personalized career counseling & roadmaps",
        },
        {
          name: "Talent Score",
          shortName: "Score",
          href: "/talent-score",
          icon: Trophy,
          description: "AI skill & competency score",
        },
        {
          name: "Skill Enhancement",
          shortName: "Skills",
          href: "/skills",
          icon: BookOpenCheck,
          description: "AI learning paths & certifications",
        },
      ],
    },
  ];

  const displayName = user?.fullName || user?.username || "User Account";
  const firstName = displayName.split(" ")[0] || "Account";
  const email = user?.email || "";
  const firstLetter = (displayName || email || "U").charAt(0).toUpperCase();
  const avatarUrl = user?.avatarUrl || user?.avatar;

  const handleLogout = async () => {
    setIsProfileOpen(false);
    if (onClose) onClose();
    await logout();
    router.push("/auth");
  };

  const sidebarContent = (
    <div
      className={`flex flex-col h-full bg-surface border-r border-border select-none shadow-sm transition-all duration-300 ease-in-out relative ${
        isCollapsed ? "w-20" : "w-64 lg:w-60"
      }`}
    >
      {/* Sidebar Header with Brand Logo & Open/Minimize Toggle Button */}
      <div
        className={`p-4 border-b border-border flex items-center ${
          isCollapsed
            ? "justify-center flex-col gap-2.5 py-4"
            : "justify-between"
        }`}
      >
        {isCollapsed ? (
          <>
            <Link
              href="/"
              className="w-10 h-10 rounded-2xl bg-gradient-brand flex items-center justify-center text-primary-foreground font-extrabold text-base shadow-glow hover:scale-105 transition shrink-0"
              title="LetGetIn AI"
            >
              L
            </Link>
            <button
              onClick={toggleCollapsed}
              className="p-1.5 rounded-xl text-ink-soft hover:text-primary-glow hover:bg-surface-alt transition cursor-pointer"
              title="Expand Sidebar"
              aria-label="Expand Sidebar"
            >
              <PanelLeftOpen className="w-4 h-4 text-primary-glow" />
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2.5 min-w-0">
              <Logo href="/" />
            </div>

            <div className="flex items-center gap-1">
              {/* Open / Collapse Minimize Toggle Button for Desktop */}
              <button
                onClick={toggleCollapsed}
                className="hidden lg:flex p-2 rounded-xl text-ink-soft hover:text-ink hover:bg-surface-alt transition cursor-pointer"
                title="Minimize Sidebar (Icons with labels)"
                aria-label="Minimize Sidebar"
              >
                <PanelLeftClose className="w-5 h-5 text-ink-soft hover:text-primary-glow" />
              </button>

              {/* Close Drawer Button for Mobile */}
              {onClose && (
                <button
                  onClick={onClose}
                  className="lg:hidden p-1.5 rounded-xl text-ink-soft hover:text-ink hover:bg-surface-alt transition cursor-pointer"
                  aria-label="Close Sidebar"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Main Hierarchical Navigation Section */}
      <div
        className={`flex-1 overflow-y-auto ${
          isCollapsed ? "p-2 space-y-3" : "p-3 space-y-4"
        } scrollbar-thin`}
      >
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1">
            {!isCollapsed && (
              <div className="px-3 mb-1.5 text-[10px] font-extrabold uppercase tracking-widest text-ink-soft select-none">
                {section.title}
              </div>
            )}

            <nav className={isCollapsed ? "space-y-1.5" : "space-y-1"}>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isDirectActive = pathname === item.href;
                const hasActiveChild =
                  item.nestedItems?.some(
                    (child) => pathname === child.href,
                  ) ?? false;
                const isItemActive = isDirectActive;

                // ==========================================
                // MINI SIDEBAR VIEW (Collapsed with Labels Under Icons)
                // ==========================================
                if (isCollapsed) {
                  const isMiniActive = isDirectActive || hasActiveChild;
                  return (
                    <div
                      key={item.name}
                      className="relative group flex justify-center w-full"
                    >
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={`w-[68px] py-2 px-1 rounded-2xl flex flex-col items-center justify-center transition-all group/item ${
                          isMiniActive
                            ? "bg-gradient-brand text-primary-foreground shadow-glow font-bold"
                            : "text-ink-soft hover:text-ink hover:bg-surface-alt/70"
                        }`}
                        aria-label={item.name}
                      >
                        <Icon
                          className={`w-5 h-5 shrink-0 transition-transform group-hover/item:scale-110 ${
                            isMiniActive
                              ? "text-primary-foreground"
                              : "text-primary-glow"
                          }`}
                        />
                        {/* Name shown underneath the icon */}
                        <span
                          className={`text-[9.5px] font-semibold tracking-tight text-center truncate max-w-[62px] leading-none mt-1.5 ${
                            isMiniActive
                              ? "text-primary-foreground"
                              : "text-ink-soft group-hover/item:text-ink"
                          }`}
                        >
                          {item.shortName}
                        </span>
                      </Link>

                      {/* Floating Flyout/Tooltip in Mini Mode */}
                      {item.nestedItems && item.nestedItems.length > 0 ? (
                        <div className="absolute left-full ml-3 top-0 w-52 p-2 bg-surface dark:bg-slate-900 border border-border dark:border-slate-800 rounded-2xl shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all z-50 animate-in fade-in duration-150">
                          <div className="px-2.5 py-1.5 border-b border-border/50 text-[10px] font-extrabold uppercase tracking-wider text-primary-glow flex items-center justify-between">
                            <span>{item.name}</span>
                            <span className="text-[9px] bg-primary/10 text-primary-glow px-1.5 py-0.2 rounded-md">
                              {item.nestedItems.length + 1}
                            </span>
                          </div>
                          <div className="mt-1.5 space-y-1">
                            <Link
                              href={item.href}
                              onClick={onClose}
                              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                                isDirectActive
                                  ? "bg-gradient-brand text-primary-foreground shadow-glow font-bold"
                                  : "text-ink-soft hover:text-ink hover:bg-surface-alt"
                              }`}
                            >
                              <Icon
                                className={`w-3.5 h-3.5 shrink-0 ${
                                  isDirectActive
                                    ? "text-primary-foreground"
                                    : "text-primary-glow"
                                }`}
                              />
                              <span className="truncate flex-1">
                                {item.name}
                              </span>
                            </Link>
                            {item.nestedItems.map((child) => {
                              const isChildActive = pathname === child.href;
                              const ChildIcon = child.icon;
                              return (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  onClick={onClose}
                                  className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                                    isChildActive
                                      ? "bg-gradient-brand text-primary-foreground shadow-glow font-bold"
                                      : "text-ink-soft hover:text-ink hover:bg-surface-alt"
                                  }`}
                                >
                                  <ChildIcon
                                    className={`w-3.5 h-3.5 shrink-0 ${
                                      isChildActive
                                        ? "text-primary-foreground"
                                        : "text-primary-glow"
                                    }`}
                                  />
                                  <span className="truncate flex-1">
                                    {child.name}
                                  </span>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-xl shadow-2xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 border border-slate-800">
                          <div>{item.name}</div>
                          {item.description && (
                            <div className="text-[10px] text-slate-400 font-normal">
                              {item.description}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                }

                // ==========================================
                // FULL SIDEBAR VIEW (with clean nested indentation)
                // ==========================================
                return (
                  <div key={item.name} className="space-y-1">
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                        isItemActive
                          ? "bg-gradient-brand text-primary-foreground shadow-glow font-bold"
                          : "text-ink-soft hover:text-ink hover:bg-surface-alt/70"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                          isItemActive
                            ? "text-primary-foreground"
                            : "text-primary-glow"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="truncate">{item.name}</div>
                        {!isItemActive && (
                          <div className="text-[10px] text-ink-soft/70 truncate group-hover:text-ink-soft transition">
                            {item.description}
                          </div>
                        )}
                      </div>
                      {isItemActive && (
                        <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-80" />
                      )}
                    </Link>

                    {/* Nested Sub-items with clear visual indentation */}
                    {item.nestedItems && item.nestedItems.length > 0 && (
                      <div className="pl-3.5 ml-4 my-0.5 border-l-2 border-primary/20 space-y-1">
                        {item.nestedItems.map((nested) => {
                          const NestedIcon = nested.icon;
                          const isNestedActive = pathname === nested.href;
                          return (
                            <Link
                              key={nested.href}
                              href={nested.href}
                              onClick={onClose}
                              className={`group relative flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium transition-all ${
                                isNestedActive
                                  ? "bg-gradient-brand text-primary-foreground shadow-glow font-bold"
                                  : "text-ink-soft hover:text-ink hover:bg-surface-alt/70"
                              }`}
                            >
                              <NestedIcon
                                className={`w-3.5 h-3.5 shrink-0 transition-transform group-hover:scale-110 ${
                                  isNestedActive
                                    ? "text-primary-foreground"
                                    : "text-primary-glow"
                                }`}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="truncate">{nested.name}</div>
                                {!isNestedActive && nested.description && (
                                  <div className="text-[9.5px] text-ink-soft/70 truncate group-hover:text-ink-soft transition">
                                    {nested.description}
                                  </div>
                                )}
                              </div>
                              {isNestedActive && (
                                <ChevronRight className="w-3 h-3 shrink-0 opacity-80" />
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* User Profile SaaS Footer Trigger & Popover Box */}
      <div
        ref={profileRef}
        className={`border-t border-border bg-surface-alt/40 relative ${
          isCollapsed ? "p-2 flex flex-col items-center" : "p-2.5"
        }`}
      >
        {/* Profile Card Trigger Button */}
        {isCollapsed ? (
          <div className="flex flex-col items-center gap-1 w-full">
            <button
              type="button"
              onClick={() => setIsProfileOpen((prev) => !prev)}
              className="relative p-0.5 rounded-2xl hover:ring-2 hover:ring-primary-glow/50 transition-all cursor-pointer group"
              aria-label="Open User Profile Menu"
            >
              {avatarUrl ? (
                <div className="w-10 h-10 rounded-2xl overflow-hidden ring-1 ring-border shadow-sm shrink-0">
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-2xl bg-gradient-brand text-primary-foreground font-extrabold text-sm flex items-center justify-center shadow-glow shrink-0 group-hover:scale-105 transition-transform">
                  {firstLetter}
                </div>
              )}
              {/* Online Indicator */}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-surface" />
            </button>
            <span className="text-[9.5px] font-semibold text-ink-soft text-center truncate max-w-[58px] leading-tight">
              {firstName}
            </span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsProfileOpen((prev) => !prev)}
            className="w-full flex items-center justify-between p-2 rounded-2xl hover:bg-surface-alt transition-all group/profile cursor-pointer border border-transparent hover:border-border/60 text-left"
            aria-label="Open User Profile Menu"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                {avatarUrl ? (
                  <div className="w-9 h-9 rounded-xl overflow-hidden ring-1 ring-border shadow-xs">
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-gradient-brand text-primary-foreground font-extrabold text-xs flex items-center justify-center shadow-glow group-hover/profile:scale-105 transition-transform">
                    {firstLetter}
                  </div>
                )}
                {/* Online Indicator */}
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-surface" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-ink truncate group-hover/profile:text-primary-glow transition-colors">
                  {displayName}
                </div>
                <div className="text-[10px] text-ink-soft truncate">
                  {email}
                </div>
              </div>
            </div>
            <ChevronsUpDown
              className={`w-4 h-4 text-ink-soft transition-transform duration-200 shrink-0 ${
                isProfileOpen
                  ? "rotate-180 text-primary-glow"
                  : "group-hover/profile:text-ink"
              }`}
            />
          </button>
        )}

        {/* ======================================================== */}
        {/* SAAS USER PROFILE MODAL / POPOVER BOX                    */}
        {/* ======================================================== */}
        {isProfileOpen && (
          <div
            className={`absolute z-50 bg-surface border border-border rounded-3xl shadow-2xl p-4 space-y-3.5 animate-in fade-in zoom-in-95 duration-150 ${
              isCollapsed
                ? "left-[calc(100%+12px)] bottom-2 w-72"
                : "bottom-[calc(100%+8px)] left-2 right-2 w-[calc(100%-16px)] sm:w-72"
            }`}
          >
            {/* User Identity Header */}
            <div className="flex items-start gap-3 pb-3 border-b border-border">
              <div className="relative shrink-0">
                {avatarUrl ? (
                  <div className="w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-primary-glow/30 shadow-md">
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-gradient-brand text-primary-foreground font-extrabold text-base flex items-center justify-center shadow-glow">
                    {firstLetter}
                  </div>
                )}
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-surface" />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-extrabold text-ink truncate">
                  {displayName}
                </h4>
                <p className="text-[11px] text-ink-soft truncate">{email}</p>
                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  <span className="inline-flex items-center gap-1 text-[9.5px] font-bold text-primary-glow bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                    <Sparkles className="w-2.5 h-2.5 text-primary-glow" /> Pro
                    Career
                  </span>
                  <span className="inline-flex items-center gap-1 text-[9.5px] font-semibold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-2.5 h-2.5 text-emerald-500" />{" "}
                    Active
                  </span>
                </div>
              </div>
            </div>

            {/* Quick SaaS Menu Actions */}
            <div className="space-y-1 pt-1">
              <Link
                href="/profile"
                onClick={() => {
                  setIsProfileOpen(false);
                  if (onClose) onClose();
                }}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-ink hover:text-primary-glow hover:bg-surface-alt transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <UserCheck className="w-4 h-4 text-primary-glow" />
                  <span>My Profile & Identity</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-ink-soft opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link
                href="/resume"
                onClick={() => {
                  setIsProfileOpen(false);
                  if (onClose) onClose();
                }}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-ink hover:text-primary-glow hover:bg-surface-alt transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <Briefcase className="w-4 h-4 text-primary-glow" />
                  <span>Jobs & Applications</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-ink-soft opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link
                href="/drive"
                onClick={() => {
                  setIsProfileOpen(false);
                  if (onClose) onClose();
                }}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-ink-soft hover:text-ink hover:bg-surface-alt transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <HardDrive className="w-4 h-4 text-ink-soft group-hover:text-ink" />
                  <span>Cloud Asset Storage</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-ink-soft opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </Link>
            </div>

            {/* Divider */}
            <div className="border-t border-border pt-1" />

            {/* Logout Action */}
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-destructive hover:bg-destructive/10 border border-destructive/20 hover:border-destructive/30 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                <span>Sign Out</span>
              </div>
              <span className="text-[10px] text-destructive/70 font-semibold bg-destructive/10 px-1.5 py-0.5 rounded-md">
                Log Out
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <aside
        className={`hidden lg:block sticky top-0 h-screen shrink-0 z-30 transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-20" : "w-64 lg:w-60"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in"
            onClick={onClose}
          />
          <div className="relative z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
