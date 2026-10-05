"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  Filter,
  Plus,
  ArrowRight,
  Search,
  CheckCircle2,
  X,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";
import { TalentPoolNavTabs } from "@/components/recruiter/TalentPoolNavTabs";

interface TalentPoolCategory {
  id: string;
  title: string;
  count: number;
  skills: string[];
  progressPercent: number;
}

const INITIAL_CATEGORIES: TalentPoolCategory[] = [
  {
    id: "tech-skills-1",
    title: "Technical Skills",
    count: 1247,
    skills: ["Programming", "Data Analysis", "Cloud Computing"],
    progressPercent: 35,
  },
  {
    id: "react-dev",
    title: "React Developer",
    count: 1247,
    skills: ["Communication", "Js", "Teamwork"],
    progressPercent: 55,
  },
  {
    id: "design-skills-1",
    title: "Design Skills",
    count: 1247,
    skills: ["UI/UX", "Graphic Design", "Prototyping"],
    progressPercent: 42,
  },
  {
    id: "tech-skills-2",
    title: "Technical Skills",
    count: 1247,
    skills: ["Programming", "Data Analysis", "Cloud Computing"],
    progressPercent: 30,
  },
  {
    id: "soft-skills",
    title: "Soft Skills",
    count: 1247,
    skills: ["Communication", "Leadership", "Teamwork"],
    progressPercent: 65,
  },
  {
    id: "design-skills-2",
    title: "Design Skills",
    count: 1247,
    skills: ["UI/UX", "Graphic Design", "Prototyping"],
    progressPercent: 45,
  },
  {
    id: "cloud-devops",
    title: "Cloud & DevOps",
    count: 890,
    skills: ["Docker & Kubernetes", "AWS / GCP", "CI/CD Automation"],
    progressPercent: 70,
  },
  {
    id: "ai-ml",
    title: "AI & Machine Learning",
    count: 642,
    skills: ["LLM Fine-tuning", "Python & PyTorch", "Data Modeling"],
    progressPercent: 60,
  },
  {
    id: "mobile-dev",
    title: "Mobile Engineers",
    count: 430,
    skills: ["React Native", "Flutter", "iOS & Android SDKs"],
    progressPercent: 38,
  },
];

export default function TalentPoolPage() {
  const [categories, setCategories] = useState<TalentPoolCategory[]>(INITIAL_CATEGORIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [selectedSort, setSelectedSort] = useState<"name" | "count" | "progress">("name");

  // Add Candidate Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCandidate, setNewCandidate] = useState({
    name: "",
    email: "",
    category: "React Developer",
    skills: "",
  });
  const [addSuccess, setAddSuccess] = useState(false);

  const filteredCategories = categories.filter((cat) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      cat.title.toLowerCase().includes(q) ||
      cat.skills.some((s) => s.toLowerCase().includes(q))
    );
  }).sort((a, b) => {
    if (selectedSort === "count") return b.count - a.count;
    if (selectedSort === "progress") return b.progressPercent - a.progressPercent;
    return a.title.localeCompare(b.title);
  });

  const handleAddCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCandidate.name.trim()) return;
    setAddSuccess(true);
    setTimeout(() => {
      setAddSuccess(false);
      setShowAddModal(false);
      setNewCandidate({ name: "", email: "", category: "React Developer", skills: "" });
    }, 1200);
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto">
      {/* Top Unified Navigation Tabs */}
      <TalentPoolNavTabs />

      {/* Main Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            Talent Pool
          </h1>
          <p className="text-xs sm:text-sm text-ink-soft mt-1">
            Segmented candidate groups, competency benchmarks, and active hiring pools.
          </p>
        </div>

        {/* Action Buttons matching screenshot */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowFilterDrawer((prev) => !prev)}
            className={`inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl border transition cursor-pointer ${
              showFilterDrawer
                ? "bg-primary/10 border-primary/30 text-primary-glow font-bold"
                : "bg-surface border-border text-ink-soft hover:text-ink hover:bg-surface-alt"
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            Filter
          </button>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 text-xs font-bold bg-[#0d3b37] hover:bg-[#092b28] text-white px-4 py-2.5 rounded-xl shadow-elegant hover:shadow-glow hover:scale-[1.02] active:scale-95 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add New Candidate
          </button>
        </div>
      </div>

      {/* Filter Drawer / Bar */}
      {showFilterDrawer && (
        <div className="mb-6 p-4 rounded-2xl bg-surface border border-border shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-ink-soft absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search category or skill (e.g. React, UI/UX, Programming)..."
              className="input-base text-xs pl-10 w-full"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5 text-ink-soft" />
            <span className="text-xs text-ink-soft font-semibold">Sort:</span>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value as any)}
              className="input-base text-xs py-1.5 px-2.5 rounded-xl"
            >
              <option value="name">Alphabetical</option>
              <option value="count">Candidate Volume</option>
              <option value="progress">Match Rate</option>
            </select>
          </div>
        </div>
      )}

      {/* Grid of Talent Pool Category Cards (3 columns on desktop matching screenshot) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((cat) => (
          <div
            key={cat.id}
            className="rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-xs hover:shadow-elegant transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              {/* Card Title & Candidate Count */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <h2 className="text-sm sm:text-base font-bold text-ink">
                  {cat.title}
                </h2>
                <span className="text-xs text-ink-soft font-medium shrink-0">
                  {cat.count.toLocaleString()} candidates
                </span>
              </div>

              {/* Skill Bullet Points matching screenshot */}
              <ul className="space-y-1.5 mb-5 text-xs text-ink-soft">
                {cat.skills.map((skill, sIdx) => (
                  <li key={sIdx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-ink-soft shrink-0" />
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              {/* Progress bar matching screenshot */}
              <div className="mb-4">
                <div className="h-1.5 w-full bg-surface-alt rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#0d3b37] rounded-full transition-all duration-500"
                    style={{ width: `${cat.progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Action Button: View Candidate List */}
              <Link
                href={`/recruiter/candidates?search=${encodeURIComponent(cat.title)}`}
                className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl border border-border/90 bg-surface text-xs font-semibold text-ink hover:bg-surface-alt transition-colors"
              >
                View Candidate List
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Candidate Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl text-ink-soft hover:text-ink hover:bg-surface-alt transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-xl bg-primary/10 text-primary-glow">
                <Users className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-ink">Add Candidate to Pool</h2>
            </div>
            <p className="text-xs text-ink-soft mb-5">
              Directly inject a prospective talent profile into your recruiter pool.
            </p>

            {addSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center text-emerald-600 dark:text-emerald-400 font-bold text-xs flex flex-col items-center gap-2">
                <CheckCircle2 className="w-8 h-8" />
                Candidate added to talent pool successfully!
              </div>
            ) : (
              <form onSubmit={handleAddCandidate} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-ink block mb-1">
                    Candidate Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCandidate.name}
                    onChange={(e) =>
                      setNewCandidate((p) => ({ ...p, name: e.target.value }))
                    }
                    placeholder="e.g. Sarah Johnson"
                    className="input-base text-xs w-full"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-ink block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={newCandidate.email}
                    onChange={(e) =>
                      setNewCandidate((p) => ({ ...p, email: e.target.value }))
                    }
                    placeholder="e.g. sarah.johnson@example.com"
                    className="input-base text-xs w-full"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-ink block mb-1">
                    Target Talent Category
                  </label>
                  <select
                    value={newCandidate.category}
                    onChange={(e) =>
                      setNewCandidate((p) => ({ ...p, category: e.target.value }))
                    }
                    className="input-base text-xs w-full"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.title}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-ink block mb-1">
                    Key Skills (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newCandidate.skills}
                    onChange={(e) =>
                      setNewCandidate((p) => ({ ...p, skills: e.target.value }))
                    }
                    placeholder="e.g. React, Next.js, Figma"
                    className="input-base text-xs w-full"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-ink-soft hover:bg-surface-alt transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#0d3b37] hover:bg-[#092b28] text-white text-xs font-bold shadow-glow transition cursor-pointer"
                  >
                    Save Candidate
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
