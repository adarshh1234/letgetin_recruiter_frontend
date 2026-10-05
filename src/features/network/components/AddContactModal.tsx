"use client";

import React, { useState } from "react";
import {
  X,
  User,
  Building2,
  Briefcase,
  MapPin,
  Mail,
  Phone,
  Globe,
  Link2,
  Layers,
  Sparkles,
  Tag,
  FileText,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { NetworkContact, RelationshipStage, ConnectionDegree } from "../types/network.types";

interface AddContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultStage?: RelationshipStage;
  onSubmit: (data: Partial<NetworkContact>) => Promise<void>;
}

export function AddContactModal({
  isOpen,
  onClose,
  defaultStage = "discover",
  onSubmit,
}: AddContactModalProps) {
  const [name, setName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("Bengaluru, India");
  const [industry, setIndustry] = useState("Technology & AI");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [relationshipStage, setRelationshipStage] = useState<RelationshipStage>(defaultStage);
  const [connectionDegree, setConnectionDegree] = useState<ConnectionDegree>("2nd");
  const [source, setSource] = useState("Network Recommendation");
  const [tagsInput, setTagsInput] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !jobTitle.trim() || !company.trim()) {
      setError("Please fill in the contact name, job title, and company.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      await onSubmit({
        name: name.trim(),
        jobTitle: jobTitle.trim(),
        company: company.trim(),
        location: location.trim(),
        industry: industry.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        linkedinUrl: linkedinUrl.trim() || undefined,
        relationshipStage,
        connectionDegree,
        source,
        tags,
        notes: notes.trim() || undefined,
      });

      // Reset form
      setName("");
      setJobTitle("");
      setCompany("");
      setEmail("");
      setPhone("");
      setLinkedinUrl("");
      setTagsInput("");
      setNotes("");
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to add contact. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto select-none">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Modal Dialog */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-xl rounded-3xl bg-surface border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="p-5 border-b border-border flex items-center justify-between bg-surface-alt/50">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-primary/10 text-primary-glow border border-primary/20">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-ink">Add Professional Contact</h2>
                <p className="text-xs text-ink-soft">
                  Record an existing or target relationship into your pipeline
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-ink-soft hover:text-ink hover:bg-surface transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Row 1: Name & Degree */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-semibold text-ink">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-surface-alt border border-border text-ink focus:outline-hidden focus:border-primary transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-ink">Degree</label>
                <select
                  value={connectionDegree}
                  onChange={(e) => setConnectionDegree(e.target.value as ConnectionDegree)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-surface-alt border border-border text-ink focus:outline-hidden focus:border-primary transition cursor-pointer"
                >
                  <option value="1st">1st Degree</option>
                  <option value="2nd">2nd Degree</option>
                  <option value="3rd+">3rd+ Degree</option>
                </select>
              </div>
            </div>

            {/* Row 2: Job Title & Company */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-ink">
                  Job Title / Designation <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Founder & CEO"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-surface-alt border border-border text-ink focus:outline-hidden focus:border-primary transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-ink">
                  Company / Organization <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. XYZ Technologies"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-surface-alt border border-border text-ink focus:outline-hidden focus:border-primary transition"
                />
              </div>
            </div>

            {/* Row 3: Industry & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-ink">Industry</label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="e.g. Technology & AI"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-surface-alt border border-border text-ink focus:outline-hidden focus:border-primary transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-ink">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Bengaluru, India"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-surface-alt border border-border text-ink focus:outline-hidden focus:border-primary transition"
                />
              </div>
            </div>

            {/* Row 4: Stage & Source */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-ink">Funnel Stage</label>
                <select
                  value={relationshipStage}
                  onChange={(e) => setRelationshipStage(e.target.value as RelationshipStage)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-surface-alt border border-border text-ink focus:outline-hidden focus:border-primary transition cursor-pointer"
                >
                  <option value="discover">1. Discover</option>
                  <option value="connected">2. Connected</option>
                  <option value="contacted">3. Contacted</option>
                  <option value="engaged">4. Engaged</option>
                  <option value="meeting">5. Meeting</option>
                  <option value="relationship">6. Relationship</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-ink">Relationship Source</label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-surface-alt border border-border text-ink focus:outline-hidden focus:border-primary transition cursor-pointer"
                >
                  <option value="Network Recommendation">Network Recommendation</option>
                  <option value="Alumni Network">Alumni Network</option>
                  <option value="Direct Reachout">Direct Reachout</option>
                  <option value="Event">Event / Conference</option>
                  <option value="LinkedIn Import">LinkedIn / Social</option>
                  <option value="Investor Network">Investor Network</option>
                </select>
              </div>
            </div>

            {/* Row 5: Email, Phone, LinkedIn */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-ink">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-surface-alt border border-border text-ink focus:outline-hidden focus:border-primary transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-ink">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-surface-alt border border-border text-ink focus:outline-hidden focus:border-primary transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-ink">LinkedIn URL</label>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-surface-alt border border-border text-ink focus:outline-hidden focus:border-primary transition"
                />
              </div>
            </div>

            {/* Row 6: Tags & Notes */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-ink">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. AI Founder, Angel Investor, Tech Mentor"
                className="w-full px-3 py-2 text-xs rounded-xl bg-surface-alt border border-border text-ink focus:outline-hidden focus:border-primary transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-ink">Initial Notes</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Context or next steps regarding this contact..."
                className="w-full px-3 py-2 text-xs rounded-xl bg-surface-alt border border-border text-ink focus:outline-hidden focus:border-primary transition resize-none"
              />
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 rounded-xl border border-border text-xs font-bold text-ink-soft hover:text-ink hover:bg-surface-alt transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Add Contact</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
