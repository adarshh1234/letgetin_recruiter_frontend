"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Printer,
  Download,
  Mail,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  GraduationCap,
  Sparkles,
  Award,
  Languages,
  Code,
  FolderGit2,
  Calendar,
  ExternalLink,
  User,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  FileText,
  FileCheck,
} from "lucide-react";
import { Applicant } from "../types";

interface ApplicantResumeModalProps {
  isOpen: boolean;
  applicant: Applicant | null;
  onClose: () => void;
  onStatusChange?: (applicationId: string, newStatus: string) => void;
  isUpdatingStatus?: boolean;
}

const STATUS_OPTIONS = [
  "submitted",
  "reviewing",
  "shortlisted",
  "interviewing",
  "offered",
  "rejected",
];

export const ApplicantResumeModal: React.FC<ApplicantResumeModalProps> = ({
  isOpen,
  applicant,
  onClose,
  onStatusChange,
  isUpdatingStatus,
}) => {
  const [activeTab, setActiveTab] = useState<"document" | "profile">("document");
  const [zoom, setZoom] = useState<number>(85);

  if (!isOpen || !applicant) return null;

  const candidate = applicant.candidate;
  const resume = applicant.resume;
  const content = resume?.content;
  const settings = resume?.settings;
  const personal = content?.personalInfo;

  const primaryColor = settings?.primaryColor || "#1e293b";
  const fontFamily = settings?.fontFamily || "Inter, system-ui, sans-serif";

  const displayName =
    personal?.fullName ||
    candidate?.fullName ||
    candidate?.username ||
    "Candidate";
  const email = personal?.email || candidate?.email || "";
  const phone = personal?.phone || candidate?.phone || "";
  const location = personal?.location || "";
  const website = personal?.websiteUrl || "";
  const headline =
    personal?.headline || "Professional Resume & Experience";
  const summary = content?.summary || "";
  const experiences = content?.experiences || [];
  const educations = content?.educations || [];
  const skills = content?.skills || [];
  const projects = content?.projects || [];
  const certificates = content?.certificates || [];
  const languagesList = content?.languages || [];
  const socialLinks = content?.socialLinks || [];

  const handleDownloadPdf = () => {
    if (typeof window === "undefined") return;

    // Generate filename starting with candidate name, e.g. "anupamgupta" -> "anupamgupta.pdf"
    const rawName = displayName.trim();
    const sanitized = rawName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "") || "candidate";

    const docTitle = sanitized;
    const originalDocumentTitle = document.title;

    // Set document title so browsers use it as the default filename in PDF export
    document.title = docTitle;

    const resumeElement = document.getElementById("applicant-resume-paper-canvas");

    if (!resumeElement) {
      window.print();
      setTimeout(() => {
        document.title = originalDocumentTitle;
      }, 1000);
      return;
    }

    // Create or reuse isolated hidden iframe for 100% clean PDF export of ONLY the resume
    let printFrame = document.getElementById("applicant-pdf-print-iframe") as HTMLIFrameElement;
    if (!printFrame) {
      printFrame = document.createElement("iframe");
      printFrame.id = "applicant-pdf-print-iframe";
      printFrame.style.position = "fixed";
      printFrame.style.right = "0";
      printFrame.style.bottom = "0";
      printFrame.style.width = "0";
      printFrame.style.height = "0";
      printFrame.style.border = "0";
      printFrame.style.visibility = "hidden";
      document.body.appendChild(printFrame);
    }

    const doc = printFrame.contentWindow?.document;
    if (!doc) {
      window.print();
      setTimeout(() => {
        document.title = originalDocumentTitle;
      }, 1000);
      return;
    }

    // Collect all active stylesheets and link tags from main app
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map((s) => s.outerHTML)
      .join("\n");

    // Strip inline scale transforms from cloned resume paper
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = resumeElement.outerHTML;
    const clonedPaper = tempDiv.querySelector(".resume-paper") as HTMLElement;
    if (clonedPaper) {
      clonedPaper.style.transform = "none";
      clonedPaper.style.boxShadow = "none";
      clonedPaper.style.margin = "0";
      clonedPaper.style.border = "none";
      clonedPaper.style.width = "210mm";
      clonedPaper.style.minHeight = "297mm";
    }

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <title>${docTitle}</title>
          <meta charset="utf-8">
          ${styles}
          <style>
            @page {
              size: A4 portrait;
              margin: 0;
            }
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              background: #ffffff !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .resume-paper {
              transform: none !important;
              box-shadow: none !important;
              border: none !important;
              margin: 0 !important;
              padding: 10mm !important;
              width: 210mm !important;
              min-height: 297mm !important;
              page-break-after: avoid !important;
              page-break-inside: avoid !important;
            }
          </style>
        </head>
        <body>
          ${tempDiv.innerHTML}
        </body>
      </html>
    `);
    doc.close();

    // Wait 300ms for web fonts & styles to resolve before opening print dialog
    setTimeout(() => {
      printFrame.contentWindow?.focus();
      printFrame.contentWindow?.print();

      // Restore original document title after print dialog triggers
      setTimeout(() => {
        document.title = originalDocumentTitle;
      }, 1500);
    }, 300);
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 10, 140));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 10, 50));
  const handleResetZoom = () => setZoom(100);
  const handleFitWidth = () => setZoom(85);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          className="bg-card border border-border rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden relative max-h-[94vh] flex flex-col my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Controls Bar */}
          <div className="p-4 sm:p-4.5 border-b border-border bg-surface-alt/80 flex items-center justify-between gap-3 flex-wrap shrink-0">
            {/* Candidate Identity */}
            <div className="flex items-center gap-3 min-w-0">
              {candidate?.avatarUrl ? (
                <img
                  src={candidate.avatarUrl}
                  alt={displayName}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-glow/40 shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-brand text-primary-foreground font-extrabold text-sm flex items-center justify-center shadow-glow shrink-0">
                  <User className="w-5 h-5" />
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base font-bold text-ink truncate">
                    {displayName}
                  </h2>
                  <span className="text-[10px] font-bold text-primary-glow bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                    {applicant.matchScore || 0}% match
                  </span>
                  {resume?.atsScore != null && resume.atsScore > 0 && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 hidden sm:inline-flex items-center gap-1">
                      <FileCheck className="w-2.5 h-2.5" /> ATS {resume.atsScore}%
                    </span>
                  )}
                </div>
                <p className="text-xs text-ink-soft truncate">
                  Applied: {new Date(applicant.appliedAt).toLocaleDateString()} · Resume: <span className="font-semibold text-ink">{resume?.title || "Submitted Resume"}</span>
                </p>
              </div>
            </div>

            {/* View Mode Toggle Tabs */}
            <div className="flex items-center bg-surface border border-border p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab("document")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === "document"
                    ? "bg-primary text-white shadow-xs"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Actual Resume (PDF)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("profile")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === "profile"
                    ? "bg-primary text-white shadow-xs"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Candidate Profile</span>
              </button>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Status Selector */}
              {onStatusChange && (
                <div className="flex items-center gap-1.5 bg-surface border border-border px-2.5 py-1.5 rounded-xl">
                  <span className="text-[10px] font-bold text-ink-soft uppercase hidden sm:inline">Status:</span>
                  <select
                    value={applicant.status}
                    disabled={isUpdatingStatus}
                    onChange={(e) => onStatusChange(applicant._id, e.target.value)}
                    className="text-xs font-bold bg-transparent text-ink capitalize cursor-pointer focus:outline-none"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Download / Print PDF Button - ONLY shown when viewing Actual Resume Document */}
              {activeTab === "document" && (
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary-dark shadow-xs transition cursor-pointer"
                  title="Download PDF Resume"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              )}

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-ink-soft hover:text-ink hover:bg-surface border border-border transition cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ============================================================
              TAB 1: ACTUAL PDF / A4 RESUME DOCUMENT CANVAS
              ============================================================ */}
          {activeTab === "document" ? (
            <div className="relative flex-1 bg-surface-alt/40 overflow-y-auto flex flex-col items-center p-4 sm:p-6">
              {/* Zoom & PDF Toolbar */}
              <div className="sticky top-0 z-20 mb-4 bg-surface/90 backdrop-blur-md border border-border rounded-xl px-3 py-1.5 shadow-sm flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  className="p-1 rounded-lg text-ink-soft hover:text-ink hover:bg-surface-alt transition cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-bold text-ink min-w-10 text-center select-none">
                  {zoom}%
                </span>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  className="p-1 rounded-lg text-ink-soft hover:text-ink hover:bg-surface-alt transition cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <div className="w-px h-3.5 bg-border mx-1" />
                <button
                  type="button"
                  onClick={handleResetZoom}
                  className="px-2 py-0.5 rounded-lg text-[11px] font-bold text-ink-soft hover:text-ink hover:bg-surface-alt transition cursor-pointer"
                  title="Reset Zoom (100%)"
                >
                  100%
                </button>
                <button
                  type="button"
                  onClick={handleFitWidth}
                  className="px-2 py-0.5 rounded-lg text-[11px] font-bold text-ink-soft hover:text-ink hover:bg-surface-alt transition cursor-pointer"
                  title="Fit Page Width"
                >
                  Fit
                </button>
                <div className="w-px h-3.5 bg-border mx-1" />
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-primary/10 hover:bg-primary text-primary hover:text-white transition cursor-pointer"
                  title="Download PDF Resume"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>

              {/* A4 Paper Canvas */}
              <div
                id="applicant-resume-paper-canvas"
                className="resume-paper bg-white text-slate-900 transition-transform duration-150 ease-out origin-top shadow-2xl rounded-sm p-10 flex flex-col justify-between leading-relaxed text-xs border border-slate-200 print:shadow-none print:m-0 print:p-0 print:border-none print:transform-none"
                style={{
                  transform: `scale(${zoom / 100})`,
                  width: "210mm",
                  minHeight: "297mm",
                  fontFamily: fontFamily,
                }}
              >
                <div className="space-y-6">
                  {/* Modern Header Banner */}
                  <div
                    className="rounded-xl p-6 text-white shadow-sm"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <h1 className="text-2xl font-black tracking-tight">
                      {displayName}
                    </h1>
                    <p className="text-sm font-medium text-slate-200 mt-0.5">
                      {headline}
                    </p>

                    {/* Contact details */}
                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-200 mt-4 pt-3 border-t border-white/20">
                      {email && <span>📧 {email}</span>}
                      {phone && <span>📱 {phone}</span>}
                      {location && <span>📍 {location}</span>}
                      {website && (
                        <a
                          href={website.startsWith("http") ? website : `https://${website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white underline hover:opacity-90"
                        >
                          🌐 {website.replace(/^https?:\/\//, "")}
                        </a>
                      )}
                      {socialLinks?.map((link, idx) => (
                        <a
                          key={idx}
                          href={link.url.startsWith("http") ? link.url : `https://${link.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white underline hover:opacity-90"
                        >
                          🔗 {link.label || link.platform || "Link"}
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Summary */}
                  {summary && (
                    <div className="space-y-1.5">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
                        Professional Summary
                      </h3>
                      <p className="text-xs text-slate-700 leading-relaxed pt-0.5">
                        {summary}
                      </p>
                    </div>
                  )}

                  {/* Work Experience */}
                  {experiences.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
                        Work Experience
                      </h3>
                      <div className="space-y-3.5">
                        {experiences.map((exp, idx) => {
                          const highlights = Array.isArray(exp.highlights)
                            ? exp.highlights
                            : typeof exp.highlights === "string"
                              ? exp.highlights.split("\n").filter(Boolean)
                              : [];

                          return (
                            <div key={exp.id || idx} className="space-y-1">
                              <div className="flex justify-between items-baseline font-bold text-xs text-slate-900">
                                <span>{exp.position}</span>
                                <span className="text-[11px] font-medium text-slate-500">
                                  {exp.startDate || ""} – {exp.isCurrent ? "Present" : exp.endDate || "Present"}
                                </span>
                              </div>
                              <div className="text-[11px] font-semibold text-slate-600">
                                {exp.company} {exp.location ? `· ${exp.location}` : ""}
                              </div>
                              {highlights.length > 0 && (
                                <ul className="list-disc list-inside text-[11px] text-slate-700 space-y-0.5 pt-0.5">
                                  {highlights.map((h, hIdx) => (
                                    <li key={hIdx} className="leading-snug">
                                      {h}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {educations.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
                        Education
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {educations.map((edu, idx) => (
                          <div key={edu.id || idx} className="space-y-0.5 text-xs">
                            <div className="font-bold text-slate-900">
                              {edu.degree || edu.fieldOfStudy}
                            </div>
                            <div className="text-[11px] text-slate-600 font-medium">
                              {edu.institution}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              {edu.startDate || ""} {edu.endDate ? `– ${edu.endDate}` : ""} {edu.gradeScore ? `(Grade: ${edu.gradeScore})` : ""}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  {skills.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
                        Key Skills
                      </h3>
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {skills.map((s, idx) => {
                          const name = typeof s === "string" ? s : s?.name;
                          if (!name) return null;
                          return (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-800 border border-slate-200"
                            >
                              {name}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Key Projects */}
                  {projects.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
                        Projects
                      </h3>
                      <div className="space-y-2.5">
                        {projects.map((proj, idx) => (
                          <div key={proj.id || idx} className="space-y-1">
                            <div className="flex justify-between items-baseline font-bold text-xs text-slate-900">
                              <div className="flex items-center gap-2">
                                <span>{proj.title}</span>
                                {proj.link && (
                                  <a
                                    href={proj.link.startsWith("http") ? proj.link : `https://${proj.link}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary text-[10px] underline font-normal"
                                  >
                                    View Project
                                  </a>
                                )}
                              </div>
                              {(proj.startDate || proj.endDate) && (
                                <span className="text-[10px] text-slate-500 font-medium">
                                  {proj.startDate || ""} {proj.endDate ? `– ${proj.endDate}` : ""}
                                </span>
                              )}
                            </div>
                            {proj.subtitle && (
                              <div className="text-[11px] text-slate-600">{proj.subtitle}</div>
                            )}
                            {proj.description && (
                              <p className="text-[11px] text-slate-700 leading-snug">
                                {proj.description}
                              </p>
                            )}
                            {proj.technologies && proj.technologies.length > 0 && (
                              <div className="flex flex-wrap gap-1 pt-0.5">
                                {proj.technologies.map((t, tIdx) => (
                                  <span
                                    key={tIdx}
                                    className="text-[9px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded"
                                  >
                                    {t}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Certifications & Languages */}
                  {(certificates.length > 0 || languagesList.length > 0) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      {certificates.length > 0 && (
                        <div className="space-y-2">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
                            Certifications
                          </h3>
                          <div className="space-y-1.5">
                            {certificates.map((cert, idx) => (
                              <div key={cert.id || idx} className="text-[11px]">
                                <div className="font-bold text-slate-900">{cert.name}</div>
                                <div className="text-slate-500">
                                  {cert.issuer} {cert.issueDate ? `(${cert.issueDate})` : ""}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {languagesList.length > 0 && (
                        <div className="space-y-2">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
                            Languages
                          </h3>
                          <div className="flex flex-wrap gap-1.5">
                            {languagesList.map((lang, idx) => (
                              <span
                                key={lang.id || idx}
                                className="text-[11px] font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded"
                              >
                                {lang.language} {lang.proficiency ? `(${lang.proficiency})` : ""}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* ============================================================
                TAB 2: CANDIDATE PROFILE DETAILS VIEW
                ============================================================ */
            <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
              {/* Contact overview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-surface-alt/40 border border-border/70 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ink-soft block">Email</span>
                  <a href={`mailto:${email}`} className="font-semibold text-ink hover:text-primary transition truncate flex items-center gap-1.5 mt-0.5">
                    <Mail className="w-3.5 h-3.5 text-primary-glow shrink-0" />
                    <span className="truncate">{email || "Not provided"}</span>
                  </a>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ink-soft block">Phone</span>
                  <a href={`tel:${phone}`} className="font-semibold text-ink hover:text-primary transition truncate flex items-center gap-1.5 mt-0.5">
                    <Phone className="w-3.5 h-3.5 text-primary-glow shrink-0" />
                    <span>{phone || "Not provided"}</span>
                  </a>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ink-soft block">Location</span>
                  <span className="font-semibold text-ink flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-primary-glow shrink-0" />
                    <span>{location || "Remote / Global"}</span>
                  </span>
                </div>
              </div>

              {/* Summary */}
              {summary && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink">
                    <Sparkles className="w-3.5 h-3.5 text-primary-glow" />
                    <span>Candidate Summary</span>
                  </div>
                  <p className="text-xs sm:text-sm text-ink-soft leading-relaxed bg-surface p-4 rounded-2xl border border-border">
                    {summary}
                  </p>
                </div>
              )}

              {/* Skills */}
              {skills.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink">
                    <Code className="w-3.5 h-3.5 text-primary-glow" />
                    <span>Competencies & Skills</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map((s, idx) => {
                      const name = typeof s === "string" ? s : s?.name;
                      if (!name) return null;
                      return (
                        <span
                          key={idx}
                          className="text-xs font-semibold text-primary-glow bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-xl shadow-xs"
                        >
                          {name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Experiences */}
              {experiences.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink">
                    <Briefcase className="w-3.5 h-3.5 text-primary-glow" />
                    <span>Experience Timeline</span>
                  </div>
                  <div className="space-y-3">
                    {experiences.map((exp, idx) => (
                      <div
                        key={exp.id || idx}
                        className="p-4 rounded-2xl bg-surface border border-border space-y-1.5"
                      >
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-ink">
                              {exp.position || "Position"}
                            </h4>
                            <p className="text-xs font-semibold text-primary-glow">
                              {exp.company || "Company"} {exp.location ? `· ${exp.location}` : ""}
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-ink-soft">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {exp.startDate || ""} – {exp.isCurrent ? "Present" : exp.endDate || "Present"}
                            </span>
                          </div>
                        </div>
                        {exp.highlights && (
                          <p className="text-xs text-ink-soft pt-1 leading-relaxed">
                            {Array.isArray(exp.highlights) ? exp.highlights.join(" · ") : exp.highlights}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {educations.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink">
                    <GraduationCap className="w-3.5 h-3.5 text-primary-glow" />
                    <span>Education</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {educations.map((edu, idx) => (
                      <div
                        key={edu.id || idx}
                        className="p-3.5 rounded-2xl bg-surface border border-border space-y-1"
                      >
                        <h4 className="text-xs sm:text-sm font-bold text-ink">
                          {edu.degree || edu.fieldOfStudy || "Degree"}
                        </h4>
                        <p className="text-xs font-semibold text-ink-soft">
                          {edu.institution || "Institution"}
                        </p>
                        <div className="text-[11px] text-ink-soft pt-0.5">
                          {edu.startDate || ""} {edu.endDate ? `– ${edu.endDate}` : ""}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
