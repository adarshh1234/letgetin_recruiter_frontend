"use client";

import React, { useState } from "react";
import {
  Compass,
  UserCheck,
  Send,
  MessageSquare,
  Calendar,
  Handshake,
  Plus,
  ArrowRight,
} from "lucide-react";
import {
  NetworkContact,
  RelationshipStage,
  KanbanStageConfig,
} from "../types/network.types";
import { NetworkContactCard } from "./NetworkContactCard";

interface NetworkKanbanBoardProps {
  contacts: NetworkContact[];
  onSelectContact: (contact: NetworkContact) => void;
  onMoveStage: (contactId: string, targetStage: RelationshipStage) => void;
  onOpenAddModal: (defaultStage?: RelationshipStage) => void;
}

const KANBAN_STAGES: KanbanStageConfig[] = [
  {
    id: "discover",
    title: "1. Discover",
    subtitle: "People discovered through network recommendations.",
    badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    borderColor: "border-blue-500/20",
    headerBg: "bg-blue-500/5",
    accentDot: "bg-blue-500",
  },
  {
    id: "connected",
    title: "2. Connected",
    subtitle: "People who accepted or established a connection.",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    borderColor: "border-emerald-500/20",
    headerBg: "bg-emerald-500/5",
    accentDot: "bg-emerald-500",
  },
  {
    id: "contacted",
    title: "3. Contacted",
    subtitle: "People who have been contacted.",
    badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    borderColor: "border-amber-500/20",
    headerBg: "bg-amber-500/5",
    accentDot: "bg-amber-500",
  },
  {
    id: "engaged",
    title: "4. Engaged",
    subtitle: "People who replied or interacted.",
    badgeColor: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
    borderColor: "border-violet-500/20",
    headerBg: "bg-violet-500/5",
    accentDot: "bg-violet-500",
  },
  {
    id: "meeting",
    title: "5. Meeting",
    subtitle: "People with a scheduled or held meeting.",
    badgeColor: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    borderColor: "border-cyan-500/20",
    headerBg: "bg-cyan-500/5",
    accentDot: "bg-cyan-500",
  },
  {
    id: "relationship",
    title: "6. Relationship",
    subtitle: "Active professional relationships.",
    badgeColor: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    borderColor: "border-rose-500/20",
    headerBg: "bg-rose-500/5",
    accentDot: "bg-rose-500",
  },
];

export function NetworkKanbanBoard({
  contacts,
  onSelectContact,
  onMoveStage,
  onOpenAddModal,
}: NetworkKanbanBoardProps) {
  const [dragOverStage, setDragOverStage] = useState<RelationshipStage | null>(null);

  const handleDragOver = (e: React.DragEvent, stage: RelationshipStage) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverStage !== stage) {
      setDragOverStage(stage);
    }
  };

  const handleDragLeave = (e: React.DragEvent, stage: RelationshipStage) => {
    if (dragOverStage === stage) {
      setDragOverStage(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetStage: RelationshipStage) => {
    e.preventDefault();
    setDragOverStage(null);
    const contactId = e.dataTransfer.getData("text/plain");
    if (contactId) {
      onMoveStage(contactId, targetStage);
    }
  };

  return (
    <div className="w-full overflow-x-auto pb-6 pt-2 scrollbar-thin scrollbar-thumb-border">
      <div className="flex gap-4 min-w-[1300px] xl:min-w-full">
        {KANBAN_STAGES.map((stage) => {
          const stageContacts = contacts.filter(
            (c) => c.relationshipStage === stage.id
          );
          const isOver = dragOverStage === stage.id;

          return (
            <div
              key={stage.id}
              onDragOver={(e) => handleDragOver(e, stage.id)}
              onDragLeave={(e) => handleDragLeave(e, stage.id)}
              onDrop={(e) => handleDrop(e, stage.id)}
              className={`flex-1 min-w-[260px] max-w-[320px] rounded-2xl bg-surface-alt/60 border ${
                isOver ? "border-primary ring-2 ring-primary/20 bg-primary/5" : "border-border"
              } transition-all flex flex-col`}
            >
              {/* Column Header */}
              <div className="p-3.5 border-b border-border/80">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${stage.accentDot}`} />
                    <h3 className="text-xs font-bold text-ink tracking-tight uppercase">
                      {stage.title}
                    </h3>
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${stage.badgeColor}`}
                  >
                    {stageContacts.length}
                  </span>
                </div>

                <p className="text-[11px] text-ink-soft leading-tight line-clamp-2">
                  {stage.subtitle}
                </p>
              </div>

              {/* Column Cards Container */}
              <div className="flex-1 p-2.5 space-y-2.5 min-h-[420px] overflow-y-auto max-h-[calc(100vh-320px)]">
                {stageContacts.map((contact) => (
                  <NetworkContactCard
                    key={contact._id}
                    contact={contact}
                    onSelect={onSelectContact}
                    onMoveStage={(c, nextStage) => onMoveStage(c._id, nextStage)}
                  />
                ))}

                {stageContacts.length === 0 && (
                  <div className="h-44 rounded-xl border border-dashed border-border/80 flex flex-col items-center justify-center p-4 text-center text-ink-soft">
                    <p className="text-xs font-medium mb-2">No contacts in this stage</p>
                    <button
                      type="button"
                      onClick={() => onOpenAddModal(stage.id)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-primary-glow hover:underline cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> Add to {stage.title}
                    </button>
                  </div>
                )}
              </div>

              {/* Column Footer */}
              <div className="p-2 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => onOpenAddModal(stage.id)}
                  className="w-full py-1.5 rounded-xl border border-border bg-surface text-[11px] font-semibold text-ink-soft hover:text-ink hover:bg-surface-alt transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Contact</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
