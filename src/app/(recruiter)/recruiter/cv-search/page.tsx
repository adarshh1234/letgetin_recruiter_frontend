"use client";

import React, { useState } from "react";
import {
  Search,
  Plus,
  X,
  MoreVertical,
  FileText,
  Eye,
  Download,
  Mail,
  CheckCircle2,
  Filter,
} from "lucide-react";
import { TalentPoolNavTabs } from "@/components/recruiter/TalentPoolNavTabs";

interface CvRecord {
  id: string;
  name: string;
  role: string;
  lastModified: string;
  skills: string[];
  experience: string;
  qualification: string;
  age: string;
}

const SAMPLE_CVS: CvRecord[] = [
  {
    id: "cv-1",
    name: "Sarah Johnson",
    role: "Senior Product Designer",
    lastModified: "2 days ago",
    skills: ["Figma", "UI/UX", "Design Systems"],
    experience: "5+ Years",
    qualification: "Bachelor of Design",
    age: "28",
  },
  {
    id: "cv-2",
    name: "Alex Rivera",
    role: "Lead Full Stack Engineer",
    lastModified: "3 days ago",
    skills: ["React", "Node.js", "TypeScript", "Next.js"],
    experience: "7 Years",
    qualification: "B.Tech Computer Science",
    age: "31",
  },
  {
    id: "cv-3",
    name: "Priya Sharma",
    role: "Product Manager",
    lastModified: "4 days ago",
    skills: ["Agile", "Roadmapping", "Data Analytics"],
    experience: "4 Years",
    qualification: "MBA",
    age: "29",
  },
  {
    id: "cv-4",
    name: "Michael Chang",
    role: "Senior React Developer",
    lastModified: "5 days ago",
    skills: ["React", "Redux", "TailwindCSS"],
    experience: "6 Years",
    qualification: "B.S. Software Engineering",
    age: "30",
  },
  {
    id: "cv-5",
    name: "Emily Watson",
    role: "UI/UX & Brand Designer",
    lastModified: "1 week ago",
    skills: ["UI/UX", "User Research", "Prototyping"],
    experience: "3 Years",
    qualification: "Master of Fine Arts",
    age: "26",
  },
  {
    id: "cv-6",
    name: "David Kim",
    role: "DevOps & Cloud Engineer",
    lastModified: "1 week ago",
    skills: ["AWS", "Kubernetes", "Docker", "Terraform"],
    experience: "5 Years",
    qualification: "B.Tech Information Technology",
    age: "32",
  },
];

const AVAILABLE_FILTER_PILLS = [
  "Age",
  "Skill",
  "Qualification",
  "Experience",
  "Location",
];

export default function CvSearchPage() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeTags, setActiveTags] = useState<{ key: string; value: string }[]>([
    { key: "Age", value: "25-35" },
    { key: "Skill", value: "React & Figma" },
    { key: "Qualification", value: "Degree Certified" },
  ]);
  const [isParsing, setIsParsing] = useState(false);
  const [selectedCv, setSelectedCv] = useState<CvRecord | null>(null);

  // Toggle single selection
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectedIds.length === SAMPLE_CVS.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(SAMPLE_CVS.map((cv) => cv.id));
    }
  };

  // Remove tag
  const removeTag = (index: number) => {
    setActiveTags((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Add tag pill
  const addTagPill = (pill: string) => {
    if (!activeTags.some((t) => t.key === pill)) {
      setActiveTags((prev) => [...prev, { key: pill, value: "Active filter" }]);
    }
  };

  // Parse Action
  const handleParse = () => {
    setIsParsing(true);
    setTimeout(() => {
      setIsParsing(false);
    }, 800);
  };

  // Reset Filters
  const handleCancel = () => {
    setSearchKeyword("");
    setActiveTags([]);
    setSelectedIds([]);
  };

  const filteredCvs = SAMPLE_CVS.filter((cv) => {
    if (!searchKeyword.trim()) return true;
    const q = searchKeyword.toLowerCase();
    return (
      cv.name.toLowerCase().includes(q) ||
      cv.role.toLowerCase().includes(q) ||
      cv.skills.some((s) => s.toLowerCase().includes(q))
    );
  });

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-6">
      {/* Top Unified Navigation Tabs */}
      <TalentPoolNavTabs />

      {/* TOP CARD: Search & Criteria (Matching CvSearch.jpeg) */}
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-xs space-y-5">
        <h2 className="text-base sm:text-lg font-bold text-ink">Search</h2>

        {/* Search Input Bar */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-ink-soft absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Search........"
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-surface text-ink placeholder:text-ink-soft text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
          />
        </div>

        {/* Filter Pills Row */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {AVAILABLE_FILTER_PILLS.map((pill) => (
            <button
              key={pill}
              type="button"
              onClick={() => addTagPill(pill)}
              className="px-4 py-1.5 rounded-xl border border-border bg-surface hover:bg-surface-alt text-ink-soft hover:text-ink text-xs font-medium transition cursor-pointer"
            >
              {pill}
            </button>
          ))}
          <button
            type="button"
            onClick={() => addTagPill("General")}
            className="w-8 h-8 rounded-full border border-border bg-surface hover:bg-surface-alt flex items-center justify-center text-ink-soft hover:text-ink transition cursor-pointer"
            title="Add Custom Filter"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Active Selected Tags with Close 'x' (matching CvSearch.jpeg) */}
        {activeTags.length > 0 && (
          <div className="flex items-center gap-2.5 flex-wrap pt-1">
            {activeTags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-border bg-surface-alt/70 text-ink text-xs font-semibold"
              >
                <span>
                  {tag.key}: <span className="font-normal text-ink-soft">{tag.value}</span>
                </span>
                <button
                  type="button"
                  onClick={() => removeTag(idx)}
                  className="hover:text-destructive transition cursor-pointer"
                  title="Remove filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Bottom Actions: Cancel & Parse (matching CvSearch.jpeg) */}
        <div className="flex items-center justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2.5 rounded-xl border border-border bg-surface hover:bg-surface-alt text-xs font-semibold text-ink transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleParse}
            disabled={isParsing}
            className="px-7 py-2.5 rounded-xl bg-[#0d3b37] hover:bg-[#092b28] text-white text-xs font-bold shadow-elegant hover:shadow-glow hover:scale-[1.02] active:scale-95 transition cursor-pointer disabled:opacity-50"
          >
            {isParsing ? "Parsing..." : "Parse"}
          </button>
        </div>
      </div>

      {/* BOTTOM CARD: List all CV's (Matching CvSearch.jpeg) */}
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-base sm:text-lg font-bold text-ink">
            List all CV&apos;s
          </h2>
          <span className="text-xs text-ink-soft">
            {filteredCvs.length} candidate resumes available
          </span>
        </div>

        {/* List of Candidate CV Rows */}
        <div className="space-y-3">
          {filteredCvs.map((cv) => {
            const isChecked = selectedIds.includes(cv.id);

            return (
              <div
                key={cv.id}
                className={`rounded-2xl border border-border p-4 sm:px-6 sm:py-4 flex items-center justify-between gap-4 transition-all hover:border-primary/40 ${
                  isChecked ? "bg-primary/5 border-primary/40" : "bg-surface"
                }`}
              >
                {/* Left: Checkbox + Name & Subtitle */}
                <div className="flex items-center gap-4 min-w-0">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleSelect(cv.id)}
                    className="w-4 h-4 rounded-md border-border text-[#0d3b37] focus:ring-[#0d3b37] cursor-pointer"
                  />
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-bold text-ink truncate">
                      {cv.name}
                    </h3>
                    <p className="text-xs text-ink-soft truncate mt-0.5">
                      {cv.role}
                    </p>
                  </div>
                </div>

                {/* Right: Last modified timestamp + Options Menu */}
                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-xs text-ink-soft font-medium">
                    Last modified: {cv.lastModified}
                  </span>

                  <button
                    type="button"
                    onClick={() => setSelectedCv(cv)}
                    className="p-1.5 rounded-lg text-ink-soft hover:text-ink hover:bg-surface-alt transition cursor-pointer"
                    title="Actions"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Candidate CV Quick Preview Modal */}
      {selectedCv && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
            <button
              type="button"
              onClick={() => setSelectedCv(null)}
              className="absolute top-5 right-5 p-1.5 rounded-xl text-ink-soft hover:text-ink hover:bg-surface-alt transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#0d3b37] text-white flex items-center justify-center font-bold text-lg">
                {selectedCv.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-ink">{selectedCv.name}</h3>
                <p className="text-xs text-ink-soft">{selectedCv.role}</p>
              </div>
            </div>

            <div className="space-y-3 bg-surface-alt/50 border border-border/80 rounded-2xl p-4 text-xs">
              <div className="flex justify-between">
                <span className="text-ink-soft">Experience:</span>
                <span className="font-semibold text-ink">{selectedCv.experience}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Qualification:</span>
                <span className="font-semibold text-ink">{selectedCv.qualification}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Age:</span>
                <span className="font-semibold text-ink">{selectedCv.age}</span>
              </div>
              <div>
                <span className="text-ink-soft block mb-1.5">Key Skills:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCv.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2.5 py-1 bg-surface border border-border rounded-lg text-ink font-medium text-[11px]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedCv(null)}
                className="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-ink-soft hover:bg-surface-alt transition cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  alert(`Shortlisted candidate ${selectedCv.name}!`);
                  setSelectedCv(null);
                }}
                className="px-5 py-2 rounded-xl bg-[#0d3b37] hover:bg-[#092b28] text-white text-xs font-bold shadow-glow transition cursor-pointer"
              >
                Shortlist Candidate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
