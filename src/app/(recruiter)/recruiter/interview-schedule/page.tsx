"use client";

import React, { useState, useMemo, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CalendarDays,
  KanbanSquare,
  Search,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  Clock,
  Video,
  ExternalLink,
  Users,
  CheckCircle2,
  AlertCircle,
  Calendar as CalendarIcon,
  X,
  MoreVertical,
  Star,
  Sparkles,
  ArrowRight,
  Building2,
  Mail,
  Phone,
  RefreshCw,
  SlidersHorizontal,
  ChevronDown,
  Bot,
  Trash2,
  Loader2,
} from "lucide-react";
import { interviewService } from "@/features/interview/services/interviewService";
import { InterviewStage } from "@/features/interview/types";

export type { InterviewStage };

export interface ScheduledInterview {
  id: string;
  candidateName: string;
  candidateEmail: string;
  avatarUrl?: string;
  position: string;
  department: string;
  roundName: string;
  stage: InterviewStage;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "10:30 AM"
  durationMinutes: number;
  interviewers: { name: string; role: string; avatar?: string }[];
  platform: "Google Meet" | "Zoom" | "Microsoft Teams" | "LetGetIn Room" | "On-Site";
  meetingLink: string;
  score?: number; // 1-5
  feedbackNotes?: string;
}

const STAGE_CONFIG: Record<
  InterviewStage,
  { label: string; color: string; bgBadge: string; textBadge: string; borderBadge: string }
> = {
  to_schedule: {
    label: "Requested / To Schedule",
    color: "from-amber-500/20 to-amber-600/10",
    bgBadge: "bg-amber-500/10",
    textBadge: "text-amber-600 dark:text-amber-400",
    borderBadge: "border-amber-500/30",
  },
  upcoming: {
    label: "Confirmed / Upcoming",
    color: "from-blue-500/20 to-blue-600/10",
    bgBadge: "bg-blue-500/10",
    textBadge: "text-blue-600 dark:text-blue-400",
    borderBadge: "border-blue-500/30",
  },
  today: {
    label: "In Progress / Today",
    color: "from-emerald-500/20 to-emerald-600/10",
    bgBadge: "bg-emerald-500/10",
    textBadge: "text-emerald-600 dark:text-emerald-400",
    borderBadge: "border-emerald-500/30",
  },
  feedback_pending: {
    label: "Feedback Pending",
    color: "from-purple-500/20 to-purple-600/10",
    bgBadge: "bg-purple-500/10",
    textBadge: "text-purple-600 dark:text-purple-400",
    borderBadge: "border-purple-500/30",
  },
  completed: {
    label: "Completed / Decided",
    color: "from-teal-500/20 to-teal-600/10",
    bgBadge: "bg-teal-500/10",
    textBadge: "text-teal-600 dark:text-teal-400",
    borderBadge: "border-teal-500/30",
  },
  cancelled: {
    label: "Cancelled",
    color: "from-rose-500/20 to-rose-600/10",
    bgBadge: "bg-rose-500/10",
    textBadge: "text-rose-600 dark:text-rose-400",
    borderBadge: "border-rose-500/30",
  },
};

const INITIAL_INTERVIEWS: ScheduledInterview[] = [
  {
    id: "int-1",
    candidateName: "Sophia Chen",
    candidateEmail: "sophia.chen@example.com",
    position: "Senior Frontend Engineer",
    department: "Engineering",
    roundName: "Round 2: Architecture & Code",
    stage: "today",
    date: new Date().toISOString().slice(0, 10),
    time: "10:30 AM",
    durationMinutes: 45,
    interviewers: [
      { name: "David Kim", role: "Principal Engineer" },
      { name: "Elena Rostova", role: "Frontend Lead" },
    ],
    platform: "LetGetIn Room",
    meetingLink: "https://letgetin.com/room/live-7829-alpha",
  },
  {
    id: "int-2",
    candidateName: "Marcus Vance",
    candidateEmail: "marcus.v@example.com",
    position: "Staff Product Designer",
    department: "Design",
    roundName: "Portfolio Deep Dive",
    stage: "today",
    date: new Date().toISOString().slice(0, 10),
    time: "02:00 PM",
    durationMinutes: 60,
    interviewers: [
      { name: "Sarah Jenkins", role: "Design Director" },
    ],
    platform: "Google Meet",
    meetingLink: "https://meet.google.com/abc-wxyz-qrs",
  },
  {
    id: "int-3",
    candidateName: "Aarav Sharma",
    candidateEmail: "aarav.sharma@example.com",
    position: "Full Stack Engineer",
    department: "Engineering",
    roundName: "Round 1: Technical Screening",
    stage: "upcoming",
    date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    time: "11:00 AM",
    durationMinutes: 45,
    interviewers: [
      { name: "Alex Rivera", role: "Tech Lead" },
    ],
    platform: "Zoom",
    meetingLink: "https://zoom.us/j/9812739102",
  },
  {
    id: "int-4",
    candidateName: "Emily Watson",
    candidateEmail: "emily.w@example.com",
    position: "Product Marketing Manager",
    department: "Marketing",
    roundName: "Culture & Value Alignment",
    stage: "upcoming",
    date: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
    time: "03:30 PM",
    durationMinutes: 45,
    interviewers: [
      { name: "Rachel Adams", role: "VP of Marketing" },
      { name: "Jordan Cole", role: "People Partner" },
    ],
    platform: "Google Meet",
    meetingLink: "https://meet.google.com/xyz-pmkt-abc",
  },
  {
    id: "int-5",
    candidateName: "Jameson Miller",
    candidateEmail: "j.miller@example.com",
    position: "DevOps / SRE Specialist",
    department: "Engineering",
    roundName: "Initial Recruiter Screen",
    stage: "to_schedule",
    date: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10),
    time: "04:00 PM",
    durationMinutes: 30,
    interviewers: [
      { name: "Jordan Cole", role: "Talent Partner" },
    ],
    platform: "Google Meet",
    meetingLink: "https://meet.google.com/devops-screen",
  },
  {
    id: "int-6",
    candidateName: "Ananya Patel",
    candidateEmail: "ananya.patel@example.com",
    position: "Data Science Lead",
    department: "Engineering",
    roundName: "Round 3: System Modeling",
    stage: "feedback_pending",
    date: new Date(Date.now() - 86400000).toISOString().slice(0, 10),
    time: "01:30 PM",
    durationMinutes: 60,
    interviewers: [
      { name: "Dr. Vikram Seth", role: "Head of AI" },
      { name: "David Kim", role: "Principal Engineer" },
    ],
    platform: "LetGetIn Room",
    meetingLink: "https://letgetin.com/room/ds-eval-55",
    score: 4.5,
    feedbackNotes: "Strong mathematical intuition and clean code style.",
  },
  {
    id: "int-7",
    candidateName: "Lucas Silva",
    candidateEmail: "lucas.silva@example.com",
    position: "Senior Mobile Developer (React Native)",
    department: "Engineering",
    roundName: "Executive Panel",
    stage: "completed",
    date: new Date(Date.now() - 86400000 * 2).toISOString().slice(0, 10),
    time: "04:30 PM",
    durationMinutes: 45,
    interviewers: [
      { name: "CTO / VP Engineering", role: "Leadership" },
    ],
    platform: "Microsoft Teams",
    meetingLink: "https://teams.microsoft.com/l/meetup-join/exec-77",
    score: 5.0,
    feedbackNotes: "Exceeded all technical and culture benchmarks. Recommended for immediate offer.",
  },
];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function InterviewScheduleContent() {
  const searchParams = useSearchParams();
  const paramCandidateName = searchParams?.get("candidateName");
  const paramCandidateEmail = searchParams?.get("candidateEmail");
  const paramPosition = searchParams?.get("position");
  const paramDepartment = searchParams?.get("department");
  const paramAutoOpen = searchParams?.get("autoOpen");

  const [activeTab, setActiveTab] = useState<"kanban" | "calendar">("kanban");
  const [interviews, setInterviews] = useState<ScheduledInterview[]>(INITIAL_INTERVIEWS);
  const [isLoadingBackend, setIsLoadingBackend] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");

  // Load from backend on mount
  const loadBackendInterviews = useCallback(async () => {
    try {
      setIsLoadingBackend(true);
      const data = await interviewService.getInterviews();
      if (data && data.length > 0) {
        setInterviews(
          data.map((item) => ({
            id: item._id || item.id || `int-${Date.now()}`,
            candidateName: item.candidateName,
            candidateEmail: item.candidateEmail,
            avatarUrl: item.candidateAvatar,
            position: item.position,
            department: item.department || "Engineering",
            roundName: item.roundName || "Technical Round 1",
            stage: item.stage,
            date: item.date,
            time: item.time,
            durationMinutes: item.durationMinutes || 45,
            interviewers: item.interviewers || [{ name: "Hiring Lead", role: "Interviewer" }],
            platform: item.platform || "LetGetIn Room",
            meetingLink: item.meetingLink || `/recruiter/video-interview?room=${item.roomCode || item._id}`,
            score: item.score,
            feedbackNotes: item.feedbackNotes,
          }))
        );
      }
    } catch {
      // Graceful fallback to initial state if offline or no backend
    } finally {
      setIsLoadingBackend(false);
    }
  }, []);

  useEffect(() => {
    loadBackendInterviews();
  }, [loadBackendInterviews]);

  // Calendar view states
  const today = new Date();
  const [calendarMonth, setCalendarMonth] = useState(today.getMonth());
  const [calendarYear, setCalendarYear] = useState(today.getFullYear());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(today.toISOString().slice(0, 10));

  // Modals
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [activeDetailInterview, setActiveDetailInterview] = useState<ScheduledInterview | null>(null);
  const [modalScore, setModalScore] = useState<number>(4);
  const [modalFeedback, setModalFeedback] = useState<string>("");
  const [isSavingFeedback, setIsSavingFeedback] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (activeDetailInterview) {
      setModalScore(activeDetailInterview.score || 4);
      setModalFeedback(activeDetailInterview.feedbackNotes || "");
    }
  }, [activeDetailInterview]);

  // New Interview Form
  const [formCandidateName, setFormCandidateName] = useState(paramCandidateName || "");
  const [formCandidateEmail, setFormCandidateEmail] = useState(paramCandidateEmail || "");
  const [formPosition, setFormPosition] = useState(paramPosition || "");
  const [formDepartment, setFormDepartment] = useState(paramDepartment || "Engineering");
  const [formRoundName, setFormRoundName] = useState("Round 1: Screening");
  const [formDate, setFormDate] = useState(new Date().toISOString().slice(0, 10));
  const [formTime, setFormTime] = useState("11:00 AM");
  const [formDuration, setFormDuration] = useState(45);
  const [formInterviewerName, setFormInterviewerName] = useState("");
  const [formPlatform, setFormPlatform] = useState<ScheduledInterview["platform"]>("LetGetIn Room");

  useEffect(() => {
    if (paramCandidateName) {
      setFormCandidateName(paramCandidateName);
      if (paramCandidateEmail) setFormCandidateEmail(paramCandidateEmail);
      if (paramPosition) setFormPosition(paramPosition);
      if (paramDepartment) setFormDepartment(paramDepartment);
      if (paramAutoOpen === "true" || paramAutoOpen === "1") {
        setIsScheduleModalOpen(true);
      }
    }
  }, [paramCandidateName, paramCandidateEmail, paramPosition, paramDepartment, paramAutoOpen]);

  // Filtered Interviews
  const filteredInterviews = useMemo(() => {
    return interviews.filter((item) => {
      if (departmentFilter !== "all" && item.department !== departmentFilter) return false;
      if (stageFilter !== "all" && item.stage !== stageFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.candidateName.toLowerCase().includes(q);
        const matchPos = item.position.toLowerCase().includes(q);
        const matchRound = item.roundName.toLowerCase().includes(q);
        const matchInterviewer = item.interviewers.some((i) => i.name.toLowerCase().includes(q));
        if (!matchName && !matchPos && !matchRound && !matchInterviewer) return false;
      }
      return true;
    });
  }, [interviews, departmentFilter, stageFilter, searchQuery]);

  // Metrics
  const metrics = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const total = interviews.length;
    const todayCount = interviews.filter((i) => i.date === todayStr || i.stage === "today").length;
    const pendingFeedback = interviews.filter((i) => i.stage === "feedback_pending").length;
    const completedCount = interviews.filter((i) => i.stage === "completed").length;
    return { total, todayCount, pendingFeedback, completedCount };
  }, [interviews]);

  // Stage Movement
  const handleMoveStage = async (id: string, newStage: InterviewStage) => {
    setInterviews((prev) =>
      prev.map((i) => (i.id === id ? { ...i, stage: newStage } : i))
    );
    if (activeDetailInterview && activeDetailInterview.id === id) {
      setActiveDetailInterview((prev) => (prev ? { ...prev, stage: newStage } : null));
    }
    try {
      await interviewService.updateStage(id, newStage);
    } catch (e) {
      console.warn("Failed to persist stage update to backend:", e);
    }
  };

  // Calendar Helpers
  const changeCalendarMonth = (delta: number) => {
    let m = calendarMonth + delta;
    let y = calendarYear;
    if (m < 0) {
      m = 11;
      y--;
    } else if (m > 11) {
      m = 0;
      y++;
    }
    setCalendarMonth(m);
    setCalendarYear(y);
  };

  const firstDayOfWeek = new Date(calendarYear, calendarMonth, 1).getDay();
  const daysInCalendarMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();

  const calendarCells = useMemo(() => {
    const cells: { dateStr: string; dayNum: number; isCurrentMonth: boolean }[] = [];
    const prevMonthDays = new Date(calendarYear, calendarMonth, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      const m = calendarMonth === 0 ? 12 : calendarMonth;
      const y = calendarMonth === 0 ? calendarYear - 1 : calendarYear;
      const dateStr = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      cells.push({ dateStr, dayNum: d, isCurrentMonth: false });
    }
    for (let d = 1; d <= daysInCalendarMonth; d++) {
      const m = calendarMonth + 1;
      const dateStr = `${calendarYear}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      cells.push({ dateStr, dayNum: d, isCurrentMonth: true });
    }
    const remaining = 42 - cells.length;
    for (let d = 1; d <= remaining; d++) {
      const m = calendarMonth === 11 ? 1 : calendarMonth + 2;
      const y = calendarMonth === 11 ? calendarYear + 1 : calendarYear;
      const dateStr = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      cells.push({ dateStr, dayNum: d, isCurrentMonth: false });
    }
    return cells;
  }, [calendarYear, calendarMonth, firstDayOfWeek, daysInCalendarMonth]);

  const interviewsByDate = useMemo(() => {
    const map = new Map<string, ScheduledInterview[]>();
    for (const item of filteredInterviews) {
      const list = map.get(item.date) || [];
      list.push(item);
      map.set(item.date, list);
    }
    return map;
  }, [filteredInterviews]);

  const selectedDateInterviews = useMemo(() => {
    return filteredInterviews.filter((i) => i.date === selectedDateStr);
  }, [filteredInterviews, selectedDateStr]);

  // Handle Schedule Submit
  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCandidateName || !formPosition) return;

    const email = formCandidateEmail || `${formCandidateName.toLowerCase().replace(/\s+/g, ".")}@example.com`;
    const newStage: InterviewStage = formDate === new Date().toISOString().slice(0, 10) ? "today" : "upcoming";

    try {
      const created = await interviewService.createInterview({
        candidateName: formCandidateName,
        candidateEmail: email,
        position: formPosition,
        department: formDepartment,
        roundName: formRoundName,
        stage: newStage,
        date: formDate,
        time: formTime,
        durationMinutes: formDuration,
        platform: formPlatform,
        interviewers: [{ name: formInterviewerName || "Hiring Panel", role: "Interviewer" }],
      });

      const mapped: ScheduledInterview = {
        id: created._id || created.id || `int-${Date.now()}`,
        candidateName: created.candidateName,
        candidateEmail: created.candidateEmail,
        avatarUrl: created.candidateAvatar,
        position: created.position,
        department: created.department,
        roundName: created.roundName,
        stage: created.stage,
        date: created.date,
        time: created.time,
        durationMinutes: created.durationMinutes,
        interviewers: created.interviewers,
        platform: created.platform,
        meetingLink: created.meetingLink || `/recruiter/video-interview?room=${created.roomCode || created._id}`,
      };

      setInterviews((prev) => [mapped, ...prev]);
    } catch {
      // Fallback local addition
      const localItem: ScheduledInterview = {
        id: `int-${Date.now()}`,
        candidateName: formCandidateName,
        candidateEmail: email,
        position: formPosition,
        department: formDepartment,
        roundName: formRoundName,
        stage: newStage,
        date: formDate,
        time: formTime,
        durationMinutes: formDuration,
        interviewers: [{ name: formInterviewerName || "Hiring Panel", role: "Interviewer" }],
        platform: formPlatform,
        meetingLink: `/recruiter/video-interview?room=lgi-${Date.now()}`,
      };
      setInterviews((prev) => [localItem, ...prev]);
    }

    setIsScheduleModalOpen(false);
    setFormCandidateName("");
    setFormCandidateEmail("");
    setFormPosition("");
    setFormInterviewerName("");
  };

  const handleSaveFeedback = async (id: string) => {
    setIsSavingFeedback(true);
    try {
      await interviewService.submitFeedback(id, modalScore, modalFeedback);
      setInterviews((prev) =>
        prev.map((i) =>
          i.id === id ? { ...i, score: modalScore, feedbackNotes: modalFeedback, stage: "completed" } : i
        )
      );
      setActiveDetailInterview((prev) =>
        prev && prev.id === id ? { ...prev, score: modalScore, feedbackNotes: modalFeedback, stage: "completed" } : null
      );
    } catch (e) {
      console.warn("Failed to submit feedback to backend:", e);
      setInterviews((prev) =>
        prev.map((i) =>
          i.id === id ? { ...i, score: modalScore, feedbackNotes: modalFeedback, stage: "completed" } : i
        )
      );
      setActiveDetailInterview((prev) =>
        prev && prev.id === id ? { ...prev, score: modalScore, feedbackNotes: modalFeedback, stage: "completed" } : null
      );
    } finally {
      setIsSavingFeedback(false);
    }
  };

  const handleDeleteInterview = async (id: string) => {
    setIsDeleting(true);
    try {
      await interviewService.deleteInterview(id);
      setInterviews((prev) => prev.filter((i) => i.id !== id));
      setActiveDetailInterview(null);
    } catch (e) {
      console.warn("Failed to delete interview on backend:", e);
      setInterviews((prev) => prev.filter((i) => i.id !== id));
      setActiveDetailInterview(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8 lg:p-10 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
              Interview Schedule
            </h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary-glow bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3 text-primary-glow" />
              Live Sync
            </span>
          </div>
          <p className="text-xs sm:text-sm text-ink-soft mt-1">
            Streamline candidate interview pipelines, synchronize multi-panel availability, and conduct live video evaluations.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-surface text-[11px] font-medium text-ink-soft">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Google & Outlook Synced
          </div>

          <button
            type="button"
            onClick={() => setIsScheduleModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-brand text-primary-foreground text-xs font-bold shadow-glow hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Schedule Interview
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl border border-border bg-surface shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-ink-soft uppercase tracking-wider">
              Total Scheduled
            </div>
            <div className="text-2xl font-black text-ink mt-0.5">{metrics.total}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary-glow flex items-center justify-center">
            <CalendarDays className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-border bg-surface shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-ink-soft uppercase tracking-wider">
              Today's Rounds
            </div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
              {metrics.todayCount}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-border bg-surface shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-ink-soft uppercase tracking-wider">
              Feedback Pending
            </div>
            <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-0.5">
              {metrics.pendingFeedback}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-border bg-surface shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-ink-soft uppercase tracking-wider">
              Decided & Done
            </div>
            <div className="text-2xl font-black text-teal-600 dark:text-teal-400 mt-0.5">
              {metrics.completedCount}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tabs & Controls Bar */}
      <div className="p-3 sm:p-4 rounded-2xl border border-border bg-surface shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* 2 Tabs: Kanban Board vs Calendar View */}
        <div className="flex items-center p-1 rounded-xl bg-surface-alt border border-border/80 w-full sm:w-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("kanban")}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "kanban"
                ? "bg-surface text-ink shadow-xs border border-border"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            <KanbanSquare className="w-4 h-4 text-primary-glow" />
            <span>Kanban Board</span>
            <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary-glow font-extrabold">
              {filteredInterviews.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("calendar")}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "calendar"
                ? "bg-surface text-ink shadow-xs border border-border"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            <CalendarDays className="w-4 h-4 text-primary-glow" />
            <span>Calendar View</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-2.5 flex-1 max-w-xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-ink-soft absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidate, role, or interviewer..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-surface text-xs text-ink placeholder:text-ink-soft outline-none focus:border-primary transition"
            />
          </div>

          <div className="relative">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="pl-3 pr-7 py-2 rounded-xl border border-border bg-surface text-xs font-semibold text-ink appearance-none outline-none focus:border-primary"
            >
              <option value="all">All Depts</option>
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-ink-soft absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: KANBAN BOARD                                                       */}
      {/* ========================================================================= */}
      {activeTab === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 items-start">
          {(Object.keys(STAGE_CONFIG) as InterviewStage[]).map((stageKey) => {
            const conf = STAGE_CONFIG[stageKey];
            const stageItems = filteredInterviews.filter((i) => i.stage === stageKey);

            return (
              <div
                key={stageKey}
                className="bg-surface rounded-2xl border border-border flex flex-col min-h-[500px] shadow-xs"
              >
                {/* Column Header */}
                <div className="p-3.5 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-2.5 h-2.5 rounded-full ${conf.bgBadge} border ${conf.borderBadge}`} />
                    <h3 className="text-xs font-bold text-ink truncate">{conf.label}</h3>
                  </div>
                  <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full ${conf.bgBadge} ${conf.textBadge}`}>
                    {stageItems.length}
                  </span>
                </div>

                {/* Column Cards List */}
                <div className="p-3 space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-320px)] scrollbar-thin">
                  {stageItems.length === 0 ? (
                    <div className="h-32 flex flex-col items-center justify-center text-center p-4 border border-dashed border-border rounded-xl text-ink-soft text-xs">
                      <span>No candidates in this stage</span>
                    </div>
                  ) : (
                    stageItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setActiveDetailInterview(item)}
                        className="p-3.5 rounded-xl border border-border bg-surface-alt/40 hover:bg-surface-alt hover:border-primary/40 transition-all cursor-pointer shadow-xs space-y-3 group"
                      >
                        {/* Header: Candidate Name & Round */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-xs font-extrabold text-ink group-hover:text-primary-glow transition">
                              {item.candidateName}
                            </div>
                            <div className="text-[11px] text-ink-soft truncate max-w-[150px]">
                              {item.position}
                            </div>
                          </div>
                          <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${conf.bgBadge} ${conf.textBadge} ${conf.borderBadge} shrink-0`}>
                            {item.roundName.split(":")[0]}
                          </span>
                        </div>

                        {/* Date & Time Badge */}
                        <div className="flex items-center gap-1.5 text-[11px] text-ink font-semibold">
                          <Clock className="w-3.5 h-3.5 text-primary-glow shrink-0" />
                          <span>{item.date === new Date().toISOString().slice(0, 10) ? "Today" : item.date}</span>
                          <span className="text-ink-soft">•</span>
                          <span className="text-primary-glow font-bold">{item.time}</span>
                          <span className="text-[10px] text-ink-soft">({item.durationMinutes}m)</span>
                        </div>

                        {/* Interviewers & Platform */}
                        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-border/60">
                          <div className="flex items-center gap-1 text-ink-soft">
                            <Users className="w-3 h-3 text-ink-soft shrink-0" />
                            <span className="truncate max-w-[100px]">
                              {item.interviewers[0]?.name}
                              {item.interviewers.length > 1 && ` +${item.interviewers.length - 1}`}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 text-[10px] font-bold text-primary-glow bg-primary/10 px-1.5 py-0.5 rounded-md">
                            <Video className="w-2.5 h-2.5" />
                            <span>{item.platform}</span>
                          </div>
                        </div>

                        {/* Score Rating if available */}
                        {item.score && (
                          <div className="flex items-center justify-between text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-md font-bold">
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-emerald-500 text-emerald-500" />
                              <span>Score: {item.score} / 5.0</span>
                            </div>
                            <span className="text-[9px] uppercase font-bold">Approved</span>
                          </div>
                        )}

                        {/* Quick Stage Progression Buttons */}
                        <div className="flex items-center justify-between pt-1 text-[10px]" onClick={(e) => e.stopPropagation()}>
                          <a
                            href={item.meetingLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-primary-glow hover:underline font-bold"
                          >
                            <span>Join</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>

                          <div className="flex items-center gap-1">
                            {stageKey !== "to_schedule" && (
                              <button
                                type="button"
                                onClick={() => {
                                  const stages: InterviewStage[] = [
                                    "to_schedule",
                                    "upcoming",
                                    "today",
                                    "feedback_pending",
                                    "completed",
                                  ];
                                  const idx = stages.indexOf(stageKey);
                                  if (idx > 0) handleMoveStage(item.id, stages[idx - 1]);
                                }}
                                title="Move Back"
                                className="px-1.5 py-0.5 rounded hover:bg-surface border border-border text-ink-soft cursor-pointer"
                              >
                                ←
                              </button>
                            )}
                            {stageKey !== "completed" && (
                              <button
                                type="button"
                                onClick={() => {
                                  const stages: InterviewStage[] = [
                                    "to_schedule",
                                    "upcoming",
                                    "today",
                                    "feedback_pending",
                                    "completed",
                                  ];
                                  const idx = stages.indexOf(stageKey);
                                  if (idx < stages.length - 1) handleMoveStage(item.id, stages[idx + 1]);
                                }}
                                title="Advance Stage"
                                className="px-1.5 py-0.5 rounded bg-primary/10 text-primary-glow font-bold hover:bg-primary/20 cursor-pointer"
                              >
                                →
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CALENDAR VIEW                                                      */}
      {/* ========================================================================= */}
      {activeTab === "calendar" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Month Grid (8 columns) */}
          <div className="lg:col-span-8 bg-surface rounded-2xl border border-border shadow-xs p-5 sm:p-6 space-y-4">
            {/* Calendar Navigation Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => changeCalendarMonth(-1)}
                  className="p-2 rounded-xl hover:bg-surface-alt border border-border text-ink-soft hover:text-ink transition cursor-pointer"
                  aria-label="Previous Month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <h2 className="text-base sm:text-lg font-bold text-ink">
                  {MONTH_NAMES[calendarMonth]} {calendarYear}
                </h2>
                <button
                  type="button"
                  onClick={() => changeCalendarMonth(1)}
                  className="p-2 rounded-xl hover:bg-surface-alt border border-border text-ink-soft hover:text-ink transition cursor-pointer"
                  aria-label="Next Month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCalendarMonth(today.getMonth());
                    setCalendarYear(today.getFullYear());
                    setSelectedDateStr(today.toISOString().slice(0, 10));
                  }}
                  className="px-3 py-1.5 rounded-xl border border-border hover:bg-surface-alt text-xs font-semibold text-ink transition cursor-pointer"
                >
                  Today
                </button>
              </div>
            </div>

            {/* Weekdays Row */}
            <div className="grid grid-cols-7 gap-1">
              {WEEKDAYS.map((d) => (
                <div
                  key={d}
                  className="text-center text-[11px] font-bold text-ink-soft uppercase py-1"
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Month Day Cells */}
            <div className="grid grid-cols-7 gap-1.5">
              {calendarCells.map((cell, idx) => {
                const isSelected = cell.dateStr === selectedDateStr;
                const isToday = cell.dateStr === today.toISOString().slice(0, 10);
                const dayInterviews = interviewsByDate.get(cell.dateStr) || [];

                return (
                  <div
                    key={`${cell.dateStr}-${idx}`}
                    onClick={() => setSelectedDateStr(cell.dateStr)}
                    className={`min-h-[85px] sm:min-h-[105px] p-2 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "border-primary-glow bg-primary/5 ring-1 ring-primary-glow"
                        : cell.isCurrentMonth
                        ? "border-border bg-surface hover:border-primary/40 hover:bg-surface-alt/40"
                        : "border-border/40 bg-surface-alt/30 opacity-40 hover:opacity-80"
                    }`}
                  >
                    {/* Day Number and Badges */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                          isToday
                            ? "bg-gradient-brand text-primary-foreground shadow-glow"
                            : isSelected
                            ? "text-primary-glow font-black"
                            : "text-ink"
                        }`}
                      >
                        {cell.dayNum}
                      </span>

                      {dayInterviews.length > 0 && (
                        <span className="text-[10px] font-extrabold text-primary-glow bg-primary/10 px-1.5 py-0.2 rounded-full">
                          {dayInterviews.length}
                        </span>
                      )}
                    </div>

                    {/* Interview Event Chips */}
                    <div className="space-y-1 mt-1">
                      {dayInterviews.slice(0, 2).map((item) => (
                        <div
                          key={item.id}
                          className="text-[9.5px] font-semibold px-1.5 py-0.5 rounded-md truncate bg-primary/10 text-primary-glow border border-primary/20 flex items-center gap-1"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-primary-glow shrink-0" />
                          <span className="truncate">{item.candidateName}</span>
                        </div>
                      ))}
                      {dayInterviews.length > 2 && (
                        <div className="text-[9px] text-ink-soft font-bold pl-1">
                          +{dayInterviews.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Date Agenda Panel (4 columns) */}
          <div className="lg:col-span-4 bg-surface rounded-2xl border border-border shadow-xs p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="text-sm font-extrabold text-ink">
                  {new Date(selectedDateStr + "T00:00:00").toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </h3>
                <p className="text-[11px] text-ink-soft">
                  {selectedDateInterviews.length} interview{selectedDateInterviews.length === 1 ? "" : "s"} scheduled
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setFormDate(selectedDateStr);
                  setIsScheduleModalOpen(true);
                }}
                className="p-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary-glow text-xs font-bold transition cursor-pointer"
                title="Add Interview Slot"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* List of interviews on selected date */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto scrollbar-thin pr-1">
              {selectedDateInterviews.length === 0 ? (
                <div className="py-12 text-center text-ink-soft text-xs space-y-2">
                  <CalendarIcon className="w-8 h-8 mx-auto text-ink-soft/40" />
                  <p>No interviews booked for this date.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setFormDate(selectedDateStr);
                      setIsScheduleModalOpen(true);
                    }}
                    className="text-xs font-bold text-primary-glow hover:underline cursor-pointer"
                  >
                    + Schedule an Interview
                  </button>
                </div>
              ) : (
                selectedDateInterviews.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setActiveDetailInterview(item)}
                    className="p-3.5 rounded-xl border border-border bg-surface-alt/40 hover:bg-surface-alt transition-all cursor-pointer space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs font-extrabold text-ink">{item.candidateName}</div>
                        <div className="text-[11px] text-ink-soft">{item.position}</div>
                      </div>
                      <span className="text-[10px] font-bold text-primary-glow bg-primary/10 px-2 py-0.5 rounded-md">
                        {item.time}
                      </span>
                    </div>

                    <div className="text-[11px] text-ink font-semibold flex items-center gap-1.5">
                      <span className="text-ink-soft font-normal">Round:</span>
                      <span>{item.roundName}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-2 border-t border-border/60">
                      <span className="text-ink-soft truncate max-w-[130px]">
                        Panel: {item.interviewers.map((i) => i.name).join(", ")}
                      </span>

                      <a
                        href={item.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-brand text-primary-foreground text-[10px] font-bold shadow-xs hover:scale-105 transition"
                      >
                        <Video className="w-3 h-3" />
                        <span>Join</span>
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: SCHEDULE NEW INTERVIEW                                             */}
      {/* ========================================================================= */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-surface border border-border rounded-3xl shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-brand text-primary-foreground flex items-center justify-center shadow-glow">
                  <CalendarDays className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-ink">Schedule Candidate Interview</h3>
                  <p className="text-[11px] text-ink-soft">Create a new interview slot and auto-generate invite links</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-surface-alt text-ink-soft hover:text-ink transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-4 text-xs">
              {/* Candidate Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-ink">Candidate Name *</label>
                  <input
                    type="text"
                    required
                    value={formCandidateName}
                    onChange={(e) => setFormCandidateName(e.target.value)}
                    placeholder="e.g. Maya Lin"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-ink outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-ink">Candidate Email</label>
                  <input
                    type="email"
                    value={formCandidateEmail}
                    onChange={(e) => setFormCandidateEmail(e.target.value)}
                    placeholder="maya@example.com"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-ink outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Role & Dept */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-ink">Position / Job Title *</label>
                  <input
                    type="text"
                    required
                    value={formPosition}
                    onChange={(e) => setFormPosition(e.target.value)}
                    placeholder="e.g. Lead Product Engineer"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-ink outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-ink">Department</label>
                  <select
                    value={formDepartment}
                    onChange={(e) => setFormDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-ink outline-none focus:border-primary"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Product">Product</option>
                    <option value="Sales">Sales</option>
                  </select>
                </div>
              </div>

              {/* Round & Interviewer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-ink">Interview Round</label>
                  <select
                    value={formRoundName}
                    onChange={(e) => setFormRoundName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-ink outline-none focus:border-primary"
                  >
                    <option value="Round 1: Screening">Round 1: Screening</option>
                    <option value="Round 2: Technical Deep Dive">Round 2: Technical Deep Dive</option>
                    <option value="Round 3: System Architecture">Round 3: System Architecture</option>
                    <option value="Round 4: Culture & Values">Round 4: Culture & Values</option>
                    <option value="Final: Executive Panel">Final: Executive Panel</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-ink">Lead Interviewer</label>
                  <input
                    type="text"
                    value={formInterviewerName}
                    onChange={(e) => setFormInterviewerName(e.target.value)}
                    placeholder="e.g. David Kim"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-ink outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-ink">Date *</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-ink outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-ink">Time Slot *</label>
                  <input
                    type="text"
                    required
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    placeholder="10:30 AM"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-ink outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-ink">Duration</label>
                  <select
                    value={formDuration}
                    onChange={(e) => setFormDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-ink outline-none focus:border-primary"
                  >
                    <option value={30}>30 min</option>
                    <option value={45}>45 min</option>
                    <option value={60}>60 min</option>
                    <option value={90}>90 min</option>
                  </select>
                </div>
              </div>

              {/* Meeting Platform */}
              <div className="space-y-1">
                <label className="font-bold text-ink">Meeting Platform</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["LetGetIn Room", "Google Meet", "Zoom"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setFormPlatform(p)}
                      className={`p-2 rounded-xl border text-center font-bold text-[11px] transition cursor-pointer ${
                        formPlatform === p
                          ? "bg-primary/10 border-primary text-primary-glow"
                          : "border-border hover:bg-surface-alt text-ink-soft"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border text-ink-soft hover:text-ink hover:bg-surface-alt transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-brand text-primary-foreground font-bold shadow-glow hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
                >
                  Schedule & Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: INTERVIEW DETAIL & SCORECARD                                       */}
      {/* ========================================================================= */}
      {activeDetailInterview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-surface border border-border rounded-3xl shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-border">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary-glow bg-primary/10 px-2 py-0.5 rounded-full">
                  {activeDetailInterview.roundName}
                </span>
                <h3 className="text-lg font-extrabold text-ink mt-1">
                  {activeDetailInterview.candidateName}
                </h3>
                <p className="text-xs text-ink-soft">{activeDetailInterview.position} • {activeDetailInterview.department}</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveDetailInterview(null)}
                className="p-1.5 rounded-xl hover:bg-surface-alt text-ink-soft hover:text-ink transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Timing & Meeting Link */}
            <div className="p-3.5 rounded-2xl bg-surface-alt/70 border border-border/80 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-ink-soft font-medium">Scheduled Time:</span>
                <span className="font-bold text-ink">
                  {activeDetailInterview.date} at {activeDetailInterview.time} ({activeDetailInterview.durationMinutes} min)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-soft font-medium">Platform:</span>
                <span className="font-bold text-primary-glow">{activeDetailInterview.platform}</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-border">
                <span className="text-ink-soft font-medium">Meeting Link:</span>
                <a
                  href={activeDetailInterview.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-primary-glow hover:underline"
                >
                  <span>Launch Call</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Quick Action Hub: Video Room & AI Interview Buddy */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                href={`/recruiter/video-interview?id=${activeDetailInterview.id}&candidate=${encodeURIComponent(activeDetailInterview.candidateName)}`}
                className="inline-flex items-center justify-center gap-1.5 p-2 rounded-xl bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary-glow text-xs font-bold transition text-center cursor-pointer"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Launch Video Room</span>
              </Link>
              <Link
                href={`/recruiter/interview-buddy?id=${activeDetailInterview.id}&role=${encodeURIComponent(activeDetailInterview.position)}`}
                className="inline-flex items-center justify-center gap-1.5 p-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-bold transition text-center cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>AI Interview Buddy</span>
              </Link>
            </div>

            {/* Stage Selector */}
            <div className="space-y-1 text-xs">
              <label className="font-bold text-ink">Workflow Stage</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                {(Object.keys(STAGE_CONFIG) as InterviewStage[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleMoveStage(activeDetailInterview.id, st)}
                    className={`px-2 py-1.5 rounded-xl text-[10px] font-bold border transition cursor-pointer text-center truncate ${
                      activeDetailInterview.stage === st
                        ? "bg-primary text-primary-foreground border-primary shadow-xs"
                        : "border-border hover:bg-surface-alt text-ink-soft"
                    }`}
                  >
                    {STAGE_CONFIG[st].label.split("/")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Interviewer Scorecard Section */}
            <div className="space-y-2 pt-2 border-t border-border text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-ink">Scorecard Assessment</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setModalScore(star)}
                      className={`text-sm transition cursor-pointer ${
                        star <= modalScore ? "text-amber-400 scale-110" : "text-border hover:text-amber-300"
                      }`}
                      title={`${star} Star`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="text-[11px] font-bold text-ink ml-1.5">{modalScore} / 5.0</span>
                </div>
              </div>
              <textarea
                value={modalFeedback}
                onChange={(e) => setModalFeedback(e.target.value)}
                placeholder="Add evaluation comments, key strengths, red flags, and hiring recommendation..."
                rows={3}
                className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-ink text-xs outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={() => handleSaveFeedback(activeDetailInterview.id)}
                disabled={isSavingFeedback}
                className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isSavingFeedback ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                <span>Save Feedback & Finalize Score</span>
              </button>
            </div>

            <div className="flex items-center justify-between gap-2 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => handleDeleteInterview(activeDetailInterview.id)}
                disabled={isDeleting}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-rose-500 hover:bg-rose-500/10 text-xs font-bold transition cursor-pointer disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveDetailInterview(null)}
                  className="px-4 py-2 rounded-xl bg-surface-alt hover:bg-surface-alt/80 text-ink text-xs font-bold transition cursor-pointer"
                >
                  Close
                </button>
                <a
                  href={activeDetailInterview.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-brand text-primary-foreground text-xs font-bold shadow-glow hover:scale-105 transition"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Join Call</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function InterviewSchedulePage() {
  return (
    <Suspense
      fallback={
        <div className="p-10 flex items-center justify-center text-ink-soft">
          <Loader2 className="w-6 h-6 animate-spin text-primary-glow mr-2" />
          <span>Loading interview schedule...</span>
        </div>
      }
    >
      <InterviewScheduleContent />
    </Suspense>
  );
}
