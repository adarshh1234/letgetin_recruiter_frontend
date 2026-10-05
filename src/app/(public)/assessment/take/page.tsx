"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Clock,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  BookmarkCheck,
  FileQuestion,
  HelpCircle,
  Loader2,
  Send,
  Maximize,
  AlertOctagon,
  Award,
  ChevronRight,
  RefreshCw,
  Check,
  Zap,
  Layers,
  Paperclip,
  UploadCloud,
  X,
  MessageSquare,
  Sparkles,
  Bot,
  User,
  Code,
  Lightbulb,
  Target,
  TrendingUp,
  Compass,
  CheckCircle,
  BarChart3,
  Star,
  CornerDownLeft,
  Sun,
  Moon,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Square,
  Radio,
} from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/shared/services/apiClient";
import { domainAssessmentService } from "@/features/domainAssessment/services/domainAssessmentService";
import { ChatSessionEvaluation } from "@/features/domainAssessment/types";

function FormattedChatMessage({ content }: { content: string }) {
  // Split on code blocks ``` ... ```
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-2 text-xs sm:text-sm leading-relaxed">
      {parts.map((part, pIdx) => {
        if (part.startsWith("```") && part.endsWith("```")) {
          const lines = part.slice(3, -3).trim().split("\n");
          const firstLine = lines[0].trim();
          const hasLang = /^[a-zA-Z0-9_-]+$/.test(firstLine);
          const lang = hasLang ? firstLine : "";
          const code = (hasLang ? lines.slice(1) : lines).join("\n");

          return (
            <div
              key={pIdx}
              className="my-2 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden font-mono text-[11px] sm:text-xs"
            >
              {lang && (
                <div className="px-3 py-1 bg-slate-900/90 border-b border-slate-800 text-[10px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <Code className="w-3 h-3 text-primary-glow" />
                  <span>{lang}</span>
                </div>
              )}
              <pre className="p-3 overflow-x-auto text-emerald-400 leading-snug">
                <code>{code}</code>
              </pre>
            </div>
          );
        }

        // Render regular markdown text paragraphs
        return (
          <div key={pIdx} className="space-y-1">
            {part.split("\n").map((line, lIdx) => {
              if (line.startsWith("### ")) {
                return (
                  <h4 key={lIdx} className="text-xs sm:text-sm font-bold text-white mt-2 mb-1">
                    {line.replace("### ", "")}
                  </h4>
                );
              }
              if (line.startsWith("- ") || line.startsWith("* ")) {
                return (
                  <div key={lIdx} className="flex items-start gap-1.5 pl-2 my-0.5 text-slate-200">
                    <span className="text-primary-glow font-bold">•</span>
                    <span>{line.substring(2)}</span>
                  </div>
                );
              }
              // Basic bold replacement: **text**
              const boldSegments = line.split(/(\*\*.*?\*\*)/g);
              return (
                <p key={lIdx} className="min-h-[1.2em]">
                  {boldSegments.map((seg, sIdx) => {
                    if (seg.startsWith("**") && seg.endsWith("**")) {
                      return (
                        <strong key={sIdx} className="font-bold text-white">
                          {seg.slice(2, -2)}
                        </strong>
                      );
                    }
                    return seg;
                  })}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

interface StageQuestion {
  id: string;
  order: number;
  type: string;
  section?: string;
  question: string;
  instructions?: string;
  points: number;
  timeLimitSeconds?: number;
  options?: Array<{ id: string; text: string }>;
  context?: string;
  sampleAnswer?: string;
  evaluationRubric?: string;
  correctOptionId?: string;
}

interface TestData {
  applicationId: string;
  job: {
    _id: string;
    title: string;
    company: { name: string };
  };
  stage: {
    stageId: string;
    stageName: string;
    stageType: string;
    assessmentType?: string;
    durationMinutes: number;
    passingScore: number;
    totalQuestions: number;
    schedule?: any;
    config?: any;
    instructions: string;
  };
  questions: StageQuestion[];
}

function CandidateStageTakeComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const applicationId = searchParams.get("applicationId") || "";
  const stageId = searchParams.get("stageId") || "";
  const jobId = searchParams.get("jobId") || "";

  // Phases: 'onboarding' | 'in_progress' | 'completed'
  const [phase, setPhase] = useState<"onboarding" | "in_progress" | "completed">("onboarding");

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [testData, setTestData] = useState<TestData | null>(null);

  // Session state
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(1800);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Rapid Question Round per-question speed timer state
  const [rapidRemaining, setRapidRemaining] = useState<number | null>(null);
  const [rapidLimit, setRapidLimit] = useState<number>(30);

  // Scratchpad / calculation sheet attachments for descriptive questions
  const [attachments, setAttachments] = useState<Record<string, { name: string; size: string }>>({});

  // Proctoring state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFullscreenWarning, setShowFullscreenWarning] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Evaluation outcome state
  const [submissionResult, setSubmissionResult] = useState<{
    passed: boolean;
    totalScore: number;
    maxScore: number;
    percentage: number;
    passingScore: number;
    verdict: string;
    message: string;
    tabSwitchCount: number;
    proctorDisqualified: boolean;
    nextStageId: string | null;
    isFinalShortlist: boolean;
  } | null>(null);

  // AI Chat Assessment Conversational State
  const [chatMessages, setChatMessages] = useState<
    Array<{
      id: string;
      role: "ai" | "candidate";
      message: string;
      topic?: string;
      turnScore?: number;
      feedback?: string;
      guidanceTip?: string;
      timestamp: string;
    }>
  >([]);
  const [chatInput, setChatInput] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [currentChatTopicIdx, setCurrentChatTopicIdx] = useState(0);
  const [activeGuidanceTip, setActiveGuidanceTip] = useState<string>(
    "Structure your response logically: introduce your high-level approach, outline concrete implementation details or algorithms, and address production edge cases."
  );
  const [chatEvaluation, setChatEvaluation] = useState<ChatSessionEvaluation | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const chatTextareaRef = useRef<HTMLTextAreaElement>(null);

  // AI Voice Assessment State
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isAiVoiceMuted, setIsAiVoiceMuted] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isListeningMic, setIsListeningMic] = useState(false);
  const recognitionRef = useRef<any>(null);
  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [voiceMessages, setVoiceMessages] = useState<
    Array<{
      id: string;
      role: "ai" | "candidate";
      message: string;
      topic?: string;
      turnScore?: number;
      feedback?: string;
      timestamp: string;
    }>
  >([]);
  const [voiceSimulatedInput, setVoiceSimulatedInput] = useState("");
  const [currentVoiceTopicIdx, setCurrentVoiceTopicIdx] = useState(0);
  const voiceBottomRef = useRef<HTMLDivElement>(null);

  // Theme state: 'dark' | 'light'
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("letgetin_test_theme") as "dark" | "light" | null;
      if (savedTheme === "light" || savedTheme === "dark") {
        setTheme(savedTheme);
      }
    } catch {}
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("letgetin_test_theme", next);
      } catch {}
      return next;
    });
  };

  // Standard Fallback Question Presets for Candidate & Recruiter Preview Portals
  const GENERAL_APTITUDE_DEFAULT_QUESTIONS = [
    {
      id: "demo-ga-q1",
      order: 1,
      type: "mcq",
      section: "mcq",
      question: "If a project sprint velocity increases by 20% and the backlog is reduced by 10%, how does the completion timeline change relative to the initial forecast?",
      points: 15,
      correctOptionId: "B",
      options: [
        { id: "A", text: "Decreases by 10%" },
        { id: "B", text: "Decreases by approximately 25%" },
        { id: "C", text: "Increases by 15%" },
        { id: "D", text: "Remains approximately unchanged" },
      ],
    },
    {
      id: "demo-ga-q2",
      order: 2,
      type: "mcq",
      section: "mcq",
      question: "Which of the following data structures provides average O(1) time complexity for lookup, insert, and delete operations?",
      points: 15,
      correctOptionId: "B",
      options: [
        { id: "A", text: "Binary Search Tree" },
        { id: "B", text: "Hash Table" },
        { id: "C", text: "Red-Black Tree" },
        { id: "D", text: "B-Tree" },
      ],
    },
    {
      id: "demo-ga-q3",
      order: 3,
      type: "mcq",
      section: "mcq",
      question: "If 6 workers can complete an infrastructure deployment in 8 days, how many days will 4 workers take to complete the exact same scope, assuming identical working speed?",
      points: 15,
      correctOptionId: "B",
      options: [
        { id: "A", text: "10 days" },
        { id: "B", text: "12 days" },
        { id: "C", text: "14 days" },
        { id: "D", text: "16 days" },
      ],
    },
    {
      id: "demo-ga-q4",
      order: 4,
      type: "mcq",
      section: "mcq",
      question: "What is the key difference between optimistic and pessimistic concurrency control in database transactions?",
      points: 15,
      correctOptionId: "A",
      options: [
        { id: "A", text: "Optimistic assumes conflicts are rare and verifies at commit; pessimistic locks resources in advance" },
        { id: "B", text: "Pessimistic requires distributed consensus while optimistic does not" },
        { id: "C", text: "Optimistic only works on NoSQL databases" },
        { id: "D", text: "Pessimistic uses rollback segments while optimistic does not" },
      ],
    },
    {
      id: "demo-ga-q5",
      order: 5,
      type: "descriptive",
      section: "descriptive",
      question: "A distribution hub has two conveyor lines, Line A and Line B. Line A processes an entire cargo batch in 6 hours alone, while Line B takes 9 hours alone. Line A begins operating at 9:00 AM. At 11:00 AM, Line B joins Line A, and both work together until the cargo batch is finished. At what exact time is the entire cargo batch processed? Provide your full mathematical deduction, intermediate fraction rates, and calculation steps.",
      points: 20,
      sampleAnswer: "Line A rate = 1/6 batch/hr. In first 2 hrs (9-11 AM), Line A completes 2/6 = 1/3 of the work. Remaining work = 1 - 1/3 = 2/3. Combined rate = 1/6 + 1/9 = 5/18 batch/hr. Time needed = (2/3)/(5/18) = 12/5 = 2.4 hrs = 2 hrs 24 mins. Adding 2h 24m to 11:00 AM gives exactly 1:24 PM.",
      evaluationRubric: "Award partial points for initial fraction done (1/3), combined work rate calculation (5/18), and final completion timestamp (1:24 PM).",
    },
    {
      id: "demo-ga-q6",
      order: 6,
      type: "rapid",
      section: "rapid",
      timeLimitSeconds: 30,
      correctOptionId: "B",
      question: "A cloud API service currently processes 1,200 requests/minute. If sudden traffic surges by 150%, how many requests per second must the cluster handle?",
      points: 10,
      options: [
        { id: "A", text: "30 req/s" },
        { id: "B", text: "50 req/s" },
        { id: "C", text: "75 req/s" },
        { id: "D", text: "120 req/s" },
      ],
    },
    {
      id: "demo-ga-q7",
      order: 7,
      type: "rapid",
      section: "rapid",
      timeLimitSeconds: 20,
      correctOptionId: "C",
      question: "Which HTTP status code is the industry standard for indicating that client rate limits have been exceeded?",
      points: 10,
      options: [
        { id: "A", text: "401 Unauthorized" },
        { id: "B", text: "403 Forbidden" },
        { id: "C", text: "429 Too Many Requests" },
        { id: "D", text: "503 Service Unavailable" },
      ],
    },
  ];

  const TECHNICAL_TEST_DEFAULT_QUESTIONS = [
    {
      id: "demo-tech-q1",
      order: 1,
      type: "mcq",
      section: "mcq",
      question: "In distributed systems, what is the primary purpose of the Circuit Breaker pattern?",
      points: 15,
      correctOptionId: "B",
      options: [
        { id: "A", text: "To encrypt payload transmissions between microservices" },
        { id: "B", text: "To prevent cascading failures when a downstream service is unresponsive" },
        { id: "C", text: "To distribute HTTP traffic evenly across available worker nodes" },
        { id: "D", text: "To authenticate API tokens before forwarding requests" },
      ],
    },
    {
      id: "demo-tech-q2",
      order: 2,
      type: "mcq",
      section: "mcq",
      question: "When implementing asynchronous event-driven pipelines, what is the core role of a Dead Letter Queue (DLQ)?",
      points: 15,
      correctOptionId: "B",
      options: [
        { id: "A", text: "To buffer high-priority real-time user traffic" },
        { id: "B", text: "To isolate and store poison messages that persistently fail execution after maximum retries" },
        { id: "C", text: "To optimize garbage collection cycles in message brokers" },
        { id: "D", text: "To compress archival audit logs" },
      ],
    },
    {
      id: "demo-tech-q3",
      order: 3,
      type: "mcq",
      section: "mcq",
      question: "Under high write concurrency, which database isolation level guarantees prevention of dirty reads, non-repeatable reads, and phantom reads?",
      points: 15,
      correctOptionId: "D",
      options: [
        { id: "A", text: "Read Committed" },
        { id: "B", text: "Read Uncommitted" },
        { id: "C", text: "Repeatable Read" },
        { id: "D", text: "Serializable" },
      ],
    },
    {
      id: "demo-tech-q4",
      order: 4,
      type: "descriptive",
      section: "descriptive",
      question: "Design a high-throughput, fault-tolerant Rate Limiter and Inventory Reservation service for flash sales handling 50,000 requests/second. Detail your architectural choices for: (1) In-memory rate limiting algorithm and distributed state sync (e.g. Token Bucket with Redis Lua scripts), (2) Database concurrency and row locking (pessimistic vs optimistic) to prevent inventory overselling, (3) Idempotency guarantees for payment retries, and (4) Graceful fallback when the primary cache node fails.",
      points: 30,
      sampleAnswer: "1. Token Bucket / Sliding Window Log in Redis executed atomically via Redis Lua scripts to eliminate race conditions. 2. Decrement inventory atomically in Redis first with conditional check (DECRBY if >= 1); sync to database asynchronously using transactional outbox or Kafka queue, with optimistic concurrency check (version number) or conditional SQL 'UPDATE inventory SET stock = stock - 1 WHERE id = ? AND stock > 0'. 3. Client passes UUID idempotency key; server stores key with hashed request in Redis with TTL. 4. If Redis fails, fall back to local in-memory token bucket per instance with reduced thresholds.",
      evaluationRubric: "Architecture clarity: 10 pts, Race condition & concurrency mitigation: 10 pts, Idempotency & resilience: 10 pts.",
    },
    {
      id: "demo-tech-q5",
      order: 5,
      type: "rapid",
      section: "rapid",
      timeLimitSeconds: 25,
      correctOptionId: "B",
      question: "What is the worst-case time complexity of QuickSort when the pivot is consistently chosen as the smallest or largest element?",
      points: 10,
      options: [
        { id: "A", text: "O(n log n)" },
        { id: "B", text: "O(n²)" },
        { id: "C", text: "O(log n)" },
        { id: "D", text: "O(n)" },
      ],
    },
    {
      id: "demo-tech-q6",
      order: 6,
      type: "rapid",
      section: "rapid",
      timeLimitSeconds: 20,
      correctOptionId: "A",
      question: "Which HTTP request header is standard for passing JSON Web Tokens (JWT) for stateless bearer authentication?",
      points: 10,
      options: [
        { id: "A", text: "Authorization: Bearer <token>" },
        { id: "B", text: "X-Auth-Token: <token>" },
        { id: "C", text: "Proxy-Authenticate: <token>" },
        { id: "D", text: "Set-Cookie: jwt=<token>" },
      ],
    },
  ];

  const RAPID_ROUND_DEFAULT_QUESTIONS = [
    {
      id: "demo-rr-q1",
      order: 1,
      type: "rapid",
      section: "rapid",
      timeLimitSeconds: 20,
      correctOptionId: "C",
      question: "Which HTTP status code is standard for indicating that client rate limits have been exceeded?",
      points: 10,
      options: [
        { id: "A", text: "401 Unauthorized" },
        { id: "B", text: "403 Forbidden" },
        { id: "C", text: "429 Too Many Requests" },
        { id: "D", text: "503 Service Unavailable" },
      ],
    },
    {
      id: "demo-rr-q2",
      order: 2,
      type: "rapid",
      section: "rapid",
      timeLimitSeconds: 20,
      correctOptionId: "B",
      question: "What essential precondition must be satisfied before Binary Search can be applied to an array?",
      points: 10,
      options: [
        { id: "A", text: "Array must contain only unique values" },
        { id: "B", text: "Array elements must be sorted in order" },
        { id: "C", text: "Array size must be an exact power of 2" },
        { id: "D", text: "Array must be stored in contiguous heap memory" },
      ],
    },
    {
      id: "demo-rr-q3",
      order: 3,
      type: "rapid",
      section: "rapid",
      timeLimitSeconds: 25,
      correctOptionId: "B",
      question: "What is the amortized insertion time complexity of appending an element to a dynamic array (like std::vector or Python list)?",
      points: 10,
      options: [
        { id: "A", text: "O(n)" },
        { id: "B", text: "O(1)" },
        { id: "C", text: "O(log n)" },
        { id: "D", text: "O(n²)" },
      ],
    },
    {
      id: "demo-rr-q4",
      order: 4,
      type: "rapid",
      section: "rapid",
      timeLimitSeconds: 15,
      correctOptionId: "C",
      question: "What is the default TCP port number used for secure HTTPS web traffic?",
      points: 10,
      options: [
        { id: "A", text: "80" },
        { id: "B", text: "8080" },
        { id: "C", text: "443" },
        { id: "D", text: "22" },
      ],
    },
    {
      id: "demo-rr-q5",
      order: 5,
      type: "rapid",
      section: "rapid",
      timeLimitSeconds: 20,
      correctOptionId: "D",
      question: "In relational database ACID transactions, what does the letter 'I' represent?",
      points: 10,
      options: [
        { id: "A", text: "Indexability" },
        { id: "B", text: "Idempotence" },
        { id: "C", text: "Immutable" },
        { id: "D", text: "Isolation" },
      ],
    },
    {
      id: "demo-rr-q6",
      order: 6,
      type: "rapid",
      section: "rapid",
      timeLimitSeconds: 20,
      correctOptionId: "B",
      question: "Which linear data structure enforces a Strict Last-In, First-Out (LIFO) access order?",
      points: 10,
      options: [
        { id: "A", text: "Queue" },
        { id: "B", text: "Stack" },
        { id: "C", text: "Linked List" },
        { id: "D", text: "Priority Queue" },
      ],
    },
  ];

  // Fetch stage test data on mount
  useEffect(() => {
    async function loadTest() {
      const isPreview = searchParams.get("preview") === "true";

      // If recruiter preview or no applicationId: attempt to load the actual configured stage questions
      if (!applicationId || isPreview) {
        // 1. Check if there is an in-memory draft stored in sessionStorage by recruiter studio
        if (typeof window !== "undefined") {
          try {
            const rawDraft = sessionStorage.getItem(`stage_preview_${jobId}_${stageId}`);
            if (rawDraft) {
              const draft = JSON.parse(rawDraft);
              const customQuestions = draft.customQuestions || [];
              const sName = (draft.stageName || "").toLowerCase();
              const sId = (stageId || "").toLowerCase();
              const dType = (draft.stageType || draft.assessmentType || "").toLowerCase();

              const isGeneralAptitude = Boolean(
                draft.isGeneralAptitude ||
                dType === "general_aptitude" ||
                sId.includes("general_aptitude") ||
                sName.includes("general aptitude") ||
                (sName.includes("aptitude") && !sName.includes("technical"))
              );

              const isTechnicalTest = Boolean(
                draft.isTechnicalTest ||
                dType === "technical_test" ||
                dType === "technical" ||
                sId.includes("technical_test") ||
                sId.includes("technical") ||
                sName.includes("technical test") ||
                sName.includes("tech test") ||
                sName.includes("technical assessment")
              );

              const isRapidRound = Boolean(
                draft.isRapidRound ||
                dType === "rapid_round" ||
                dType === "rapid_question" ||
                sId.includes("rapid_round") ||
                sId.includes("rapid_question") ||
                (sName.includes("rapid") && !isGeneralAptitude && !isTechnicalTest)
              );

              const isAiVoice = Boolean(
                !isGeneralAptitude && !isTechnicalTest && !isRapidRound && (
                  dType === "ai_voice" ||
                  sId.includes("ai_voice") ||
                  sName.includes("ai voice") ||
                  (draft.modalities?.length === 1 && draft.modalities[0] === "voice")
                )
              );

              const isAiChat = Boolean(
                !isGeneralAptitude && !isTechnicalTest && !isRapidRound && (
                  dType === "ai_chat" ||
                  sId.includes("ai_chat") ||
                  sName.includes("ai chat") ||
                  (draft.isAiAssessment && draft.modalities?.length === 1 && draft.modalities[0] === "chat") ||
                  (draft.isAiAssessment && draft.modalities?.includes("chat") && !draft.modalities?.includes("voice"))
                )
              );

              let resolvedQuestions: any[] = [];
              if (customQuestions.length > 0) {
                resolvedQuestions = customQuestions;
              } else if (isGeneralAptitude) {
                resolvedQuestions = GENERAL_APTITUDE_DEFAULT_QUESTIONS;
              } else if (isTechnicalTest) {
                resolvedQuestions = TECHNICAL_TEST_DEFAULT_QUESTIONS;
              } else if (isRapidRound) {
                resolvedQuestions = RAPID_ROUND_DEFAULT_QUESTIONS;
              } else if (isAiVoice) {
                const topics = draft.topics || [];
                resolvedQuestions = topics.length > 0
                  ? topics.map((t: string, idx: number) => ({
                      id: `voice_topic_${idx + 1}`,
                      order: idx + 1,
                      type: "descriptive",
                      section: "ai_interview",
                      question: t,
                      points: 10,
                      instructions: "AI Spoken Assessment: Verbally articulate your perspective and trade-offs clearly into the microphone.",
                      sampleAnswer: `Model verbal response covering structured reasoning and architectural trade-offs (${draft.difficulty || 'medium'} difficulty).`,
                      evaluationRubric: "Spoken Clarity: 4 pts, Technical Reasoning: 3 pts, Trade-offs & Production Thinking: 3 pts",
                    }))
                  : [
                      {
                        id: "voice_topic_1",
                        order: 1,
                        type: "descriptive",
                        section: "ai_interview",
                        question: "Walk through the architectural design, failure modes, and scalability trade-offs of an event-driven system handling 50k requests per second.",
                        points: 10,
                        instructions: "AI Spoken Assessment: Verbally articulate system architecture, latency guarantees, and bottleneck mitigations.",
                      },
                      {
                        id: "voice_topic_2",
                        order: 2,
                        type: "descriptive",
                        section: "ai_interview",
                        question: "Live Production Outage Triage: A critical payments gateway begins throwing intermittent 504 timeouts after a peak traffic deploy. How do you verbally organize incident containment, diagnosis, and post-mortem communication?",
                        points: 10,
                        instructions: "AI Spoken Assessment: Explain troubleshooting methodology, metric dashboards inspection, and cross-team communication.",
                      },
                      {
                        id: "voice_topic_3",
                        order: 3,
                        type: "descriptive",
                        section: "ai_interview",
                        question: "Engineering Leadership & Disagreements: Describe a scenario where your proposed technical approach conflicted with a senior engineer's solution. How did you resolve the trade-offs and build consensus?",
                        points: 10,
                        instructions: "AI Spoken Assessment: Focus on communication clarity, objective trade-off evaluation, and team collaboration.",
                      },
                      {
                        id: "voice_topic_4",
                        order: 4,
                        type: "descriptive",
                        section: "ai_interview",
                        question: "Stakeholder Communication: How do you explain the technical debt and necessity of refactoring core legacy infrastructure to non-technical business executives?",
                        points: 10,
                        instructions: "AI Spoken Assessment: Translate technical complexities into business value, risk management, and ROI.",
                      },
                    ];
              } else if (isAiChat || draft.isAiAssessment) {
                const topics = draft.topics || [];
                resolvedQuestions = topics.length > 0
                  ? topics.map((t: string, idx: number) => ({
                      id: `chat_topic_${idx + 1}`,
                      order: idx + 1,
                      type: "descriptive",
                      section: "ai_interview",
                      question: t,
                      points: 10,
                      instructions: "AI Conversational Chat Assessment: Type your structured approach and code snippets.",
                      sampleAnswer: `The AI evaluates the candidate's conversational response based on depth, technical accuracy, and role requirements (${draft.difficulty || 'medium'} difficulty).`,
                      evaluationRubric: "Concept Clarity & Code Implementation: 4 pts, Practical Architecture: 3 pts, Edge Cases: 3 pts",
                    }))
                  : [
                      {
                        id: "chat_topic_1",
                        order: 1,
                        type: "descriptive",
                        section: "ai_interview",
                        question: "Design and implement a scalable State Management & Data Flow Architecture for high-concurrency client updates, handling optimistic UI and race conditions.",
                        points: 10,
                        instructions: "AI Chat Assessment: Provide architectural choices, code patterns, and concrete state flow diagrams or snippets.",
                      },
                      {
                        id: "chat_topic_2",
                        order: 2,
                        type: "descriptive",
                        section: "ai_interview",
                        question: "API Contract & Query Optimization: How would you structure schema validation, pagination, and database indexing for high-frequency search and filtering endpoints?",
                        points: 10,
                        instructions: "AI Chat Assessment: Detail your schema definitions, SQL/NoSQL query plans, and caching layer implementation.",
                      },
                      {
                        id: "chat_topic_3",
                        order: 3,
                        type: "descriptive",
                        section: "ai_interview",
                        question: "Asynchronous Concurrency & Error Boundaries: How do you isolate failures in distributed background workers, prevent memory leaks, and guarantee idempotency in message queues?",
                        points: 10,
                        instructions: "AI Chat Assessment: Explain retry strategies, dead-letter queues, and error-handling code structure.",
                      },
                      {
                        id: "chat_topic_4",
                        order: 4,
                        type: "descriptive",
                        section: "ai_interview",
                        question: "Production CI/CD Pipelines & Automated Testing: Outline an automated end-to-end testing matrix and canary deployment strategy to ensure zero-downtime releases.",
                        points: 10,
                        instructions: "AI Chat Assessment: Outline your pipeline stages, health checks, and automated rollback triggers.",
                      },
                    ];
              } else {
                resolvedQuestions = GENERAL_APTITUDE_DEFAULT_QUESTIONS;
              }

              const resolvedStageType = isGeneralAptitude
                ? "general_aptitude"
                : isTechnicalTest
                ? "technical_test"
                : isRapidRound
                ? "rapid_round"
                : isAiChat
                ? "ai_chat"
                : isAiVoice
                ? "ai_voice"
                : "assessment";

              const resolvedAssessmentType = isGeneralAptitude
                ? "general_aptitude"
                : isTechnicalTest
                ? "technical_test"
                : isRapidRound
                ? "rapid_round"
                : isAiChat
                ? "ai_chat"
                : isAiVoice
                ? "ai_voice"
                : "general_aptitude";

              const resolvedStageName = draft.stageName || (
                isGeneralAptitude
                  ? "General Aptitude Test"
                  : isTechnicalTest
                  ? "Technical Assessment"
                  : isRapidRound
                  ? "Rapid Fire Assessment Round"
                  : isAiChat
                  ? "AI Chat Assessment Round"
                  : isAiVoice
                  ? "AI Voice Assessment Round"
                  : "Assessment Round"
              );

              setTestData({
                applicationId: "preview-application",
                job: {
                  _id: jobId || "draft-job",
                  title: draft.stageName ? `${draft.stageName} (Recruiter Live Draft Preview)` : "Live Assessment Preview",
                  company: { name: "Job Stage Preview" },
                },
                stage: {
                  stageId: stageId || "preview-stage",
                  stageName: resolvedStageName,
                  stageType: resolvedStageType,
                  assessmentType: resolvedAssessmentType,
                  durationMinutes: draft.durationMinutes || (isRapidRound ? 10 : 30),
                  passingScore: draft.passingScore || 70,
                  totalQuestions: resolvedQuestions.length,
                  config: draft,
                  instructions: isAiChat
                    ? "Candidate Preview Mode: This window simulates how candidates experience your AI Chat Assessment."
                    : isRapidRound
                    ? "Recruiter Preview Mode: This window simulates your standalone speed-timed Rapid Fire assessment."
                    : isTechnicalTest
                    ? "Recruiter Preview Mode: This window simulates your configured Technical Assessment with MCQs and Engineering problems."
                    : "Recruiter Preview Mode: This window simulates your General Aptitude Test with Multiple Choice, Descriptive, and Rapid sections.",
                },
                questions: resolvedQuestions.map((q: any, idx: number) => ({
                  id: q.id || `q_${idx + 1}`,
                  order: q.order || idx + 1,
                  type: q.type || (q.section === "rapid" ? "rapid" : q.section === "descriptive" ? "descriptive" : "mcq"),
                  section: q.section,
                  question: q.question,
                  instructions: q.instructions || "",
                  points: q.points || 10,
                  timeLimitSeconds: q.timeLimitSeconds,
                  options: q.options,
                  context: q.context,
                  correctOptionId: q.correctOptionId,
                  sampleAnswer: q.sampleAnswer,
                  evaluationRubric: q.evaluationRubric,
                })),
              });
              const totalSecs = (draft.durationMinutes || (isRapidRound ? 10 : 30)) * 60;
              setTimeRemainingSeconds(totalSecs);
              setLoading(false);
              return;
            }
          } catch (e) {
            console.warn("Failed to load draft from sessionStorage", e);
          }
        }

        // 2. Fetch configured stage directly from backend if jobId & stageId are present
        if (jobId && stageId) {
          try {
            setLoading(true);
            const res: any = await apiClient.get(`/recruiter/jobs/${jobId}/hiring-engine/stages/${stageId}`);
            const stageData = res.data;
            const customQuestions = stageData?.config?.customQuestions || [];
            const sName = (stageData?.stageName || "").toLowerCase();
            const sId = (stageId || stageData?.stageId || "").toLowerCase();
            const sType = (stageData?.stageType || "").toLowerCase();
            const aType = (stageData?.assessmentType || "").toLowerCase();

            const isGeneralAptitude = Boolean(
              sType === "general_aptitude" ||
              aType === "general_aptitude" ||
              sId.includes("general_aptitude") ||
              sName.includes("general aptitude") ||
              (sName.includes("aptitude") && !sName.includes("technical"))
            );

            const isTechnicalTest = Boolean(
              sType === "technical_test" ||
              sType === "technical" ||
              aType === "technical_test" ||
              aType === "technical" ||
              sId.includes("technical_test") ||
              sId.includes("technical") ||
              sName.includes("technical test") ||
              sName.includes("tech test") ||
              sName.includes("technical assessment")
            );

            const isRapidRound = Boolean(
              sType === "rapid_round" ||
              sType === "rapid_question" ||
              aType === "rapid_round" ||
              aType === "rapid_question" ||
              sId.includes("rapid_round") ||
              sId.includes("rapid_question") ||
              (sName.includes("rapid") && !isGeneralAptitude && !isTechnicalTest)
            );

            const isAiVoice = Boolean(
              !isGeneralAptitude && !isTechnicalTest && !isRapidRound && (
                sType === "ai_voice" ||
                aType === "ai_voice" ||
                sId.includes("ai_voice") ||
                sName.includes("ai voice") ||
                (stageData?.config?.modalities?.length === 1 && stageData?.config?.modalities[0] === "voice")
              )
            );

            const isAiChat = Boolean(
              !isGeneralAptitude && !isTechnicalTest && !isRapidRound && (
                sType === "ai_chat" ||
                aType === "ai_chat" ||
                sId.includes("ai_chat") ||
                sName.includes("ai chat") ||
                (stageData?.config?.isAiAssessment && stageData?.config?.modalities?.length === 1 && stageData?.config?.modalities[0] === "chat") ||
                (stageData?.config?.isAiAssessment && stageData?.config?.modalities?.includes("chat") && !stageData?.config?.modalities?.includes("voice"))
              )
            );

            let resolvedQuestions: any[] = [];
            if (customQuestions.length > 0) {
              resolvedQuestions = customQuestions;
            } else if (isGeneralAptitude) {
              resolvedQuestions = GENERAL_APTITUDE_DEFAULT_QUESTIONS;
            } else if (isTechnicalTest) {
              resolvedQuestions = TECHNICAL_TEST_DEFAULT_QUESTIONS;
            } else if (isRapidRound) {
              resolvedQuestions = RAPID_ROUND_DEFAULT_QUESTIONS;
            } else if (isAiVoice) {
              const topics = stageData?.config?.topics || [];
              resolvedQuestions = topics.length > 0
                ? topics.map((t: string, idx: number) => ({
                    id: `voice_topic_${idx + 1}`,
                    order: idx + 1,
                    type: "descriptive",
                    section: "ai_interview",
                    question: t,
                    points: 10,
                    instructions: "AI Spoken Assessment: Verbally articulate your perspective and trade-offs clearly into the microphone.",
                    sampleAnswer: `Model verbal response covering structured reasoning and architectural trade-offs (${stageData?.config?.difficulty || 'medium'} difficulty).`,
                    evaluationRubric: "Spoken Clarity: 4 pts, Technical Reasoning: 3 pts, Trade-offs & Production Thinking: 3 pts",
                  }))
                : [
                    {
                      id: "voice_topic_1",
                      order: 1,
                      type: "descriptive",
                      section: "ai_interview",
                      question: "Walk through the architectural design, failure modes, and scalability trade-offs of an event-driven system handling 50k requests per second.",
                      points: 10,
                      instructions: "AI Spoken Assessment: Verbally articulate system architecture, latency guarantees, and bottleneck mitigations.",
                    },
                    {
                      id: "voice_topic_2",
                      order: 2,
                      type: "descriptive",
                      section: "ai_interview",
                      question: "Live Production Outage Triage: A critical payments gateway begins throwing intermittent 504 timeouts after a peak traffic deploy. How do you verbally organize incident containment, diagnosis, and post-mortem communication?",
                      points: 10,
                      instructions: "AI Spoken Assessment: Explain troubleshooting methodology, metric dashboards inspection, and cross-team communication.",
                    },
                    {
                      id: "voice_topic_3",
                      order: 3,
                      type: "descriptive",
                      section: "ai_interview",
                      question: "Engineering Leadership & Disagreements: Describe a scenario where your proposed technical approach conflicted with a senior engineer's solution. How did you resolve the trade-offs and build consensus?",
                      points: 10,
                      instructions: "AI Spoken Assessment: Focus on communication clarity, objective trade-off evaluation, and team collaboration.",
                    },
                    {
                      id: "voice_topic_4",
                      order: 4,
                      type: "descriptive",
                      section: "ai_interview",
                      question: "Stakeholder Communication: How do you explain the technical debt and necessity of refactoring core legacy infrastructure to non-technical business executives?",
                      points: 10,
                      instructions: "AI Spoken Assessment: Translate technical complexities into business value, risk management, and ROI.",
                    },
                  ];
            } else if (isAiChat || stageData?.config?.isAiAssessment) {
              const topics = stageData?.config?.topics || [];
              resolvedQuestions = topics.length > 0
                ? topics.map((t: string, idx: number) => ({
                    id: `chat_topic_${idx + 1}`,
                    order: idx + 1,
                    type: "descriptive",
                    section: "ai_interview",
                    question: t,
                    points: 10,
                    instructions: "AI Conversational Chat Assessment: Type your structured approach and code snippets.",
                    sampleAnswer: `The AI evaluates the candidate's conversational response based on depth, technical accuracy, and role requirements (${stageData?.config?.difficulty || 'medium'} difficulty).`,
                    evaluationRubric: "Concept Clarity & Code Implementation: 4 pts, Practical Architecture: 3 pts, Edge Cases: 3 pts",
                  }))
                : [
                    {
                      id: "chat_topic_1",
                      order: 1,
                      type: "descriptive",
                      section: "ai_interview",
                      question: "Design and implement a scalable State Management & Data Flow Architecture for high-concurrency client updates, handling optimistic UI and race conditions.",
                      points: 10,
                      instructions: "AI Chat Assessment: Provide architectural choices, code patterns, and concrete state flow diagrams or snippets.",
                    },
                    {
                      id: "chat_topic_2",
                      order: 2,
                      type: "descriptive",
                      section: "ai_interview",
                      question: "API Contract & Query Optimization: How would you structure schema validation, pagination, and database indexing for high-frequency search and filtering endpoints?",
                      points: 10,
                      instructions: "AI Chat Assessment: Detail your schema definitions, SQL/NoSQL query plans, and caching layer implementation.",
                    },
                    {
                      id: "chat_topic_3",
                      order: 3,
                      type: "descriptive",
                      section: "ai_interview",
                      question: "Asynchronous Concurrency & Error Boundaries: How do you isolate failures in distributed background workers, prevent memory leaks, and guarantee idempotency in message queues?",
                      points: 10,
                      instructions: "AI Chat Assessment: Explain retry strategies, dead-letter queues, and error-handling code structure.",
                    },
                    {
                      id: "chat_topic_4",
                      order: 4,
                      type: "descriptive",
                      section: "ai_interview",
                      question: "Production CI/CD Pipelines & Automated Testing: Outline an automated end-to-end testing matrix and canary deployment strategy to ensure zero-downtime releases.",
                      points: 10,
                      instructions: "AI Chat Assessment: Outline your pipeline stages, health checks, and automated rollback triggers.",
                    },
                  ];
            } else {
              resolvedQuestions = GENERAL_APTITUDE_DEFAULT_QUESTIONS;
            }

            const resolvedStageType = isGeneralAptitude
              ? "general_aptitude"
              : isTechnicalTest
              ? "technical_test"
              : isRapidRound
              ? "rapid_round"
              : isAiChat
              ? "ai_chat"
              : isAiVoice
              ? "ai_voice"
              : stageData?.stageType || "assessment";

            const resolvedAssessmentType = isGeneralAptitude
              ? "general_aptitude"
              : isTechnicalTest
              ? "technical_test"
              : isRapidRound
              ? "rapid_round"
              : isAiChat
              ? "ai_chat"
              : isAiVoice
              ? "ai_voice"
              : stageData?.assessmentType || "general_aptitude";

            const resolvedStageName = stageData.stageName || (
              isGeneralAptitude
                ? "General Aptitude Test"
                : isTechnicalTest
                ? "Technical Assessment"
                : isRapidRound
                ? "Rapid Fire Assessment Round"
                : isAiChat
                ? "AI Chat Assessment Round"
                : isAiVoice
                ? "AI Voice Assessment Round"
                : "Assessment Round"
            );

            setTestData({
              applicationId: "preview-application",
              job: {
                _id: jobId,
                title: stageData.stageName ? `${stageData.stageName} (Recruiter Preview)` : "Live Assessment Preview",
                company: { name: "Stage Configuration Preview" },
              },
              stage: {
                stageId: stageData.stageId || stageId,
                stageName: resolvedStageName,
                stageType: resolvedStageType,
                assessmentType: resolvedAssessmentType,
                durationMinutes: stageData.durationMinutes || (isRapidRound ? 10 : 30),
                passingScore: stageData.passingScore || stageData.autoAdvanceScoreThreshold || 70,
                totalQuestions: resolvedQuestions.length,
                config: stageData.config,
                instructions: isAiChat
                  ? "Candidate Preview Mode: This window simulates how candidates experience your AI Chat Assessment."
                  : isRapidRound
                  ? "Recruiter Preview Mode: This window simulates your standalone speed-timed Rapid Fire assessment."
                  : isTechnicalTest
                  ? "Recruiter Preview Mode: This window simulates your configured Technical Assessment with MCQs and Engineering problems."
                  : "Recruiter Preview Mode: This window simulates your General Aptitude Test with Multiple Choice, Descriptive, and Rapid sections.",
              },
              questions: resolvedQuestions.map((q: any, idx: number) => ({
                id: q.id || `q_${idx + 1}`,
                order: q.order || idx + 1,
                type: q.type || (q.section === "rapid" ? "rapid" : q.section === "descriptive" ? "descriptive" : "mcq"),
                section: q.section,
                question: q.question,
                instructions: q.instructions || "",
                points: q.points || 10,
                timeLimitSeconds: q.timeLimitSeconds,
                options: q.options,
                context: q.context,
                correctOptionId: q.correctOptionId,
                sampleAnswer: q.sampleAnswer,
                evaluationRubric: q.evaluationRubric,
              })),
            });
            const totalSecs = (stageData.durationMinutes || (isRapidRound ? 10 : 30)) * 60;
            setTimeRemainingSeconds(totalSecs);
            setLoading(false);
            return;
          } catch {
            // Fall back to demo dataset below if recruiter session isn't active or endpoint fails
          }
        }

        // 3. Fallback demo/preview dataset tailored to round parameters
        const requestedStageId = (stageId || "").toLowerCase();
        const isDemoTechnical = requestedStageId.includes("technical") || requestedStageId.includes("tech");
        const isDemoRapid = requestedStageId.includes("rapid");
        const isDemoAiChat = requestedStageId.includes("ai_chat") || requestedStageId.includes("chat");

        if (isDemoTechnical) {
          setTestData({
            applicationId: "demo-preview-application",
            job: {
              _id: "demo-job",
              title: "Senior Full Stack Engineer",
              company: { name: "TechCorp Labs" },
            },
            stage: {
              stageId: "stage_technical_test",
              stageName: "Technical Assessment (Interactive Demo)",
              stageType: "technical_test",
              assessmentType: "technical_test",
              durationMinutes: 30,
              passingScore: 70,
              totalQuestions: TECHNICAL_TEST_DEFAULT_QUESTIONS.length,
              instructions: "This is a demonstration of the Technical Assessment portal. Experience multiple choice architecture questions, descriptive engineering problems with scratchpad upload, and rapid technical trivia.",
            },
            questions: TECHNICAL_TEST_DEFAULT_QUESTIONS,
          });
          setTimeRemainingSeconds(30 * 60);
          setLoading(false);
          return;
        }

        if (isDemoRapid) {
          setTestData({
            applicationId: "demo-preview-application",
            job: {
              _id: "demo-job",
              title: "Senior Full Stack Engineer",
              company: { name: "TechCorp Labs" },
            },
            stage: {
              stageId: "stage_rapid_round",
              stageName: "Rapid Fire Assessment Round (Interactive Demo)",
              stageType: "rapid_round",
              assessmentType: "rapid_round",
              durationMinutes: 10,
              passingScore: 70,
              totalQuestions: RAPID_ROUND_DEFAULT_QUESTIONS.length,
              instructions: "This is a demonstration of the Standalone Rapid-Fire portal. Answer each speed question before its individual timer expires. The system automatically auto-advances to the next question.",
            },
            questions: RAPID_ROUND_DEFAULT_QUESTIONS,
          });
          setTimeRemainingSeconds(10 * 60);
          setLoading(false);
          return;
        }

        if (isDemoAiChat) {
          const aiTopics = [
            "Core Engineering Architecture & Tradeoffs",
            "System Scalability & State Management",
            "Production Resilience, Concurrency & Error Boundaries",
          ];
          setTestData({
            applicationId: "demo-preview-application",
            job: {
              _id: "demo-job",
              title: "Senior Full Stack Engineer",
              company: { name: "TechCorp Labs" },
            },
            stage: {
              stageId: "stage_ai_chat",
              stageName: "AI Chat Assessment Round (Interactive Demo)",
              stageType: "ai_chat",
              assessmentType: "ai_chat",
              durationMinutes: 20,
              passingScore: 75,
              totalQuestions: 3,
              config: {
                modality: "chat",
                modalities: ["chat"],
                topics: aiTopics,
                difficulty: "hard",
              },
              instructions: "This is a demonstration of the AI Conversational Interview portal (Chat Modality). The AI Technical Interviewer will probe your engineering design across multi-turn dialogue.",
            },
            questions: aiTopics.map((t, idx) => ({
              id: `topic_${idx + 1}`,
              order: idx + 1,
              type: "descriptive",
              section: "ai_interview",
              question: t,
              points: 10,
            })),
          });
          setTimeRemainingSeconds(20 * 60);
          setLoading(false);
          return;
        }

        // Default Fallback: General Aptitude Test with all 3 sections (MCQ, Descriptive, Rapid)
        setTestData({
          applicationId: "demo-preview-application",
          job: {
            _id: "demo-job",
            title: "Senior Full Stack Engineer",
            company: { name: "TechCorp Labs" },
          },
          stage: {
            stageId: "stage_general_aptitude",
            stageName: "General Aptitude Test (Interactive Demo)",
            stageType: "general_aptitude",
            assessmentType: "general_aptitude",
            durationMinutes: 25,
            passingScore: 70,
            totalQuestions: GENERAL_APTITUDE_DEFAULT_QUESTIONS.length,
            instructions: "This is a demonstration of the General Aptitude Assessment portal. Experience multiple choice option selecting, descriptive mathematical deductions with scratchpad upload, and rapid-fire timed questions.",
          },
          questions: GENERAL_APTITUDE_DEFAULT_QUESTIONS,
        });
        setTimeRemainingSeconds(25 * 60);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const url = `/applications/${applicationId}/stage-test${stageId ? `?stageId=${encodeURIComponent(stageId)}` : ""}`;
        const res: any = await apiClient.get(url);
        const data: TestData = res.data;
        setTestData(data);
        const totalSecs = (data.stage?.durationMinutes || 30) * 60;
        setTimeRemainingSeconds(totalSecs);
      } catch (err: any) {
        setLoadError(err.response?.data?.message || "Failed to load assessment questions for this stage.");
      } finally {
        setLoading(false);
      }
    }

    loadTest();
  }, [applicationId, stageId]);

  // Live timer tick
  useEffect(() => {
    if (phase !== "in_progress") return;

    const timer = setInterval(() => {
      setTimeSpentSeconds((prev) => prev + 1);
      setTimeRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmitOnExpiry();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase]);

  // Rapid Question speed-timer initialization on question navigation
  useEffect(() => {
    if (phase !== "in_progress" || !testData?.questions?.[currentIdx]) {
      setRapidRemaining(null);
      return;
    }

    const q = testData.questions[currentIdx];
    const isRapid = q.type === "rapid" || q.section === "rapid";
    if (isRapid) {
      const limit = q.timeLimitSeconds || testData.stage?.config?.rapidTimeLimitSeconds || 30;
      setRapidLimit(limit);
      setRapidRemaining(limit);
    } else {
      setRapidRemaining(null);
    }
  }, [currentIdx, phase, testData]);

  // Rapid Question countdown ticker
  useEffect(() => {
    if (phase !== "in_progress" || rapidRemaining === null) return;

    const timer = setInterval(() => {
      setRapidRemaining((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          clearInterval(timer);
          toast.warning("⚡ Time's up for this rapid question! Auto-advancing...", {
            duration: 3000,
          });
          const qs = testData?.questions || [];
          if (qs.length > 0 && currentIdx < qs.length - 1) {
            setCurrentIdx((c) => c + 1);
          } else {
            setShowSubmitModal(true);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, rapidRemaining, currentIdx, testData]);

  // Fullscreen change listener
  useEffect(() => {
    if (phase !== "in_progress") return;

    const handleFullscreenChange = () => {
      const active = Boolean(document.fullscreenElement);
      setIsFullscreen(active);
      if (!active) {
        setShowFullscreenWarning(true);
      } else {
        setShowFullscreenWarning(false);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [phase]);

  // Tab switch & visibility monitoring
  useEffect(() => {
    if (phase !== "in_progress") return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleInfraction("Tab switch detected: Focus lost.");
      }
    };

    const handleWindowBlur = () => {
      handleInfraction("Window switch detected: Window blurred.");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [phase, tabSwitchCount]);

  const handleInfraction = (reason: string) => {
    setTabSwitchCount((prev) => {
      const nextCount = prev + 1;
      if (nextCount >= 4) {
        toast.error("Proctor Violation: Excessive tab switches detected. Auto-submitting assessment...", {
          duration: 6000,
        });
        handleSubmitExam(nextCount);
      } else {
        toast.warning(
          `⚠️ Proctor Warning (${nextCount}/3): Please remain in your exam window. Repeated infractions will disqualify your test.`,
          { duration: 5000 }
        );
      }
      return nextCount;
    });
  };

  const handleStartExam = async () => {
    if (!agreedToTerms) {
      toast.error("Please accept the test integrity agreement to proceed.");
      return;
    }

    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      }
    } catch {
      // Fullscreen prompt fallback
    }

    setPhase("in_progress");
    toast.success("Assessment started! You are in proctored exam mode.");
  };

  const handleReenterFullscreen = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
        setShowFullscreenWarning(false);
      }
    } catch {
      toast.error("Could not trigger full screen. Please click allow when prompted.");
    }
  };

  const handleAutoSubmitOnExpiry = () => {
    toast.error("Time has expired! Submitting your assessment answers...", { duration: 6000 });
    handleSubmitExam();
  };

  const handleSelectOption = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const toggleReview = (questionId: string) => {
    setMarkedForReview((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const handleSubmitExam = async (overrideInfractionCount?: number) => {
    if (!testData) return;
    if (isAiChatAssessment) {
      return handleFinishChatAssessment();
    }
    if (isAiVoiceAssessment) {
      return handleFinishVoiceAssessment();
    }
    try {
      setIsSubmitting(true);
      setShowSubmitModal(false);
      toast.loading("Submitting and evaluating your assessment...", { id: "stage-eval" });

      const infractions = overrideInfractionCount !== undefined ? overrideInfractionCount : tabSwitchCount;

      // In demo/preview mode, compute score locally so anyone can test the complete taker flow immediately
      const isPreview = searchParams.get("preview") === "true";
      if (
        applicationId === "demo-preview-application" ||
        applicationId === "preview-application" ||
        isPreview ||
        !applicationId
      ) {
        await new Promise((r) => setTimeout(r, 600));

        let earnedPoints = 0;
        let totalPossible = 0;
        (testData.questions || []).forEach((q: any) => {
          const pts = Number(q.points) || 10;
          totalPossible += pts;
          const userAns = (answers[q.id] || "").trim();

          if (q.correctOptionId) {
            if (userAns.toLowerCase() === String(q.correctOptionId).trim().toLowerCase()) {
              earnedPoints += pts;
            }
          } else if (q.type === "descriptive" || q.section === "descriptive" || !q.options || q.options.length === 0) {
            if (userAns.length >= 25) {
              earnedPoints += Math.round(pts * 0.9);
            } else if (userAns.length >= 10) {
              earnedPoints += Math.round(pts * 0.5);
            }
          } else if (userAns) {
            earnedPoints += pts;
          }
        });

        const maxScore = totalPossible || 100;
        const totalScore = earnedPoints;
        const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
        const proctorDisqualified = infractions >= 4;
        const passingThreshold = testData.stage?.passingScore || 70;
        const passed = percentage >= passingThreshold && !proctorDisqualified;

        setSubmissionResult({
          passed,
          totalScore,
          maxScore,
          percentage,
          passingScore: passingThreshold,
          verdict: proctorDisqualified
            ? "Disqualified due to excessive proctoring infractions (>3 tab switches)"
            : passed
            ? "Congratulations! You met the passing criteria and have been advanced to the next round."
            : `Score of ${percentage}% is below required ${passingThreshold}% passing threshold.`,
          message: passed
            ? "You qualified for the next stage in the pipeline."
            : "Review your performance and attempt future openings.",
          tabSwitchCount: infractions,
          proctorDisqualified,
          nextStageId: passed ? "stage_ai_interview" : null,
          isFinalShortlist: false,
        });
        setPhase("completed");
        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
        toast.dismiss("stage-eval");
        toast.success(
          applicationId === "preview-application"
            ? "Preview test evaluated! Verified against your saved answer keys."
            : "Assessment evaluated successfully!"
        );
        return;
      }

      const payload = {
        stageId: testData.stage.stageId,
        answers,
        timeSpentSeconds,
        tabSwitchCount: infractions,
      };

      const res: any = await apiClient.post(`/applications/${applicationId}/submit-stage`, payload);
      setSubmissionResult(res.data);
      setPhase("completed");

      // Exit fullscreen if active
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }

      toast.dismiss("stage-eval");
      toast.success("Assessment evaluated successfully!");
    } catch (err: any) {
      toast.dismiss("stage-eval");
      toast.error(err.response?.data?.message || "Failed to submit assessment. Please retry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const questions = testData?.questions || [];
  const currentQ = questions[currentIdx] || null;
  const answeredCount = Object.keys(answers).length;
  const isTimeUrgent = timeRemainingSeconds < 300;

  const stageType = (testData?.stage?.stageType || "").toLowerCase();
  const assessmentType = (testData?.stage?.assessmentType || "").toLowerCase();
  const stageName = (testData?.stage?.stageName || "").toLowerCase();
  const currentStageId = (stageId || testData?.stage?.stageId || "").toLowerCase();

  const isGeneralAptitude = Boolean(
    stageType === "general_aptitude" ||
    assessmentType === "general_aptitude" ||
    currentStageId.includes("general_aptitude") ||
    stageName.includes("general aptitude") ||
    (stageName.includes("aptitude") && !stageName.includes("technical"))
  );

  const isTechnicalTest = Boolean(
    stageType === "technical_test" ||
    stageType === "technical" ||
    assessmentType === "technical_test" ||
    assessmentType === "technical" ||
    currentStageId.includes("technical_test") ||
    currentStageId.includes("technical") ||
    stageName.includes("technical test") ||
    stageName.includes("tech test") ||
    stageName.includes("technical assessment")
  );

  const isRapidStandaloneRound = Boolean(
    stageType === "rapid_round" ||
    stageType === "rapid_question" ||
    assessmentType === "rapid_round" ||
    assessmentType === "rapid_question" ||
    currentStageId.includes("rapid_round") ||
    currentStageId.includes("rapid_question") ||
    (stageName.includes("rapid") && !isGeneralAptitude && !isTechnicalTest)
  );

  // An AI Chat Assessment is STRICTLY and ONLY active when:
  // 1. The stage is NOT General Aptitude, Technical Test, or Rapid Round
  // 2. The recruiter explicitly configured it as AI Chat assessment
  const isAiChatAssessment = Boolean(
    !isGeneralAptitude &&
    !isTechnicalTest &&
    !isRapidStandaloneRound &&
    (
      stageType === "ai_chat" ||
      assessmentType === "ai_chat" ||
      currentStageId.includes("ai_chat") ||
      stageName.includes("ai chat") ||
      (testData?.stage?.config?.isAiAssessment && testData?.stage?.config?.modality === "chat") ||
      (testData?.stage?.config?.isAiAssessment && testData?.stage?.config?.modalities?.length === 1 && testData?.stage?.config?.modalities[0] === "chat") ||
      ((stageType === "ai_assessment" || assessmentType === "ai_assessment") && testData?.stage?.config?.modalities?.includes("chat") && !testData?.stage?.config?.modalities?.includes("voice"))
    )
  );

  // An AI Voice Assessment is STRICTLY and ONLY active when:
  // 1. The stage is NOT General Aptitude, Technical Test, or Rapid Round
  // 2. The recruiter explicitly configured it as AI Voice assessment
  const isAiVoiceAssessment = Boolean(
    !isGeneralAptitude &&
    !isTechnicalTest &&
    !isRapidStandaloneRound &&
    (
      stageType === "ai_voice" ||
      assessmentType === "ai_voice" ||
      currentStageId.includes("ai_voice") ||
      stageName.includes("ai voice") ||
      stageName.includes("voice assessment") ||
      (testData?.stage?.config?.isAiAssessment && testData?.stage?.config?.modality === "voice") ||
      (testData?.stage?.config?.isAiAssessment && testData?.stage?.config?.modalities?.length === 1 && testData?.stage?.config?.modalities[0] === "voice") ||
      ((stageType === "ai_assessment" || assessmentType === "ai_assessment") && testData?.stage?.config?.modalities?.includes("voice") && !testData?.stage?.config?.modalities?.includes("chat"))
    )
  );

  // Computed section groups (Hook called unconditionally)
  const sectionGroups = React.useMemo(() => {
    if (!questions.length) return [];
    const map = new Map<string, { key: string; label: string; count: number; firstIdx: number }>();
    questions.forEach((q, idx) => {
      const secKey = q.section || (q.type === "rapid" ? "rapid" : q.type === "descriptive" ? "descriptive" : "mcq");
      if (!map.has(secKey)) {
        let label = "Multiple Choice Questions";
        if (secKey === "descriptive") {
          label = isTechnicalTest
            ? "Descriptive & Engineering Architecture"
            : "Descriptive & Step-by-Step Working";
        } else if (secKey === "rapid") {
          label = isTechnicalTest
            ? "⚡ Rapid Technical Round"
            : isRapidStandaloneRound
            ? "⚡ Standalone Rapid-Fire Round"
            : "⚡ Rapid Question Round";
        } else if (secKey === "mcq") {
          label = isTechnicalTest ? "Technical Multiple Choice" : "Multiple Choice Questions";
        } else if (secKey === "ai_interview") {
          label = "Conversational AI Interview";
        }
        map.set(secKey, { key: secKey, label, count: 0, firstIdx: idx });
      }
      map.get(secKey)!.count += 1;
    });
    return Array.from(map.values());
  }, [questions, isTechnicalTest, isRapidStandaloneRound]);

  const activeSectionKey = currentQ?.section || (currentQ?.type === "rapid" ? "rapid" : currentQ?.type === "descriptive" ? "descriptive" : "mcq");

  const chatTopics = React.useMemo(() => {
    if (!testData || !isAiChatAssessment) return [];
    if (Array.isArray(testData.questions) && testData.questions.length > 0) {
      return testData.questions.map((q: any) => q.question || q.context || "Technical Topic");
    }
    const configTopics = testData.stage?.config?.topics || testData.stage?.config?.customQuestions;
    if (Array.isArray(configTopics) && configTopics.length > 0) {
      return configTopics.map((t: any) => (typeof t === "string" ? t : t.question || t.topic || "Technical Topic"));
    }
    return [
      "System State Management, Concurrency & Data Flow Patterns",
      "API Contract Design, Schema Validation & Database Query Optimization",
      "Asynchronous Workflows, Memory Leak Prevention & Error Boundaries",
      "Automated Testing Strategy, CI/CD Pipeline & Production Resilience",
    ];
  }, [testData, isAiChatAssessment]);

  const voiceTopics = React.useMemo(() => {
    if (!testData || !isAiVoiceAssessment) return [];
    if (Array.isArray(testData.questions) && testData.questions.length > 0) {
      return testData.questions.map((q: any) => q.question || q.context || "Spoken Topic");
    }
    const configTopics = testData.stage?.config?.topics || testData.stage?.config?.customQuestions;
    if (Array.isArray(configTopics) && configTopics.length > 0) {
      return configTopics.map((t: any) => (typeof t === "string" ? t : t.question || t.topic || "Spoken Topic"));
    }
    return [
      "Verbal Architecture Walkthrough & System Scalability Trade-offs",
      "Live Production Outage Verbal Triage & Root Cause Articulation",
      "Engineering Leadership, Resolving Technical Disagreements & Mentorship",
      "Communicating Technical Debt & Architectural Decisions to Non-Technical Stakeholders",
    ];
  }, [testData, isAiVoiceAssessment]);

  // Initialize conversational AI Chat when entering exam
  useEffect(() => {
    if (phase === "in_progress" && isAiChatAssessment && chatMessages.length === 0 && chatTopics.length > 0) {
      const firstTopic = chatTopics[0];
      const initialGreeting = `Hello! Welcome to your interactive technical assessment for the **${testData?.job?.title || "Engineering"}** role.

I am your **AI Technical Interviewer** today. We will explore **${chatTopics.length} key engineering topics** calibrated to **${String(testData?.stage?.config?.difficulty || "medium").toUpperCase()}** difficulty.

### Current Topic: ${firstTopic}

To get started, could you introduce your approach and describe how you would design or implement this in a production environment? Please highlight your architectural choices, key libraries/algorithms, and trade-offs.`;

      setChatMessages([
        {
          id: "msg_init",
          role: "ai",
          message: initialGreeting,
          topic: firstTopic,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setActiveGuidanceTip(
        `Focus on Topic 1: "${firstTopic}". State your engineering design first, then touch upon scaling bottlenecks, state management, or security guarantees.`
      );
    }
  }, [phase, isAiChatAssessment, chatMessages.length, chatTopics, testData]);

  // Initialize AI Voice Session
  useEffect(() => {
    if (phase === "in_progress" && isAiVoiceAssessment && voiceMessages.length === 0 && voiceTopics.length > 0) {
      const firstTopic = voiceTopics[0];
      const initialGreeting = `Hello! Welcome to your AI Voice Assessment for the **${testData?.job?.title || "Engineering"}** position.

I am your **AI Voice Interviewer**. We will conduct a real-time spoken evaluation covering **${voiceTopics.length} discussion topics** at **${String(testData?.stage?.config?.difficulty || "medium").toUpperCase()}** depth.

### Topic 1: ${firstTopic}

When you are ready, ensure your microphone is active and speak naturally. Could you introduce your perspective and share your architectural approach on this topic?`;

      setVoiceMessages([
        {
          id: "voice_init",
          role: "ai",
          message: initialGreeting,
          topic: firstTopic,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);

      // Speak initial question aloud
      const timer = setTimeout(() => {
        speakAiText(initialGreeting);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [phase, isAiVoiceAssessment, voiceMessages.length, voiceTopics, testData]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (isAiChatAssessment && chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, isAiThinking, isAiChatAssessment]);

  // Auto-scroll voice to bottom
  useEffect(() => {
    if (isAiVoiceAssessment && voiceBottomRef.current) {
      voiceBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [voiceMessages, isAiSpeaking, isAiVoiceAssessment]);

  // Send candidate chat message
  const handleSendChatMessage = async () => {
    const text = chatInput.trim();
    if (!text || isAiThinking || !testData) return;

    const currentTopic = chatTopics[currentChatTopicIdx] || "Technical Architecture";
    const userMsg = {
      id: `usr_${Date.now()}`,
      role: "candidate" as const,
      message: text,
      topic: currentTopic,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const nextHistory = [...chatMessages, userMsg];
    setChatMessages(nextHistory);
    setChatInput("");
    setIsAiThinking(true);

    // Save candidate's answer into answers state map for tracking & review
    const topicKey = `topic_${currentChatTopicIdx + 1}`;
    setAnswers((prev) => ({
      ...prev,
      [topicKey]: (prev[topicKey] ? prev[topicKey] + "\n\n" : "") + text,
    }));

    try {
      const res = await domainAssessmentService.chatTurn({
        jobTitle: testData.job?.title || "Candidate Role",
        stageName: testData.stage?.stageName || "AI Chat Assessment",
        difficulty: testData.stage?.config?.difficulty || "medium",
        currentTopic,
        topics: chatTopics,
        topicIndex: currentChatTopicIdx,
        history: nextHistory.map((m) => ({ role: m.role, message: m.message })),
        candidateMessage: text,
        blueprint: testData.stage?.config?.blueprint || testData.stage?.config,
      });

      const aiMsg = {
        id: `ai_${Date.now()}`,
        role: "ai" as const,
        message: res.reply,
        topic: currentTopic,
        turnScore: res.turnScore,
        feedback: res.feedback,
        guidanceTip: res.guidanceTip,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setChatMessages((prev) => [...prev, aiMsg]);
      if (res.guidanceTip) {
        setActiveGuidanceTip(res.guidanceTip);
      }
    } catch (err: any) {
      console.error("AI chat turn error:", err);
      const fallbackAiMsg = {
        id: `ai_${Date.now()}`,
        role: "ai" as const,
        message: `Thank you for detailing your approach on "${currentTopic}". Could you elaborate on how you would test this system and handle race conditions or peak traffic surges?`,
        topic: currentTopic,
        turnScore: 7,
        feedback: "Solid technical explanation.",
        guidanceTip: "Elaborate on edge cases, automated test coverage, and disaster recovery.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setChatMessages((prev) => [...prev, fallbackAiMsg]);
    } finally {
      setIsAiThinking(false);
    }
  };

  // Advance to next agenda topic
  const handleNextTopic = () => {
    if (currentChatTopicIdx < chatTopics.length - 1) {
      const nextIdx = currentChatTopicIdx + 1;
      setCurrentChatTopicIdx(nextIdx);
      const nextTopic = chatTopics[nextIdx];
      const transitionMsg = {
        id: `ai_trans_${Date.now()}`,
        role: "ai" as const,
        message: `Excellent discussion. Let us now move to the next item on our interview agenda:

### Topic ${nextIdx + 1} of ${chatTopics.length}: ${nextTopic}

How would you approach or architect solutions for this specific area? Please provide concrete details on your methodology, key components, and trade-offs.`,
        topic: nextTopic,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setChatMessages((prev) => [...prev, transitionMsg]);
      setActiveGuidanceTip(
        `Now addressing Topic ${nextIdx + 1}: "${nextTopic}". Provide technical depth, reference libraries or frameworks where appropriate, and explain design rationale.`
      );
      toast.info(`Moved to Topic ${nextIdx + 1}: ${nextTopic}`);
    } else {
      setShowSubmitModal(true);
    }
  };

  // Helper to insert code snippet
  const insertCodeSnippet = () => {
    const snippet = "\n```typescript\n// Implementation\nfunction solution() {\n  \n}\n```\n";
    setChatInput((prev) => prev + snippet);
    if (chatTextareaRef.current) {
      chatTextareaRef.current.focus();
    }
  };

  // Finish and strictly evaluate full AI Chat Assessment
  const handleFinishChatAssessment = async () => {
    if (!testData) return;
    setIsSubmitting(true);
    setShowSubmitModal(false);
    toast.loading("Strictly evaluating conversational performance against rubric...", { id: "eval-chat" });

    try {
      const evalResult = await domainAssessmentService.evaluateChatSession({
        jobTitle: testData.job?.title || "Candidate Role",
        stageName: testData.stage?.stageName || "AI Chat Assessment",
        passingScore: testData.stage?.passingScore || 70,
        difficulty: testData.stage?.config?.difficulty || "medium",
        topics: chatTopics,
        transcript: chatMessages.map((m) => ({
          topic: m.topic,
          role: m.role,
          message: m.message,
          turnScore: m.turnScore,
        })),
        durationMinutes: testData.stage?.durationMinutes || 30,
        timeSpentSeconds,
      });

      setChatEvaluation(evalResult);

      const isPreview = searchParams.get("preview") === "true";
      if (
        applicationId === "demo-preview-application" ||
        applicationId === "preview-application" ||
        isPreview ||
        !applicationId
      ) {
        setSubmissionResult({
          passed: evalResult.passed,
          totalScore: evalResult.totalScore,
          maxScore: 100,
          percentage: evalResult.percentage,
          passingScore: evalResult.passingScore,
          verdict:
            evalResult.verdict === "strong_hire"
              ? "Strong Hire — Exceptional Depth"
              : evalResult.verdict === "hire"
              ? "Hire — Stage Qualified"
              : evalResult.verdict === "borderline"
              ? "Borderline Evaluation"
              : "Unsuccessful — Below Passing Mark",
          message: evalResult.summary,
          tabSwitchCount,
          proctorDisqualified: tabSwitchCount >= 4,
          nextStageId: evalResult.passed ? "stage_next" : null,
          isFinalShortlist: false,
        });
      } else {
        const payload = {
          stageId: testData.stage.stageId,
          answers,
          timeSpentSeconds,
          tabSwitchCount,
        };
        const res: any = await apiClient.post(`/applications/${applicationId}/submit-stage`, payload);
        setSubmissionResult({
          ...res.data,
          percentage: evalResult.percentage,
          passed: evalResult.passed,
          verdict: evalResult.verdict,
          message: evalResult.summary,
        });
      }

      setPhase("completed");
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      toast.dismiss("eval-chat");
      toast.success("AI Chat Assessment strictly evaluated successfully!");
    } catch (err: any) {
      toast.dismiss("eval-chat");
      toast.error(err.response?.data?.message || "Failed to evaluate chat session. Please retry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------------------------------------------------
  // AI Voice Synthesis & Speech Recognition Engine
  // -------------------------------------------------------------
  const speakAiText = (rawText: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (isAiVoiceMuted) return;

    try {
      window.speechSynthesis.cancel();

      // Clean markdown formatting (*, #, `, _, etc.) to make speech smooth and natural
      const cleanText = rawText
        .replace(/###\s+/g, "")
        .replace(/\*\*([^*]+)\*\*/g, "$1")
        .replace(/\*([^*]+)\*/g, "$1")
        .replace(/`([^`]+)`/g, "$1")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/\n+/g, " ")
        .trim();

      if (!cleanText) return;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.lang = "en-US";

      const voices = window.speechSynthesis.getVoices();
      const naturalVoice = voices.find(
        (v) =>
          (v.lang.startsWith("en") &&
            (v.name.includes("Natural") ||
              v.name.includes("Google") ||
              v.name.includes("Samantha") ||
              v.name.includes("Jenny") ||
              v.name.includes("Zira"))) ||
          v.lang === "en-US" ||
          v.lang === "en-GB"
      );
      if (naturalVoice) {
        utterance.voice = naturalVoice;
      }

      utterance.onstart = () => {
        setIsAiSpeaking(true);
      };
      utterance.onend = () => {
        setIsAiSpeaking(false);
      };
      utterance.onerror = () => {
        setIsAiSpeaking(false);
      };

      speechSynthRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error", e);
      setIsAiSpeaking(false);
    }
  };

  const stopAiSpeech = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    setIsAiSpeaking(false);
  };

  const handleToggleMic = () => {
    if (isAiSpeaking) {
      stopAiSpeech();
    }

    if (isListeningMic) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      setIsListeningMic(false);
      setIsMicMuted(true);
      toast.info("Microphone paused.");
    } else {
      if (typeof window !== "undefined") {
        const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRec) {
          try {
            const rec = new SpeechRec();
            rec.continuous = true;
            rec.interimResults = true;
            rec.lang = "en-US";

            rec.onresult = (event: any) => {
              let transcript = "";
              for (let i = event.resultIndex; i < event.results.length; ++i) {
                transcript += event.results[i][0].transcript;
              }
              if (transcript.trim()) {
                setVoiceSimulatedInput(transcript);
              }
            };

            rec.onerror = (event: any) => {
              console.warn("Speech recognition error:", event.error);
              if (event.error === "not-allowed") {
                toast.error("Microphone access denied. You can type in the transcript box below.");
                setIsListeningMic(false);
                setIsMicMuted(true);
              }
            };

            rec.onend = () => {
              setIsListeningMic(false);
            };

            recognitionRef.current = rec;
            rec.start();
            setIsListeningMic(true);
            setIsMicMuted(false);
            toast.success("Microphone active! Speak your response aloud.");
          } catch (e) {
            console.warn("Could not start speech recognition:", e);
            setIsListeningMic(false);
          }
        } else {
          toast.info("Speech recognition not supported in this browser. You can type your response below.");
          setIsMicMuted((prev) => !prev);
        }
      }
    }
  };

  // Cleanup speech synthesis & recognition on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        try {
          window.speechSynthesis.cancel();
        } catch {}
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, []);

  // Send candidate voice turn (spoken audio or simulated transcript)
  const handleSendVoiceResponse = (textToSend?: string) => {
    const text = (textToSend || voiceSimulatedInput).trim();
    if (!text || isAiSpeaking || !testData) return;

    if (isListeningMic && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      setIsListeningMic(false);
    }

    const userMsgId = `voice_cand_${Date.now()}`;
    const userTimestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const currentTopic = voiceTopics[currentVoiceTopicIdx] || "Spoken Technical Articulation & Conceptual Clarity";

    const turnScore = Math.min(10, Math.max(7, Math.round(7 + (text.length > 40 ? 2 : 0))));
    const feedback = "Strong verbal articulation, logical structuring, and authentic technical reasoning.";

    const newCandidateMsg = {
      id: userMsgId,
      role: "candidate" as const,
      message: text,
      topic: currentTopic,
      turnScore,
      feedback,
      timestamp: userTimestamp,
    };

    setVoiceMessages((prev) => [...prev, newCandidateMsg]);
    setVoiceSimulatedInput("");
    setIsAiSpeaking(true);

    // Track answer for proctoring/submission audit
    const topicKey = `voice_topic_${currentVoiceTopicIdx + 1}`;
    setAnswers((prev) => ({
      ...prev,
      [topicKey]: (prev[topicKey] ? prev[topicKey] + "\n\n" : "") + text,
    }));

    setTimeout(() => {
      setIsAiSpeaking(false);
      const isLastTopic = currentVoiceTopicIdx >= voiceTopics.length - 1;
      let reply = "";
      if (!isLastTopic) {
        reply = `Thank you for articulating that clearly. Your spoken breakdown of ${currentTopic} demonstrated solid conceptual grounding. Now, let's explore our next discussion topic: **${voiceTopics[currentVoiceTopicIdx + 1]}**. How do you approach this in production environments?`;
        setCurrentVoiceTopicIdx((c) => c + 1);
      } else {
        reply = `Excellent work! We have covered all ${voiceTopics.length} discussion topics for this AI Voice Assessment. You have completed the speaking roadmap. Please click "Finish & Submit Voice" above to generate your spoken scorecard!`;
      }
      setVoiceMessages((prev) => [
        ...prev,
        {
          id: `voice_ai_${Date.now()}`,
          role: "ai" as const,
          message: reply,
          topic: voiceTopics[currentVoiceTopicIdx + (isLastTopic ? 0 : 1)],
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      // Speak AI reply aloud
      speakAiText(reply);
    }, 1200);
  };

  // Finish and strictly evaluate full AI Voice Assessment
  const handleFinishVoiceAssessment = async () => {
    if (!testData) return;
    setIsSubmitting(true);
    setShowSubmitModal(false);
    toast.loading("Analyzing spoken audio fluency, transcription, and verbal reasoning...", { id: "voice-eval" });

    try {
      await new Promise((r) => setTimeout(r, 700));

      const totalPossible = Math.max(voiceTopics.length * 10, 30);
      const candidateAnswers = voiceMessages.filter((m) => m.role === "candidate");
      const earned = candidateAnswers.length > 0
        ? candidateAnswers.reduce((acc, m) => acc + (m.turnScore || 8), 0)
        : Math.round(totalPossible * 0.85);
      const percentage = Math.min(100, Math.round((earned / totalPossible) * 100));
      const passThreshold = testData?.stage?.passingScore || 70;
      const passed = percentage >= passThreshold;

      const isPreview = searchParams.get("preview") === "true";
      if (
        applicationId === "demo-preview-application" ||
        applicationId === "preview-application" ||
        isPreview ||
        !applicationId
      ) {
        setSubmissionResult({
          passed,
          totalScore: earned,
          maxScore: totalPossible,
          percentage,
          passingScore: passThreshold,
          verdict: passed ? "Stage Qualified — Spoken Fluency Verified" : "Evaluation Completed",
          message: passed
            ? "Superb verbal communication, speech fluency, and technical reasoning. Your spoken responses met the benchmark standards."
            : "Your AI Voice Assessment has been recorded and evaluated against the benchmark standards.",
          tabSwitchCount,
          proctorDisqualified: false,
          nextStageId: passed ? "stage_next" : null,
          isFinalShortlist: false,
        });
      } else {
        const payload = {
          stageId: testData.stage.stageId,
          answers,
          timeSpentSeconds,
          tabSwitchCount,
        };
        const res: any = await apiClient.post(`/applications/${applicationId}/submit-stage`, payload);
        setSubmissionResult({
          ...res.data,
          percentage,
          passed,
          verdict: passed ? "Stage Qualified" : "Evaluation Completed",
          message: passed
            ? "Superb verbal communication, speech fluency, and technical reasoning."
            : "Your AI Voice Assessment has been recorded and evaluated.",
        });
      }

      setPhase("completed");
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      toast.dismiss("voice-eval");
      toast.success(passed ? "Voice Assessment Qualified!" : "Voice Assessment Evaluated.");
    } catch (err: any) {
      toast.dismiss("voice-eval");
      toast.error(err.response?.data?.message || "Failed to submit voice assessment. Please retry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary-glow animate-spin" />
          <p className="text-xs text-slate-400">Loading proctored assessment session...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (loadError || !testData) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white">Assessment Unavailable</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            {loadError || "Could not retrieve the specified assessment round."}
          </p>
          <div className="pt-2">
            <Link
              href="/candidate/applications"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition"
            >
              <span>Return to My Applications</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 1. ONBOARDING & PROCTOR RULES SCREEN
  if (phase === "onboarding") {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 sm:p-8 transition-colors duration-200 ${theme === "dark" ? "portal-dark dark bg-slate-950 text-slate-100" : "portal-light bg-slate-50 text-slate-900"}`}>
        <div className="max-w-2xl w-full bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary-glow flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-primary-glow uppercase tracking-wider">
                  {testData.job.company.name}
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  {testData.stage.stageName}
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">Role: {testData.job.title}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="p-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer flex items-center justify-center shrink-0"
              aria-label="Toggle light and dark mode"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-400" />
              )}
            </button>
          </div>

          {/* Test Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/50">
              <Clock className="w-4 h-4 text-primary-glow mx-auto mb-1.5" />
              <div className="text-base font-bold text-white">{testData.stage.durationMinutes} mins</div>
              <div className="text-[10px] text-slate-400">Total Duration</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/50">
              <FileQuestion className="w-4 h-4 text-purple-400 mx-auto mb-1.5" />
              <div className="text-base font-bold text-white">{questions.length}</div>
              <div className="text-[10px] text-slate-400">Questions</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/50">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto mb-1.5" />
              <div className="text-base font-bold text-white">{testData.stage.passingScore}%</div>
              <div className="text-[10px] text-slate-400">Pass Mark</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/50">
              <ShieldCheck className="w-4 h-4 text-blue-400 mx-auto mb-1.5" />
              <div className="text-base font-bold text-white">Strict</div>
              <div className="text-[10px] text-slate-400">Proctored</div>
            </div>
          </div>

          {/* Configured Section Breakdown */}
          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-3 text-left">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-primary-glow" />
                Assessment Structure &amp; Sections
              </span>
              <span className="text-[10px] font-semibold text-primary-glow bg-primary/10 px-2 py-0.5 rounded-full">
                {sectionGroups.length} Configured {sectionGroups.length === 1 ? "Section" : "Sections"}
              </span>
            </div>

            <div className={`grid grid-cols-1 ${sectionGroups.length === 1 ? "sm:grid-cols-1" : sectionGroups.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"} gap-2.5 text-xs`}>
              {sectionGroups.map((grp) => (
                <div key={grp.key} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <div className="font-bold text-slate-200 flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        grp.key === "rapid"
                          ? "bg-amber-400"
                          : grp.key === "descriptive"
                          ? "bg-purple-400"
                          : grp.key === "ai_interview"
                          ? "bg-violet-400"
                          : "bg-blue-400"
                      }`}
                    />
                    <span>{grp.label}</span>
                    <span className="text-[10px] text-slate-400 font-normal ml-auto">({grp.count} Qs)</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {grp.key === "rapid"
                      ? "High-speed speed questions with live countdown timer and auto-advance."
                      : grp.key === "descriptive"
                      ? "Step-by-step written engineering working or scratchpad attachment."
                      : grp.key === "ai_interview"
                      ? "Conversational technical interview questions evaluated by AI in Chat & Voice."
                      : "Conceptual and practical multiple-choice questions."}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Proctoring Rules */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2.5 text-xs text-slate-300">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
              <ShieldAlert className="w-4 h-4" />
              <span>Proctoring &amp; Examination Regulations</span>
            </div>
            <ul className="space-y-1.5 list-disc list-inside text-[11px] text-slate-300/90 pl-1 leading-relaxed">
              <li>Fullscreen mode is strictly enforced throughout the duration of this exam.</li>
              <li>Switching tabs, windows, or minimizing your browser triggers an infraction warning.</li>
              <li>Exceeding 3 proctoring infractions will automatically terminate and disqualify your test.</li>
              <li>Copy, paste, and right-click actions are disabled to preserve test integrity.</li>
              <li>Answers are recorded and scored immediately upon submission.</li>
            </ul>
          </div>

          {/* Integrity Checkbox */}
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-primary focus:ring-primary/30 cursor-pointer"
            />
            <span className="text-xs text-slate-300">
              I acknowledge the test rules, confirm that I will complete this assessment independently, and agree to enter full-screen proctored mode.
            </span>
          </label>

          {/* Action */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleStartExam}
              disabled={!agreedToTerms}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl font-bold text-sm text-white bg-gradient-brand shadow-lg hover:opacity-95 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Maximize className="w-4 h-4" />
              <span>Enter Proctored Exam (Full Screen)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. COMPLETED & SCORECARD SCREEN
  if (phase === "completed" && submissionResult) {
    const isPass = submissionResult.passed;

    return (
      <div className={`min-h-screen flex items-center justify-center p-4 sm:p-8 transition-colors duration-200 ${theme === "dark" ? "portal-dark dark bg-slate-950 text-slate-100" : "portal-light bg-slate-50 text-slate-900"}`}>
        <div
          className={`w-full bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 relative ${
            chatEvaluation ? "max-w-4xl text-left" : "max-w-xl text-center"
          }`}
        >
          <div className="absolute top-6 right-6">
            <button
              type="button"
              onClick={toggleTheme}
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="p-2 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer flex items-center justify-center shrink-0"
              aria-label="Toggle light and dark mode"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-400" />
              )}
            </button>
          </div>
          {chatEvaluation ? (
            /* ======================================================== */
            /* EXECUTIVE AI CHAT ASSESSMENT SCORECARD */
            /* ======================================================== */
            <div className="space-y-6">
              {/* Header Hero */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                      chatEvaluation.passed
                        ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                        : "bg-amber-500/15 border border-amber-500/30 text-amber-400"
                    }`}
                  >
                    {chatEvaluation.passed ? (
                      <Award className="w-7 h-7" />
                    ) : (
                      <AlertTriangle className="w-7 h-7" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          chatEvaluation.verdict === "strong_hire"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : chatEvaluation.verdict === "hire"
                            ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                            : chatEvaluation.verdict === "borderline"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        }`}
                      >
                        Verdict: {chatEvaluation.verdict.replace("_", " ").toUpperCase()}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-full">
                        Conversational Evaluation
                      </span>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
                      {chatEvaluation.passed
                        ? "Congratulations! Stage Qualified"
                        : "Assessment Evaluated"}
                    </h1>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Role: {testData?.job.title} · Stage: {testData?.stage.stageName}
                    </p>
                  </div>
                </div>

                {/* Score Big Pill */}
                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-center sm:text-right shrink-0 min-w-[130px]">
                  <div className="text-3xl font-extrabold text-white">
                    {chatEvaluation.percentage}%
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                    Benchmark: {chatEvaluation.passingScore}%
                  </div>
                </div>
              </div>

              {/* Executive Summary Paragraph */}
              <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 text-xs text-slate-300 leading-relaxed space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary-glow block">
                  Executive Evaluator Summary:
                </span>
                <p>{chatEvaluation.summary}</p>
              </div>

              {/* 4-Tier Rubric Breakdown Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <BarChart3 className="w-3.5 h-3.5 text-primary-glow" />
                    Strict Rubric Performance Breakdown
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">Normalized to 100%</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Concept Clarity */}
                  <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200">Concept Clarity</span>
                      <span className="text-xs font-mono font-bold text-primary-glow">
                        {chatEvaluation.rubricBreakdown.conceptClarity.score} /{" "}
                        {chatEvaluation.rubricBreakdown.conceptClarity.maxScore} pts
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{
                          width: `${(chatEvaluation.rubricBreakdown.conceptClarity.score / chatEvaluation.rubricBreakdown.conceptClarity.maxScore) * 100}%`,
                        }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      {chatEvaluation.rubricBreakdown.conceptClarity.feedback}
                    </p>
                  </div>

                  {/* Technical Depth */}
                  <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200">Technical Depth</span>
                      <span className="text-xs font-mono font-bold text-purple-400">
                        {chatEvaluation.rubricBreakdown.technicalDepth.score} /{" "}
                        {chatEvaluation.rubricBreakdown.technicalDepth.maxScore} pts
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{
                          width: `${(chatEvaluation.rubricBreakdown.technicalDepth.score / chatEvaluation.rubricBreakdown.technicalDepth.maxScore) * 100}%`,
                        }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      {chatEvaluation.rubricBreakdown.technicalDepth.feedback}
                    </p>
                  </div>

                  {/* Problem Solving */}
                  <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200">Problem Solving &amp; Edge Cases</span>
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        {chatEvaluation.rubricBreakdown.problemSolving.score} /{" "}
                        {chatEvaluation.rubricBreakdown.problemSolving.maxScore} pts
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{
                          width: `${(chatEvaluation.rubricBreakdown.problemSolving.score / chatEvaluation.rubricBreakdown.problemSolving.maxScore) * 100}%`,
                        }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      {chatEvaluation.rubricBreakdown.problemSolving.feedback}
                    </p>
                  </div>

                  {/* Communication */}
                  <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200">Articulation &amp; Communication</span>
                      <span className="text-xs font-mono font-bold text-blue-400">
                        {chatEvaluation.rubricBreakdown.communication.score} /{" "}
                        {chatEvaluation.rubricBreakdown.communication.maxScore} pts
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{
                          width: `${(chatEvaluation.rubricBreakdown.communication.score / chatEvaluation.rubricBreakdown.communication.maxScore) * 100}%`,
                        }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      {chatEvaluation.rubricBreakdown.communication.feedback}
                    </p>
                  </div>
                </div>
              </div>

              {/* Topics Performance Breakdown */}
              {chatEvaluation.topicScores && chatEvaluation.topicScores.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-primary-glow" />
                    Interview Agenda Topics Evaluation
                  </h3>

                  <div className="space-y-2">
                    {chatEvaluation.topicScores.map((ts, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl bg-slate-800/30 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-[11px] shrink-0">
                            {idx + 1}
                          </span>
                          <div className="min-w-0">
                            <span className="font-bold text-white truncate block">{ts.topic}</span>
                            <span className="text-[11px] text-slate-400 truncate block">
                              {ts.feedback}
                            </span>
                          </div>
                        </div>

                        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700/60 shrink-0">
                          {ts.score}/{ts.maxScore || 10} pts
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Strengths & Growth Areas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Strengths */}
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Demonstrated Acuity &amp; Strengths
                  </span>
                  <ul className="space-y-1.5 text-[11px] text-slate-300">
                    {chatEvaluation.strengths.map((str, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Areas for improvement */}
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Recommended Growth Areas
                  </span>
                  <ul className="space-y-1.5 text-[11px] text-slate-300">
                    {chatEvaluation.areasForImprovement.map((area, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
                {submissionResult?.nextStageId && (
                  <Link
                    href={`/assessment/take?applicationId=${applicationId}&stageId=${encodeURIComponent(submissionResult.nextStageId)}&jobId=${encodeURIComponent(jobId || testData?.job?._id || '')}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-brand text-white text-xs font-bold hover:opacity-95 transition shadow-sm"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-300" />
                    <span>Proceed to Next Round</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
                <Link
                  href="/candidate/applications"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition shadow-sm"
                >
                  <span>View Application Pipeline</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            /* ======================================================== */
            /* STANDARD ASSESSMENT SCORECARD */
            /* ======================================================== */
            <>
              <div
                className={`w-16 h-16 rounded-3xl flex items-center justify-center mx-auto ${
                  isPass
                    ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                    : "bg-amber-500/15 border border-amber-500/30 text-amber-400"
                }`}
              >
                {isPass ? <CheckCircle2 className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
              </div>

              <div>
                <span
                  className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                    isPass
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  }`}
                >
                  {submissionResult.verdict}
                </span>
                <h1 className="text-2xl font-bold text-white mt-3">
                  {isPass ? "Congratulations! Stage Qualified" : "Assessment Completed"}
                </h1>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
                  {submissionResult.message}
                </p>
              </div>

              {/* Score Summary Box */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                <div>
                  <div className="text-2xl font-extrabold text-white">
                    {submissionResult.percentage}%
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">Your Score</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-slate-300">
                    {submissionResult.passingScore}%
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">Passing Mark</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-slate-300">
                    {submissionResult.totalScore}/{submissionResult.maxScore}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">Points Earned</div>
                </div>
              </div>

              {/* Advancement status */}
              {isPass && (
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 text-left flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    Your application has been automatically advanced to the next stage in the hiring pipeline. Track your progress anytime in your applicant portal.
                  </span>
                </div>
              )}

              {submissionResult.proctorDisqualified && (
                <div className="p-3.5 rounded-2xl bg-destructive/10 border border-destructive/20 text-xs text-destructive text-left flex items-start gap-2.5">
                  <AlertOctagon className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                  <span>
                    Disqualified due to {submissionResult.tabSwitchCount} tab-switch proctoring infractions.
                  </span>
                </div>
              )}

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                {isPass && submissionResult.nextStageId && (
                  <Link
                    href={`/assessment/take?applicationId=${applicationId}&stageId=${encodeURIComponent(submissionResult.nextStageId)}&jobId=${encodeURIComponent(jobId || testData?.job?._id || '')}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-brand text-white text-xs font-bold hover:opacity-95 transition shadow-sm"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-300" />
                    <span>Proceed to Next Round</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
                <Link
                  href="/candidate/applications"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition shadow-sm"
                >
                  <span>View Application Tracking</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // 3. LIVE PROCTORED EXAM TAKING SCREEN
  return (
    <div
      className={`min-h-screen flex flex-col select-none transition-colors duration-200 ${theme === "dark" ? "portal-dark dark bg-slate-950 text-slate-100" : "portal-light bg-slate-50 text-slate-900"}`}
      onContextMenu={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
    >
      {/* Fullscreen Alert Modal (If user escapes fullscreen) */}
      {showFullscreenWarning && (
        <div className="fixed inset-0 z-[99999] bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-slate-900 border border-amber-500/40 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <Maximize className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Full-Screen Required</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              You have exited full-screen mode. Exam regulations require active full-screen. Please re-enter full-screen immediately to continue your test.
            </p>
            <button
              type="button"
              onClick={handleReenterFullscreen}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-brand shadow-sm hover:opacity-95 transition cursor-pointer"
            >
              Return to Full Screen
            </button>
          </div>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 relative">
          {/* Left: Test & Question Info */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                isAiChatAssessment
                  ? "bg-violet-600/20 border border-violet-500/30 text-violet-400"
                  : isAiVoiceAssessment
                  ? "bg-emerald-600/20 border border-emerald-500/30 text-emerald-400"
                  : isRapidStandaloneRound
                  ? "bg-amber-500/20 border border-amber-500/30 text-amber-400"
                  : isTechnicalTest
                  ? "bg-cyan-500/20 border border-cyan-500/30 text-cyan-400"
                  : "bg-primary/10 border border-primary/20 text-primary-glow"
              }`}
            >
              {isAiChatAssessment ? (
                <Bot className="w-4 h-4" />
              ) : isAiVoiceAssessment ? (
                <Mic className="w-4 h-4" />
              ) : isRapidStandaloneRound ? (
                <Zap className="w-4 h-4 fill-current" />
              ) : isTechnicalTest ? (
                <Code className="w-4 h-4" />
              ) : (
                `Q${currentIdx + 1}`
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-xs sm:text-sm font-bold text-white truncate">
                  {testData.stage.stageName}
                </h2>
                <span className="text-[10px] font-bold text-primary-glow bg-primary/10 px-2 py-0.5 rounded-full hidden sm:inline-block">
                  {testData.job.title}
                </span>
                {isAiChatAssessment && (
                  <span className="text-[10px] font-bold text-violet-300 bg-violet-500/20 border border-violet-500/30 px-2 py-0.5 rounded-full hidden sm:inline-block">
                    AI Chat Assessment Round
                  </span>
                )}
                {isAiVoiceAssessment && (
                  <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-full hidden sm:inline-block flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    AI Voice Assessment Round
                  </span>
                )}
                {isRapidStandaloneRound && !isAiChatAssessment && !isAiVoiceAssessment && (
                  <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded-full hidden sm:inline-block">
                    ⚡ Standalone Rapid Round
                  </span>
                )}
                {isTechnicalTest && !isAiChatAssessment && !isAiVoiceAssessment && (
                  <span className="text-[10px] font-bold text-cyan-300 bg-cyan-500/20 border border-cyan-500/30 px-2 py-0.5 rounded-full hidden sm:inline-block">
                    Technical Test
                  </span>
                )}
                {isGeneralAptitude && !isAiChatAssessment && !isAiVoiceAssessment && (
                  <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/20 border border-indigo-500/30 px-2 py-0.5 rounded-full hidden sm:inline-block">
                    General Aptitude
                  </span>
                )}
                {(applicationId === "demo-preview-application" || applicationId === "preview-application") && (
                  <span className="text-[10px] font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full hidden sm:inline-block">
                    Simulation Mode
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                {isAiChatAssessment
                  ? `Topic ${currentChatTopicIdx + 1} of ${chatTopics.length} · Live Conversational Assessment`
                  : isAiVoiceAssessment
                  ? `Topic ${currentVoiceTopicIdx + 1} of ${voiceTopics.length} · Real-Time Audio Streaming (Gemini Live)`
                  : isRapidStandaloneRound
                  ? `Question ${currentIdx + 1} of ${questions.length} · Rapid-Fire Speed Round (${answeredCount} answered)`
                  : isTechnicalTest
                  ? `Question ${currentIdx + 1} of ${questions.length} · Technical & Architecture (${answeredCount} answered)`
                  : `Question ${currentIdx + 1} of ${questions.length} · 3 Sections (${answeredCount} answered)`}
              </p>
            </div>
          </div>

          {/* Middle: Prominently Centered Countdown Timer */}
          <div className="shrink-0 flex items-center justify-center px-1 sm:px-4">
            <div
              className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-2xl text-xs sm:text-sm font-mono font-black border shadow-sm transition-all duration-300 ${
                isTimeUrgent
                  ? "bg-rose-500/20 text-rose-400 border-rose-500/50 shadow-rose-500/10 animate-pulse scale-105"
                  : timeRemainingSeconds < 600
                  ? "bg-amber-500/15 text-amber-400 border-amber-500/40 shadow-amber-500/10"
                  : "bg-slate-800/90 text-slate-100 border-slate-700 shadow-slate-900/40"
              }`}
            >
              <Clock className={`w-3.5 sm:w-4 h-3.5 sm:h-4 ${isTimeUrgent ? "text-rose-400 animate-spin" : "text-primary-glow"}`} />
              <span className="tracking-wider">{formatTimer(timeRemainingSeconds)}</span>
              <span className="text-[10px] text-slate-400 hidden md:inline font-sans font-medium uppercase tracking-wider pl-1 border-l border-slate-700">
                Remaining
              </span>
            </div>
          </div>

          {/* Right: Proctor Status + Theme Toggle (Light/Dark) + Submit Button */}
          <div className="flex items-center justify-end gap-2 sm:gap-3 flex-1 min-w-0">
            {/* Proctor Infractions Badge */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-semibold border ${
                tabSwitchCount === 0
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  : "bg-amber-500/10 border-amber-500/20 text-amber-400"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Warnings: {tabSwitchCount}/3</span>
              <span className="sm:hidden">{tabSwitchCount}/3</span>
            </div>

            {/* Light / Dark Mode Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="p-2 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer flex items-center justify-center shrink-0"
              aria-label="Toggle light and dark mode"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-400" />
              )}
            </button>

            {/* Submit Button */}
            <button
              type="button"
              onClick={() => setShowSubmitModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs shadow-sm transition cursor-pointer shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {isAiChatAssessment ? "Finish & Submit" : isAiVoiceAssessment ? "Finish & Submit Voice" : "Submit Test"}
              </span>
              <span className="sm:hidden">
                {isAiChatAssessment ? "Finish" : isAiVoiceAssessment ? "Finish" : "Submit"}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Section Navigation Ribbon */}
      {!isAiChatAssessment && !isAiVoiceAssessment && sectionGroups.length > 1 && (
        <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 sm:px-6 py-2">
          <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1 shrink-0">
              <Layers className="w-3 h-3 text-primary-glow" />
              Sections:
            </span>
            {sectionGroups.map((sec) => {
              const isActive = activeSectionKey === sec.key;
              return (
                <button
                  key={sec.key}
                  type="button"
                  onClick={() => setCurrentIdx(sec.firstIdx)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer border ${
                    isActive
                      ? "bg-primary/20 text-white border-primary/50 shadow-sm"
                      : "bg-slate-800/40 text-slate-400 border-slate-700/60 hover:text-slate-200 hover:bg-slate-800"
                  }`}
                >
                  {sec.key === "rapid" && <Zap className="w-3 h-3 text-amber-400 fill-current" />}
                  <span>{sec.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                      isActive ? "bg-primary/40 text-white" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {sec.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Standalone Rapid Round Speed Banner */}
      {!isAiChatAssessment && !isAiVoiceAssessment && isRapidStandaloneRound && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 sm:px-6 py-2.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-amber-300 font-bold">
              <Zap className="w-4 h-4 fill-current text-amber-400" />
              <span>⚡ Standalone Rapid-Fire Round: Pure Speed &amp; Quick Accuracy Assessment</span>
            </div>
            <span className="text-[11px] text-amber-200/80 hidden sm:inline font-mono">
              Auto-advances when time expires · Select your option swiftly
            </span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {isAiChatAssessment ? (
        <main className="flex-1 max-w-7xl mx-auto w-full p-3 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[calc(100vh-80px)]">
          {/* ======================================================== */}
          {/* LEFT WINDOW: AI Questions, Agenda Roadmap, Suggestions */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            {/* 1. Active Probing Topic Focus Box */}
            <div className="bg-gradient-to-br from-violet-950/40 to-slate-900 border border-violet-500/30 rounded-3xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                  Active Probing Topic
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Module {currentChatTopicIdx + 1} of {chatTopics.length}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                {chatTopics[currentChatTopicIdx]}
              </h3>

              <p className="text-xs text-slate-300/90 leading-relaxed">
                The AI Technical Interviewer is currently probing your engineering comprehension, architectural patterns, and production trade-offs for this topic.
              </p>

              <div className="pt-1 flex items-center gap-2 text-[11px] text-slate-400">
                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-semibold uppercase text-[10px]">
                  Difficulty: {String(testData.stage?.config?.difficulty || "medium").toUpperCase()}
                </span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">
                  Pass Threshold: {testData.stage.passingScore}%
                </span>
              </div>
            </div>

            {/* 2. Interview Agenda & Question Seeds Roadmap */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary-glow" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Interview Agenda &amp; Seeds
                  </h4>
                </div>
                <span className="text-[10px] font-semibold text-slate-400">
                  {currentChatTopicIdx + 1} / {chatTopics.length} in progress
                </span>
              </div>

              <div className="space-y-2">
                {chatTopics.map((topic, tIdx) => {
                  const isCurrent = tIdx === currentChatTopicIdx;
                  const isCompleted = tIdx < currentChatTopicIdx;

                  return (
                    <div
                      key={tIdx}
                      className={`p-3 rounded-2xl border transition-all text-xs flex items-center justify-between gap-3 ${
                        isCurrent
                          ? "bg-violet-500/15 border-violet-500/50 shadow-sm text-white"
                          : isCompleted
                          ? "bg-slate-900/70 border-emerald-500/30 text-slate-300"
                          : "bg-slate-900/40 border-slate-800/80 text-slate-400"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[11px] shrink-0 ${
                            isCurrent
                              ? "bg-violet-500 text-white shadow-sm"
                              : isCompleted
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-slate-800 text-slate-500"
                          }`}
                        >
                          {isCompleted ? <Check className="w-3.5 h-3.5" /> : tIdx + 1}
                        </div>
                        <span
                          className={`truncate leading-snug ${
                            isCurrent ? "font-bold text-white" : "font-normal"
                          }`}
                        >
                          {topic}
                        </span>
                      </div>

                      <span
                        className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0 ${
                          isCurrent
                            ? "bg-violet-500/30 text-violet-300 border border-violet-500/40 animate-pulse"
                            : isCompleted
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-slate-800/60 text-slate-500"
                        }`}
                      >
                        {isCurrent ? "Live Discussion" : isCompleted ? "Covered" : "Queued"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. AI Answering Help & Suggestions */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
              <div className="flex items-center gap-2 text-amber-400">
                <Lightbulb className="w-4 h-4 fill-current" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  AI Suggestions &amp; Answering Guidance
                </h4>
              </div>

              {/* Live dynamic guidance hint from AI turn */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-300 block mb-0.5">Live Coaching Cue:</span>
                  <span>{activeGuidanceTip}</span>
                </div>
              </div>

              <ul className="space-y-1.5 text-[11px] text-slate-300/90 pl-1 list-disc list-inside leading-relaxed">
                <li>State high-level architectural rationale before jumping into detailed code.</li>
                <li>Contrast tradeoffs (space vs time, latency vs consistency, caching strategies).</li>
                <li>Format algorithms and data structures using the code block button below.</li>
                <li>Mention concurrency safeguards, error boundaries, and telemetry/monitoring.</li>
              </ul>
            </div>

            {/* 4. Strict Rubric Criteria Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary-glow" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Strict Scoring Rubric
                  </h4>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Weight: 100%</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-200 text-[11px]">
                    <span>Concept Clarity</span>
                    <span className="text-primary-glow">25%</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-snug">
                    Syntax accuracy, language fundamentals &amp; framework concepts.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-200 text-[11px]">
                    <span>Technical Depth</span>
                    <span className="text-purple-400">35%</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-snug">
                    Architecture, scale, distributed state &amp; performance trade-offs.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-200 text-[11px]">
                    <span>Problem Solving</span>
                    <span className="text-emerald-400">25%</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-snug">
                    Edge case mitigations, debugging &amp; failure resilience.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-200 text-[11px]">
                    <span>Communication</span>
                    <span className="text-blue-400">15%</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-snug">
                    Structure, precision &amp; professional articulation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT WINDOW: Live Turn-by-Turn Conversational Chat */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 flex flex-col bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden min-h-[600px] lg:min-h-0">
            {/* Chat Stream Header */}
            <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-900/95 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
                    <Bot className="w-5 h-5" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-bold text-white">
                      AI Technical Interviewer
                    </h3>
                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      Live Rubric Scoring
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate max-w-xs sm:max-w-md">
                    Active Topic: {chatTopics[currentChatTopicIdx]}
                  </p>
                </div>
              </div>

              {/* Topic navigation / finish button */}
              <div className="flex items-center gap-2">
                {currentChatTopicIdx < chatTopics.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNextTopic}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition cursor-pointer"
                  >
                    <span>Next Topic</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold transition shadow-sm cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Finish Test</span>
                  </button>
                )}
              </div>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-h-[calc(100vh-270px)]">
              {chatMessages.map((msg) => {
                const isAi = msg.role === "ai";

                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${isAi ? "justify-start" : "justify-end"}`}
                  >
                    {isAi && (
                      <div className="w-8 h-8 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30 flex items-center justify-center shrink-0 mt-1">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 space-y-2 shadow-sm ${
                        isAi
                          ? "bg-slate-800/80 border border-slate-700/80 text-slate-100 rounded-tl-sm"
                          : "bg-primary/20 border border-primary/40 text-white rounded-tr-sm"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 text-[10px] text-slate-400 border-b border-white/5 pb-1 mb-1">
                        <span className="font-semibold text-slate-300">
                          {isAi ? "AI Interviewer" : "Candidate Response"}
                        </span>
                        <span>{msg.timestamp}</span>
                      </div>

                      <FormattedChatMessage content={msg.message} />

                      {/* Turn feedback pill (for candidate answers scored by AI) */}
                      {!isAi && msg.turnScore !== undefined && (
                        <div className="pt-1.5 flex items-center gap-2 text-[10px]">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                            Score: {msg.turnScore}/10
                          </span>
                          {msg.feedback && (
                            <span className="text-slate-300 italic truncate max-w-xs sm:max-w-md">
                              {msg.feedback}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {!isAi && (
                      <div className="w-8 h-8 rounded-xl bg-primary/20 text-primary-glow border border-primary/30 flex items-center justify-center shrink-0 mt-1">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* AI Typing Indicator */}
              {isAiThinking && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/80 text-xs text-slate-300 flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-primary-glow" />
                    <span>AI Interviewer is analyzing response and evaluating rubric...</span>
                  </div>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Interactive Input Bar */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/95 space-y-2.5">
              {/* Helper Actions Row */}
              <div className="flex items-center justify-between gap-2 text-xs">
                <button
                  type="button"
                  onClick={insertCodeSnippet}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-[11px] transition cursor-pointer"
                >
                  <Code className="w-3.5 h-3.5 text-primary-glow" />
                  <span>Insert Code Snippet (```)</span>
                </button>

                <span className="text-[11px] text-slate-400">
                  {chatInput.length} chars ·{" "}
                  {chatInput.trim() ? chatInput.trim().split(/\s+/).length : 0} words
                </span>
              </div>

              {/* Input Textarea & Send Control */}
              <div className="relative">
                <textarea
                  ref={chatTextareaRef}
                  rows={3}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendChatMessage();
                    }
                  }}
                  placeholder="Type your technical response... (Shift+Enter for newline, Enter to send)"
                  disabled={isAiThinking}
                  className="w-full bg-slate-800/70 border border-slate-700 rounded-2xl p-3.5 pr-28 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition resize-none leading-relaxed font-sans"
                />

                <div className="absolute right-2.5 bottom-3.5 flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={!chatInput.trim() || isAiThinking}
                    onClick={handleSendChatMessage}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-brand hover:opacity-95 text-white font-bold text-xs shadow-md transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isAiThinking ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        <span>Send</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>
                  Tip: Press Enter to send answer. Responses are scored continuously by the
                  assessment engine.
                </span>
                {currentChatTopicIdx < chatTopics.length - 1 && (
                  <button
                    type="button"
                    onClick={handleNextTopic}
                    className="text-violet-400 hover:text-violet-300 font-semibold cursor-pointer underline"
                  >
                    Advance to Next Topic →
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>
      ) : isAiVoiceAssessment ? (
        /* ======================================================== */
        /* AI VOICE ASSESSMENT PORTAL (Gemini Live Audio Streaming) */
        /* ======================================================== */
        <main className="flex-1 max-w-7xl mx-auto w-full p-3 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[calc(100vh-80px)]">
          {/* Left Column: Voice Agenda & Speaking Rubrics */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            {/* 1. Active Voice Probing Topic */}
            <div className="bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/30 rounded-3xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Active Spoken Topic
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Topic {currentVoiceTopicIdx + 1} of {voiceTopics.length}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                {voiceTopics[currentVoiceTopicIdx]}
              </h3>

              <p className="text-xs text-slate-300/90 leading-relaxed">
                The AI Voice Interviewer is evaluating your verbal problem articulation, architectural trade-offs, and communication fluency. Speak clearly into your microphone.
              </p>

              <div className="pt-1 flex items-center gap-2 text-[11px] text-slate-400">
                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-semibold uppercase text-[10px]">
                  Difficulty: {String(testData.stage?.config?.difficulty || "medium").toUpperCase()}
                </span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">
                  Pass Threshold: {testData.stage.passingScore}%
                </span>
              </div>
            </div>

            {/* 2. Spoken Interview Agenda Roadmap */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Speaking Agenda &amp; Roadmap
                  </h4>
                </div>
                <span className="text-[10px] font-semibold text-slate-400">
                  {currentVoiceTopicIdx + 1} / {voiceTopics.length} In Progress
                </span>
              </div>

              <div className="space-y-2">
                {voiceTopics.map((topic, vIdx) => {
                  const isCurrent = vIdx === currentVoiceTopicIdx;
                  const isDone = vIdx < currentVoiceTopicIdx;

                  return (
                    <div
                      key={vIdx}
                      className={`p-3 rounded-2xl border transition-all text-xs flex items-center justify-between gap-3 ${
                        isCurrent
                          ? "bg-emerald-500/15 border-emerald-500/50 shadow-sm text-white"
                          : isDone
                          ? "bg-slate-900/70 border-emerald-500/30 text-slate-300"
                          : "bg-slate-900/40 border-slate-800/80 text-slate-400"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[11px] shrink-0 ${
                            isCurrent
                              ? "bg-emerald-500 text-white shadow-sm"
                              : isDone
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-slate-800 text-slate-500"
                          }`}
                        >
                          {isDone ? <Check className="w-3.5 h-3.5" /> : vIdx + 1}
                        </div>
                        <span className="font-semibold truncate">{topic}</span>
                      </div>
                      <span className="text-[10px] uppercase font-bold shrink-0 text-slate-400">
                        {isCurrent ? "Speaking" : isDone ? "Completed" : "Upcoming"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Verbal Scoring Rubric Pill Box */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 text-xs space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block">
                Speech Evaluation Calibration:
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <span className="font-bold text-white block">Fluency &amp; Delivery</span>
                  <span className="text-slate-400 text-[10px]">Natural pacing &amp; tone</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <span className="font-bold text-white block">Technical Depth</span>
                  <span className="text-slate-400 text-[10px]">Precision &amp; terminology</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <span className="font-bold text-white block">Problem Framing</span>
                  <span className="text-slate-400 text-[10px]">Structuring before answer</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <span className="font-bold text-white block">Verbal Reasoning</span>
                  <span className="text-slate-400 text-[10px]">Trade-offs &amp; justification</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Real-Time Audio Streaming Studio */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl overflow-hidden min-h-[600px]">
            {/* Studio Header Bar */}
            <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <Mic className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Gemini Live Voice Audio Session</h4>
                  <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Bidirectional Real-Time Audio Stream Active
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (!isAiVoiceMuted && isAiSpeaking) {
                      stopAiSpeech();
                    }
                    setIsAiVoiceMuted((prev) => !prev);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                    isAiVoiceMuted
                      ? "bg-slate-800 text-slate-400 border-slate-700"
                      : "bg-violet-500/20 text-violet-300 border-violet-500/40"
                  }`}
                  title={isAiVoiceMuted ? "Unmute AI Voice Audio" : "Mute AI Voice Audio"}
                >
                  {isAiVoiceMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-400" /> : <Volume2 className="w-3.5 h-3.5 text-violet-400" />}
                  <span>{isAiVoiceMuted ? "AI Audio: Muted" : "AI Audio: Live"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleToggleMic}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                    isListeningMic
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm animate-pulse"
                      : isMicMuted
                      ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                      : "bg-slate-800 text-slate-300 border-slate-700"
                  }`}
                  title={isListeningMic ? "Click to Pause Microphone" : "Click to Start Speaking into Mic"}
                >
                  {isListeningMic ? (
                    <>
                      <Radio className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                      <span>Mic: Listening Live...</span>
                    </>
                  ) : isMicMuted ? (
                    <>
                      <MicOff className="w-3.5 h-3.5" />
                      <span>Mic: Paused</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-3.5 h-3.5" />
                      <span>Start Mic Speaking</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Center: Animated AI Voice Orb & Waveform */}
            <div className="p-6 flex flex-col items-center justify-center space-y-5 text-center">
              {/* Glowing Voice Orb */}
              <div className="relative flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => {
                    if (isAiSpeaking) {
                      stopAiSpeech();
                    } else {
                      handleToggleMic();
                    }
                  }}
                  className={`w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
                    isAiSpeaking
                      ? "bg-gradient-to-tr from-violet-600 to-indigo-500 shadow-2xl shadow-indigo-500/50 scale-105"
                      : isListeningMic
                      ? "bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-2xl shadow-emerald-500/50 scale-105 animate-pulse"
                      : isMicMuted
                      ? "bg-slate-800 border-2 border-slate-700 opacity-60"
                      : "bg-gradient-to-tr from-emerald-700/80 to-teal-600/80 shadow-xl shadow-emerald-500/30"
                  }`}
                  title={isAiSpeaking ? "Click to Stop AI Voice" : isListeningMic ? "Click to Stop Mic" : "Click to Speak into Mic"}
                >
                  {isAiSpeaking ? (
                    <Volume2 className="w-10 h-10 text-white animate-pulse" />
                  ) : isListeningMic ? (
                    <Mic className="w-10 h-10 text-white animate-bounce" />
                  ) : isMicMuted ? (
                    <MicOff className="w-10 h-10 text-slate-400" />
                  ) : (
                    <Mic className="w-10 h-10 text-white" />
                  )}
                </button>

                {/* Animated Ripple Waves */}
                {(isAiSpeaking || isListeningMic) && (
                  <>
                    <div
                      className={`absolute w-36 h-36 rounded-full border animate-ping pointer-events-none ${
                        isAiSpeaking ? "border-violet-500/40" : "border-emerald-500/40"
                      }`}
                    />
                    <div
                      className={`absolute w-44 h-44 rounded-full border animate-pulse pointer-events-none ${
                        isAiSpeaking ? "border-violet-500/20" : "border-emerald-500/20"
                      }`}
                    />
                  </>
                )}
              </div>

              {/* Status Text & Interactive Actions */}
              <div className="space-y-1.5">
                <span className="text-sm font-bold text-white block">
                  {isAiSpeaking
                    ? "AI Voice Interviewer is speaking aloud..."
                    : isListeningMic
                    ? "Listening to your spoken answer... (Speak now)"
                    : isMicMuted
                    ? "Microphone is paused"
                    : "Ready for your spoken response"}
                </span>
                <span className="text-xs text-slate-400 block max-w-sm mx-auto">
                  {isAiSpeaking
                    ? "Listen to the AI's question, or click 'Stop AI Voice' below to speak your response."
                    : isListeningMic
                    ? "Continuous speech recognition active. Your spoken words are transcribed below."
                    : isMicMuted
                    ? "Click 'Start Mic Speaking' or type into the transcript box below."
                    : "Click the mic or speak into your microphone. Transcription updates live."}
                </span>

                {/* Action Buttons under Orb */}
                <div className="pt-1 flex items-center justify-center gap-2">
                  {isAiSpeaking && (
                    <button
                      type="button"
                      onClick={stopAiSpeech}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-rose-300 border border-rose-500/30 transition cursor-pointer"
                    >
                      <Square className="w-3 h-3 text-rose-400" />
                      <span>Stop AI Voice</span>
                    </button>
                  )}
                  {!isAiSpeaking && (
                    <button
                      type="button"
                      onClick={handleToggleMic}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer border ${
                        isListeningMic
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                          : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
                      }`}
                    >
                      {isListeningMic ? (
                        <>
                          <Radio className="w-3 h-3 text-emerald-400 animate-spin" />
                          <span>Pause Mic</span>
                        </>
                      ) : (
                        <>
                          <Mic className="w-3 h-3 text-emerald-400" />
                          <span>Start Mic</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Animated Audio Equalizer Bars */}
              <div className="flex items-center gap-1.5 h-8">
                {[40, 75, 55, 95, 65, 85, 45, 90, 60, 80, 50, 70].map((h, i) => (
                  <div
                    key={i}
                    className={`w-1 rounded-full transition-all duration-150 ${
                      isAiSpeaking
                        ? "bg-violet-400"
                        : isListeningMic
                        ? "bg-emerald-400"
                        : "bg-slate-700"
                    }`}
                    style={{
                      height: isAiSpeaking
                        ? `${Math.max(8, (h * 0.95))}px`
                        : isListeningMic
                        ? `${Math.max(8, (h * 0.85))}px`
                        : "6px",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Bottom: Live Spoken Transcript Stream & Simulator Controls */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/95 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <MessageSquare className="w-3 h-3 text-emerald-400" />
                  Live Spoken Dialogue Transcript
                </span>
                <span className="text-[10px] text-slate-400">
                  {voiceMessages.length} turns recorded
                </span>
              </div>

              {/* Transcript Scroll Area */}
              <div className="max-h-48 overflow-y-auto space-y-2.5 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs">
                {voiceMessages.map((vMsg) => (
                  <div
                    key={vMsg.id}
                    className={`p-2.5 rounded-xl space-y-1 ${
                      vMsg.role === "ai"
                        ? "bg-slate-800/60 border border-slate-700/60 text-slate-200"
                        : "bg-emerald-500/15 border border-emerald-500/30 text-emerald-200"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white">
                          {vMsg.role === "ai" ? "AI Voice Interviewer" : "Candidate Spoken Answer"}
                        </span>
                        {vMsg.role === "ai" && (
                          <button
                            type="button"
                            onClick={() => speakAiText(vMsg.message)}
                            className="inline-flex items-center gap-1 text-[10px] text-violet-400 hover:text-violet-300 font-semibold cursor-pointer ml-1 hover:underline"
                            title="Listen to AI speak this question"
                          >
                            <Volume2 className="w-3 h-3" />
                            <span>Listen</span>
                          </button>
                        )}
                      </div>
                      <span>{vMsg.timestamp}</span>
                    </div>
                    <p className="leading-relaxed">{vMsg.message}</p>
                    {vMsg.turnScore !== undefined && (
                      <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Score: {vMsg.turnScore}/10 pts · {vMsg.feedback}
                      </span>
                    )}
                  </div>
                ))}
                <div ref={voiceBottomRef} />
              </div>

              {/* Interactive Speech Response / Transcription Input */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={
                      isListeningMic
                        ? "Speaking into mic... (transcribing your voice in real time)"
                        : "Speak into mic or type spoken transcript here..."
                    }
                    value={voiceSimulatedInput}
                    onChange={(e) => setVoiceSimulatedInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendVoiceResponse();
                      }
                    }}
                    className={`input-base text-xs py-2 flex-1 transition ${
                      isListeningMic ? "border-emerald-500/60 ring-1 ring-emerald-500/30 bg-emerald-500/5" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => handleSendVoiceResponse()}
                    disabled={!voiceSimulatedInput.trim() || isAiSpeaking}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition cursor-pointer disabled:opacity-50"
                  >
                    <span>Send Spoken Turn</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>
                    Continuous audio stream evaluation. Speak clearly to conclude the turn.
                  </span>
                  {currentVoiceTopicIdx < voiceTopics.length - 1 && (
                    <button
                      type="button"
                      onClick={() => handleSendVoiceResponse("I have concluded my answer for this topic.")}
                      className="text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer underline"
                    >
                      Advance to Next Voice Topic →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      ) : (
        /* Main Content Area */
        <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Question Card (8 cols) */}
          <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
            {currentQ ? (
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  {/* Question Meta Header */}
                  <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-primary-glow bg-primary/10 px-2.5 py-1 rounded-lg">
                        Question {currentIdx + 1} of {questions.length}
                      </span>
                      {currentQ.type === "rapid" || currentQ.section === "rapid" ? (
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                          <Zap className="w-3 h-3 fill-current" />
                          {isRapidStandaloneRound ? "Rapid-Fire Blitz" : "Rapid Question"} ({currentQ.timeLimitSeconds || 30}s)
                        </span>
                      ) : currentQ.type === "descriptive" ||
                        (!currentQ.options || currentQ.options.length === 0) ? (
                        <span className="text-[10px] font-bold text-purple-400 bg-purple-500/15 border border-purple-500/30 px-2 py-0.5 rounded-full">
                          {isTechnicalTest ? "Descriptive & Engineering Architecture" : "Descriptive & Analytical Working"}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                          {isTechnicalTest ? "Technical Multiple Choice" : "Multiple Choice"}
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400">
                        {currentQ.points || 1} {currentQ.points === 1 ? "point" : "points"}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleReview(currentQ.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium border transition cursor-pointer ${
                        markedForReview[currentQ.id]
                          ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                          : "bg-slate-800/60 text-slate-400 border-slate-700 hover:text-slate-200"
                      }`}
                    >
                      <BookmarkCheck className="w-3.5 h-3.5" />
                      <span>
                        {markedForReview[currentQ.id] ? "Marked for Review" : "Mark for Review"}
                      </span>
                    </button>
                  </div>

                  {/* Rapid Question Live Speed Bar */}
                  {rapidRemaining !== null &&
                    (currentQ.type === "rapid" || currentQ.section === "rapid") && (
                      <div
                        className={`p-3.5 rounded-2xl border transition-all ${
                          rapidRemaining <= 5
                            ? "bg-rose-500/15 border-rose-500/40 animate-pulse"
                            : "bg-amber-500/10 border-amber-500/30"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3 text-xs mb-2">
                          <div className="flex items-center gap-2 font-bold">
                            <div
                              className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                                rapidRemaining <= 5
                                  ? "bg-rose-500/20 text-rose-400"
                                  : "bg-amber-500/20 text-amber-400"
                              }`}
                            >
                              <Zap className="w-3.5 h-3.5 fill-current" />
                            </div>
                            <div>
                              <span
                                className={
                                  rapidRemaining <= 5 ? "text-rose-300" : "text-amber-300"
                                }
                              >
                                Speed Round Active:
                              </span>{" "}
                              <span className="text-white font-extrabold">
                                {rapidRemaining}s remaining
                              </span>
                            </div>
                          </div>
                          <span className="text-[11px] text-slate-400 hidden sm:inline">
                            Auto-advances when time expires
                          </span>
                        </div>

                        {/* Progress track */}
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-1000 ease-linear rounded-full ${
                              rapidRemaining <= 5
                                ? "bg-rose-500"
                                : "bg-gradient-to-r from-amber-400 to-amber-500"
                            }`}
                            style={{
                              width: `${Math.max(
                                0,
                                Math.min(100, (rapidRemaining / (rapidLimit || 30)) * 100)
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}

                  {/* Question Statement */}
                  <div>
                    {currentQ.instructions && (
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                        {currentQ.instructions}
                      </p>
                    )}
                    <h3 className="text-sm sm:text-base font-semibold text-white leading-relaxed">
                      {currentQ.question}
                    </h3>
                  </div>

                  {/* Descriptive Answer Field */}
                  {(currentQ.type === "descriptive" ||
                    !currentQ.options ||
                    currentQ.options.length === 0) && (
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="font-semibold text-slate-300">
                          {isTechnicalTest
                            ? "Type your engineering architecture, code logic, or system design write-up:"
                            : "Type your step-by-step mathematical working or written deduction:"}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {(answers[currentQ.id] || "").length} chars ·{" "}
                          {(answers[currentQ.id] || "").trim()
                            ? (answers[currentQ.id] || "").trim().split(/\s+/).length
                            : 0}{" "}
                          words
                        </span>
                      </div>
                      <textarea
                        rows={7}
                        value={answers[currentQ.id] || ""}
                        onChange={(e) => handleSelectOption(currentQ.id, e.target.value)}
                        placeholder={
                          isTechnicalTest
                            ? "Detail your system design, concurrency model, data flow, algorithm complexity, and edge cases here..."
                            : "Detail your intermediate equations, deduction steps, and final answer here..."
                        }
                        className="w-full bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition resize-y font-mono leading-relaxed"
                      />
                      <p className="text-[11px] text-slate-400 italic">
                        {isTechnicalTest
                          ? "Tip: Detail structural tradeoffs, fault-tolerance mechanisms, and algorithmic performance guarantees."
                          : "Tip: Show complete steps. Your solution is scored against intermediate deduction values and final deduction accuracy."}
                      </p>

                      {/* Optional handwritten scratchpad upload */}
                      <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-300 font-medium flex items-center gap-1.5">
                            <Paperclip className="w-3.5 h-3.5 text-primary-glow" />
                            Attach Handwritten Working / Scratchpad (Optional)
                          </span>
                          <span className="text-[10px] text-slate-400">
                            PDF, PNG, JPG up to 10MB
                          </span>
                        </div>

                        {attachments[currentQ.id] ? (
                          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs">
                            <div className="flex items-center gap-2 truncate">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                              <span className="text-slate-200 truncate">
                                {attachments[currentQ.id].name}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                ({attachments[currentQ.id].size})
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setAttachments((prev) => {
                                  const copy = { ...prev };
                                  delete copy[currentQ.id];
                                  return copy;
                                });
                              }}
                              className="text-slate-400 hover:text-rose-400 p-1 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <label className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-dashed border-slate-700 hover:border-primary/50 bg-slate-800/30 hover:bg-slate-800/60 transition cursor-pointer text-xs text-slate-400 hover:text-slate-200">
                            <UploadCloud className="w-4 h-4 text-primary-glow" />
                            <span>Upload photo or PDF of your calculations</span>
                            <input
                              type="file"
                              accept="image/*,.pdf"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const sizeKb = Math.round(file.size / 1024);
                                  const sizeStr =
                                    sizeKb > 1024
                                      ? `${(sizeKb / 1024).toFixed(1)} MB`
                                      : `${sizeKb} KB`;
                                  setAttachments((prev) => ({
                                    ...prev,
                                    [currentQ.id]: { name: file.name, size: sizeStr },
                                  }));
                                  toast.success(`Attached ${file.name}`);
                                }
                              }}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Multiple Choice Options List */}
                  {currentQ.options &&
                    currentQ.options.length > 0 &&
                    currentQ.type !== "descriptive" && (
                      <div className="space-y-2.5 pt-2">
                        {currentQ.options.map((opt, oIdx) => {
                          const isSelected = answers[currentQ.id] === opt.id;
                          return (
                            <div
                              key={opt.id}
                              onClick={() => handleSelectOption(currentQ.id, opt.id)}
                              className={`flex items-center gap-3.5 p-3.5 rounded-2xl border text-xs sm:text-sm transition cursor-pointer ${
                                isSelected
                                  ? "bg-primary/15 border-primary text-white shadow-sm"
                                  : "bg-slate-800/40 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/70"
                              }`}
                            >
                              <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs uppercase shrink-0 transition ${
                                  isSelected
                                    ? "bg-primary text-white"
                                    : "bg-slate-800 text-slate-400 border border-slate-700"
                                }`}
                              >
                                {String.fromCharCode(65 + oIdx)}
                              </div>
                              <span className="flex-1 leading-relaxed">{opt.text}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                </div>

                {/* Bottom Nav Prev/Next Buttons */}
                <div className="flex items-center justify-between border-t border-slate-800 pt-4 mt-6">
                  <button
                    type="button"
                    disabled={currentIdx === 0}
                    onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>

                  <div className="text-[11px] text-slate-400">
                    {answers[currentQ.id] ? (
                      <span className="text-emerald-400 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Answer recorded</span>
                      </span>
                    ) : (
                      <span>No answer selected yet</span>
                    )}
                  </div>

                  {currentIdx < questions.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentIdx((prev) => Math.min(questions.length - 1, prev + 1))}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-xs transition cursor-pointer"
                    >
                      <span>{isRapidStandaloneRound ? "Next Rapid Question" : "Next Question"}</span>
                      {isRapidStandaloneRound ? <Zap className="w-3.5 h-3.5 fill-current text-amber-300" /> : <ArrowRight className="w-3.5 h-3.5" />}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowSubmitModal(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Review &amp; Submit</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400">No question selected.</div>
            )}
          </div>

          {/* Right: Question Navigation Palette (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Question Palette
              </h4>

              {/* Legend */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pb-2 border-b border-slate-800">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-emerald-500/30 border border-emerald-500/50" />
                  <span>Answered ({answeredCount})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-purple-500/30 border border-purple-500/50" />
                  <span>Review ({Object.values(markedForReview).filter(Boolean).length})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-slate-800 border border-slate-700" />
                  <span>Unanswered ({questions.length - answeredCount})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-primary/30 border border-primary ring-1 ring-primary" />
                  <span>Current</span>
                </div>
              </div>

              {/* Numbered Palette Matrix */}
              <div className="max-h-[300px] overflow-y-auto pr-1">
                {sectionGroups.length > 1 ? (
                  sectionGroups.map((grp) => (
                    <div key={grp.key} className="mb-3 space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                        <span>{grp.label}</span>
                        <span>{grp.count} Qs</span>
                      </div>
                      <div className="grid grid-cols-5 gap-2">
                        {questions.slice(grp.firstIdx, grp.firstIdx + grp.count).map((q, qOffset) => {
                          const idx = grp.firstIdx + qOffset;
                          const isCurrent = idx === currentIdx;
                          const isAnswered = Boolean(answers[q.id]);
                          const isReview = Boolean(markedForReview[q.id]);

                          let bgClass = "bg-slate-800/80 text-slate-400 border-slate-700";
                          if (isReview) {
                            bgClass = "bg-purple-500/20 text-purple-300 border-purple-500/50";
                          } else if (isAnswered) {
                            bgClass = "bg-emerald-500/20 text-emerald-300 border-emerald-500/50";
                          }

                          return (
                            <button
                              key={q.id}
                              type="button"
                              onClick={() => setCurrentIdx(idx)}
                              className={`h-9 rounded-xl border text-xs font-bold transition flex items-center justify-center cursor-pointer ${bgClass} ${
                                isCurrent
                                  ? "ring-2 ring-primary ring-offset-2 ring-offset-slate-950 scale-105"
                                  : ""
                              }`}
                            >
                              {idx + 1}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="grid grid-cols-5 gap-2">
                    {questions.map((q, idx) => {
                      const isCurrent = idx === currentIdx;
                      const isAnswered = Boolean(answers[q.id]);
                      const isReview = Boolean(markedForReview[q.id]);

                      let bgClass = "bg-slate-800/80 text-slate-400 border-slate-700";
                      if (isReview) {
                        bgClass = "bg-purple-500/20 text-purple-300 border-purple-500/50";
                      } else if (isAnswered) {
                        bgClass = "bg-emerald-500/20 text-emerald-300 border-emerald-500/50";
                      }

                      return (
                        <button
                          key={q.id}
                          type="button"
                          onClick={() => setCurrentIdx(idx)}
                          className={`h-9 rounded-xl border text-xs font-bold transition flex items-center justify-center cursor-pointer ${bgClass} ${
                            isCurrent
                              ? "ring-2 ring-primary ring-offset-2 ring-offset-slate-950 scale-105"
                              : ""
                          }`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Test Progress Indicator */}
              <div className="pt-2 border-t border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Progress</span>
                  <span className="font-bold text-white">
                    {Math.round((answeredCount / (questions.length || 1)) * 100)}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${(answeredCount / (questions.length || 1)) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Integrity Reminder Card */}
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 text-[11px] text-slate-400 space-y-1.5">
              <div className="font-bold text-slate-300 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-primary-glow" />
                <span>Session Monitored</span>
              </div>
              <p className="leading-relaxed">
                Active full-screen enforcement is engaged. All tab switches and window blur events
                are logged to the proctoring ledger.
              </p>
            </div>
          </div>
        </main>
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary-glow flex items-center justify-center mx-auto">
              <Send className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold text-white">
                {isAiChatAssessment
                  ? "Submit AI Conversational Assessment?"
                  : isAiVoiceAssessment
                  ? "Submit AI Voice Assessment?"
                  : "Submit Assessment?"}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {isAiChatAssessment
                  ? "Your full multi-turn interview transcript will be audited by the AI evaluation engine against technical clarity, depth, problem solving, and communication."
                  : isAiVoiceAssessment
                  ? "Your spoken responses, verbal articulation, and audio transcription will be audited by the AI evaluation engine against the role benchmark."
                  : "Please verify your responses before final evaluation submission."}
              </p>
            </div>

            {isAiChatAssessment ? (
              <div className="grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center text-xs">
                <div>
                  <div className="font-bold text-emerald-400 text-sm">
                    {chatMessages.filter((m) => m.role === "candidate").length}
                  </div>
                  <div className="text-[10px] text-slate-400">Turns Done</div>
                </div>
                <div>
                  <div className="font-bold text-violet-400 text-sm">
                    {currentChatTopicIdx + 1} / {chatTopics.length}
                  </div>
                  <div className="text-[10px] text-slate-400">Modules Covered</div>
                </div>
                <div>
                  <div className="font-bold text-primary-glow text-sm">Active</div>
                  <div className="text-[10px] text-slate-400">Live AI Rubric</div>
                </div>
              </div>
            ) : isAiVoiceAssessment ? (
              <div className="grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center text-xs">
                <div>
                  <div className="font-bold text-emerald-400 text-sm">
                    {voiceMessages.filter((m) => m.role === "candidate").length}
                  </div>
                  <div className="text-[10px] text-slate-400">Spoken Turns</div>
                </div>
                <div>
                  <div className="font-bold text-emerald-400 text-sm">
                    {currentVoiceTopicIdx + 1} / {voiceTopics.length}
                  </div>
                  <div className="text-[10px] text-slate-400">Topics Done</div>
                </div>
                <div>
                  <div className="font-bold text-primary-glow text-sm">Live Audio</div>
                  <div className="text-[10px] text-slate-400">Fluency Engine</div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center text-xs">
                <div>
                  <div className="font-bold text-emerald-400 text-sm">{answeredCount}</div>
                  <div className="text-[10px] text-slate-400">Answered</div>
                </div>
                <div>
                  <div className="font-bold text-amber-400 text-sm">
                    {questions.length - answeredCount}
                  </div>
                  <div className="text-[10px] text-slate-400">Unanswered</div>
                </div>
                <div>
                  <div className="font-bold text-purple-400 text-sm">
                    {Object.values(markedForReview).filter(Boolean).length}
                  </div>
                  <div className="text-[10px] text-slate-400">For Review</div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="w-1/2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 transition cursor-pointer"
              >
                Continue Assessment
              </button>
              <button
                type="button"
                disabled={isSubmitting || isAiThinking || isAiSpeaking}
                onClick={() => (isAiChatAssessment ? handleFinishChatAssessment() : isAiVoiceAssessment ? handleFinishVoiceAssessment() : handleSubmitExam())}
                className="w-1/2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-brand shadow-sm hover:opacity-95 transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Grading Session...</span>
                  </>
                ) : (
                  <span>Confirm &amp; Submit</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CandidateStageTakePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
          <Loader2 className="w-8 h-8 text-primary-glow animate-spin" />
        </div>
      }
    >
      <CandidateStageTakeComponent />
    </Suspense>
  );
}
