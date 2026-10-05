"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Download,
  Plus,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  Eye,
  FileText,
  UserCheck,
  Building2,
  GraduationCap,
  Briefcase,
  Fingerprint,
  Scale,
  RefreshCw,
  X,
  Sparkles,
  Info,
  ArrowRight,
  Send,
  Calendar,
  Mail,
  Phone,
  MapPin,
  HelpCircle,
  FileCheck2,
} from "lucide-react";
import { toast } from "sonner";

export type BGVOverallStatus = "cleared" | "in_progress" | "discrepancy";
export type SingleCheckStatus = "cleared" | "in_progress" | "discrepancy" | "pending";

export interface CheckItem {
  status: SingleCheckStatus;
  provider: string;
  verifiedAt?: string;
  badge: string;
  details?: string;
  discrepancyNote?: string;
}

export interface BGVCandidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  appliedRole: string;
  currentCompany: string;
  experience: string;
  overallStatus: BGVOverallStatus;
  trustScore: number;
  verificationHash: string;
  initiatedDate: string;
  completionDate?: string;
  priority: "standard" | "express";
  checks: {
    identity: CheckItem;
    education: CheckItem;
    employment: CheckItem;
    criminal: CheckItem;
  };
  notes?: string;
}

const INITIAL_BGV_CANDIDATES: BGVCandidate[] = [
  {
    id: "BGV-2026-081",
    name: "Aarav Sharma",
    email: "aarav.sharma@techscale.io",
    phone: "+91 98450 11223",
    location: "Bengaluru, India",
    appliedRole: "Senior Full Stack Engineer",
    currentCompany: "Razorpay (Ex-Senior SDE)",
    experience: "7.2 yrs",
    overallStatus: "cleared",
    trustScore: 99,
    verificationHash: "0x7a8f9c1b3d4e2f6a5b8c9d0e1f2a3b4c5d6e7f8a",
    initiatedDate: "Sep 08, 2026",
    completionDate: "Sep 12, 2026",
    priority: "express",
    checks: {
      identity: {
        status: "cleared",
        provider: "DigiLocker / Aadhaar XML & PAN",
        verifiedAt: "Sep 09, 2026",
        badge: "Gov ID & Biometric Cleared",
        details: "Aadhaar e-KYC, PAN card name & DOB 100% matched with Tax Information Network.",
      },
      education: {
        status: "cleared",
        provider: "National Academic Depository (NAD)",
        verifiedAt: "Sep 10, 2026",
        badge: "B.Tech CSE - IIT Bombay",
        details: "Graduation degree authenticated directly against IIT Bombay academic registry records.",
      },
      employment: {
        status: "cleared",
        provider: "EPFO Service History & HR Reference",
        verifiedAt: "Sep 11, 2026",
        badge: "Razorpay (3.2 yrs) & Swiggy (4.0 yrs)",
        details: "EPF member passbook records matched tenure dates. HR manager positive appraisal sign-off.",
      },
      criminal: {
        status: "cleared",
        provider: "e-Courts National Database & Police Check",
        verifiedAt: "Sep 12, 2026",
        badge: "Clean Record (0 Criminal Records)",
        details: "Scanned 3,400+ district & high court records. No civil or criminal litigation found.",
      },
    },
    notes: "Candidate has an impeccable track record. Ready for immediate offer letter & onboarding.",
  },
  {
    id: "BGV-2026-082",
    name: "Sneha Reddy",
    email: "sneha.reddy@deepmind-alumni.org",
    phone: "+91 97310 99887",
    location: "Hyderabad, India",
    appliedRole: "Staff AI/ML Engineer",
    currentCompany: "Microsoft Research",
    experience: "8.5 yrs",
    overallStatus: "cleared",
    trustScore: 100,
    verificationHash: "0x3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f",
    initiatedDate: "Sep 09, 2026",
    completionDate: "Sep 13, 2026",
    priority: "express",
    checks: {
      identity: {
        status: "cleared",
        provider: "Passport Seva & UIDAI",
        verifiedAt: "Sep 10, 2026",
        badge: "Passport & National ID Cleared",
        details: "Global passport KYC verified. No discrepancy in address or identity credentials.",
      },
      education: {
        status: "cleared",
        provider: "IIIT Hyderabad Ph.D Registry",
        verifiedAt: "Sep 11, 2026",
        badge: "Ph.D Machine Learning Cleared",
        details: "Doctoral dissertation verified directly with academic dean's office.",
      },
      employment: {
        status: "cleared",
        provider: "Microsoft Corporate Verification API",
        verifiedAt: "Sep 12, 2026",
        badge: "Staff Research Fellow Cleared",
        details: "Official verification letter confirmed tenure, title, and intellectual property disclosures.",
      },
      criminal: {
        status: "cleared",
        provider: "Law Enforcement & Interpol Global DB",
        verifiedAt: "Sep 13, 2026",
        badge: "Clean Background Verified",
        details: "Court registers and police jurisdiction clear of all citations.",
      },
    },
    notes: "Top-tier profile. Recommended for expedited Onboarding stage.",
  },
  {
    id: "BGV-2026-083",
    name: "Karan Verma",
    email: "karan.verma@codeflow.dev",
    phone: "+91 98112 34567",
    location: "Gurugram, India",
    appliedRole: "Lead Frontend Architect",
    currentCompany: "Swiggy Frontend Platform",
    experience: "6.5 yrs",
    overallStatus: "in_progress",
    trustScore: 84,
    verificationHash: "0x5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b",
    initiatedDate: "Sep 14, 2026",
    priority: "standard",
    checks: {
      identity: {
        status: "cleared",
        provider: "DigiLocker / Aadhaar & PAN",
        verifiedAt: "Sep 14, 2026",
        badge: "Aadhaar e-KYC Cleared",
        details: "Aadhaar demographic data and PAN card matching verified.",
      },
      education: {
        status: "cleared",
        provider: "BITS Pilani Academic Registry",
        verifiedAt: "Sep 15, 2026",
        badge: "B.E. Computer Science Cleared",
        details: "Degree certificate verified against university convocation roll records.",
      },
      employment: {
        status: "in_progress",
        provider: "Swiggy HR & EPF Check",
        badge: "HR Awaiting Signoff",
        details: "EPFO records confirmed. Awaiting formal HR reference response from previous employer.",
      },
      criminal: {
        status: "cleared",
        provider: "e-Courts National Database",
        verifiedAt: "Sep 15, 2026",
        badge: "e-Courts Scan Cleared",
        details: "Zero open court suits or pending warrants.",
      },
    },
    notes: "Employment reference expected within 24 hours. Automated reminder sent to HR.",
  },
  {
    id: "BGV-2026-084",
    name: "Rohit Malhotra",
    email: "rohit.m@cloudscale.net",
    phone: "+91 99220 88776",
    location: "Noida, India",
    appliedRole: "Senior Backend Specialist",
    currentCompany: "Freelance / Ex-Infosys",
    experience: "5.0 yrs",
    overallStatus: "discrepancy",
    trustScore: 62,
    verificationHash: "0x8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c",
    initiatedDate: "Sep 10, 2026",
    priority: "standard",
    checks: {
      identity: {
        status: "cleared",
        provider: "PAN & Voter ID Verification",
        verifiedAt: "Sep 11, 2026",
        badge: "Identity Confirmed",
        details: "Matched government records for voter ID & PAN database.",
      },
      education: {
        status: "cleared",
        provider: "Delhi University Registry",
        verifiedAt: "Sep 12, 2026",
        badge: "B.Sc Computer Science Cleared",
        details: "Convocation roll and marksheet authenticated.",
      },
      employment: {
        status: "discrepancy",
        provider: "EPFO Service Record Cross-Audit",
        verifiedAt: "Sep 13, 2026",
        badge: "Tenure Mismatch (-1.7 yrs)",
        details: "Resume states 3.5 years at Infosys, but EPFO contribution history only accounts for 1.8 years.",
        discrepancyNote: "Significant tenure gap identified. Candidate claimed continuous employment during 2022-2023.",
      },
      criminal: {
        status: "cleared",
        provider: "e-Courts & Police Records",
        verifiedAt: "Sep 12, 2026",
        badge: "Clean Record Verified",
        details: "No legal or criminal infractions on file.",
      },
    },
    notes: "Flagged for recruiter review. Need candidate to provide relieving letter and bank statements for disputed period.",
  },
  {
    id: "BGV-2026-085",
    name: "Priya Nair",
    email: "priya.nair@designdome.com",
    phone: "+91 94470 65432",
    location: "Mumbai, India",
    appliedRole: "Lead Product Designer",
    currentCompany: "Swiggy Design Studio",
    experience: "6.0 yrs",
    overallStatus: "cleared",
    trustScore: 98,
    verificationHash: "0x1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c",
    initiatedDate: "Sep 10, 2026",
    completionDate: "Sep 13, 2026",
    priority: "standard",
    checks: {
      identity: {
        status: "cleared",
        provider: "UIDAI e-KYC",
        verifiedAt: "Sep 11, 2026",
        badge: "e-KYC Cleared",
        details: "Instant Aadhaar OTP validation confirmed candidate identity.",
      },
      education: {
        status: "cleared",
        provider: "National Institute of Design (NID)",
        verifiedAt: "Sep 12, 2026",
        badge: "Master of Design (NID) Cleared",
        details: "Degree authenticity confirmed via NID academic portal.",
      },
      employment: {
        status: "cleared",
        provider: "HR Reference & Payslips",
        verifiedAt: "Sep 13, 2026",
        badge: "Lead Designer Title Confirmed",
        details: "HR verified designation, 3 months payslips, and positive performance rating.",
      },
      criminal: {
        status: "cleared",
        provider: "e-Courts Police Jurisdiction",
        verifiedAt: "Sep 12, 2026",
        badge: "Court Records Cleared",
        details: "Clean criminal record certificate issued.",
      },
    },
    notes: "Ready for Onboarding step. Welcome kit and offer letter dispatch recommended.",
  },
  {
    id: "BGV-2026-086",
    name: "Vikramaditya Rao",
    email: "vikram.rao@infraops.co",
    phone: "+91 99800 12345",
    location: "Bengaluru, India",
    appliedRole: "Cloud DevOps & Platform Lead",
    currentCompany: "Oracle Cloud Infrastructure",
    experience: "7.8 yrs",
    overallStatus: "in_progress",
    trustScore: 79,
    verificationHash: "0x9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d",
    initiatedDate: "Sep 15, 2026",
    priority: "express",
    checks: {
      identity: {
        status: "cleared",
        provider: "Passport & Driving License",
        verifiedAt: "Sep 15, 2026",
        badge: "Passport Verified",
        details: "Passport validity verified through national passport portal.",
      },
      education: {
        status: "in_progress",
        provider: "VTU Academic Verification",
        badge: "Awaiting University Transcript",
        details: "Verification request sent to Visvesvaraya Technological University examination branch.",
      },
      employment: {
        status: "in_progress",
        provider: "Oracle Corp Verification Dept",
        badge: "Corporate HR Review",
        details: "Tenure validation ticket created with Oracle HR Shared Services.",
      },
      criminal: {
        status: "cleared",
        provider: "e-Courts National Database",
        verifiedAt: "Sep 15, 2026",
        badge: "e-Courts Cleared",
        details: "Zero criminal or civil matters pending.",
      },
    },
    notes: "High priority role. Follow up with VTU university registrar.",
  },
  {
    id: "BGV-2026-087",
    name: "Meera Iyer",
    email: "meera.iyer@finpulse.org",
    phone: "+91 98860 55443",
    location: "Bengaluru, India",
    appliedRole: "Senior Product Manager",
    currentCompany: "Flipkart Commerce Systems",
    experience: "8.0 yrs",
    overallStatus: "cleared",
    trustScore: 97,
    verificationHash: "0x2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e",
    initiatedDate: "Sep 07, 2026",
    completionDate: "Sep 11, 2026",
    priority: "standard",
    checks: {
      identity: {
        status: "cleared",
        provider: "DigiLocker / Aadhaar & PAN",
        verifiedAt: "Sep 08, 2026",
        badge: "ID & Address Cleared",
        details: "Address and identity authenticated without discrepancy.",
      },
      education: {
        status: "cleared",
        provider: "IIM Ahmedabad Academic Cell",
        verifiedAt: "Sep 09, 2026",
        badge: "MBA (IIM-A) Cleared",
        details: "Post-graduate diploma confirmed via IIMA alumni registry.",
      },
      employment: {
        status: "cleared",
        provider: "Flipkart HR Shared Services",
        verifiedAt: "Sep 10, 2026",
        badge: "Senior PM Role Confirmed",
        details: "Tenure, team leadership, and standard exit protocols confirmed in writing.",
      },
      criminal: {
        status: "cleared",
        provider: "National Crime Records Bureau (NCRB)",
        verifiedAt: "Sep 11, 2026",
        badge: "NCRB Clean Record",
        details: "NCRB and local station verification verified clear.",
      },
    },
    notes: "Cleared on all parameters. Can be transitioned to Onboarding.",
  },
  {
    id: "BGV-2026-088",
    name: "Devendra Joshi",
    email: "devendra.j@databytes.io",
    phone: "+91 97123 45678",
    location: "Pune, India",
    appliedRole: "Data Engineering Specialist",
    currentCompany: "Ex-Wipro / Freelance",
    experience: "4.5 yrs",
    overallStatus: "discrepancy",
    trustScore: 56,
    verificationHash: "0x6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a",
    initiatedDate: "Sep 11, 2026",
    priority: "standard",
    checks: {
      identity: {
        status: "cleared",
        provider: "PAN & Aadhaar Online",
        verifiedAt: "Sep 11, 2026",
        badge: "Gov ID Cleared",
        details: "Government identity checks verified accurately.",
      },
      education: {
        status: "discrepancy",
        provider: "University Grants Commission (UGC) Registry",
        verifiedAt: "Sep 13, 2026",
        badge: "Unrecognized Institution",
        details: "Claimed M.Tech institution not listed on UGC accredited universities register.",
        discrepancyNote: "Certificate from 'Global Distance University' failed UGC accreditation check.",
      },
      employment: {
        status: "cleared",
        provider: "Wipro Verification Services",
        verifiedAt: "Sep 14, 2026",
        badge: "Wipro (3.0 yrs) Confirmed",
        details: "Wipro employment confirmed via formal corporate background check.",
      },
      criminal: {
        status: "cleared",
        provider: "e-Courts Police Records",
        verifiedAt: "Sep 12, 2026",
        badge: "Clean Record",
        details: "Zero criminal proceedings.",
      },
    },
    notes: "Candidate claims institution was UGC approved during enrollment. Under recruiter investigation.",
  },
];

export default function BackgroundVerificationPage() {
  const [candidates, setCandidates] = useState<BGVCandidate[]>(INITIAL_BGV_CANDIDATES);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedCandidate, setSelectedCandidate] = useState<BGVCandidate | null>(null);
  const [isInitiateModalOpen, setIsInitiateModalOpen] = useState(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // New BGV Check Form State
  const [newCandidateName, setNewCandidateName] = useState("");
  const [newCandidateEmail, setNewCandidateEmail] = useState("");
  const [newCandidateRole, setNewCandidateRole] = useState("");
  const [newPriority, setNewPriority] = useState<"standard" | "express">("standard");
  const [includeIdentity, setIncludeIdentity] = useState(true);
  const [includeEducation, setIncludeEducation] = useState(true);
  const [includeEmployment, setIncludeEmployment] = useState(true);
  const [includeCriminal, setIncludeCriminal] = useState(true);

  // Metrics
  const stats = useMemo(() => {
    const total = candidates.length;
    const cleared = candidates.filter((c) => c.overallStatus === "cleared").length;
    const inProgress = candidates.filter((c) => c.overallStatus === "in_progress").length;
    const discrepancy = candidates.filter((c) => c.overallStatus === "discrepancy").length;
    const avgTrust = Math.round(
      candidates.reduce((acc, c) => acc + c.trustScore, 0) / (total || 1)
    );
    return { total, cleared, inProgress, discrepancy, avgTrust };
  }, [candidates]);

  // Filtered Candidates
  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.appliedRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.currentCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || c.overallStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [candidates, searchQuery, statusFilter]);

  const handleCopyHash = (hash: string) => {
    navigator.clipboard?.writeText(hash);
    setCopiedHash(hash);
    toast.success("Verification hash copied to clipboard!", {
      description: hash,
    });
    setTimeout(() => setCopiedHash(null), 2500);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Background verification registries synchronized!", {
        description: "Checked DigiLocker, NAD, EPFO, and e-Courts APIs for updates.",
      });
    }, 900);
  };

  const handleInitiateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCandidateName.trim() || !newCandidateEmail.trim() || !newCandidateRole.trim()) {
      toast.error("Please fill in candidate name, email, and role.");
      return;
    }

    const newId = `BGV-2026-${String(candidates.length + 81).padStart(3, "0")}`;
    const newEntry: BGVCandidate = {
      id: newId,
      name: newCandidateName.trim(),
      email: newCandidateEmail.trim(),
      phone: "+91 98000 00000",
      location: "Bengaluru, India",
      appliedRole: newCandidateRole.trim(),
      currentCompany: "Candidate Verified Portfolio",
      experience: "5.0 yrs",
      overallStatus: "in_progress",
      trustScore: 75,
      verificationHash: `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}7a8b9c`,
      initiatedDate: "Just now",
      priority: newPriority,
      checks: {
        identity: {
          status: includeIdentity ? "in_progress" : "pending",
          provider: "DigiLocker / Aadhaar e-KYC",
          badge: includeIdentity ? "Verification Queued" : "Not Requested",
          details: "Initiated automated e-KYC request to candidate email.",
        },
        education: {
          status: includeEducation ? "in_progress" : "pending",
          provider: "National Academic Depository (NAD)",
          badge: includeEducation ? "Registry Query Queued" : "Not Requested",
          details: "NAD roll number verification initiated.",
        },
        employment: {
          status: includeEmployment ? "in_progress" : "pending",
          provider: "EPFO & HR Reference API",
          badge: includeEmployment ? "Audit Triggered" : "Not Requested",
          details: "EPF UAN check dispatched to employer database.",
        },
        criminal: {
          status: includeCriminal ? "in_progress" : "pending",
          provider: "e-Courts National Database",
          badge: includeCriminal ? "Court Scan Initiated" : "Not Requested",
          details: "Automated scan queued across high court & district jurisdictions.",
        },
      },
      notes: "Newly initiated BGV screening. Automated invite sent to candidate.",
    };

    setCandidates([newEntry, ...candidates]);
    setIsInitiateModalOpen(false);
    setNewCandidateName("");
    setNewCandidateEmail("");
    setNewCandidateRole("");
    toast.success(`BGV screening initiated for ${newEntry.name}!`, {
      description: `Verification tracking ID: ${newEntry.id}`,
    });
  };

  const handleApproveForOnboarding = (candidate: BGVCandidate) => {
    toast.success(`${candidate.name} approved for Onboarding!`, {
      description: "Candidate credentials cleared. You can now configure the Onboarding packet.",
    });
    setSelectedCandidate(null);
  };

  const renderStatusBadge = (status: BGVOverallStatus) => {
    switch (status) {
      case "cleared":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Cleared</span>
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5 animate-pulse" />
            <span>In Progress</span>
          </span>
        );
      case "discrepancy":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Discrepancy</span>
          </span>
        );
    }
  };

  const renderCheckIndicator = (check: CheckItem, label: string, icon: React.ReactNode) => {
    const isCleared = check.status === "cleared";
    const isInProgress = check.status === "in_progress";
    const isDiscrepancy = check.status === "discrepancy";

    return (
      <div
        className={`flex items-center gap-2 p-2 rounded-xl border text-xs transition-all ${
          isCleared
            ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-700 dark:text-emerald-300"
            : isInProgress
            ? "bg-amber-500/5 border-amber-500/20 text-amber-700 dark:text-amber-300"
            : isDiscrepancy
            ? "bg-rose-500/5 border-rose-500/25 text-rose-700 dark:text-rose-300"
            : "bg-surface-alt/40 border-border text-ink-soft"
        }`}
        title={`${label}: ${check.badge} (${check.provider})`}
      >
        <div
          className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
            isCleared
              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
              : isInProgress
              ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
              : isDiscrepancy
              ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
              : "bg-surface text-ink-soft"
          }`}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-bold text-[11px] truncate flex items-center gap-1">
            <span>{label}</span>
            {isCleared && <Check className="w-3 h-3 text-emerald-500" />}
            {isInProgress && <Clock className="w-3 h-3 text-amber-500 animate-spin" />}
            {isDiscrepancy && <AlertTriangle className="w-3 h-3 text-rose-500" />}
          </div>
          <div className="text-[10px] opacity-80 truncate">{check.badge}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-surface-alt/20 p-4 md:p-8 space-y-6 md:space-y-8">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-brand flex items-center justify-center text-primary-foreground shadow-glow shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-ink">
                  Background Verification
                </h1>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary-glow border border-primary/20">
                  Hiring Funnel · Stage 4
                </span>
              </div>
              <p className="text-xs md:text-sm text-ink-soft mt-0.5">
                Comprehensive screening of candidate identity, academic degrees, past employment records, and criminal histories before onboarding.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-surface hover:bg-surface-alt text-ink text-xs md:text-sm font-semibold rounded-xl border border-border transition shadow-sm cursor-pointer disabled:opacity-50"
            title="Sync verification registries"
          >
            <RefreshCw className={`w-4 h-4 text-ink-soft ${isRefreshing ? "animate-spin text-primary" : ""}`} />
            <span>Sync Registries</span>
          </button>

          <button
            type="button"
            onClick={() => setIsInitiateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-brand text-primary-foreground text-xs md:text-sm font-bold rounded-xl shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Initiate BGV Check</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
        <div className="bg-surface rounded-2xl p-4 border border-border/80 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-2xl font-black text-ink">{stats.total}</div>
            <div className="text-xs text-ink-soft truncate">Total Screened</div>
          </div>
        </div>

        <div className="bg-surface rounded-2xl p-4 border border-border/80 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{stats.cleared}</div>
            <div className="text-xs text-ink-soft truncate">Cleared (Ready)</div>
          </div>
        </div>

        <div className="bg-surface rounded-2xl p-4 border border-border/80 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400">{stats.inProgress}</div>
            <div className="text-xs text-ink-soft truncate">In Verification</div>
          </div>
        </div>

        <div className="bg-surface rounded-2xl p-4 border border-border/80 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-2xl font-black text-rose-600 dark:text-rose-400">{stats.discrepancy}</div>
            <div className="text-xs text-ink-soft truncate">Discrepancies</div>
          </div>
        </div>

        <div className="col-span-2 md:col-span-1 bg-surface rounded-2xl p-4 border border-border/80 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-2xl font-black text-ink">{stats.avgTrust}%</div>
            <div className="text-xs text-ink-soft truncate">Avg Trust Score</div>
          </div>
        </div>
      </div>

      {/* Integration Providers Banner */}
      <div className="bg-surface rounded-2xl p-4 border border-border/80 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary-glow flex items-center justify-center shrink-0">
            <Fingerprint className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-ink">Integrated Verification Channels</div>
            <div className="text-[11px] text-ink-soft">
              Direct API handshake with official national registries, university depositories & court records.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2.5 py-1 rounded-lg bg-surface-alt border border-border text-[11px] font-semibold text-ink flex items-center gap-1.5">
            <Fingerprint className="w-3.5 h-3.5 text-blue-500" />
            <span>DigiLocker / UIDAI</span>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-surface-alt border border-border text-[11px] font-semibold text-ink flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-emerald-500" />
            <span>NAD / UGC Depository</span>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-surface-alt border border-border text-[11px] font-semibold text-ink flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-purple-500" />
            <span>EPFO / Corporate HR</span>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-surface-alt border border-border text-[11px] font-semibold text-ink flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-amber-500" />
            <span>e-Courts & Police Records</span>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface p-4 rounded-2xl border border-border/80 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidate, role, email, or BGV ID..."
            className="w-full pl-9 pr-4 py-2 bg-surface-alt/50 border border-border rounded-xl text-xs md:text-sm text-ink placeholder:text-ink-soft/60 focus:outline-none focus:border-primary transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Tabs */}
          <div className="flex items-center p-1 bg-surface-alt rounded-xl border border-border text-xs">
            {[
              { id: "all", label: `All (${candidates.length})` },
              { id: "cleared", label: `Cleared (${stats.cleared})` },
              { id: "in_progress", label: `In Progress (${stats.inProgress})` },
              { id: "discrepancy", label: `Discrepancy (${stats.discrepancy})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                  statusFilter === tab.id
                    ? "bg-surface text-ink font-bold shadow-sm"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Candidates BGV Cards Grid */}
      <div className="space-y-3">
        {filteredCandidates.length === 0 ? (
          <div className="bg-surface rounded-2xl p-12 border border-border text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-surface-alt flex items-center justify-center text-ink-soft mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="text-base font-bold text-ink">No verification records found</div>
            <p className="text-xs text-ink-soft max-w-md mx-auto">
              Try adjusting your search terms or status filter, or initiate a new background verification check for shortlisted candidates.
            </p>
          </div>
        ) : (
          filteredCandidates.map((candidate) => {
            const isExpress = candidate.priority === "express";

            return (
              <div
                key={candidate.id}
                className="bg-surface rounded-2xl p-4 md:p-5 border border-border/80 shadow-sm hover:border-primary/40 transition-all space-y-4"
              >
                {/* Top Row: Candidate details, status & actions */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-brand text-primary-foreground font-black text-lg flex items-center justify-center shadow-glow shrink-0">
                      {candidate.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-base text-ink hover:text-primary-glow transition cursor-pointer">
                          {candidate.name}
                        </span>
                        {renderStatusBadge(candidate.overallStatus)}
                        {isExpress && (
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25">
                            ⚡ Express 24h
                          </span>
                        )}
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-surface-alt text-ink-soft border border-border">
                          {candidate.id}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-ink-soft mt-1 flex-wrap">
                        <span className="font-medium text-ink/90 flex items-center gap-1">
                          <Briefcase className="w-3.5 h-3.5 text-primary-glow" />
                          {candidate.appliedRole}
                        </span>
                        <span>•</span>
                        <span>{candidate.currentCompany}</span>
                        <span>•</span>
                        <span>{candidate.experience} exp</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {candidate.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {/* Trust Meter */}
                    <div className="text-right">
                      <div className="text-xs text-ink-soft">Trust Index</div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-16 bg-surface-alt rounded-full h-2 overflow-hidden border border-border">
                          <div
                            className={`h-full rounded-full transition-all ${
                              candidate.trustScore >= 90
                                ? "bg-emerald-500"
                                : candidate.trustScore >= 70
                                ? "bg-amber-500"
                                : "bg-rose-500"
                            }`}
                            style={{ width: `${candidate.trustScore}%` }}
                          />
                        </div>
                        <span className="font-black text-xs text-ink">{candidate.trustScore}%</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedCandidate(candidate)}
                      className="flex items-center gap-2 px-3.5 py-2 bg-surface hover:bg-surface-alt text-ink text-xs font-bold rounded-xl border border-border transition shadow-sm cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-primary-glow" />
                      <span>View Dossier</span>
                    </button>

                    {candidate.overallStatus === "cleared" ? (
                      <Link
                        href="/recruiter/onboarding"
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-brand text-primary-foreground text-xs font-bold rounded-xl shadow-glow hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
                        title="Move candidate to Onboarding"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>To Onboarding</span>
                        <ChevronRight className="w-3 h-3 opacity-70" />
                      </Link>
                    ) : candidate.overallStatus === "discrepancy" ? (
                      <button
                        type="button"
                        onClick={() => setSelectedCandidate(candidate)}
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-xl border border-rose-500/25 transition cursor-pointer"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Review Flag</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => toast.info(`Awaiting BGV checks for ${candidate.name}`)}
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-surface-alt text-ink-soft text-xs font-medium rounded-xl border border-border cursor-pointer hover:text-ink"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Checks Pending</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 4 Checkpoint Badges Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2 border-t border-border/60">
                  {renderCheckIndicator(
                    candidate.checks.identity,
                    "Identity & e-KYC",
                    <Fingerprint className="w-3.5 h-3.5" />
                  )}
                  {renderCheckIndicator(
                    candidate.checks.education,
                    "Higher Education",
                    <GraduationCap className="w-3.5 h-3.5" />
                  )}
                  {renderCheckIndicator(
                    candidate.checks.employment,
                    "Past Employment",
                    <Briefcase className="w-3.5 h-3.5" />
                  )}
                  {renderCheckIndicator(
                    candidate.checks.criminal,
                    "Criminal & Court",
                    <Scale className="w-3.5 h-3.5" />
                  )}
                </div>

                {/* Bottom Hash & Audit Footer */}
                <div className="flex items-center justify-between gap-3 text-[11px] text-ink-soft pt-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-ink-soft/70">Audit Hash:</span>
                    <button
                      type="button"
                      onClick={() => handleCopyHash(candidate.verificationHash)}
                      className="font-mono text-[10px] text-ink-soft hover:text-primary-glow flex items-center gap-1 cursor-pointer transition"
                      title="Copy cryptographic audit hash"
                    >
                      <span>{candidate.verificationHash.slice(0, 16)}...</span>
                      {copiedHash === candidate.verificationHash ? (
                        <Check className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <span>Initiated: {candidate.initiatedDate}</span>
                    {candidate.completionDate && (
                      <>
                        <span>•</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                          Completed: {candidate.completionDate}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Candidate Detailed BGV Dossier Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface rounded-3xl border border-border shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-border flex items-center justify-between bg-surface-alt/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-brand text-primary-foreground font-black text-base flex items-center justify-center shadow-glow">
                  {selectedCandidate.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-ink">{selectedCandidate.name}</h2>
                    {renderStatusBadge(selectedCandidate.overallStatus)}
                  </div>
                  <div className="text-xs text-ink-soft">
                    {selectedCandidate.appliedRole} • {selectedCandidate.id}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCandidate(null)}
                className="p-2 rounded-xl text-ink-soft hover:text-ink hover:bg-surface-alt transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Trust Score & Cryptographic Stamp */}
              <div className="p-4 rounded-2xl bg-surface-alt border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-ink-soft font-semibold">Verification Trust Index</div>
                  <div className="text-2xl font-black text-ink flex items-center gap-2 mt-0.5">
                    <span>{selectedCandidate.trustScore}/100</span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      {selectedCandidate.trustScore >= 90 ? "High Fidelity" : selectedCandidate.trustScore >= 70 ? "Moderate" : "Flagged"}
                    </span>
                  </div>
                  <div className="text-[11px] text-ink-soft mt-1">
                    Calculated from authenticated government IDs, institutional registrar signatures, and employment records.
                  </div>
                </div>

                <div className="p-3 bg-surface rounded-xl border border-border shrink-0">
                  <div className="text-[10px] text-ink-soft font-bold uppercase tracking-wider">Blockchain Audit Hash</div>
                  <div className="font-mono text-[11px] text-primary-glow font-bold mt-0.5 break-all max-w-[240px]">
                    {selectedCandidate.verificationHash}
                  </div>
                </div>
              </div>

              {/* 4 Checkpoint Breakdown */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-primary-glow" />
                  <span>Screening Checkpoints & Authenticated Evidence</span>
                </h3>

                <div className="space-y-3">
                  {/* Identity Check */}
                  <div className="p-4 rounded-2xl border border-border bg-surface hover:border-border/80 transition space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                          <Fingerprint className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-ink">Government Identity & Address (e-KYC)</div>
                          <div className="text-[11px] text-ink-soft">{selectedCandidate.checks.identity.provider}</div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                        {selectedCandidate.checks.identity.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-ink/80 pl-10.5">
                      {selectedCandidate.checks.identity.details}
                    </p>
                    {selectedCandidate.checks.identity.verifiedAt && (
                      <div className="text-[10px] text-ink-soft pl-10.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Verified on {selectedCandidate.checks.identity.verifiedAt}</span>
                      </div>
                    )}
                  </div>

                  {/* Higher Education Check */}
                  <div className="p-4 rounded-2xl border border-border bg-surface hover:border-border/80 transition space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                          <GraduationCap className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-ink">Academic Degree & Higher Education</div>
                          <div className="text-[11px] text-ink-soft">{selectedCandidate.checks.education.provider}</div>
                        </div>
                      </div>
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                          selectedCandidate.checks.education.status === "cleared"
                            ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                            : selectedCandidate.checks.education.status === "in_progress"
                            ? "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20"
                            : "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20"
                        }`}
                      >
                        {selectedCandidate.checks.education.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-ink/80 pl-10.5">
                      {selectedCandidate.checks.education.details}
                    </p>
                    {selectedCandidate.checks.education.discrepancyNote && (
                      <div className="ml-10.5 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-700 dark:text-rose-300 font-medium">
                        ⚠️ Discrepancy Note: {selectedCandidate.checks.education.discrepancyNote}
                      </div>
                    )}
                    {selectedCandidate.checks.education.verifiedAt && (
                      <div className="text-[10px] text-ink-soft pl-10.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Verified on {selectedCandidate.checks.education.verifiedAt}</span>
                      </div>
                    )}
                  </div>

                  {/* Employment History Check */}
                  <div className="p-4 rounded-2xl border border-border bg-surface hover:border-border/80 transition space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                          <Briefcase className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-ink">Past Employment History & EPF Records</div>
                          <div className="text-[11px] text-ink-soft">{selectedCandidate.checks.employment.provider}</div>
                        </div>
                      </div>
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                          selectedCandidate.checks.employment.status === "cleared"
                            ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                            : selectedCandidate.checks.employment.status === "in_progress"
                            ? "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20"
                            : "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20"
                        }`}
                      >
                        {selectedCandidate.checks.employment.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-ink/80 pl-10.5">
                      {selectedCandidate.checks.employment.details}
                    </p>
                    {selectedCandidate.checks.employment.discrepancyNote && (
                      <div className="ml-10.5 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-700 dark:text-rose-300 font-medium">
                        ⚠️ Discrepancy Note: {selectedCandidate.checks.employment.discrepancyNote}
                      </div>
                    )}
                    {selectedCandidate.checks.employment.verifiedAt && (
                      <div className="text-[10px] text-ink-soft pl-10.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Verified on {selectedCandidate.checks.employment.verifiedAt}</span>
                      </div>
                    )}
                  </div>

                  {/* Criminal & Law Enforcement Check */}
                  <div className="p-4 rounded-2xl border border-border bg-surface hover:border-border/80 transition space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                          <Scale className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-ink">Criminal & Civil Court Database (e-Courts)</div>
                          <div className="text-[11px] text-ink-soft">{selectedCandidate.checks.criminal.provider}</div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                        {selectedCandidate.checks.criminal.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-ink/80 pl-10.5">
                      {selectedCandidate.checks.criminal.details}
                    </p>
                    {selectedCandidate.checks.criminal.verifiedAt && (
                      <div className="text-[10px] text-ink-soft pl-10.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Verified on {selectedCandidate.checks.criminal.verifiedAt}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Recruiter Notes */}
              {selectedCandidate.notes && (
                <div className="p-4 rounded-2xl bg-surface-alt/60 border border-border">
                  <div className="text-xs font-bold text-ink flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-primary-glow" />
                    <span>Recruiter & Auditor Notes</span>
                  </div>
                  <p className="text-xs text-ink-soft mt-1 leading-relaxed">
                    {selectedCandidate.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="p-5 border-t border-border bg-surface-alt/40 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => toast.success(`BGV Dossier PDF generated for ${selectedCandidate.name}`)}
                  className="flex items-center justify-center gap-2 px-3.5 py-2.5 bg-surface hover:bg-surface-alt text-ink text-xs font-bold rounded-xl border border-border transition shadow-sm w-full sm:w-auto cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-ink-soft" />
                  <span>Download Full Report</span>
                </button>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setSelectedCandidate(null)}
                  className="px-4 py-2.5 text-ink-soft hover:text-ink text-xs font-semibold rounded-xl transition cursor-pointer"
                >
                  Close
                </button>

                {selectedCandidate.overallStatus === "cleared" ? (
                  <button
                    type="button"
                    onClick={() => handleApproveForOnboarding(selectedCandidate)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-brand text-primary-foreground text-xs font-bold rounded-xl shadow-glow hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer w-full sm:w-auto"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Approve for Onboarding</span>
                  </button>
                ) : selectedCandidate.overallStatus === "discrepancy" ? (
                  <button
                    type="button"
                    onClick={() => {
                      toast.info(`Candidate clarification requested from ${selectedCandidate.name}`);
                      setSelectedCandidate(null);
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 text-white text-xs font-bold rounded-xl shadow-md hover:bg-amber-600 transition cursor-pointer w-full sm:w-auto"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Request Candidate Clarification</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      toast.success(`Verification expedited for ${selectedCandidate.name}`);
                      setSelectedCandidate(null);
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-brand text-primary-foreground text-xs font-bold rounded-xl shadow-glow hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer w-full sm:w-auto"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Expedite Remaining Checks</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Initiate New BGV Modal */}
      {isInitiateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface rounded-3xl border border-border shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-border flex items-center justify-between bg-surface-alt/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-brand text-primary-foreground flex items-center justify-center shadow-glow">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-ink">Initiate Background Check</h2>
                  <p className="text-xs text-ink-soft">
                    Trigger automated multi-point verification for candidate.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsInitiateModalOpen(false)}
                className="p-2 rounded-xl text-ink-soft hover:text-ink hover:bg-surface-alt transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInitiateSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-ink mb-1.5">Candidate Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sen"
                  value={newCandidateName}
                  onChange={(e) => setNewCandidateName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-surface-alt/50 border border-border rounded-xl text-xs md:text-sm text-ink focus:outline-none focus:border-primary transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1.5">Candidate Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. rahul.sen@example.com"
                  value={newCandidateEmail}
                  onChange={(e) => setNewCandidateEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-surface-alt/50 border border-border rounded-xl text-xs md:text-sm text-ink focus:outline-none focus:border-primary transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1.5">Job Role / Designation *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Backend Engineer"
                  value={newCandidateRole}
                  onChange={(e) => setNewCandidateRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-surface-alt/50 border border-border rounded-xl text-xs md:text-sm text-ink focus:outline-none focus:border-primary transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-2">Checkpoints to Execute</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-border bg-surface-alt/30 hover:bg-surface-alt/60 cursor-pointer transition">
                    <input
                      type="checkbox"
                      checked={includeIdentity}
                      onChange={(e) => setIncludeIdentity(e.target.checked)}
                      className="rounded text-primary focus:ring-primary"
                    />
                    <span className="font-semibold text-ink">Identity & e-KYC</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-border bg-surface-alt/30 hover:bg-surface-alt/60 cursor-pointer transition">
                    <input
                      type="checkbox"
                      checked={includeEducation}
                      onChange={(e) => setIncludeEducation(e.target.checked)}
                      className="rounded text-primary focus:ring-primary"
                    />
                    <span className="font-semibold text-ink">Degree & NAD</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-border bg-surface-alt/30 hover:bg-surface-alt/60 cursor-pointer transition">
                    <input
                      type="checkbox"
                      checked={includeEmployment}
                      onChange={(e) => setIncludeEmployment(e.target.checked)}
                      className="rounded text-primary focus:ring-primary"
                    />
                    <span className="font-semibold text-ink">Employment & EPF</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-border bg-surface-alt/30 hover:bg-surface-alt/60 cursor-pointer transition">
                    <input
                      type="checkbox"
                      checked={includeCriminal}
                      onChange={(e) => setIncludeCriminal(e.target.checked)}
                      className="rounded text-primary focus:ring-primary"
                    />
                    <span className="font-semibold text-ink">Criminal & Courts</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1.5">SLA / Speed</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setNewPriority("standard")}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition ${
                      newPriority === "standard"
                        ? "border-primary bg-primary/10 text-primary-glow font-bold"
                        : "border-border text-ink-soft hover:text-ink"
                    }`}
                  >
                    <div className="font-bold">Standard Check</div>
                    <div className="text-[10px] opacity-80">3 - 5 business days</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewPriority("express")}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition ${
                      newPriority === "express"
                        ? "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold"
                        : "border-border text-ink-soft hover:text-ink"
                    }`}
                  >
                    <div className="font-bold">⚡ Express 24h</div>
                    <div className="text-[10px] opacity-80">Prioritized API queues</div>
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsInitiateModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-ink-soft hover:text-ink rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-gradient-brand text-primary-foreground text-xs font-bold rounded-xl shadow-glow hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
                >
                  Initiate Screening
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
