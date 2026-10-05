"use client";

import React, { useState } from "react";
import {
  X,
  MapPin,
  Building2,
  Mail,
  Phone,
  Globe,
  Link2,
  Clock,
  Sparkles,
  MessageSquare,
  UserPlus,
  Check,
  Send,
  Trash2,
  Tag,
  Plus,
  Calendar,
  CheckCircle2,
  Share2,
} from "lucide-react";
import { NetworkContact, RelationshipStage, InteractionHistoryItem } from "../types/network.types";

interface ProfileRelationshipDrawerProps {
  contact: NetworkContact | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStage: (stage: RelationshipStage) => void;
  onToggleConnect: () => void;
  onToggleFollow: () => void;
  onAddInteraction: (type: "message" | "meeting" | "note", note: string) => void;
  onDeleteContact: () => void;
}

const STAGES: Array<{ id: RelationshipStage; label: string }> = [
  { id: "discover", label: "1. Discover" },
  { id: "connected", label: "2. Connected" },
  { id: "contacted", label: "3. Contacted" },
  { id: "engaged", label: "4. Engaged" },
  { id: "meeting", label: "5. Meeting" },
  { id: "relationship", label: "6. Relationship" },
];

export function ProfileRelationshipDrawer({
  contact,
  isOpen,
  onClose,
  onUpdateStage,
  onToggleConnect,
  onToggleFollow,
  onAddInteraction,
  onDeleteContact,
}: ProfileRelationshipDrawerProps) {
  const [newNote, setNewNote] = useState("");
  const [interactionType, setInteractionType] = useState<"message" | "meeting" | "note">("note");
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !contact) return null;

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    onAddInteraction(interactionType, newNote.trim());
    setNewNote("");
  };

  const isConnected = contact.connectionStatus === "connected";
  const isPending = contact.connectionStatus === "pending";

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Slide-over panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md sm:max-w-lg bg-surface border-l border-border shadow-2xl flex flex-col overflow-y-auto animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between sticky top-0 bg-surface/90 backdrop-blur-md z-10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-ink-soft">
                Relationship Profile
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary-glow border border-primary/20">
                {contact.connectionDegree || "2nd"} Degree
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-ink-soft hover:text-ink hover:bg-surface-alt transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 space-y-6 flex-1">
            {/* Top Profile Card */}
            <div className="flex items-start gap-4">
              <div className="relative shrink-0">
                {contact.avatarUrl ? (
                  <img
                    src={contact.avatarUrl}
                    alt={contact.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-primary/10 text-primary-glow font-black text-lg flex items-center justify-center border-2 border-primary/20">
                    {getInitials(contact.name)}
                  </div>
                )}
                {isConnected && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-surface" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-bold text-ink truncate">{contact.name}</h2>
                <p className="text-xs font-semibold text-ink-soft mt-0.5">
                  {contact.jobTitle}
                </p>
                <p className="text-xs text-primary-glow font-medium flex items-center gap-1 mt-0.5">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{contact.company}</span>
                </p>
                <p className="text-[11px] text-ink-soft/80 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" />
                  <span>{contact.location}</span>
                  <span>•</span>
                  <span>{contact.industry}</span>
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={onToggleConnect}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  isConnected
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                    : isPending
                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                {isConnected ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Connected</span>
                  </>
                ) : isPending ? (
                  <>
                    <Clock className="w-3.5 h-3.5 animate-spin" />
                    <span>Pending</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Connect</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onToggleFollow}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition border cursor-pointer ${
                  contact.isFollowing
                    ? "bg-surface-alt border-primary/30 text-primary-glow"
                    : "bg-surface border-border text-ink hover:bg-surface-alt"
                }`}
              >
                {contact.isFollowing ? "Following" : "Follow"}
              </button>

              <button
                type="button"
                className="col-span-2 sm:col-span-1 py-2 px-3 rounded-xl text-xs font-bold bg-surface border border-border text-ink hover:bg-surface-alt transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-primary-glow" />
                <span>Message</span>
              </button>
            </div>

            {/* Relationship Stage Switcher */}
            <div className="p-4 rounded-2xl bg-surface-alt border border-border space-y-2">
              <label className="text-xs font-bold text-ink uppercase tracking-wider block">
                Current Relationship Stage
              </label>
              <select
                value={contact.relationshipStage}
                onChange={(e) => onUpdateStage(e.target.value as RelationshipStage)}
                className="w-full px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-surface border border-border text-ink focus:outline-hidden focus:border-primary transition cursor-pointer"
              >
                {STAGES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-ink-soft">
                Changing stage automatically updates your Kanban funnel and records an interaction event.
              </p>
            </div>

            {/* Contact Details & Metadata */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-ink">
                Contact & Background
              </h3>

              <div className="space-y-2 text-xs">
                {contact.email && (
                  <div className="flex items-center gap-2 text-ink-soft">
                    <Mail className="w-3.5 h-3.5 text-primary-glow" />
                    <span className="text-ink">{contact.email}</span>
                  </div>
                )}
                {contact.phone && (
                  <div className="flex items-center gap-2 text-ink-soft">
                    <Phone className="w-3.5 h-3.5 text-primary-glow" />
                    <span className="text-ink">{contact.phone}</span>
                  </div>
                )}
                {contact.linkedinUrl && (
                  <div className="flex items-center gap-2 text-ink-soft">
                    <Globe className="w-3.5 h-3.5 text-blue-500" />
                    <a
                      href={contact.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary-glow hover:underline truncate"
                    >
                      {contact.linkedinUrl}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2 text-ink-soft">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Source: {contact.source || "Network Recommendation"}</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-primary-glow" /> Tags
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {contact.tags && contact.tags.length > 0 ? (
                  contact.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-lg text-xs font-medium bg-surface-alt border border-border text-ink"
                    >
                      #{tag}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-ink-soft">No tags added</span>
                )}
              </div>
            </div>

            {/* Notes & Log Interaction */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-ink">
                Notes & Activity Log
              </h3>

              {contact.notes && (
                <div className="p-3 rounded-xl bg-surface-alt border border-border/80 text-xs text-ink whitespace-pre-line">
                  {contact.notes}
                </div>
              )}

              {/* Add Note Form */}
              <form onSubmit={handleAddNoteSubmit} className="space-y-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setInteractionType("note")}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                      interactionType === "note"
                        ? "bg-primary text-primary-foreground"
                        : "bg-surface-alt text-ink-soft border border-border"
                    }`}
                  >
                    Add Note
                  </button>
                  <button
                    type="button"
                    onClick={() => setInteractionType("message")}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                      interactionType === "message"
                        ? "bg-primary text-primary-foreground"
                        : "bg-surface-alt text-ink-soft border border-border"
                    }`}
                  >
                    Log Message
                  </button>
                  <button
                    type="button"
                    onClick={() => setInteractionType("meeting")}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                      interactionType === "meeting"
                        ? "bg-primary text-primary-foreground"
                        : "bg-surface-alt text-ink-soft border border-border"
                    }`}
                  >
                    Log Meeting
                  </button>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder={`Record a ${interactionType}...`}
                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-surface-alt border border-border text-ink focus:outline-hidden focus:border-primary transition"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition cursor-pointer shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>

            {/* Interaction History Timeline */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-ink">
                Interaction Timeline
              </h3>

              <div className="space-y-3 relative pl-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                {contact.interactionHistory && contact.interactionHistory.length > 0 ? (
                  contact.interactionHistory.map((item, idx) => (
                    <div key={item.id || idx} className="relative group">
                      <span className="absolute -left-4 top-1 w-2.5 h-2.5 rounded-full bg-primary border-2 border-surface" />
                      <p className="text-xs font-medium text-ink leading-snug">
                        {item.description}
                      </p>
                      <span className="text-[10px] text-ink-soft block mt-0.5">
                        {new Date(item.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-ink-soft">No recorded interactions yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div className="p-4 border-t border-border bg-surface flex items-center justify-between sticky bottom-0">
            {isDeleting ? (
              <div className="flex items-center gap-2 w-full justify-between">
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                  Remove from network?
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsDeleting(false)}
                    className="px-3 py-1.5 rounded-xl border border-border text-xs font-semibold text-ink-soft hover:text-ink cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={onDeleteContact}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition cursor-pointer"
                  >
                    Confirm Delete
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setIsDeleting(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Contact</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-surface-alt border border-border text-xs font-bold text-ink hover:bg-surface transition cursor-pointer"
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
