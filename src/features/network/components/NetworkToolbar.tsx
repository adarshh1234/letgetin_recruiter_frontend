"use client";

import React from "react";
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  Plus,
  RotateCcw,
  Building2,
  MapPin,
  Sparkles,
} from "lucide-react";
import { NetworkFilters, RelationshipStage } from "../types/network.types";

interface NetworkToolbarProps {
  filters: NetworkFilters;
  onFilterChange: (updates: Partial<NetworkFilters>) => void;
  onResetFilters: () => void;
  onOpenAddModal: () => void;
  totalFilteredCount: number;
}

const STAGES: Array<{ value: RelationshipStage | "all"; label: string }> = [
  { value: "all", label: "All Stages" },
  { value: "discover", label: "1. Discover" },
  { value: "connected", label: "2. Connected" },
  { value: "contacted", label: "3. Contacted" },
  { value: "engaged", label: "4. Engaged" },
  { value: "meeting", label: "5. Meeting" },
  { value: "relationship", label: "6. Relationship" },
];

const INDUSTRIES = [
  "All Industries",
  "Technology & AI",
  "Enterprise Software",
  "Cloud Infrastructure",
  "Venture Capital & Talent",
  "Financial Technology",
  "Logistics & Tech",
  "DeepTech & Investment",
];

const LOCATIONS = [
  "All Locations",
  "Bengaluru, India",
  "Hyderabad, India",
  "Mumbai, India",
  "Delhi NCR, India",
  "Pune, India",
];

const SOURCES = [
  "All Sources",
  "Network Recommendation",
  "Alumni Network",
  "Direct Reachout",
  "Event",
  "LinkedIn Import",
  "Investor Network",
];

const SORTS = [
  { value: "recent", label: "Recently Active" },
  { value: "name", label: "Name (A-Z)" },
  { value: "company", label: "Company (A-Z)" },
  { value: "mutual", label: "Most Mutual Connections" },
];

export function NetworkToolbar({
  filters,
  onFilterChange,
  onResetFilters,
  onOpenAddModal,
  totalFilteredCount,
}: NetworkToolbarProps) {
  const hasActiveFilters =
    filters.search !== "" ||
    filters.stage !== "all" ||
    filters.industry !== "all" ||
    filters.location !== "all" ||
    filters.source !== "all" ||
    filters.sort !== "recent";

  return (
    <div className="space-y-3">
      {/* Main Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-3.5 rounded-2xl bg-surface border border-border">
        {/* Left: Search input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-ink-soft absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Search people, companies, job titles, tags..."
            className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-xl bg-surface-alt border border-border text-ink placeholder:text-ink-soft focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ search: "" })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-ink-soft hover:text-ink"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right: Filters, Sort & Action */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Stage Filter */}
          <select
            value={filters.stage}
            onChange={(e) => onFilterChange({ stage: e.target.value as any })}
            className="px-3 py-2 text-xs font-medium rounded-xl bg-surface-alt border border-border text-ink focus:outline-hidden focus:border-primary transition cursor-pointer"
          >
            {STAGES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          {/* Industry Filter */}
          <select
            value={filters.industry}
            onChange={(e) => onFilterChange({ industry: e.target.value })}
            className="px-3 py-2 text-xs font-medium rounded-xl bg-surface-alt border border-border text-ink focus:outline-hidden focus:border-primary transition cursor-pointer max-w-[150px] sm:max-w-none truncate"
          >
            {INDUSTRIES.map((ind) => (
              <option key={ind} value={ind === "All Industries" ? "all" : ind}>
                {ind}
              </option>
            ))}
          </select>

          {/* Location Filter */}
          <select
            value={filters.location}
            onChange={(e) => onFilterChange({ location: e.target.value })}
            className="px-3 py-2 text-xs font-medium rounded-xl bg-surface-alt border border-border text-ink focus:outline-hidden focus:border-primary transition cursor-pointer max-w-[140px] sm:max-w-none truncate"
          >
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc === "All Locations" ? "all" : loc}>
                {loc}
              </option>
            ))}
          </select>

          {/* Source Filter */}
          <select
            value={filters.source}
            onChange={(e) => onFilterChange({ source: e.target.value })}
            className="px-3 py-2 text-xs font-medium rounded-xl bg-surface-alt border border-border text-ink focus:outline-hidden focus:border-primary transition cursor-pointer max-w-[140px] sm:max-w-none truncate"
          >
            {SOURCES.map((src) => (
              <option key={src} value={src === "All Sources" ? "all" : src}>
                {src}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={filters.sort}
            onChange={(e) => onFilterChange({ sort: e.target.value as any })}
            className="px-3 py-2 text-xs font-medium rounded-xl bg-surface-alt border border-border text-ink focus:outline-hidden focus:border-primary transition cursor-pointer"
          >
            {SORTS.map((st) => (
              <option key={st.value} value={st.value}>
                {st.label}
              </option>
            ))}
          </select>

          {/* Quick Add Button */}
          <button
            type="button"
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Contact</span>
          </button>
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 px-1">
          <span className="text-xs font-semibold text-ink-soft flex items-center gap-1">
            <Filter className="w-3 h-3 text-primary-glow" /> Active Filters:
          </span>

          {filters.search && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary-glow border border-primary/20">
              Search: "{filters.search}"
              <button
                onClick={() => onFilterChange({ search: "" })}
                className="hover:text-primary transition"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.stage !== "all" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary-glow border border-primary/20">
              Stage: {filters.stage}
              <button
                onClick={() => onFilterChange({ stage: "all" })}
                className="hover:text-primary transition"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.industry !== "all" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-surface-alt text-ink border border-border">
              Industry: {filters.industry}
              <button
                onClick={() => onFilterChange({ industry: "all" })}
                className="hover:text-ink-soft transition"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.location !== "all" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-surface-alt text-ink border border-border">
              Location: {filters.location}
              <button
                onClick={() => onFilterChange({ location: "all" })}
                className="hover:text-ink-soft transition"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.source !== "all" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-surface-alt text-ink border border-border">
              Source: {filters.source}
              <button
                onClick={() => onFilterChange({ source: "all" })}
                className="hover:text-ink-soft transition"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer ml-1"
          >
            <RotateCcw className="w-3 h-3" /> Clear all
          </button>

          <span className="text-xs text-ink-soft ml-auto font-medium">
            Showing {totalFilteredCount} matching contacts
          </span>
        </div>
      )}
    </div>
  );
}
