"use client";

import React from "react";
import {
  MapPin,
  Building2,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  GripVertical,
  CheckCircle2,
  Share2,
  MessageSquare,
  MoreVertical,
} from "lucide-react";
import { NetworkContact, RelationshipStage } from "../types/network.types";

interface NetworkContactCardProps {
  contact: NetworkContact;
  onSelect: (contact: NetworkContact) => void;
  onMoveStage?: (contact: NetworkContact, stage: RelationshipStage) => void;
  isDragging?: boolean;
}

const STAGE_OPTIONS: Array<{ id: RelationshipStage; label: string }> = [
  { id: "discover", label: "1. Discover" },
  { id: "connected", label: "2. Connected" },
  { id: "contacted", label: "3. Contacted" },
  { id: "engaged", label: "4. Engaged" },
  { id: "meeting", label: "5. Meeting" },
  { id: "relationship", label: "6. Relationship" },
];

export function NetworkContactCard({
  contact,
  onSelect,
  onMoveStage,
  isDragging = false,
}: NetworkContactCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const formatTimeAgo = (dateStr?: string) => {
    if (!dateStr) return "Recently";
    try {
      const diffMs = Date.now() - new Date(dateStr).getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);

      if (diffHours < 1) return "Just now";
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 30) return `${diffDays}d ago`;
      return "1mo+ ago";
    } catch {
      return "Recently";
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", contact._id);
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={() => onSelect(contact)}
      className={`group relative p-3.5 rounded-2xl bg-surface border border-border hover:border-primary/40 hover:shadow-md transition-all cursor-grab active:cursor-grabbing select-none ${
        isDragging ? "opacity-40 scale-95 border-dashed border-primary" : ""
      }`}
    >
      {/* Top row: Avatar, Name & Degree */}
      <div className="flex items-start gap-2.5 mb-2.5">
        {/* Avatar */}
        <div className="relative shrink-0">
          {contact.avatarUrl ? (
            <img
              src={contact.avatarUrl}
              alt={contact.name}
              className="w-10 h-10 rounded-full object-cover border border-border"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary-glow font-bold text-xs flex items-center justify-center border border-primary/20">
              {getInitials(contact.name)}
            </div>
          )}
          {contact.connectionStatus === "connected" && (
            <span
              className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-surface"
              title="Connected"
            />
          )}
        </div>

        {/* Name & Title */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <h4 className="text-xs font-bold text-ink truncate group-hover:text-primary-glow transition">
              {contact.name}
            </h4>
            <span className="shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-surface-alt border border-border text-ink-soft">
              {contact.connectionDegree || "2nd"}
            </span>
          </div>

          <p className="text-[11px] font-medium text-ink-soft truncate">
            {contact.jobTitle} • {contact.company}
          </p>

          <p className="text-[10px] text-ink-soft/80 truncate flex items-center gap-1 mt-0.5">
            <MapPin className="w-2.5 h-2.5 shrink-0" />
            <span>{contact.location}</span>
          </p>
        </div>
      </div>

      {/* Tags / Source & Mutual Connections */}
      <div className="space-y-1.5 mb-3 pt-2 border-t border-border/70">
        <div className="flex flex-wrap items-center gap-1.5">
          {contact.source && (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-primary/10 text-primary-glow border border-primary/15 truncate max-w-[170px]">
              <Sparkles className="w-2.5 h-2.5 shrink-0" />
              <span className="truncate">{contact.source}</span>
            </span>
          )}

          {contact.mutualConnections > 0 && (
            <span className="text-[10px] text-ink-soft font-medium">
              {contact.mutualConnections} mutuals
            </span>
          )}
        </div>

        {/* Latest Interaction Note Preview if any */}
        {contact.interactionHistory && contact.interactionHistory.length > 0 && (
          <p className="text-[10px] text-ink-soft line-clamp-1 italic bg-surface-alt/70 px-2 py-1 rounded-lg">
            "{contact.interactionHistory[0].description}"
          </p>
        )}
      </div>

      {/* Footer: Last Interaction & View Profile Action */}
      <div className="flex items-center justify-between pt-2 border-t border-border/60 text-[11px]">
        <span className="text-[10px] text-ink-soft flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{formatTimeAgo(contact.lastInteraction)}</span>
        </span>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(contact);
            }}
            className="text-[11px] font-bold text-primary-glow hover:underline inline-flex items-center gap-0.5 cursor-pointer"
          >
            <span>View</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
