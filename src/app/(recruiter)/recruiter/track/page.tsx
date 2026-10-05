"use client";

import React, { useState } from "react";
import {
  Search,
  ChevronDown,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  X,
} from "lucide-react";
import { TalentPoolNavTabs } from "@/components/recruiter/TalentPoolNavTabs";

interface TrackApplicantRecord {
  id: string;
  candidateName: string;
  position: string;
  experience: string;
  appliedDate: string;
  currentStatus: "Shortlisted" | "Pending" | "Rejected" | "Interview";
  department: string;
}

const INITIAL_TRACK_DATA: TrackApplicantRecord[] = [
  {
    id: "track-1",
    candidateName: "Sarah Johnson",
    position: "UI/UX Designer",
    experience: "2 Yr",
    appliedDate: "July 20, 2025",
    currentStatus: "Shortlisted",
    department: "Design",
  },
  {
    id: "track-2",
    candidateName: "Sarah Johnson",
    position: "Marketing",
    experience: "Office Equipment",
    appliedDate: "July 20, 2025",
    currentStatus: "Pending",
    department: "Marketing",
  },
  {
    id: "track-3",
    candidateName: "Sarah Johnson",
    position: "Marketing",
    experience: "Office Equipment",
    appliedDate: "July 20, 2025",
    currentStatus: "Rejected",
    department: "Marketing",
  },
  {
    id: "track-4",
    candidateName: "Sarah Johnson",
    position: "UI/UX Designer",
    experience: "2 Yr",
    appliedDate: "July 20, 2025",
    currentStatus: "Shortlisted",
    department: "Design",
  },
  {
    id: "track-5",
    candidateName: "Sarah Johnson",
    position: "UI/UX Designer",
    experience: "2 Yr",
    appliedDate: "July 20, 2025",
    currentStatus: "Shortlisted",
    department: "Design",
  },
  {
    id: "track-6",
    candidateName: "Sarah Johnson",
    position: "UI/UX Designer",
    experience: "2 Yr",
    appliedDate: "July 20, 2025",
    currentStatus: "Shortlisted",
    department: "Design",
  },
  {
    id: "track-7",
    candidateName: "Sarah Johnson",
    position: "UI/UX Designer",
    experience: "2 Yr",
    appliedDate: "July 20, 2025",
    currentStatus: "Shortlisted",
    department: "Design",
  },
  {
    id: "track-8",
    candidateName: "Sarah Johnson",
    position: "UI/UX Designer",
    experience: "2 Yr",
    appliedDate: "July 20, 2025",
    currentStatus: "Shortlisted",
    department: "Design",
  },
];

export default function TrackApplicantsPage() {
  const [records, setRecords] = useState<TrackApplicantRecord[]>(INITIAL_TRACK_DATA);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateRangeFilter, setDateRangeFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Edit Modal State
  const [editingItem, setEditingItem] = useState<TrackApplicantRecord | null>(null);

  // Toggle selection
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredRecords.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredRecords.map((r) => r.id));
    }
  };

  const handleStatusChange = (id: string, newStatus: TrackApplicantRecord["currentStatus"]) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, currentStatus: newStatus } : r))
    );
  };

  const handleDelete = (id: string) => {
    if (confirm("Remove applicant from tracking table?")) {
      setRecords((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setRecords((prev) =>
      prev.map((r) => (r.id === editingItem.id ? editingItem : r))
    );
    setEditingItem(null);
  };

  const filteredRecords = records.filter((r) => {
    if (statusFilter && r.currentStatus !== statusFilter) return false;
    if (departmentFilter && r.department !== departmentFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.candidateName.toLowerCase().includes(q) ||
        r.position.toLowerCase().includes(q) ||
        r.experience.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusDropdownStyle = (status: TrackApplicantRecord["currentStatus"]) => {
    switch (status) {
      case "Shortlisted":
        return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20";
      case "Pending":
        return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20";
      case "Rejected":
        return "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20";
      case "Interview":
        return "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20";
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-6">
      {/* Top Unified Navigation Tabs */}
      <TalentPoolNavTabs />

      {/* TOP CARD: Track Applicant Filters (Matching TrackApplicants.jpeg) */}
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-7 shadow-xs space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-ink">
          Track Applicant
        </h2>

        {/* Filter Bar Row: Status, Date Range, Department, Search */}
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Status Dropdown */}
          <div className="relative w-full md:w-44">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface text-ink text-xs font-semibold appearance-none outline-none focus:border-primary pr-8"
            >
              <option value="">Status</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
              <option value="Interview">Interview</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-ink-soft absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Date Range Dropdown */}
          <div className="relative w-full md:w-44">
            <select
              value={dateRangeFilter}
              onChange={(e) => setDateRangeFilter(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface text-ink text-xs font-semibold appearance-none outline-none focus:border-primary pr-8"
            >
              <option value="">Date Range</option>
              <option value="today">Today</option>
              <option value="this_week">This Week</option>
              <option value="this_month">This Month</option>
              <option value="all_time">All Time</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-ink-soft absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Department Dropdown */}
          <div className="relative w-full md:w-48">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface text-ink text-xs font-semibold appearance-none outline-none focus:border-primary pr-8"
            >
              <option value="">Department</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Engineering">Engineering</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-ink-soft absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Search Input Bar */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-ink-soft absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search........"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-surface text-ink text-xs placeholder:text-ink-soft outline-none focus:border-primary transition"
            />
          </div>
        </div>
      </div>

      {/* BOTTOM CARD: Tracking Table (Matching TrackApplicants.jpeg) */}
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-xs space-y-5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-[10px] font-extrabold uppercase tracking-wider text-ink-soft">
                <th className="px-4 py-3.5 w-10">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length === filteredRecords.length &&
                      filteredRecords.length > 0
                    }
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded-md border-border text-[#0d3b37] focus:ring-[#0d3b37] cursor-pointer"
                  />
                </th>
                <th className="px-5 py-3.5">Candidate</th>
                <th className="px-5 py-3.5">Position</th>
                <th className="px-5 py-3.5">Experience</th>
                <th className="px-5 py-3.5">Applied Date</th>
                <th className="px-5 py-3.5">Current Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-ink-soft">
                    No applicant tracking records found matching your query.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((item) => {
                  const isChecked = selectedIds.includes(item.id);

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-surface-alt/40 transition-colors ${
                        isChecked ? "bg-primary/5" : ""
                      }`}
                    >
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelect(item.id)}
                          className="w-4 h-4 rounded-md border-border text-[#0d3b37] focus:ring-[#0d3b37] cursor-pointer"
                        />
                      </td>
                      <td className="px-5 py-4 font-bold text-ink whitespace-nowrap">
                        {item.candidateName}
                      </td>
                      <td className="px-5 py-4 font-medium text-ink whitespace-nowrap">
                        {item.position}
                      </td>
                      <td className="px-5 py-4 text-ink-soft whitespace-nowrap">
                        {item.experience}
                      </td>
                      <td className="px-5 py-4 text-ink-soft whitespace-nowrap">
                        {item.appliedDate}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        {/* Status dropdown badge matching screenshot */}
                        <div className="relative inline-block">
                          <select
                            value={item.currentStatus}
                            onChange={(e) =>
                              handleStatusChange(item.id, e.target.value as any)
                            }
                            className={`px-3 py-1 pr-6 rounded-lg text-[11px] font-bold border appearance-none cursor-pointer outline-none transition ${getStatusDropdownStyle(
                              item.currentStatus
                            )}`}
                          >
                            <option value="Shortlisted">Shortlisted</option>
                            <option value="Pending">Pending</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Interview">Interview</option>
                          </select>
                          <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-70" />
                        </div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingItem(item)}
                            className="p-1.5 rounded-lg text-ink-soft hover:text-ink hover:bg-surface-alt transition cursor-pointer"
                            title="Edit Applicant"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 rounded-lg text-ink-soft hover:text-destructive hover:bg-destructive/10 transition cursor-pointer"
                            title="Delete Applicant"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination matching TrackApplicants.jpeg: < 1 2 > */}
        <div className="flex items-center justify-center gap-1.5 pt-3">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-ink-soft hover:bg-surface-alt disabled:opacity-40 transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setCurrentPage(1)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs transition cursor-pointer ${
              currentPage === 1
                ? "bg-[#0d3b37] text-white shadow-xs"
                : "border border-border text-ink-soft hover:bg-surface-alt"
            }`}
          >
            1
          </button>
          <button
            type="button"
            onClick={() => setCurrentPage(2)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs transition cursor-pointer ${
              currentPage === 2
                ? "bg-[#0d3b37] text-white shadow-xs"
                : "border border-border text-ink-soft hover:bg-surface-alt"
            }`}
          >
            2
          </button>
          <button
            type="button"
            onClick={() => setCurrentPage(2)}
            className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-ink-soft hover:bg-surface-alt transition cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
            <button
              type="button"
              onClick={() => setEditingItem(null)}
              className="absolute top-5 right-5 p-1.5 rounded-xl text-ink-soft hover:text-ink hover:bg-surface-alt transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-ink mb-1">Edit Applicant</h3>
            <p className="text-xs text-ink-soft mb-5">Update tracking details.</p>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-ink block mb-1">Candidate Name</label>
                <input
                  type="text"
                  required
                  value={editingItem.candidateName}
                  onChange={(e) =>
                    setEditingItem((p) => p ? { ...p, candidateName: e.target.value } : null)
                  }
                  className="input-base text-xs w-full"
                />
              </div>

              <div>
                <label className="font-bold text-ink block mb-1">Position</label>
                <input
                  type="text"
                  required
                  value={editingItem.position}
                  onChange={(e) =>
                    setEditingItem((p) => p ? { ...p, position: e.target.value } : null)
                  }
                  className="input-base text-xs w-full"
                />
              </div>

              <div>
                <label className="font-bold text-ink block mb-1">Experience</label>
                <input
                  type="text"
                  value={editingItem.experience}
                  onChange={(e) =>
                    setEditingItem((p) => p ? { ...p, experience: e.target.value } : null)
                  }
                  className="input-base text-xs w-full"
                />
              </div>

              <div>
                <label className="font-bold text-ink block mb-1">Status</label>
                <select
                  value={editingItem.currentStatus}
                  onChange={(e) =>
                    setEditingItem((p) => p ? { ...p, currentStatus: e.target.value as any } : null)
                  }
                  className="input-base text-xs w-full"
                >
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Interview">Interview</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-ink-soft hover:bg-surface-alt transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0d3b37] hover:bg-[#092b28] text-white text-xs font-bold transition cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
