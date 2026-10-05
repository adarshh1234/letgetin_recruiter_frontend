"use client";

import React, { useState } from "react";
import {
  Bot,
  Sparkles,
  Zap,
  CheckCircle2,
  Clock,
  Send,
  Sliders,
  Settings,
  ShieldCheck,
  TrendingUp,
  Users,
  CalendarDays,
  FileCheck,
  MessageSquare,
  RefreshCw,
  Power,
  ChevronRight,
  Activity,
  Cpu,
  BrainCircuit,
  Volume2,
} from "lucide-react";

interface SkillModule {
  id: string;
  name: string;
  description: string;
  category: string;
  isEnabled: boolean;
  actionsToday: number;
}

interface ActivityEvent {
  id: string;
  time: string;
  action: string;
  target: string;
  status: "completed" | "in_progress" | "pending";
}

const INITIAL_SKILLS: SkillModule[] = [
  {
    id: "skill-1",
    name: "Autonomous CV Screening & Tagging",
    description: "Evaluates inbound applicant resumes against role requirements in real time upon submission.",
    category: "Sourcing",
    isEnabled: true,
    actionsToday: 38,
  },
  {
    id: "skill-2",
    name: "Calendar Slot Negotiation Agent",
    description: "Detects interviewer free slots across Google Calendar/Outlook and books candidates without email ping-pong.",
    category: "Scheduling",
    isEnabled: true,
    actionsToday: 12,
  },
  {
    id: "skill-3",
    name: "WhatsApp Candidate Concierge",
    description: "Sends automated reminder notifications, collects documents, and answers interview FAQs 24/7.",
    category: "Engagement",
    isEnabled: true,
    actionsToday: 44,
  },
  {
    id: "skill-4",
    name: "Interview Scorecard Synthesizer",
    description: "Transcribes live interview calls and auto-populates evaluation rubrics with evidence citations.",
    category: "Assessment",
    isEnabled: true,
    actionsToday: 6,
  },
  {
    id: "skill-5",
    name: "Passive Talent Outbound Agent",
    description: "Identifies top matching candidates on external talent networks and drafts personalized outreach.",
    category: "Sourcing",
    isEnabled: false,
    actionsToday: 0,
  },
];

const INITIAL_ACTIVITIES: ActivityEvent[] = [
  {
    id: "act-1",
    time: "2 mins ago",
    action: "Scheduled Round 2 Interview",
    target: "Sophia Chen • Senior Frontend Engineer",
    status: "completed",
  },
  {
    id: "act-2",
    time: "14 mins ago",
    action: "Dispatched WhatsApp Slot Selection Link",
    target: "Marcus Vance • Staff Product Designer",
    status: "completed",
  },
  {
    id: "act-3",
    time: "42 mins ago",
    action: "Screened 18 Inbound Applications",
    target: "Job: Full Stack Engineer (Remote)",
    status: "completed",
  },
  {
    id: "act-4",
    time: "1 hour ago",
    action: "Synthesized Scorecard Draft",
    target: "Ananya Patel • Data Science Lead",
    status: "completed",
  },
  {
    id: "act-5",
    time: "2 hours ago",
    action: "Sent Polite Personalized Rejection with Tips",
    target: "4 Underqualified Applicants",
    status: "completed",
  },
];

export default function MyTwinEmployeePage() {
  const [twinName, setTwinName] = useState("Avery AI - Digital Recruiter Clone");
  const [autonomyMode, setAutonomyMode] = useState<"autonomous" | "copilot" | "paused">("autonomous");
  const [toneOfVoice, setToneOfVoice] = useState("Warm & Professional");
  const [skills, setSkills] = useState<SkillModule[]>(INITIAL_SKILLS);
  const [activities, setActivities] = useState<ActivityEvent[]>(INITIAL_ACTIVITIES);

  // Playground Chat State
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ sender: "user" | "twin"; text: string; time: string }[]>([
    {
      sender: "twin",
      text: "Hello! I am Avery, your Digital Twin Employee. Today I have screened 38 resumes and booked 12 interviews. How can I assist you with your hiring pipeline right now?",
      time: "10:15 AM",
    },
  ]);

  const toggleSkill = (id: string) => {
    setSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isEnabled: !s.isEnabled } : s))
    );
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    const newMsgTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    setChatMessages((prev) => [
      ...prev,
      { sender: "user", text: userMsg, time: newMsgTime },
    ]);
    setChatInput("");

    // Simulated Twin Response
    setTimeout(() => {
      let reply = "Understood! I am analyzing your request and synchronizing it with the recruiter pipeline.";
      if (userMsg.toLowerCase().includes("schedule") || userMsg.toLowerCase().includes("interview")) {
        reply = "I've checked the candidate calendar. There are 3 recommended 45-minute slots tomorrow afternoon. Should I auto-dispatch the invites?";
      } else if (userMsg.toLowerCase().includes("screen") || userMsg.toLowerCase().includes("resume")) {
        reply = "I reviewed the last batch of applicants: 4 candidates have strong matching signals (>85% suitability) for your engineering roles. I have flagged them for your review!";
      }

      setChatMessages((prev) => [
        ...prev,
        { sender: "twin", text: reply, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
      ]);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8 lg:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">
              My Twin Employee
            </h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary-glow bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
              <Bot className="w-3.5 h-3.5 text-primary-glow" />
              Digital Workforce v2.4
            </span>
          </div>
          <p className="text-xs sm:text-sm text-ink-soft mt-1">
            Configure your autonomous digital clone to execute candidate screening, interview scheduling, and pipeline follow-ups while you sleep.
          </p>
        </div>

        {/* Status Mode Badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl border border-border bg-surface shadow-xs">
            <span
              className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                autonomyMode === "autonomous"
                  ? "bg-emerald-500"
                  : autonomyMode === "copilot"
                  ? "bg-amber-500"
                  : "bg-rose-500"
              }`}
            />
            <span className="text-xs font-bold text-ink capitalize">
              {autonomyMode === "autonomous" ? "Autonomous Auto-Pilot" : autonomyMode}
            </span>
          </div>
        </div>
      </div>

      {/* Main Twin Profile Card */}
      <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          {/* Avatar and Identity */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl bg-gradient-brand text-primary-foreground flex items-center justify-center shadow-glow">
                <Bot className="w-10 h-10" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 ring-4 ring-surface flex items-center justify-center text-[10px] text-white font-bold">
                ✓
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-ink">{twinName}</h2>
              </div>
              <p className="text-xs text-ink-soft mt-0.5">
                Cloned from your recruiter decision profile • Latency &lt; 200ms
              </p>

              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="text-[10px] font-bold text-ink-soft bg-surface-alt px-2.5 py-1 rounded-lg border border-border">
                  Tone: <strong className="text-ink">{toneOfVoice}</strong>
                </span>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                  99.4% Decision Alignment
                </span>
              </div>
            </div>
          </div>

          {/* Autonomy Selector Controls */}
          <div className="flex items-center gap-2 bg-surface-alt p-1.5 rounded-2xl border border-border self-start lg:self-center">
            <button
              type="button"
              onClick={() => setAutonomyMode("autonomous")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                autonomyMode === "autonomous"
                  ? "bg-surface text-ink shadow-xs border border-border"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              Autonomous
            </button>
            <button
              type="button"
              onClick={() => setAutonomyMode("copilot")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                autonomyMode === "copilot"
                  ? "bg-surface text-ink shadow-xs border border-border"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              Co-Pilot
            </button>
            <button
              type="button"
              onClick={() => setAutonomyMode("paused")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                autonomyMode === "paused"
                  ? "bg-surface text-destructive shadow-xs border border-border"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              Pause
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-border">
          <div>
            <div className="text-[11px] font-bold text-ink-soft uppercase tracking-wider">Hours Saved This Month</div>
            <div className="text-2xl font-black text-ink mt-0.5">52.4 hrs</div>
          </div>
          <div>
            <div className="text-[11px] font-bold text-ink-soft uppercase tracking-wider">Resumes Screened</div>
            <div className="text-2xl font-black text-primary-glow mt-0.5">1,840</div>
          </div>
          <div>
            <div className="text-[11px] font-bold text-ink-soft uppercase tracking-wider">Interviews Booked</div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">112</div>
          </div>
          <div>
            <div className="text-[11px] font-bold text-ink-soft uppercase tracking-wider">Response Velocity</div>
            <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-0.5">89.2%</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Skills Configuration & Live Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Configurable Skills (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-ink">Autonomous Skill Capabilities</h3>
            <span className="text-xs text-ink-soft">
              {skills.filter((s) => s.isEnabled).length} of {skills.length} Active
            </span>
          </div>

          <div className="space-y-3">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="p-4 rounded-2xl border border-border bg-surface shadow-xs flex items-start justify-between gap-4 transition hover:border-primary/40"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-ink">{skill.name}</h4>
                    <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary-glow">
                      {skill.category}
                    </span>
                  </div>
                  <p className="text-xs text-ink-soft leading-relaxed">{skill.description}</p>
                  <div className="text-[10px] text-ink-soft font-semibold pt-1">
                    Executed <strong className="text-ink">{skill.actionsToday} times</strong> today
                  </div>
                </div>

                {/* Toggle Switch */}
                <button
                  type="button"
                  onClick={() => toggleSkill(skill.id)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                    skill.isEnabled ? "bg-primary" : "bg-border"
                  }`}
                  aria-label={`Toggle ${skill.name}`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      skill.isEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Live Activity Stream (5 cols) */}
        <div className="lg:col-span-5 bg-surface rounded-2xl border border-border shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary-glow" />
              <h3 className="text-sm font-extrabold text-ink">Live Twin Activity Stream</h3>
            </div>
            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              Real-Time
            </span>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto scrollbar-thin pr-1">
            {activities.map((act) => (
              <div
                key={act.id}
                className="p-3 rounded-xl border border-border bg-surface-alt/40 space-y-1"
              >
                <div className="flex items-center justify-between text-[10px] text-ink-soft">
                  <span className="font-semibold text-primary-glow">{act.time}</span>
                  <span className="text-emerald-500 font-bold uppercase text-[9px]">Completed</span>
                </div>
                <div className="text-xs font-bold text-ink">{act.action}</div>
                <div className="text-[11px] text-ink-soft truncate">{act.target}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Twin Chat Playground */}
      <div className="rounded-3xl border border-border bg-surface p-5 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <MessageSquare className="w-4 h-4 text-primary-glow" />
            <div>
              <h3 className="text-sm font-extrabold text-ink">Talk to Your Twin</h3>
              <p className="text-[11px] text-ink-soft">Test prompts, instruct candidate searches, or audit recent reasoning</p>
            </div>
          </div>
        </div>

        {/* Chat History Box */}
        <div className="h-64 overflow-y-auto space-y-3 p-3 bg-surface-alt/30 rounded-2xl border border-border/80 scrollbar-thin">
          {chatMessages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-md p-3 rounded-2xl text-xs leading-relaxed space-y-1 ${
                  msg.sender === "user"
                    ? "bg-gradient-brand text-primary-foreground font-medium shadow-xs"
                    : "bg-surface border border-border text-ink shadow-xs"
                }`}
              >
                <div>{msg.text}</div>
                <div className={`text-[9px] ${msg.sender === "user" ? "text-primary-foreground/70" : "text-ink-soft"}`}>
                  {msg.time}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input Box */}
        <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-1">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Give an instruction e.g. 'Find the top 3 candidates for Senior Frontend'..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-surface text-xs text-ink placeholder:text-ink-soft outline-none focus:border-primary transition"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-gradient-brand text-primary-foreground font-bold text-xs shadow-glow hover:scale-105 active:scale-95 transition cursor-pointer flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
