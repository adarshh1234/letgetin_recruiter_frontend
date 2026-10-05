"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  RotateCcw,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { TalentPoolNavTabs } from "@/components/recruiter/TalentPoolNavTabs";

interface CandidateRecord {
  id: string;
  vacancy: string;
  candidateName: string;
  hiringManager: string;
  dateOfApplication: string;
  status: "Shortlisted" | "Interview" | "Reviewing" | "Offered" | "Rejected";
  method: string;
}

const INITIAL_RECORDS: CandidateRecord[] = [
  {
    id: "cand-1",
    vacancy: "Next js",
    candidateName: "Karthika",
    hiringManager: "Amal Benny",
    dateOfApplication: "2024-03-29",
    status: "Shortlisted",
    method: "Direct Portal",
  },
  {
    id: "cand-2",
    vacancy: "Nodejs developer",
    candidateName: "Amal Benny",
    hiringManager: "Amal Benny",
    dateOfApplication: "2024-03-29",
    status: "Shortlisted",
    method: "Referral",
  },
  {
    id: "cand-3",
    vacancy: "Senior Product Designer",
    candidateName: "Sarah Johnson",
    hiringManager: "Sarah Johnson",
    dateOfApplication: "2024-03-29",
    status: "Interview",
    method: "LinkedIn Import",
  },
  {
    id: "cand-4",
    vacancy: "Cloud Infrastructure Specialist",
    candidateName: "Alex Rivera",
    hiringManager: "Amal Benny",
    dateOfApplication: "2024-04-02",
    status: "Reviewing",
    method: "Direct Portal",
  },
  {
    id: "cand-5",
    vacancy: "AI Research Engineer",
    candidateName: "Devon Vance",
    hiringManager: "Sarah Johnson",
    dateOfApplication: "2024-04-10",
    status: "Offered",
    method: "Talent Pool Sourcing",
  },
];

export default function CandidatesListPage() {
  // Filter form state
  const [filters, setFilters] = useState({
    jobTitle: "",
    vacancy: "",
    hiringManager: "",
    status: "",
    candidateName: "",
    keywords: "",
    dateFrom: "",
    dateTo: "",
    method: "",
  });

  const [records, setRecords] = useState<CandidateRecord[]>(INITIAL_RECORDS);
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateRecord | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<CandidateRecord | null>(null);

  // Add Candidate modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({
    vacancy: "Next js",
    candidateName: "",
    hiringManager: "Amal Benny",
    dateOfApplication: new Date().toISOString().slice(0, 10),
    status: "Shortlisted" as CandidateRecord["status"],
    method: "Direct Portal",
  });

  const handleReset = () => {
    const emptyFilters = {
      jobTitle: "",
      vacancy: "",
      hiringManager: "",
      status: "",
      candidateName: "",
      keywords: "",
      dateFrom: "",
      dateTo: "",
      method: "",
    };
    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedFilters(filters);
    setCurrentPage(1);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this candidate record?")) {
      setRecords((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const handleEditClick = (cand: CandidateRecord) => {
    setEditingCandidate(cand);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCandidate) return;
    setRecords((prev) =>
      prev.map((r) => (r.id === editingCandidate.id ? editingCandidate : r))
    );
    setIsEditModalOpen(false);
  };

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.candidateName.trim()) return;
    const created: CandidateRecord = {
      id: `cand-${Date.now()}`,
      ...newEntry,
    };
    setRecords((prev) => [created, ...prev]);
    setIsAddModalOpen(false);
    setNewEntry({
      vacancy: "Next js",
      candidateName: "",
      hiringManager: "Amal Benny",
      dateOfApplication: new Date().toISOString().slice(0, 10),
      status: "Shortlisted",
      method: "Direct Portal",
    });
  };

  // Filter evaluation
  const filteredRecords = records.filter((r) => {
    if (appliedFilters.jobTitle && !r.vacancy.toLowerCase().includes(appliedFilters.jobTitle.toLowerCase())) return false;
    if (appliedFilters.vacancy && r.vacancy !== appliedFilters.vacancy) return false;
    if (appliedFilters.hiringManager && r.hiringManager !== appliedFilters.hiringManager) return false;
    if (appliedFilters.status && r.status !== appliedFilters.status) return false;
    if (appliedFilters.candidateName && !r.candidateName.toLowerCase().includes(appliedFilters.candidateName.toLowerCase())) return false;
    if (appliedFilters.keywords && !r.vacancy.toLowerCase().includes(appliedFilters.keywords.toLowerCase()) && !r.candidateName.toLowerCase().includes(appliedFilters.keywords.toLowerCase())) return false;
    if (appliedFilters.dateFrom && r.dateOfApplication < appliedFilters.dateFrom) return false;
    if (appliedFilters.dateTo && r.dateOfApplication > appliedFilters.dateTo) return false;
    if (appliedFilters.method && r.method !== appliedFilters.method) return false;
    return true;
  });

  const getStatusBadgeClass = (status: CandidateRecord["status"]) => {
    switch (status) {
      case "Shortlisted":
        return "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20";
      case "Interview":
        return "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20";
      case "Reviewing":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "Offered":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "Rejected":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-6">
      {/* Top Unified Navigation Tabs */}
      <TalentPoolNavTabs />

      {/* TOP CARD: Candidates Filter Form (Matching Candidates.jpeg) */}
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-xs">
        <h2 className="text-base sm:text-lg font-bold text-ink mb-6">
          Candidates
        </h2>

        <form onSubmit={handleSearch} className="space-y-4">
          {/* Row 1: Job Title, Vacancy, Hiring Manager, Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-bold text-ink block mb-1.5">
                Job Title
              </label>
              <select
                value={filters.jobTitle}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, jobTitle: e.target.value }))
                }
                className="input-base text-xs w-full"
              >
                <option value="">Select Job Title</option>
                <option value="Next js">Next js</option>
                <option value="Nodejs developer">Nodejs developer</option>
                <option value="Senior Product Designer">Senior Product Designer</option>
                <option value="Cloud Infrastructure Specialist">Cloud Infrastructure Specialist</option>
                <option value="AI Research Engineer">AI Research Engineer</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-ink block mb-1.5">
                Vacancy
              </label>
              <select
                value={filters.vacancy}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, vacancy: e.target.value }))
                }
                className="input-base text-xs w-full"
              >
                <option value="">Select Vacancy</option>
                <option value="Next js">Next js</option>
                <option value="Nodejs developer">Nodejs developer</option>
                <option value="Senior Product Designer">Senior Product Designer</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-ink block mb-1.5">
                Hiring Manager
              </label>
              <select
                value={filters.hiringManager}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, hiringManager: e.target.value }))
                }
                className="input-base text-xs w-full"
              >
                <option value="">Select Manager</option>
                <option value="Amal Benny">Amal Benny</option>
                <option value="Sarah Johnson">Sarah Johnson</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-ink block mb-1.5">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, status: e.target.value }))
                }
                className="input-base text-xs w-full"
              >
                <option value="">Select Status</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interview">Interview</option>
                <option value="Reviewing">Reviewing</option>
                <option value="Offered">Offered</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Row 2: Candidate Name, Keywords, Date From, Date To */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-bold text-ink block mb-1.5">
                Candidate Name
              </label>
              <input
                type="text"
                value={filters.candidateName}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, candidateName: e.target.value }))
                }
                placeholder="Candidate Name"
                className="input-base text-xs w-full"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-ink block mb-1.5">
                Keywords
              </label>
              <input
                type="text"
                value={filters.keywords}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, keywords: e.target.value }))
                }
                placeholder="Keywords"
                className="input-base text-xs w-full"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-ink block mb-1.5">
                Date of Application (From)
              </label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, dateFrom: e.target.value }))
                }
                className="input-base text-xs w-full"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-ink block mb-1.5">
                Date of Application (To)
              </label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, dateTo: e.target.value }))
                }
                className="input-base text-xs w-full"
              />
            </div>
          </div>

          {/* Row 3: Method of Application */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-bold text-ink block mb-1.5">
                Method of Application
              </label>
              <select
                value={filters.method}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, method: e.target.value }))
                }
                className="input-base text-xs w-full"
              >
                <option value="">Select Method</option>
                <option value="Direct Portal">Direct Portal</option>
                <option value="Referral">Referral</option>
                <option value="LinkedIn Import">LinkedIn Import</option>
                <option value="Talent Pool Sourcing">Talent Pool Sourcing</option>
              </select>
            </div>
          </div>

          {/* Action Buttons matching Candidates.jpeg: Reset & Search */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-2.5 rounded-xl border border-border bg-surface hover:bg-surface-alt text-xs font-semibold text-ink transition cursor-pointer"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-7 py-2.5 rounded-xl bg-[#0d3b37] hover:bg-[#092b28] text-white text-xs font-bold shadow-elegant hover:shadow-glow hover:scale-[1.02] active:scale-95 transition cursor-pointer"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* BOTTOM CARD: Candidate Records Found Table (Matching Candidates.jpeg) */}
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs font-bold text-ink">
            ({filteredRecords.length}) Records Found
          </span>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#0d3b37] hover:bg-[#092b28] text-white text-xs font-bold shadow-sm hover:scale-[1.02] active:scale-95 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </button>
        </div>

        {/* Candidate Table */}
        <div className="overflow-x-auto rounded-xl border border-border/80">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-surface-alt/50 text-[10.5px] font-extrabold uppercase tracking-wider text-ink-soft">
                <th className="px-5 py-3.5">Vacancy</th>
                <th className="px-5 py-3.5">Candidate</th>
                <th className="px-5 py-3.5">Hiring Manager</th>
                <th className="px-5 py-3.5">Date of Application</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-ink-soft">
                    No candidate records found matching the current criteria.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-surface-alt/40 transition-colors"
                  >
                    <td className="px-5 py-4 font-bold text-ink whitespace-nowrap">
                      {item.vacancy}
                    </td>
                    <td className="px-5 py-4 font-medium text-ink whitespace-nowrap">
                      {item.candidateName}
                    </td>
                    <td className="px-5 py-4 text-ink-soft whitespace-nowrap">
                      {item.hiringManager}
                    </td>
                    <td className="px-5 py-4 text-ink-soft whitespace-nowrap font-mono text-[11px]">
                      {item.dateOfApplication}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold border ${getStatusBadgeClass(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedCandidate(item)}
                          className="p-1.5 rounded-lg text-ink-soft hover:text-primary-glow hover:bg-surface-alt transition cursor-pointer"
                          title="View Candidate"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEditClick(item)}
                          className="p-1.5 rounded-lg text-ink-soft hover:text-ink hover:bg-surface-alt transition cursor-pointer"
                          title="Edit Candidate"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg text-ink-soft hover:text-destructive hover:bg-destructive/10 transition cursor-pointer"
                          title="Delete Candidate"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination matching Candidates.jpeg: < 1 > */}
        <div className="flex items-center justify-center gap-1.5 pt-2">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-ink-soft hover:bg-surface-alt disabled:opacity-40 transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="w-8 h-8 rounded-lg bg-[#0d3b37] text-white flex items-center justify-center font-bold text-xs shadow-xs">
            {currentPage}
          </span>
          <button
            type="button"
            disabled
            className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-ink-soft hover:bg-surface-alt disabled:opacity-40 transition cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* View Candidate Details Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
            <button
              type="button"
              onClick={() => setSelectedCandidate(null)}
              className="absolute top-5 right-5 p-1.5 rounded-xl text-ink-soft hover:text-ink hover:bg-surface-alt transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-ink mb-1">Candidate Profile</h3>
            <p className="text-xs text-ink-soft mb-5">Review candidate application details.</p>

            <div className="space-y-3 bg-surface-alt/50 border border-border/80 rounded-2xl p-4 text-xs">
              <div className="flex justify-between">
                <span className="text-ink-soft">Candidate Name:</span>
                <span className="font-bold text-ink">{selectedCandidate.candidateName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Applied Vacancy:</span>
                <span className="font-bold text-ink">{selectedCandidate.vacancy}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Hiring Manager:</span>
                <span className="font-medium text-ink">{selectedCandidate.hiringManager}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Application Date:</span>
                <span className="font-mono text-ink">{selectedCandidate.dateOfApplication}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-ink-soft">Status:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusBadgeClass(selectedCandidate.status)}`}>
                  {selectedCandidate.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Application Method:</span>
                <span className="font-medium text-ink">{selectedCandidate.method}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedCandidate(null)}
                className="px-5 py-2 rounded-xl bg-[#0d3b37] text-white text-xs font-bold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Candidate Modal */}
      {isEditModalOpen && editingCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl text-ink-soft hover:text-ink hover:bg-surface-alt transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-ink mb-1">Edit Candidate Record</h3>
            <p className="text-xs text-ink-soft mb-5">Update status and application details.</p>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-ink block mb-1">Candidate Name</label>
                <input
                  type="text"
                  required
                  value={editingCandidate.candidateName}
                  onChange={(e) =>
                    setEditingCandidate((p) => p ? { ...p, candidateName: e.target.value } : null)
                  }
                  className="input-base text-xs w-full"
                />
              </div>

              <div>
                <label className="font-bold text-ink block mb-1">Vacancy</label>
                <input
                  type="text"
                  required
                  value={editingCandidate.vacancy}
                  onChange={(e) =>
                    setEditingCandidate((p) => p ? { ...p, vacancy: e.target.value } : null)
                  }
                  className="input-base text-xs w-full"
                />
              </div>

              <div>
                <label className="font-bold text-ink block mb-1">Hiring Manager</label>
                <input
                  type="text"
                  value={editingCandidate.hiringManager}
                  onChange={(e) =>
                    setEditingCandidate((p) => p ? { ...p, hiringManager: e.target.value } : null)
                  }
                  className="input-base text-xs w-full"
                />
              </div>

              <div>
                <label className="font-bold text-ink block mb-1">Status</label>
                <select
                  value={editingCandidate.status}
                  onChange={(e) =>
                    setEditingCandidate((p) => p ? { ...p, status: e.target.value as any } : null)
                  }
                  className="input-base text-xs w-full"
                >
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Interview">Interview</option>
                  <option value="Reviewing">Reviewing</option>
                  <option value="Offered">Offered</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
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

      {/* Add New Record Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl text-ink-soft hover:text-ink hover:bg-surface-alt transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-ink mb-1">Add Candidate</h3>
            <p className="text-xs text-ink-soft mb-5">Create a new candidate application entry.</p>

            <form onSubmit={handleSaveNew} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-ink block mb-1">Candidate Name *</label>
                <input
                  type="text"
                  required
                  value={newEntry.candidateName}
                  onChange={(e) =>
                    setNewEntry((p) => ({ ...p, candidateName: e.target.value }))
                  }
                  placeholder="e.g. Rachel Adams"
                  className="input-base text-xs w-full"
                />
              </div>

              <div>
                <label className="font-bold text-ink block mb-1">Vacancy</label>
                <select
                  value={newEntry.vacancy}
                  onChange={(e) =>
                    setNewEntry((p) => ({ ...p, vacancy: e.target.value }))
                  }
                  className="input-base text-xs w-full"
                >
                  <option value="Next js">Next js</option>
                  <option value="Nodejs developer">Nodejs developer</option>
                  <option value="Senior Product Designer">Senior Product Designer</option>
                  <option value="Cloud Infrastructure Specialist">Cloud Infrastructure Specialist</option>
                  <option value="AI Research Engineer">AI Research Engineer</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-ink block mb-1">Hiring Manager</label>
                <input
                  type="text"
                  value={newEntry.hiringManager}
                  onChange={(e) =>
                    setNewEntry((p) => ({ ...p, hiringManager: e.target.value }))
                  }
                  className="input-base text-xs w-full"
                />
              </div>

              <div>
                <label className="font-bold text-ink block mb-1">Status</label>
                <select
                  value={newEntry.status}
                  onChange={(e) =>
                    setNewEntry((p) => ({ ...p, status: e.target.value as any }))
                  }
                  className="input-base text-xs w-full"
                >
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Interview">Interview</option>
                  <option value="Reviewing">Reviewing</option>
                  <option value="Offered">Offered</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-ink-soft hover:bg-surface-alt transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0d3b37] hover:bg-[#092b28] text-white text-xs font-bold transition cursor-pointer"
                >
                  Add Candidate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
