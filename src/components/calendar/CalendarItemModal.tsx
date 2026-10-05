"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  Calendar as CalendarIcon,
  MapPin,
  Repeat,
  ChevronDown,
  Trash2,
  Check,
  Star,
} from "lucide-react";
import {
  CalendarItem,
  CalendarItemType,
  CalendarPriority,
  CalendarStatus,
  CalendarColorTheme,
  DEFAULT_PROJECTS,
  useCalendarStore,
} from "@/features/recruiter/store/useCalendarStore";
import { useRecruiterStore } from "@/features/recruiter/store/useRecruiterStore";

interface CalendarItemModalProps {
  itemId: string | null;
  isOpen: boolean;
  onClose: () => void;
  defaultDate?: string;
  defaultType?: "task" | "event";
}

export function CalendarItemModal({
  itemId,
  isOpen,
  onClose,
  defaultDate = "2026-09-10",
  defaultType = "event",
}: CalendarItemModalProps) {
  const { items, updateItem, deleteItem, addItem } = useCalendarStore();
  const { orgProfile } = useRecruiterStore();

  const currentItem = itemId ? items.find((i) => i.id === itemId) : null;
  const isEditing = !!currentItem;

  // Form State
  const [title, setTitle] = useState("");
  const [type, setType] = useState<CalendarItemType>(defaultType);
  const [date, setDate] = useState(defaultDate);
  const [startTime, setStartTime] = useState("11:00");
  const [endTime, setEndTime] = useState("12:00");
  const [locationValue, setLocationValue] = useState("");
  const [agenda, setAgenda] = useState("");
  const [workspace, setWorkspace] = useState("Personal Workspace");
  const [eventType, setEventType] = useState("Meeting");
  const [repeats, setRepeats] = useState(false);
  const [themeColor, setThemeColor] = useState<CalendarColorTheme>("teal");
  const [participants, setParticipants] = useState<string[]>(["Me"]);
  const [newParticipantInput, setNewParticipantInput] = useState("");
  const [showAddParticipant, setShowAddParticipant] = useState(false);

  useEffect(() => {
    if (currentItem) {
      setTitle(currentItem.title || "");
      setType(currentItem.type || "event");
      setDate(currentItem.date || defaultDate);
      setStartTime(currentItem.startTime || "11:00");
      setEndTime(currentItem.endTime || "12:00");
      setLocationValue(currentItem.location || currentItem.meetingLink || "");
      setAgenda(currentItem.description || "");
      setWorkspace(currentItem.workspaceName || (orgProfile?.name ? `${orgProfile.name} Workspace` : "Personal Workspace"));
      setThemeColor(currentItem.themeColor || "teal");
      setRepeats(!!currentItem.repeats);
      if (currentItem.participants?.length) {
        setParticipants(currentItem.participants.map((p) => p.name));
      } else {
        setParticipants(["Me"]);
      }
    } else {
      setTitle("");
      setType(defaultType);
      setDate(defaultDate);
      setStartTime("11:00");
      setEndTime("12:00");
      setLocationValue("");
      setAgenda("");
      setWorkspace(orgProfile?.name ? `${orgProfile.name} Workspace` : "Personal Workspace");
      setEventType("Meeting");
      setThemeColor("teal");
      setRepeats(false);
      setParticipants(["Me"]);
    }
  }, [currentItem, isOpen, defaultDate, defaultType, orgProfile]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (isEditing && itemId) {
      updateItem(itemId, {
        title: title.trim(),
        type,
        date: date || null,
        startTime,
        endTime,
        location: locationValue,
        description: agenda,
        workspaceName: workspace,
        themeColor,
        repeats,
        participants: participants.map((name) => ({ name, isMe: name === "Me" })),
      });
    } else {
      addItem({
        title: title.trim(),
        type,
        date: date || null,
        startTime,
        endTime,
        durationMinutes: 60,
        status: "todo",
        priority: "medium",
        projectId: "recruitment",
        themeColor,
        iconEmoji: type === "event" ? "📅" : "📝",
        location: locationValue,
        description: agenda,
        workspaceName: workspace,
        repeats,
        participants: participants.map((name) => ({ name, isMe: name === "Me" })),
        assignee: { name: "Me" },
        subtasks: [],
      });
    }

    onClose();
  };

  const handleDelete = () => {
    if (itemId) {
      deleteItem(itemId);
      onClose();
    }
  };

  const handleAddParticipant = () => {
    if (newParticipantInput.trim()) {
      setParticipants([...participants, newParticipantInput.trim()]);
      setNewParticipantInput("");
      setShowAddParticipant(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs select-none">
      <div
        className="w-full max-w-2xl bg-surface border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-border bg-surface">
          <h2 className="text-lg font-black text-ink tracking-tight">
            {isEditing ? (type === "event" ? "Edit event" : "Edit task") : type === "event" ? "Create event" : "Create task"}
          </h2>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setRepeats(!repeats)}
              className={`text-xs font-semibold flex items-center gap-1.5 px-2.5 py-1 rounded-xl transition cursor-pointer ${
                repeats
                  ? "bg-primary/15 text-primary-glow border border-primary/25 font-bold"
                  : "text-ink-soft hover:text-ink hover:bg-surface-alt border border-border"
              }`}
            >
              <Repeat className="w-3.5 h-3.5" />
              <span>{repeats ? "Repeats active" : "Set repeats"}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-xl text-ink-soft hover:text-ink hover:bg-surface-alt transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body: Left Form & Right Meta Column */}
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row flex-1 overflow-hidden bg-surface">
          {/* Left Column */}
          <div className="flex-1 p-6 space-y-4 overflow-y-auto">
            {/* Date & Time Row */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-alt border border-border text-xs font-bold text-ink">
                <CalendarIcon className="w-3.5 h-3.5 text-ink-soft" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-transparent text-ink font-medium focus:outline-none cursor-pointer text-xs"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-surface-alt border border-border text-xs font-mono text-ink focus:outline-none focus:border-primary"
                />
                <span className="text-ink-soft font-bold">–</span>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-surface-alt border border-border text-xs font-mono text-ink focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Event Name Input */}
            <div className="space-y-1">
              <input
                type="text"
                required
                autoFocus
                placeholder={type === "event" ? "Event name" : "Task name"}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-alt border border-border text-sm text-ink placeholder:text-ink-soft/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
            </div>

            {/* Location Row */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-alt border border-border text-xs font-semibold text-ink-soft shrink-0">
                <MapPin className="w-3.5 h-3.5 text-ink-soft" />
                <span>Location</span>
                <ChevronDown className="w-3 h-3 text-ink-soft/60" />
              </div>

              <input
                type="text"
                placeholder="Event location or Google Meet link"
                value={locationValue}
                onChange={(e) => setLocationValue(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-surface-alt border border-border text-xs text-ink placeholder:text-ink-soft/60 focus:outline-none focus:border-primary"
              />
            </div>

            {/* Event Agenda Textarea */}
            <div className="space-y-1">
              <textarea
                rows={5}
                placeholder="Event agenda"
                value={agenda}
                onChange={(e) => setAgenda(e.target.value)}
                className="w-full p-4 rounded-xl bg-surface-alt border border-border text-xs text-ink placeholder:text-ink-soft/60 focus:outline-none focus:border-primary resize-none leading-relaxed"
              />
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-border">
              {isEditing ? (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 px-2.5 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-ink-soft hover:text-ink hover:bg-surface-alt transition cursor-pointer border border-border"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-brand hover:opacity-95 text-primary-foreground text-xs font-bold shadow-glow transition cursor-pointer"
                >
                  {isEditing ? "Save changes" : type === "event" ? "Create event" : "Create task"}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="w-full md:w-56 bg-surface-alt/70 border-t md:border-t-0 md:border-l border-border p-5 space-y-5 text-xs">
            {/* Create in */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-ink-soft uppercase tracking-wider">Create in</span>
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-surface border border-border">
                <div className="w-5 h-5 rounded-full bg-gradient-brand flex items-center justify-center text-[10px] text-primary-foreground font-bold shrink-0 shadow-2xs">
                  {workspace.charAt(0)}
                </div>
                <span className="font-semibold text-ink truncate text-xs">
                  {workspace}
                </span>
              </div>
            </div>

            {/* Type Selector */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-ink-soft uppercase tracking-wider">Type</span>
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-surface border border-border">
                <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0" />
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="bg-transparent text-ink font-semibold text-xs focus:outline-none w-full cursor-pointer"
                >
                  <option value="Meeting">Meeting</option>
                  <option value="Placement Drive">Placement Drive</option>
                  <option value="Candidate Screen">Candidate Screen</option>
                  <option value="Sprint Review">Sprint Review</option>
                  <option value="Personal Task">Personal Task</option>
                </select>
              </div>
            </div>

            {/* Theme Color Selector */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-ink-soft uppercase tracking-wider">Card Color</span>
              <div className="flex items-center gap-2">
                {[
                  { key: "green", bg: "bg-emerald-500" },
                  { key: "teal", bg: "bg-cyan-500" },
                  { key: "blue", bg: "bg-primary" },
                  { key: "slate", bg: "bg-slate-400 dark:bg-slate-500" },
                ].map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => setThemeColor(c.key as CalendarColorTheme)}
                    className={`w-6 h-6 rounded-lg ${c.bg} border transition flex items-center justify-center cursor-pointer ${
                      themeColor === c.key ? "border-ink ring-2 ring-primary/40" : "border-transparent"
                    }`}
                  >
                    {themeColor === c.key && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Participants */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-ink-soft uppercase tracking-wider">Participants</span>

              <div className="space-y-1.5">
                {participants.map((p, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="relative">
                      <div className="w-6 h-6 rounded-full bg-gradient-brand flex items-center justify-center text-[10px] text-primary-foreground font-bold shadow-2xs">
                        {p.charAt(0)}
                      </div>
                      {p === "Me" && (
                        <div className="absolute -top-1 -left-1 w-3 h-3 rounded-full bg-primary flex items-center justify-center">
                          <Star className="w-2 h-2 text-white fill-white" />
                        </div>
                      )}
                    </div>
                    <span className="font-semibold text-ink text-xs">{p}</span>
                  </div>
                ))}
              </div>

              {showAddParticipant ? (
                <div className="flex items-center gap-1.5 pt-1">
                  <input
                    type="text"
                    placeholder="Name"
                    value={newParticipantInput}
                    onChange={(e) => setNewParticipantInput(e.target.value)}
                    className="w-full px-2 py-1 rounded-lg bg-surface border border-border text-xs text-ink focus:outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={handleAddParticipant}
                    className="px-2.5 py-1 bg-gradient-brand text-primary-foreground rounded-lg text-xs font-bold cursor-pointer shadow-glow"
                  >
                    Add
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowAddParticipant(true)}
                  className="text-xs font-semibold text-primary-glow hover:underline flex items-center gap-1 transition cursor-pointer pt-1"
                >
                  <Plus className="w-3.5 h-3.5 text-primary" />
                  <span>Add participants</span>
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
