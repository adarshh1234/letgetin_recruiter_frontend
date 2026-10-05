"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Search,
  Bold,
  Italic,
  Underline,
  Link2,
  AlignLeft,
  AlignCenter,
  CheckSquare,
  ListOrdered,
  List,
  ChevronDown,
  FileText,
  Clock,
  Sparkles,
  SeparatorHorizontal,
} from "lucide-react";
import { useTaskmiteNotesStore } from "@/features/recruiter/store/useTaskmiteNotesStore";

export function TaskmiteNotesView() {
  const {
    notes,
    activeNoteId,
    setActiveNoteId,
    addNote,
    updateNote,
    deleteNote,
    searchQuery,
    setSearchQuery,
    fetchNotes,
  } = useTaskmiteNotesStore();

  useEffect(() => {
    fetchNotes().catch(() => {});
  }, [fetchNotes]);

  const [insertMenuOpen, setInsertMenuOpen] = useState(false);

  const activeNote = notes.find((n) => n.id === activeNoteId) || notes[0] || null;

  const filteredNotes = notes.filter((n) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q);
  });

  const editorRef = useRef<HTMLTextAreaElement>(null);

  const handleFormat = (prefix: string, suffix: string = "") => {
    if (!editorRef.current || !activeNote) return;
    const textarea = editorRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const before = textarea.value.substring(0, start);
    const after = textarea.value.substring(end);

    const newContent = `${before}${prefix}${selectedText || "text"}${suffix}${after}`;
    updateNote(activeNote.id, { content: newContent });

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length + (selectedText ? 0 : 4));
    }, 10);
  };

  const handleInsertBullet = () => {
    handleFormat("• ");
  };

  const handleInsertNumbered = () => {
    handleFormat("1. ");
  };

  const handleInsertChecklist = () => {
    handleFormat("[ ] ");
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-background">
      {/* ===== 1. NOTES SUB-LIST (Middle Column) ===== */}
      <aside className="w-64 sm:w-72 shrink-0 bg-surface border-r border-border flex flex-col h-full overflow-hidden select-none">
        {/* Header & Search */}
        <div className="p-3.5 border-b border-border space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary-glow" />
              <h3 className="text-xs font-bold text-ink tracking-wide">Notes</h3>
              <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-primary/15 text-primary-glow border border-primary/25">
                {notes.length}
              </span>
            </div>

            <button
              type="button"
              onClick={() => addNote("New note", "")}
              className="p-1 rounded-lg hover:bg-surface-alt text-ink-soft hover:text-ink transition cursor-pointer"
              title="Create new note"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Search */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-surface-alt border border-border text-xs">
            <Search className="w-3.5 h-3.5 text-ink-soft shrink-0" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-ink placeholder:text-ink-soft/60 focus:outline-none w-full text-xs"
            />
          </div>
        </div>

        {/* Notes Items List (Screenshot Reference: "New note", "No text yet", "Today") */}
        <div className="flex-1 p-2 space-y-1 overflow-y-auto scrollbar-thin">
          {filteredNotes.map((note) => {
            const isActive = activeNote?.id === note.id;
            const snippet = note.content.trim().split("\n")[0] || "No text yet";

            return (
              <div
                key={note.id}
                onClick={() => setActiveNoteId(note.id)}
                className={`p-3 rounded-2xl border transition cursor-pointer group text-xs space-y-1 relative ${
                  isActive
                    ? "bg-surface-alt text-ink border-border shadow-2xs font-semibold"
                    : "border-transparent hover:bg-surface-alt/60 text-ink-soft hover:text-ink"
                }`}
              >
                <div className="flex items-start justify-between gap-1.5">
                  <h4 className="font-bold text-ink truncate flex-1 text-xs">
                    {note.title || "Untitled note"}
                  </h4>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNote(note.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-ink-soft hover:text-rose-500 transition p-0.5"
                    title="Delete note"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-[11px] text-ink-soft line-clamp-1">
                  {snippet}
                </p>

                <div className="flex items-center justify-between text-[10px] text-ink-soft/70 pt-0.5 font-mono">
                  <span>{note.updatedAt || "Today"}</span>
                  {note.tags && note.tags.length > 0 && (
                    <span className="text-[9.5px] font-sans px-1.5 py-0.2 rounded bg-surface border border-border/80 text-ink-soft">
                      #{note.tags[0]}
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {filteredNotes.length === 0 && (
            <div className="h-36 border border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-center p-3 text-ink-soft/60 text-xs">
              <span>No notes found</span>
              <button
                type="button"
                onClick={() => addNote("New note", "")}
                className="mt-2 text-xs font-bold text-primary-glow hover:underline"
              >
                Create note
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ===== 2. MAIN NOTE EDITOR CANVAS (Right Panel) ===== */}
      <main className="flex-1 flex flex-col overflow-hidden bg-surface min-w-0">
        {activeNote ? (
          <>
            {/* Rich-Text Formatting Toolbar (Screenshot Reference) */}
            <div className="h-12 px-4 sm:px-6 border-b border-border flex items-center justify-between shrink-0 bg-surface text-ink text-xs select-none overflow-x-auto">
              {/* Left Formatting Tools */}
              <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
                {/* Heading / Normal text */}
                <button
                  type="button"
                  onClick={() => handleFormat("# ")}
                  className="px-2.5 py-1 rounded-lg hover:bg-surface-alt border border-transparent hover:border-border text-xs font-semibold text-ink flex items-center gap-1 transition cursor-pointer"
                >
                  <span>Normal text</span>
                  <ChevronDown className="w-3 h-3 text-ink-soft" />
                </button>

                <span className="h-4 w-px bg-border mx-1" />

                {/* Bold */}
                <button
                  type="button"
                  onClick={() => handleFormat("**", "**")}
                  className="p-1.5 rounded-lg hover:bg-surface-alt text-ink hover:text-primary transition cursor-pointer"
                  title="Bold"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>

                {/* Italic */}
                <button
                  type="button"
                  onClick={() => handleFormat("*", "*")}
                  className="p-1.5 rounded-lg hover:bg-surface-alt text-ink hover:text-primary transition cursor-pointer"
                  title="Italic"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>

                {/* Underline */}
                <button
                  type="button"
                  onClick={() => handleFormat("__", "__")}
                  className="p-1.5 rounded-lg hover:bg-surface-alt text-ink hover:text-primary transition cursor-pointer"
                  title="Underline"
                >
                  <Underline className="w-3.5 h-3.5" />
                </button>

                {/* Text Color / Highlight */}
                <button
                  type="button"
                  onClick={() => handleFormat("== ", " ==")}
                  className="p-1.5 rounded-lg hover:bg-surface-alt font-black text-primary-glow transition cursor-pointer text-xs"
                  title="Text Highlight"
                >
                  A
                </button>

                <span className="h-4 w-px bg-border mx-1" />

                {/* Link */}
                <button
                  type="button"
                  onClick={() => handleFormat("[Link](", ")")}
                  className="p-1.5 rounded-lg hover:bg-surface-alt text-ink hover:text-primary transition cursor-pointer"
                  title="Insert Link"
                >
                  <Link2 className="w-3.5 h-3.5" />
                </button>

                {/* Align Left */}
                <button
                  type="button"
                  className="p-1.5 rounded-lg hover:bg-surface-alt text-ink hover:text-primary transition cursor-pointer"
                  title="Align Left"
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                </button>

                {/* Align Center */}
                <button
                  type="button"
                  className="p-1.5 rounded-lg hover:bg-surface-alt text-ink hover:text-primary transition cursor-pointer"
                  title="Align Center"
                >
                  <AlignCenter className="w-3.5 h-3.5" />
                </button>

                <span className="h-4 w-px bg-border mx-1" />

                {/* Checklist */}
                <button
                  type="button"
                  onClick={handleInsertChecklist}
                  className="p-1.5 rounded-lg hover:bg-surface-alt text-ink hover:text-primary transition cursor-pointer"
                  title="To-do checklist"
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                </button>

                {/* Numbered list */}
                <button
                  type="button"
                  onClick={handleInsertNumbered}
                  className="p-1.5 rounded-lg hover:bg-surface-alt text-ink hover:text-primary transition cursor-pointer"
                  title="Numbered List"
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                </button>

                {/* Bullet list */}
                <button
                  type="button"
                  onClick={handleInsertBullet}
                  className="p-1.5 rounded-lg hover:bg-surface-alt text-ink hover:text-primary transition cursor-pointer"
                  title="Bullet List"
                >
                  <List className="w-3.5 h-3.5" />
                </button>

                {/* Insert / Plus (Screenshot Reference) */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setInsertMenuOpen(!insertMenuOpen)}
                    className="p-1.5 rounded-lg hover:bg-surface-alt text-ink hover:text-primary transition cursor-pointer"
                    title="Insert block"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>

                  {insertMenuOpen && (
                    <div className="absolute top-full mt-1 left-0 z-50 w-44 p-1.5 bg-surface border border-border rounded-xl shadow-xl space-y-0.5 text-xs animate-in fade-in zoom-in-95">
                      <button
                        type="button"
                        onClick={() => {
                          handleFormat("\n---\n");
                          setInsertMenuOpen(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-surface-alt text-ink flex items-center gap-2 transition"
                      >
                        <SeparatorHorizontal className="w-3.5 h-3.5 text-ink-soft" />
                        <span>Horizontal rule</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          handleFormat("> ");
                          setInsertMenuOpen(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-surface-alt text-ink flex items-center gap-2 transition"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-primary-glow" />
                        <span>Quote callout</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          handleFormat("```\n", "\n```");
                          setInsertMenuOpen(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-surface-alt text-ink flex items-center gap-2 transition"
                      >
                        <FileText className="w-3.5 h-3.5 text-ink-soft" />
                        <span>Code block</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Last edited timestamp */}
              <div className="flex items-center gap-1 text-[11px] text-ink-soft shrink-0 pl-2">
                <Clock className="w-3 h-3 text-ink-soft" />
                <span>Last edited: {activeNote.updatedAt || "Today"}</span>
              </div>
            </div>

            {/* Note Canvas (Title + Body) */}
            <div className="flex-1 p-6 sm:p-10 overflow-y-auto space-y-4 max-w-4xl w-full mx-auto">
              {/* Note Title Input (Screenshot Reference: "Title") */}
              <input
                type="text"
                placeholder="Title"
                value={activeNote.title}
                onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
                className="w-full text-2xl sm:text-4xl font-black text-ink placeholder:text-ink-soft/40 bg-transparent outline-none tracking-tight"
              />

              {/* Note Body Textarea (Screenshot Reference: "Write your text here...") */}
              <textarea
                ref={editorRef}
                rows={20}
                placeholder="Write your text here..."
                value={activeNote.content}
                onChange={(e) => updateNote(activeNote.id, { content: e.target.value })}
                className="w-full text-sm leading-relaxed text-ink placeholder:text-ink-soft/50 bg-transparent outline-none resize-none font-sans"
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-ink-soft space-y-3">
            <FileText className="w-12 h-12 opacity-30 text-primary-glow" />
            <h4 className="text-base font-bold text-ink">No note selected</h4>
            <p className="text-xs text-ink-soft">Select a note from the left list or create a new one.</p>
            <button
              type="button"
              onClick={() => addNote("New note", "")}
              className="px-4 py-2 rounded-xl bg-gradient-brand text-primary-foreground text-xs font-bold shadow-glow hover:opacity-95 transition cursor-pointer"
            >
              Create New Note
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
