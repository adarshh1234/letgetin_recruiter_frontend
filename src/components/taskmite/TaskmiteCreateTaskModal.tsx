"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  Repeat,
  Paperclip,
  Bookmark,
  CheckSquare,
  Trash2,
  Tag,
  FileText,
  Briefcase,
  User,
  Check,
} from "lucide-react";
import {
  CalendarItem,
  CalendarPriority,
  CalendarStatus,
  DEFAULT_PROJECTS,
  useCalendarStore,
} from "@/features/recruiter/store/useCalendarStore";
import { useRecruiterStore } from "@/features/recruiter/store/useRecruiterStore";

interface TaskmiteCreateTaskModalProps {
  itemId: string | null;
  isOpen: boolean;
  onClose: () => void;
  defaultStatus?: CalendarStatus;
  defaultDate?: string | null;
}

const TYPE_OPTIONS = [
  { id: "operational", label: "Operational", color: "bg-cyan-500", badgeBg: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30" },
  { id: "strategic", label: "Strategic", color: "bg-emerald-500", badgeBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30" },
  { id: "health", label: "Health", color: "bg-blue-500", badgeBg: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30" },
  { id: "home", label: "Home and family", color: "bg-purple-500", badgeBg: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30" },
  { id: "recruitment", label: "Talent & Hiring", color: "bg-primary", badgeBg: "bg-primary/15 text-primary-glow border border-primary/30" },
  { id: "campus", label: "Campus Recruitment", color: "bg-amber-500", badgeBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30" },
];

export function TaskmiteCreateTaskModal({
  itemId,
  isOpen,
  onClose,
  defaultStatus = "in_progress",
  defaultDate = "2026-09-10",
}: TaskmiteCreateTaskModalProps) {
  const { items, addItem, updateItem, deleteItem } = useCalendarStore();
  const { orgProfile } = useRecruiterStore();

  const currentItem = itemId ? items.find((i) => i.id === itemId) : null;
  const isEditing = !!currentItem;

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [workspace, setWorkspace] = useState("Personal Workspace");
  const [typeId, setTypeId] = useState("operational");
  const [status, setStatus] = useState<CalendarStatus>(defaultStatus);
  const [assigneeName, setAssigneeName] = useState("Me");
  const [scheduledDate, setScheduledDate] = useState<string>(defaultDate || "2026-09-10");
  const [isScheduled, setIsScheduled] = useState(true);
  const [estimatedTime, setEstimatedTime] = useState("0h");
  const [dueDate, setDueDate] = useState<string>("");
  const [repeats, setRepeats] = useState(false);

  // Subtasks State
  const [subtasks, setSubtasks] = useState<{ id: string; title: string; completed: boolean }[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [showSubtaskInput, setShowSubtaskInput] = useState(false);

  // Tags State
  const [tags, setTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState("");
  const [showTagInput, setShowTagInput] = useState(false);

  // Attachments State
  const [attachments, setAttachments] = useState<{ name: string; size: string }[]>([]);

  useEffect(() => {
    if (currentItem) {
      setTitle(currentItem.title || "");
      setDescription(currentItem.description || "");
      setWorkspace(currentItem.workspaceName || "Personal Workspace");
      setTypeId(currentItem.projectId || "operational");
      setStatus(currentItem.status || "in_progress");
      setAssigneeName(currentItem.assignee?.name || "Me");
      setScheduledDate(currentItem.date || "2026-09-10");
      setIsScheduled(currentItem.date !== null);
      setEstimatedTime(currentItem.estimatedTime || `${Math.floor((currentItem.durationMinutes || 0) / 60)}h`);
      setDueDate(currentItem.dueDate || "");
      setRepeats(!!currentItem.repeats);
      setSubtasks(currentItem.subtasks || []);
      setTags(currentItem.tags || []);
      setAttachments(currentItem.attachments || []);
    } else {
      setTitle("");
      setDescription("");
      setWorkspace(orgProfile?.name ? `${orgProfile.name} Workspace` : "Personal Workspace");
      setTypeId("operational");
      setStatus(defaultStatus);
      setAssigneeName("Me");
      setScheduledDate(defaultDate || "2026-09-10");
      setIsScheduled(defaultDate !== null);
      setEstimatedTime("0h");
      setDueDate("");
      setRepeats(false);
      setSubtasks([]);
      setTags([]);
      setAttachments([]);
      setShowSubtaskInput(false);
      setShowTagInput(false);
    }
  }, [currentItem, isOpen, defaultStatus, defaultDate, orgProfile]);

  if (!isOpen) return null;

  const handleAddSubtask = () => {
    if (newSubtaskTitle.trim()) {
      setSubtasks([
        ...subtasks,
        { id: `st-${Date.now()}`, title: newSubtaskTitle.trim(), completed: false },
      ]);
      setNewSubtaskTitle("");
      setShowSubtaskInput(false);
    }
  };

  const toggleSubtask = (id: string) => {
    setSubtasks(
      subtasks.map((st) => (st.id === id ? { ...st, completed: !st.completed } : st))
    );
  };

  const removeSubtask = (id: string) => {
    setSubtasks(subtasks.filter((st) => st.id !== id));
  };

  const handleAddTag = () => {
    if (newTagInput.trim()) {
      const formatted = newTagInput.trim().replace(/^#/, "");
      if (!tags.includes(formatted)) {
        setTags([...tags, formatted]);
      }
      setNewTagInput("");
      setShowTagInput(false);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleAttachMockFile = () => {
    const mockFiles = [
      { name: "Project_Roadmap_Q4.pdf", size: "2.4 MB" },
      { name: "Candidate_Scorecard.xlsx", size: "1.1 MB" },
      { name: "Meeting_Brief_Design.docx", size: "540 KB" },
    ];
    const pick = mockFiles[attachments.length % mockFiles.length];
    setAttachments([...attachments, pick]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const matchedType = TYPE_OPTIONS.find((t) => t.id === typeId) || TYPE_OPTIONS[0];

    // Estimate duration in minutes
    let durMins = 30;
    if (estimatedTime.includes("h")) {
      durMins = parseFloat(estimatedTime) * 60 || 60;
    } else if (estimatedTime.includes("m")) {
      durMins = parseInt(estimatedTime) || 30;
    }

    if (isEditing && itemId) {
      updateItem(itemId, {
        title: title.trim(),
        description: description.trim(),
        workspaceName: workspace,
        projectId: typeId,
        typeName: matchedType.label,
        status,
        date: isScheduled ? scheduledDate : null,
        dueDate: dueDate || null,
        estimatedTime,
        durationMinutes: durMins,
        repeats,
        subtasks,
        tags,
        attachments,
        assignee: { name: assigneeName },
      });
    } else {
      addItem({
        type: "task",
        title: title.trim(),
        description: description.trim(),
        workspaceName: workspace,
        projectId: typeId,
        typeName: matchedType.label,
        status,
        priority: "medium",
        themeColor: "teal",
        iconEmoji: "📝",
        date: isScheduled ? scheduledDate : null,
        dueDate: dueDate || null,
        estimatedTime,
        durationMinutes: durMins,
        repeats,
        subtasks,
        tags,
        attachments,
        assignee: { name: assigneeName },
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

  const selectedType = TYPE_OPTIONS.find((t) => t.id === typeId) || TYPE_OPTIONS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs select-none">
      <div
        className="w-full max-w-2xl bg-surface border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header (Screenshot 1) */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-border bg-surface">
          <h2 className="text-lg font-black text-ink tracking-tight">
            {isEditing ? "Edit task" : "Create task"}
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

        {/* Modal Body: Left Content Column & Right Meta Column */}
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row flex-1 overflow-hidden bg-surface">
          {/* Left Column (Screenshot 1: Task name, description, pills) */}
          <div className="flex-1 p-6 space-y-4 overflow-y-auto">
            {/* Task Name Input */}
            <div className="space-y-1">
              <input
                type="text"
                required
                autoFocus
                placeholder="Task name"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface-alt text-sm font-semibold text-ink placeholder:text-ink-soft/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition"
              />
            </div>

            {/* Task Description Textarea */}
            <div className="space-y-1">
              <textarea
                rows={6}
                placeholder="Task description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-4 rounded-xl border border-border bg-surface-alt text-xs text-ink placeholder:text-ink-soft/60 focus:outline-none focus:border-primary resize-none leading-relaxed transition"
              />
            </div>

            {/* Subtasks Section (if any added) */}
            {subtasks.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-ink-soft uppercase tracking-wider">
                  Subtasks ({subtasks.filter((s) => s.completed).length}/{subtasks.length})
                </span>
                <div className="space-y-1">
                  {subtasks.map((st) => (
                    <div
                      key={st.id}
                      className="flex items-center justify-between gap-2 p-2 rounded-xl bg-surface-alt/70 border border-border/80 text-xs"
                    >
                      <button
                        type="button"
                        onClick={() => toggleSubtask(st.id)}
                        className="flex items-center gap-2 text-left cursor-pointer flex-1"
                      >
                        <span
                          className={`w-4 h-4 rounded border flex items-center justify-center ${
                            st.completed
                              ? "bg-primary border-primary text-primary-foreground"
                              : "border-border bg-surface"
                          }`}
                        >
                          {st.completed && <Check className="w-3 h-3" />}
                        </span>
                        <span
                          className={`font-medium ${
                            st.completed ? "line-through text-ink-soft" : "text-ink"
                          }`}
                        >
                          {st.title}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => removeSubtask(st.id)}
                        className="text-ink-soft hover:text-rose-500 transition"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inline Subtask Input */}
            {showSubtaskInput && (
              <div className="flex items-center gap-2 p-1.5 rounded-xl border border-border bg-surface-alt">
                <input
                  type="text"
                  autoFocus
                  placeholder="Enter subtask..."
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSubtask();
                    }
                  }}
                  className="flex-1 bg-transparent px-2 text-xs text-ink focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddSubtask}
                  className="px-2.5 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-bold"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowSubtaskInput(false)}
                  className="p-1 text-ink-soft hover:text-ink"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Tags Section */}
            {tags.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-alt border border-border text-[11px] font-semibold text-ink"
                  >
                    <span>#{t}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(t)}
                      className="text-ink-soft hover:text-rose-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Inline Tag Input */}
            {showTagInput && (
              <div className="flex items-center gap-2 p-1.5 rounded-xl border border-border bg-surface-alt">
                <input
                  type="text"
                  autoFocus
                  placeholder="Enter tag (e.g. urgent, Q4)..."
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  className="flex-1 bg-transparent px-2 text-xs text-ink focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-2.5 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-bold"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowTagInput(false)}
                  className="p-1 text-ink-soft hover:text-ink"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Attachments Section */}
            {attachments.length > 0 && (
              <div className="space-y-1 pt-1">
                {attachments.map((att, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 rounded-xl bg-surface-alt/70 border border-border/80 text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-3.5 h-3.5 text-primary-glow shrink-0" />
                      <span className="font-semibold text-ink truncate">{att.name}</span>
                      <span className="text-[10px] text-ink-soft">{att.size}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(i)}
                      className="text-ink-soft hover:text-rose-500 transition"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Action Pill Buttons (Screenshot 1: Add subtask, Attach file, Add tag) */}
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <button
                type="button"
                onClick={() => setShowSubtaskInput(true)}
                className="px-3 py-1.5 rounded-xl border border-border bg-surface-alt hover:bg-surface text-xs font-semibold text-ink-soft hover:text-ink flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
              >
                <CheckSquare className="w-3.5 h-3.5 text-primary-glow" />
                <span>Add subtask</span>
              </button>

              <button
                type="button"
                onClick={handleAttachMockFile}
                className="px-3 py-1.5 rounded-xl border border-border bg-surface-alt hover:bg-surface text-xs font-semibold text-ink-soft hover:text-ink flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
              >
                <Paperclip className="w-3.5 h-3.5 text-primary-glow" />
                <span>Attach file</span>
              </button>

              <button
                type="button"
                onClick={() => setShowTagInput(true)}
                className="px-3 py-1.5 rounded-xl border border-border bg-surface-alt hover:bg-surface text-xs font-semibold text-ink-soft hover:text-ink flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
              >
                <Bookmark className="w-3.5 h-3.5 text-primary-glow" />
                <span>Add tag</span>
              </button>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
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
                  {isEditing ? "Save changes" : "Create task"}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column (Screenshot 1 Metadata Column) */}
          <div className="w-full md:w-60 bg-surface-alt/70 border-t md:border-t-0 md:border-l border-border p-5 space-y-4 text-xs">
            {/* Create in */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-ink-soft uppercase tracking-wider">
                Create in
              </span>
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-surface border border-border shadow-2xs">
                <div className="w-5 h-5 rounded-full bg-gradient-brand flex items-center justify-center text-[10px] text-primary-foreground font-bold shrink-0">
                  {workspace.charAt(0)}
                </div>
                <span className="font-semibold text-ink truncate text-xs">
                  {workspace}
                </span>
              </div>
            </div>

            {/* Type */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-ink-soft uppercase tracking-wider">
                Type
              </span>
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-surface border border-border shadow-2xs">
                <span className={`w-3 h-3 rounded-md ${selectedType.color} shrink-0`} />
                <select
                  value={typeId}
                  onChange={(e) => setTypeId(e.target.value)}
                  className="bg-transparent text-ink font-semibold text-xs focus:outline-none w-full cursor-pointer"
                >
                  {TYPE_OPTIONS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-ink-soft uppercase tracking-wider">
                Status
              </span>
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-surface border border-border shadow-2xs">
                <span className="text-xs shrink-0">
                  {status === "in_progress" ? "🛠️" : status === "done" ? "✅" : "📅"}
                </span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as CalendarStatus)}
                  className="bg-transparent text-ink font-semibold text-xs focus:outline-none w-full cursor-pointer"
                >
                  <option value="in_progress">In Progress</option>
                  <option value="todo">Scheduled / Todo</option>
                  <option value="done">Completed</option>
                </select>
              </div>
            </div>

            {/* Assignee */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-ink-soft uppercase tracking-wider">
                Assignee
              </span>
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-surface border border-border shadow-2xs">
                <div className="w-5 h-5 rounded-full bg-gradient-brand flex items-center justify-center text-[10px] text-primary-foreground font-bold shrink-0">
                  {assigneeName.charAt(0)}
                </div>
                <select
                  value={assigneeName}
                  onChange={(e) => setAssigneeName(e.target.value)}
                  className="bg-transparent text-ink font-semibold text-xs focus:outline-none w-full cursor-pointer"
                >
                  <option value="Me">Me</option>
                  <option value="Amal Benny">Amal Benny</option>
                  <option value="Sarah Johnson">Sarah Johnson</option>
                  <option value="Alex Chen">Alex Chen</option>
                </select>
              </div>
            </div>

            {/* Schedule this task for */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-ink-soft uppercase tracking-wider">
                Schedule this task for
              </span>
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-surface border border-border shadow-2xs">
                <CalendarIcon className="w-3.5 h-3.5 text-primary-glow shrink-0" />
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => {
                    setScheduledDate(e.target.value);
                    setIsScheduled(true);
                  }}
                  className="bg-transparent text-ink font-semibold text-xs focus:outline-none w-full cursor-pointer"
                />
              </div>
            </div>

            {/* Estimated time */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-ink-soft uppercase tracking-wider">
                Estimated time
              </span>
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-surface border border-border shadow-2xs">
                <Clock className="w-3.5 h-3.5 text-ink-soft shrink-0" />
                <select
                  value={estimatedTime}
                  onChange={(e) => setEstimatedTime(e.target.value)}
                  className="bg-transparent text-ink font-semibold text-xs focus:outline-none w-full cursor-pointer"
                >
                  <option value="0h">0h</option>
                  <option value="15m">15m</option>
                  <option value="30m">30m</option>
                  <option value="45m">45m</option>
                  <option value="1h">1h</option>
                  <option value="1.5h">1.5h</option>
                  <option value="2h">2h</option>
                  <option value="3h">3h</option>
                  <option value="4h">4h</option>
                  <option value="8h">8h</option>
                </select>
              </div>
            </div>

            {/* Due date */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-ink-soft uppercase tracking-wider">
                Due date
              </span>
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-surface border border-border shadow-2xs">
                <CalendarIcon className="w-3.5 h-3.5 text-ink-soft shrink-0" />
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  placeholder="No due date"
                  className="bg-transparent text-ink font-semibold text-xs focus:outline-none w-full cursor-pointer"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
