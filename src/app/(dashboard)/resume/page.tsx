"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuthStore } from "../../../features/auth/store/useAuthStore";
import { StorageProviderFactory } from "../../../features/resume/storage/factory";
import { IResume } from "../../../features/resume/types";
import { ResumeCard } from "../../../features/dashboard/components/ResumeCard";
import { CreateResumeModal } from "../../../features/dashboard/components/CreateResumeModal";
import { CareerOverviewSection } from "../../../features/dashboard/components/CareerOverviewSection";
import { AIChat } from "@/features/aiAssistant/components/AIChat";
import { ComingSoon } from "@/components/common/ComingSoon";
import { VideoProfileSection } from "@/features/videoProfile/components/VideoProfileSection";
import { JobsBoard } from "@/features/jobs/components/JobsBoard";
import { SectionTabs } from "@/components/common/SectionTabs";
import { MyCoverLetters } from "@/features/aiApply/components/MyCoverLetters";
import { TailorResumeEntry } from "@/features/tailorResume/components/TailorResumeEntry";
import {
  Plus,
  Search,
  FileText,
  Sparkles,
  LayoutDashboard,
  Mail,
  Video,
  LayoutGrid,
  Calendar,
} from "lucide-react";
import { CalendarWorkspace } from "@/components/calendar/CalendarWorkspace";

type MyJobsSection =
  | "overview"
  | "kanban"
  | "calendar"
  | "jobs"
  | "resume"
  | "coverLetter"
  | "videoProfile";
type ResumeInnerTab = "myResume" | "tailorResume";
type CoverLetterInnerTab = "myCoverLetter" | "tailorCoverLetter";

// Top navigation for the My Jobs area, matching the in-page tab bar pattern.
const MY_JOBS_TABS: {
  id: MyJobsSection;
  label: string;
  icon: typeof FileText;
}[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "kanban", label: "Kanban Board", icon: LayoutGrid },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "jobs", label: "Explore Jobs", icon: Search },
  { id: "resume", label: "Resume", icon: FileText },
  { id: "coverLetter", label: "Cover Letter", icon: Mail },
  { id: "videoProfile", label: "Video Profile", icon: Video },
];

function DashboardPageContent() {
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get("tab") as MyJobsSection | null;

  const { isAuthenticated } = useAuthStore();
  const [activeSection, setActiveSection] = useState<MyJobsSection>(() => {
    if (
      tabFromUrl &&
      ["overview", "kanban", "calendar", "jobs", "resume", "coverLetter", "videoProfile"].includes(
        tabFromUrl,
      )
    ) {
      return tabFromUrl;
    }
    return "overview";
  });
  const [selectedStage, setSelectedStage] = useState<string>("all");

  const [resumeInnerTab, setResumeInnerTab] =
    useState<ResumeInnerTab>("myResume");
  const [coverLetterInnerTab, setCoverLetterInnerTab] =
    useState<CoverLetterInnerTab>("myCoverLetter");
  const [resumes, setResumes] = useState<IResume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSwitchTab = (tab: MyJobsSection, stage?: string) => {
    setActiveSection(tab);

    if (stage) {
      setSelectedStage(stage);
    } else {
      setSelectedStage("all");
    }
  };

  useEffect(() => {
    if (
      tabFromUrl &&
      ["overview", "kanban", "calendar", "jobs", "resume", "coverLetter", "videoProfile"].includes(
        tabFromUrl,
      )
    ) {
      setActiveSection(tabFromUrl);
    }
  }, [tabFromUrl]);

  useEffect(() => {
    let isMounted = true;

    const fetchResumes = async () => {
      setIsLoading(true);

      try {
        const provider = StorageProviderFactory.getProvider();
        const list = await provider.list();

        if (isMounted) {
          setResumes(Array.isArray(list) ? list : []);
        }
      } catch (err: unknown) {
        const errorMsg = (err as { message?: string })?.message || String(err);

        console.warn("Failed to fetch resumes:", errorMsg);

        if (isMounted) {
          setResumes([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchResumes();

    return () => {
      isMounted = false;
    };
  }, []);

  const [settingActiveId, setSettingActiveId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      const provider = StorageProviderFactory.getProvider();

      await provider.delete(id);

      setResumes((prev) => prev.filter((r) => r.id !== id));
    } catch (err: unknown) {
      const errorMsg = (err as { message?: string })?.message || String(err);

      console.error("Failed to delete resume:", errorMsg);
    }
  };

  const handleSetActive = async (id: string) => {
    setSettingActiveId(id);
    try {
      const provider = StorageProviderFactory.getProvider();
      if (provider.setActive) {
        await provider.setActive(id);
      }
      setResumes((prev) =>
        prev.map((r) => ({
          ...r,
          isActive: r.id === id,
        }))
      );
    } catch (err: unknown) {
      const errorMsg = (err as { message?: string })?.message || String(err);
      console.error("Failed to set active resume:", errorMsg);
    } finally {
      setSettingActiveId(null);
    }
  };

  const filteredResumes = resumes.filter((r) =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Top Header Navigation Tabs - My Jobs */}
        <div className="bg-surface border border-border rounded-2xl p-2 shadow-xs flex items-center gap-1.5 overflow-x-auto no-scrollbar select-none">
          {MY_JOBS_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-gradient-brand text-white shadow-elegant"
                    : "text-ink-soft hover:text-ink hover:bg-secondary/60"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${isActive ? "text-white" : "text-primary-glow"}`}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 1. Overview Section */}
        {activeSection === "overview" && (
          <CareerOverviewSection
            onSwitchTab={handleSwitchTab}
            onOpenCreateResume={() => setIsModalOpen(true)}
          />
        )}

        {/* 2. Kanban Board */}
        {activeSection === "kanban" && (
          <JobsBoard
            onSwitchTab={handleSwitchTab}
            initialStageFilter={selectedStage}
            initialViewMode="kanban"
          />
        )}

        {/* 3. Calendar Workspace */}
        {activeSection === "calendar" && (
          <div className="space-y-4">
            <CalendarWorkspace
              title="My Jobs & Applications Schedule"
              subtitle="Keep track of your interview timings, assessment deadlines, and job application timelines in one place."
              badgeLabel="Candidate Schedule"
              defaultView="week"
            />
          </div>
        )}

        {/* 4. Jobs Board (Explore & Search Jobs) */}
        {activeSection === "jobs" && (
          <JobsBoard
            onSwitchTab={handleSwitchTab}
            initialStageFilter={selectedStage}
            initialViewMode="list"
          />
        )}

        {/* 3. Cover Letter Section */}
        {activeSection === "coverLetter" && (
          <div className="space-y-6">
            <SectionTabs
              options={[
                { id: "myCoverLetter", label: "My Cover Letter" },
                { id: "tailorCoverLetter", label: "Tailor Cover Letter" },
              ]}
              active={coverLetterInnerTab}
              onChange={setCoverLetterInnerTab}
            />

            {coverLetterInnerTab === "myCoverLetter" && <MyCoverLetters />}

            {coverLetterInnerTab === "tailorCoverLetter" && (
              <ComingSoon
                title="Tailor Cover Letter"
                description="Paste a job description and let AI tailor your cover letter to match it, automatically."
                icon={Mail}
                compact
              />
            )}
          </div>
        )}

        {/* 4. Video Profile Section */}
        {activeSection === "videoProfile" && <VideoProfileSection />}

        {/* 5. Resume Builder & Storage Section */}
        {activeSection === "resume" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Banner */}
            <div className="bg-gradient-brand rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-elegant relative overflow-hidden">
              <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--primary-glow)_0%,_transparent_70%)] pointer-events-none" />
              <div className="relative space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-primary-glow bg-primary/10 px-3 py-1 rounded-full w-fit border border-primary/20">
                  <Sparkles className="w-3.5 h-3.5" /> Intelligent Career
                  Assistant
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white shadow-elegant">
                  Welcome back to{" "}
                  <span className="text-white shadow-elegant">LetGetIn AI</span>
                </h1>
                <p className="text-sm text-white/85 mt-1 max-w-xl leading-relaxed">
                  Build verified, ATS-optimized, high-converting professional
                  profiles and resumes in minutes.
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="relative bg-white text-ink text-xs font-extrabold px-5 py-3 rounded-xl shadow-md hover:bg-white/90 transition-all inline-flex items-center gap-2 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4 text-primary" /> Create Resume
              </button>
            </div>

            <div className="space-y-6">
              <SectionTabs
                options={[
                  { id: "myResume", label: "My Resume" },
                  { id: "tailorResume", label: "Tailor Resume" },
                ]}
                active={resumeInnerTab}
                onChange={setResumeInnerTab}
              />

              {resumeInnerTab === "myResume" && (
                <div className="space-y-6">
                  {/* Filter Bar */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search resumes by title..."
                        className="input-base pl-10"
                      />
                      <Search className="w-4 h-4 text-ink-soft absolute left-3.5 top-3.5" />
                    </div>
                    <div className="text-xs text-ink-soft font-medium">
                      Showing {filteredResumes.length} resume
                      {filteredResumes.length === 1 ? "" : "s"}
                    </div>
                  </div>

                  {/* Resumes Grid */}
                  {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="h-56 bg-surface/50 border border-border rounded-3xl animate-pulse"
                        />
                      ))}
                    </div>
                  ) : filteredResumes.length === 0 ? (
                    <div className="text-center py-20 bg-surface/40 border border-dashed border-border rounded-3xl space-y-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-brand flex items-center justify-center text-primary-foreground mx-auto shadow-glow">
                        <FileText className="w-7 h-7" />
                      </div>
                      <h3 className="text-base font-bold text-ink">
                        No Resumes Found
                      </h3>
                      <p className="text-xs text-ink-soft max-w-sm mx-auto leading-relaxed">
                        You haven&apos;t created any resumes yet or no resumes
                        match your search query.
                      </p>
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-gradient-brand text-primary-foreground text-xs font-semibold px-6 py-3 rounded-xl shadow-elegant hover:shadow-glow transition-all inline-flex items-center gap-2 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" /> Create Your First Resume
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {filteredResumes.map((resume) => (
                        <ResumeCard
                          key={resume.id}
                          resume={resume}
                          onDelete={handleDelete}
                          onSetActive={handleSetActive}
                          isSettingActive={settingActiveId === resume.id}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {resumeInnerTab === "tailorResume" && <TailorResumeEntry />}
            </div>
          </div>
        )}
      </main>

      <CreateResumeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <AIChat context="resume" />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <DashboardPageContent />
    </Suspense>
  );
}
