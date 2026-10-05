"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { X, Search, ChevronDown } from "lucide-react";
import { JobSkillRequirement, SkillProficiency } from "@/features/recruiter/types";
import { searchSkillCatalog } from "@/features/recruiter/constants/skillCatalog";

const PROFICIENCY_OPTIONS: { value: SkillProficiency; label: string }[] = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "expert", label: "Expert" },
];

export type SkillRequirementsInputProps =
  | {
      showProficiency?: true;
      label: string;
      description?: string;
      skills: JobSkillRequirement[];
      onSkillsChange: (skills: JobSkillRequirement[]) => void;
      disallowedSkills?: (JobSkillRequirement | string)[];
      addButtonText?: string;
      placeholder?: string;
      badgeTone?: "primary" | "neutral";
    }
  | {
      showProficiency: false;
      label: string;
      description?: string;
      skills: string[];
      onSkillsChange: (skills: string[]) => void;
      disallowedSkills?: (JobSkillRequirement | string)[];
      addButtonText?: string;
      placeholder?: string;
      badgeTone?: "primary" | "neutral";
    };

export function SkillRequirementsInput(props: SkillRequirementsInputProps) {
  const {
    label,
    description,
    disallowedSkills = [],
    placeholder = "Search catalogue or type custom skill...",
    badgeTone = "primary",
  } = props;

  const showProficiency = props.showProficiency !== false;
  const skillsCount = props.skills.length;

  const [query, setQuery] = useState("");
  const [selectedProficiency, setSelectedProficiency] = useState<SkillProficiency>("intermediate");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter catalogue suggestions deterministically (zero network requests, zero Gemini)
  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    return searchSkillCatalog(query, 6);
  }, [query]);

  // Check if current query is an exact match to a suggestion
  const exactMatchExists = suggestions.some(
    (s) => s.toLowerCase() === query.trim().toLowerCase()
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
        setHighlightedIndex(-1);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddSkill = (
    skillName: string,
    proficiency: SkillProficiency = selectedProficiency
  ) => {
    const trimmed = skillName.trim();
    if (!trimmed) return;
    const lower = trimmed.toLowerCase();

    // Check duplicate in current skills
    if (showProficiency) {
      const reqSkills = props.skills as JobSkillRequirement[];
      if (reqSkills.some((s) => s.name.toLowerCase() === lower)) {
        setDuplicateWarning(`"${trimmed}" is already in this list.`);
        setTimeout(() => setDuplicateWarning(null), 3000);
        return;
      }
    } else {
      const prefSkills = props.skills as string[];
      if (prefSkills.some((s) => s.toLowerCase() === lower)) {
        setDuplicateWarning(`"${trimmed}" is already in this list.`);
        setTimeout(() => setDuplicateWarning(null), 3000);
        return;
      }
    }

    // Check if disallowed (e.g. already in required skills)
    if (
      disallowedSkills.some((s) => {
        const name = typeof s === "string" ? s : s.name;
        return name.toLowerCase() === lower;
      })
    ) {
      setDuplicateWarning(`"${trimmed}" is already listed in Required Skills.`);
      setTimeout(() => setDuplicateWarning(null), 3000);
      return;
    }

    if (showProficiency) {
      const reqSkills = props.skills as JobSkillRequirement[];
      props.onSkillsChange([...reqSkills, { name: trimmed, proficiency }]);
    } else {
      const prefSkills = props.skills as string[];
      props.onSkillsChange([...prefSkills, trimmed]);
    }

    setQuery("");
    setIsDropdownOpen(false);
    setHighlightedIndex(-1);
    setSelectedProficiency("intermediate");
    setDuplicateWarning(null);

    // Retain focus in search input for continuous rapid skill entry
    setTimeout(() => {
      inputRef.current?.focus();
    }, 10);
  };

  const handleUpdateProficiency = (skillName: string, newProf: SkillProficiency) => {
    if (!showProficiency) return;
    const reqSkills = props.skills as JobSkillRequirement[];
    props.onSkillsChange(
      reqSkills.map((s) =>
        s.name.toLowerCase() === skillName.toLowerCase()
          ? { ...s, proficiency: newProf }
          : s
      )
    );
  };

  const handleRemoveSkill = (skillName: string) => {
    const lower = skillName.toLowerCase();
    if (showProficiency) {
      const reqSkills = props.skills as JobSkillRequirement[];
      props.onSkillsChange(reqSkills.filter((s) => s.name.toLowerCase() !== lower));
    } else {
      const prefSkills = props.skills as string[];
      props.onSkillsChange(prefSkills.filter((s) => s.toLowerCase() !== lower));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const totalOptions = suggestions.length + (!exactMatchExists && query.trim() ? 1 : 0);

    if (e.key === "ArrowDown") {
      if (!isDropdownOpen && query.trim()) {
        setIsDropdownOpen(true);
      }
      e.preventDefault();
      if (totalOptions > 0) {
        setHighlightedIndex((prev) => (prev + 1) % totalOptions);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (totalOptions > 0) {
        setHighlightedIndex((prev) => (prev - 1 + totalOptions) % totalOptions);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (
        isDropdownOpen &&
        highlightedIndex >= 0 &&
        highlightedIndex < suggestions.length
      ) {
        handleAddSkill(suggestions[highlightedIndex]);
      } else if (
        isDropdownOpen &&
        !exactMatchExists &&
        highlightedIndex === suggestions.length
      ) {
        handleAddSkill(query.trim());
      } else if (query.trim()) {
        handleAddSkill(query.trim());
      }
    } else if (e.key === "Escape") {
      setIsDropdownOpen(false);
      setHighlightedIndex(-1);
    }
  };

  return (
    <div className="space-y-3">
      {/* 1. Header & Reactive Count */}
      <div className="flex items-center justify-between gap-2">
        <label className="text-sm font-semibold text-ink">{label}</label>
        {skillsCount > 0 ? (
          <span className="text-xs text-ink-soft font-medium">
            {skillsCount} {skillsCount === 1 ? "skill" : "skills"} specified
          </span>
        ) : (
          <span className="text-xs text-ink-soft">No skills specified yet</span>
        )}
      </div>

      {/* 2. Optional Description */}
      {description && <p className="text-xs text-ink-soft -mt-1.5">{description}</p>}

      {/* 3. Skill Search / Add Control (Always situated ABOVE the list) */}
      <div ref={containerRef} className="space-y-1.5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Autocomplete Input */}
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-ink-soft absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setHighlightedIndex(-1);
                setDuplicateWarning(null);
                setIsDropdownOpen(true);
              }}
              onFocus={() => {
                if (query.trim().length > 0) {
                  setIsDropdownOpen(true);
                }
              }}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="w-full text-xs font-medium pl-8 pr-3 py-2 rounded-lg border border-border bg-surface text-ink placeholder:text-ink-soft/70 focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs transition"
            />

            {/* Suggestions Dropdown */}
            {isDropdownOpen && query.trim().length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-surface border border-border rounded-xl shadow-lg z-50 overflow-hidden divide-y divide-border/50 max-h-56 overflow-y-auto">
                {suggestions.map((s, idx) => (
                  <div
                    key={s}
                    className={`w-full px-3 py-2 text-xs flex items-center justify-between transition cursor-pointer group ${
                      highlightedIndex === idx
                        ? "bg-primary/10 text-primary-glow font-semibold"
                        : "hover:bg-surface-alt text-ink"
                    }`}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      // Clicking the suggestion selects it into the search input
                      setQuery(s);
                      setIsDropdownOpen(false);
                      setHighlightedIndex(-1);
                      setTimeout(() => inputRef.current?.focus(), 10);
                    }}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="truncate">{s}</span>
                      <span className="text-[10px] text-ink-soft shrink-0">Catalogue</span>
                    </div>
                    <button
                      type="button"
                      title={`Add ${s} immediately`}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleAddSkill(s);
                      }}
                      className="text-[10px] font-semibold text-primary-glow hover:underline opacity-80 group-hover:opacity-100 px-1.5 py-0.5 rounded transition cursor-pointer"
                    >
                      + Add
                    </button>
                  </div>
                ))}

                {/* Custom Skill Option */}
                {!exactMatchExists && query.trim() && (
                  <div
                    className={`w-full px-3 py-2 text-xs flex items-center justify-between transition cursor-pointer group ${
                      highlightedIndex === suggestions.length
                        ? "bg-primary/10 text-primary-glow font-semibold"
                        : "hover:bg-surface-alt text-ink"
                    }`}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setQuery(query.trim());
                      setIsDropdownOpen(false);
                      setHighlightedIndex(-1);
                      setTimeout(() => inputRef.current?.focus(), 10);
                    }}
                  >
                    <span className="truncate">
                      Use <span className="font-bold">"{query.trim()}"</span>
                    </span>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleAddSkill(query.trim());
                      }}
                      className="text-[10px] text-primary font-semibold hover:underline px-1.5 py-0.5 shrink-0 ml-2 cursor-pointer"
                    >
                      + Add Custom
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Proficiency Dropdown (ONLY shown for Required Skills) & Add Button */}
          <div className="flex items-center gap-2">
            {showProficiency && (
              <div className="relative inline-block w-full sm:w-[140px]">
                <select
                  value={selectedProficiency}
                  onChange={(e) =>
                    setSelectedProficiency(e.target.value as SkillProficiency)
                  }
                  className="w-full text-xs font-semibold py-2 pl-3 pr-7 rounded-lg border border-border bg-surface text-ink appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs transition"
                >
                  {PROFICIENCY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-ink-soft pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
              </div>
            )}

            <button
              type="button"
              disabled={!query.trim()}
              onClick={() => handleAddSkill(query.trim())}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition disabled:opacity-40 disabled:cursor-not-allowed shrink-0 cursor-pointer shadow-xs"
            >
              Add
            </button>
          </div>
        </div>

        {/* Duplicate or Constraint Warning */}
        {duplicateWarning && (
          <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
            {duplicateWarning}
          </p>
        )}
      </div>

      {/* 4. Existing Skills Table / List (Situated below the add control) */}
      {skillsCount > 0 ? (
        <div className="border border-border rounded-xl overflow-hidden bg-surface shadow-xs">
          {/* Table Header (Desktop) */}
          <div
            className={`hidden sm:grid ${
              showProficiency ? "grid-cols-[1fr_170px_40px]" : "grid-cols-[1fr_40px]"
            } items-center px-4 py-2 bg-surface-alt/70 border-b border-border text-[11px] font-bold text-ink-soft uppercase tracking-wider`}
          >
            <span>Skill</span>
            {showProficiency && <span>Expected proficiency</span>}
            <span className="sr-only">Actions</span>
          </div>

          {/* Skill Rows */}
          <div className="divide-y divide-border/60">
            {showProficiency
              ? (props.skills as JobSkillRequirement[]).map((skill) => (
                  <div
                    key={skill.name}
                    className="flex flex-col sm:grid sm:grid-cols-[1fr_170px_40px] sm:items-center gap-2 p-3 hover:bg-surface-alt/40 transition"
                  >
                    {/* Skill Name */}
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`inline-block w-2 h-2 rounded-full shrink-0 ${
                          badgeTone === "primary" ? "bg-primary" : "bg-ink-soft"
                        }`}
                      />
                      <span
                        className="text-sm font-semibold text-ink truncate"
                        title={skill.name}
                      >
                        {skill.name}
                      </span>
                    </div>

                    {/* Mobile & Desktop: Proficiency Selector + Remove Button */}
                    <div className="flex items-center justify-between sm:contents gap-2">
                      <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                        <span className="sm:hidden text-xs text-ink-soft shrink-0">
                          Expected proficiency:
                        </span>
                        <div className="relative inline-block w-full sm:w-auto">
                          <select
                            value={skill.proficiency}
                            onChange={(e) =>
                              handleUpdateProficiency(
                                skill.name,
                                e.target.value as SkillProficiency
                              )
                            }
                            className="w-full sm:w-[155px] text-xs font-semibold py-1.5 pl-3 pr-8 rounded-lg border border-border bg-surface text-ink hover:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer transition shadow-2xs"
                          >
                            {PROFICIENCY_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 text-ink-soft pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>

                      {/* Remove Button */}
                      <div className="flex items-center justify-end sm:justify-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill.name)}
                          className="p-1 rounded-md text-ink-soft hover:text-destructive hover:bg-destructive/10 transition cursor-pointer"
                          title={`Remove ${skill.name}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              : (props.skills as string[]).map((skillName) => (
                  <div
                    key={skillName}
                    className="flex items-center justify-between sm:grid sm:grid-cols-[1fr_40px] sm:items-center gap-2 p-3 hover:bg-surface-alt/40 transition"
                  >
                    {/* Skill Name */}
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`inline-block w-2 h-2 rounded-full shrink-0 ${
                          badgeTone === "primary" ? "bg-primary" : "bg-ink-soft"
                        }`}
                      />
                      <span
                        className="text-sm font-semibold text-ink truncate"
                        title={skillName}
                      >
                        {skillName}
                      </span>
                    </div>

                    {/* Remove Button */}
                    <div className="flex items-center justify-end sm:justify-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skillName)}
                        className="p-1 rounded-md text-ink-soft hover:text-destructive hover:bg-destructive/10 transition cursor-pointer"
                        title={`Remove ${skillName}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
