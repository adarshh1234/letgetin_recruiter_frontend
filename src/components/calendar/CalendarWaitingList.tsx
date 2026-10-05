"use client";

import React, { useState } from "react";
import {
  Inbox,
  Plus,
  Clock,
  Circle,
  GripVertical,
} from "lucide-react";
import {
  CalendarItem,
  DEFAULT_PROJECTS,
  useCalendarStore,
} from "@/features/recruiter/store/useCalendarStore";

export function CalendarWaitingList() {
  const {
    items,
    waitingListOpen,
    toggleWaitingList,
    addItem,
    moveItemDate,
    setActiveItemId,
  } = useCalendarStore();

  const [newTitle, setNewTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState("recruitment");
  const [selectedDuration, setSelectedDuration] = useState(45);

  const waitingItems = items.filter((item) => item.date === null);

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addItem({
      type: "task",
      title: newTitle.trim(),
      date: null,
      durationMinutes: selectedDuration,
      status: "todo",
      priority: "medium",
      projectId: selectedProjectId,
      themeColor: "teal",
      iconEmoji: "📝",
      assignee: { name: "Me" },
      subtasks: [],
    });

    setNewTitle("");
    setIsAdding(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData("text/plain");
    if (itemId) {
      moveItemDate(itemId, null);
    }
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
  };

  if (!waitingListOpen) {
    return (
      <button
        type="button"
        onClick={toggleWaitingList}
        className="hidden lg:flex flex-col items-center gap-2 py-4 px-2 bg-surface border-r border-border hover:bg-surface-alt transition text-ink-soft hover:text-ink cursor-pointer select-none"
        title="Open Waiting List (Backlog)"
      >
        <Inbox className="w-5 h-5 text-primary-glow" />
        <span
          className="text-[11px] font-bold tracking-wider uppercase text-center"
          style={{ writingMode: "vertical-rl" }}
        >
          Waiting List
        </span>
        <span className="w-5 h-5 rounded-full bg-primary/15 text-primary-glow text-[10px] font-bold flex items-center justify-center">
          {waitingItems.length}
        </span>
      </button>
    );
  }

  return (
    <aside
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="w-72 sm:w-80 shrink-0 bg-surface border-r border-border flex flex-col h-full overflow-hidden select-none transition-all duration-200 shadow-2xs"
    >
      {/* Header */}
      <div className="p-3.5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Inbox className="w-4 h-4 text-primary-glow" />
          <h3 className="text-xs font-bold text-ink tracking-wide">
            Waiting List
          </h3>
          <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-primary/15 text-primary-glow border border-primary/25">
            {waitingItems.length}
          </span>
        </div>

        <button
          type="button"
          onClick={toggleWaitingList}
          className="p-1 rounded-lg text-ink-soft hover:text-ink hover:bg-surface-alt transition cursor-pointer"
          title="Collapse Waiting List"
        >
          <span className="text-xs font-bold">✕</span>
        </button>
      </div>

      {/* Quick Add Form */}
      <div className="p-3 border-b border-border">
        {isAdding ? (
          <form onSubmit={handleQuickAdd} className="space-y-2 text-xs">
            <input
              type="text"
              autoFocus
              placeholder="What needs to be done?"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-xl bg-surface-alt border border-border text-ink placeholder:text-ink-soft/60 focus:outline-none focus:border-primary"
            />
            <div className="flex items-center justify-between gap-1">
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="px-2 py-1 rounded-lg bg-surface-alt border border-border text-[11px] text-ink focus:outline-none"
              >
                {DEFAULT_PROJECTS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(Number(e.target.value))}
                className="px-2 py-1 rounded-lg bg-surface-alt border border-border text-[11px] text-ink focus:outline-none"
              >
                <option value={15}>15m</option>
                <option value={30}>30m</option>
                <option value={45}>45m</option>
                <option value={60}>1h</option>
                <option value={90}>1.5h</option>
              </select>

              <button
                type="submit"
                className="px-2.5 py-1 bg-gradient-brand text-primary-foreground font-bold rounded-lg text-[11px] cursor-pointer shadow-glow"
              >
                Add
              </button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="w-full py-1.5 px-2.5 rounded-xl border border-dashed border-border text-xs font-semibold text-ink-soft hover:text-primary-glow hover:border-primary hover:bg-surface-alt transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task to Backlog</span>
          </button>
        )}
      </div>

      {/* Waiting Items List */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2 scrollbar-thin">
        {waitingItems.map((item) => (
          <div
            key={item.id}
            draggable
            onDragStart={(e) => handleDragStart(e, item.id)}
            onClick={() => setActiveItemId(item.id)}
            className="p-3 rounded-2xl bg-surface-alt/70 hover:bg-surface-alt border border-border hover:border-primary/40 transition cursor-grab active:cursor-grabbing text-xs space-y-1.5 group shadow-2xs"
          >
            <div className="flex items-start justify-between gap-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-ink truncate">
                {item.iconEmoji && <span>{item.iconEmoji}</span>}
                <span className="truncate">{item.title}</span>
              </div>
              <GripVertical className="w-3.5 h-3.5 text-ink-soft/40 opacity-0 group-hover:opacity-100 transition shrink-0" />
            </div>

            <div className="flex items-center justify-between text-[10px] text-ink-soft pt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span className="font-mono">{item.durationMinutes}m</span>
              </span>
              <span className="text-[9.5px] font-medium text-ink-soft bg-surface border border-border px-1.5 py-0.5 rounded">
                Drag to schedule
              </span>
            </div>
          </div>
        ))}

        {waitingItems.length === 0 && (
          <div className="h-40 border border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-center p-4 text-ink-soft/60 text-xs bg-surface-alt/10">
            <Inbox className="w-6 h-6 mb-2 opacity-40 text-primary-glow" />
            <span>Backlog is empty</span>
            <span className="text-[10px] mt-1 text-ink-soft/50">
              Drag unscheduled tasks here
            </span>
          </div>
        )}
      </div>
    </aside>
  );
}
