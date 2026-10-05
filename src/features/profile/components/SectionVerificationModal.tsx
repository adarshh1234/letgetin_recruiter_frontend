import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  X,
  UploadCloud,
  FileText,
  Trash2,
  Loader2,
  AlertCircle,
  Sparkles,
  FileCheck,
  CheckCircle2,
  XCircle,
  Eye,
  HardDrive,
  ShieldCheck,
  Check,
  ArrowUpRight,
} from "lucide-react";
import {
  SectionType,
  VerificationDocument,
  VerificationService,
  VerificationStatus,
} from "../services/verificationService";
import { VerificationBadge } from "./VerificationBadge";
import { DocumentViewerModal } from "./DocumentViewerModal";
import { toast } from "sonner";

export interface SectionVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  section: SectionType;
  title: string;
  documents: VerificationDocument[];
  status: VerificationStatus;
  profileData?: Record<string, any>;
  onRefresh: () => void;
  onViewDoc?: (doc: VerificationDocument) => void;
}

export const DOCUMENT_OPTIONS: Record<
  SectionType,
  Array<{ value: string; label: string; hint?: string }>
> = {
  personal: [
    { value: "passport", label: "Passport", hint: "Bio page with photo & details" },
    { value: "driving_license", label: "Driving License", hint: "Front & back ID card" },
    { value: "pan_card", label: "PAN Card", hint: "Official PAN card or e-PAN" },
    { value: "government_id", label: "Government ID", hint: "National ID or Aadhaar" },
  ],
  contacts: [
    { value: "government_id", label: "Government ID", hint: "Valid national identity proof" },
    { value: "address_proof", label: "Address Proof", hint: "Utility bill, rental agreement, bank doc" },
  ],
  education: [
    { value: "degree_certificate", label: "Degree Certificate", hint: "Official graduation degree or diploma" },
    { value: "marksheet", label: "Marksheet / Grade Card", hint: "Consolidated or semester marksheet" },
    { value: "transcript", label: "Official Transcript", hint: "University issued transcript PDF" },
  ],
  experience: [
    { value: "experience_letter", label: "Experience Letter", hint: "Relieving or experience certificate" },
    { value: "offer_letter", label: "Offer Letter", hint: "Signed employment offer letter" },
    { value: "relieving_letter", label: "Relieving Letter", hint: "Formal exit clearance letter" },
    { value: "salary_slip", label: "Salary Slip / Payslip", hint: "Recent 3 months salary payslip" },
    { value: "appointment_letter", label: "Appointment Letter", hint: "Official appointment confirmation" },
  ],
  skills: [
    { value: "certification_pdf", label: "Certification PDF", hint: "AWS, GCP, Meta, Coursera certificate" },
    { value: "course_completion", label: "Course Certificate", hint: "Bootcamp, Udemy, edX completion proof" },
  ],
};

export const SectionVerificationModal: React.FC<SectionVerificationModalProps> = ({
  isOpen,
  onClose,
  section,
  title,
  documents,
  status,
  profileData,
  onRefresh,
  onViewDoc,
}) => {
  const [selectedDocType, setSelectedDocType] = useState<string>(
    DOCUMENT_OPTIONS[section]?.[0]?.value || "other"
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<VerificationDocument | null>(null);
  const [mounted, setMounted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const docOptions = DOCUMENT_OPTIONS[section] || [
    { value: "other", label: "Supporting Document", hint: "Any valid proof document" },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update default document type when section changes
  useEffect(() => {
    if (DOCUMENT_OPTIONS[section]?.[0]?.value) {
      setSelectedDocType(DOCUMENT_OPTIONS[section][0].value);
    }
  }, [section]);

  // ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !previewDoc) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, previewDoc]);

  // Check if any document in this section is currently pending processing
  const hasPendingDocs = documents.some(
    (d) => d.verification.status === "pending"
  );

  // Automatic Polling Mechanism: Polls every 3 seconds while documents are pending
  useEffect(() => {
    if (!isOpen || !hasPendingDocs) return;

    const pollInterval = setInterval(() => {
      onRefresh();
    }, 3000);

    return () => {
      clearInterval(pollInterval);
    };
  }, [isOpen, hasPendingDocs, onRefresh]);

  const handleOpenPreview = (doc: VerificationDocument) => {
    if (onViewDoc) {
      onViewDoc(doc);
    } else {
      setPreviewDoc(doc);
    }
  };

  const handleFileSelect = (file: File) => {
    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage("File size exceeds 15MB limit.");
      return;
    }
    setSelectedFile(file);
    setErrorMessage(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setErrorMessage(null);
    setIsUploading(true);

    try {
      await VerificationService.uploadDocument(
        selectedFile,
        section,
        selectedDocType,
        profileData
      );
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      toast.success("Document uploaded successfully! Verification in progress.");
      onRefresh();
    } catch (err: any) {
      const msg =
        err?.error?.message ||
        err?.message ||
        "Failed to upload document for verification.";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    setDeletingId(id);
    try {
      await VerificationService.deleteDocument(id);
      toast.success("Document deleted successfully");
      onRefresh();
    } catch (err: any) {
      const msg = err?.message || "Failed to delete document";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setDeletingId(null);
    }
  };

  const formatSize = (bytes: number) => {
    if (!bytes) return "N/A";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-surface border border-border rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10 animate-scale-up">
        {/* Header */}
        <div className="px-6 py-5 bg-surface border-b border-border flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-brand text-white flex items-center justify-center shrink-0 shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="font-extrabold text-ink text-base sm:text-lg truncate">
                  {title}
                </h3>
                <VerificationBadge status={status} size="sm" />
              </div>
              <p className="text-xs text-ink-soft mt-0.5">
                Upload and verify supporting documents for your profile credentials
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/drive?category=profile"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-soft hover:text-primary-glow bg-secondary/60 hover:bg-secondary border border-border px-3 py-1.5 rounded-xl transition"
              title="Open all documents in Cloud Drive"
            >
              <HardDrive className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Drive</span>
              <ArrowUpRight className="w-3 h-3 opacity-60" />
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-ink-soft hover:text-ink rounded-xl border border-border hover:bg-secondary transition cursor-pointer"
              title="Close Modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status Alert Banner */}
          {status === "verified" && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-950 dark:text-emerald-200 p-4 rounded-2xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="text-xs space-y-0.5">
                <p className="font-bold text-emerald-800 dark:text-emerald-300">
                  Section Verified
                </p>
                <p className="opacity-90">
                  Your submitted documentation has been authenticated and matched with your profile information.
                </p>
              </div>
            </div>
          )}

          {status === "rejected" && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-950 dark:text-rose-200 p-4 rounded-2xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                <XCircle className="w-5 h-5" />
              </div>
              <div className="text-xs space-y-0.5">
                <p className="font-bold text-rose-800 dark:text-rose-300">
                  Verification Issues Flagged
                </p>
                <p className="opacity-90">
                  Discrepancies or unreadable content were detected. Review the details below and upload an updated document.
                </p>
              </div>
            </div>
          )}

          {status === "pending" && (
            <div className="bg-amber-500/10 border border-amber-500/30 text-amber-950 dark:text-amber-200 p-4 rounded-2xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
              <div className="text-xs space-y-0.5">
                <p className="font-bold text-amber-800 dark:text-amber-300">
                  Verification In Progress
                </p>
                <p className="opacity-90">
                  Authenticating document and extracting credentials. Status updates automatically.
                </p>
              </div>
            </div>
          )}

          {/* Error Notice */}
          {errorMessage && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-800 dark:text-rose-300 text-xs p-3.5 rounded-2xl flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{errorMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="text-rose-600 hover:text-rose-800 dark:text-rose-400 text-xs font-bold cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Upload Section Box */}
          <div className="bg-secondary/40 border border-border rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-ink text-sm flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-primary-glow" /> Upload New Document
              </h4>
              <span className="text-[11px] text-ink-soft">PDF, PNG, JPG, WEBP, DOCX (Max 15MB)</span>
            </div>

            {/* Document Type Selection */}
            <div>
              <label className="block text-xs font-semibold text-ink-soft mb-1.5">
                Select Document Category:
              </label>
              <div className="grid sm:grid-cols-2 gap-2">
                {docOptions.map((opt) => {
                  const isSelected = selectedDocType === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setSelectedDocType(opt.value)}
                      className={`text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "bg-primary/10 border-primary-glow text-primary-glow ring-1 ring-primary-glow"
                          : "bg-surface border-border text-ink hover:bg-secondary/70"
                      }`}
                    >
                      <span className="font-bold text-xs">{opt.label}</span>
                      {opt.hint && (
                        <span className="text-[10px] text-ink-soft mt-0.5 truncate">{opt.hint}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Drag and Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                isDragging
                  ? "border-primary-glow bg-primary/10 scale-[0.99]"
                  : selectedFile
                  ? "border-emerald-500/50 bg-emerald-500/5"
                  : "border-border hover:border-primary-glow/50 bg-surface/60 hover:bg-surface"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.webp,.docx"
                onChange={handleFileChange}
                className="hidden"
                disabled={isUploading}
              />

              {selectedFile ? (
                <div className="flex items-center gap-3 text-left w-full max-w-md bg-surface p-3 rounded-xl border border-emerald-500/30">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-xs text-ink truncate">{selectedFile.name}</p>
                    <p className="text-[11px] text-ink-soft">{formatSize(selectedFile.size)} • Click to change</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="p-1.5 text-ink-soft hover:text-rose-500 rounded-lg hover:bg-secondary transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-primary-glow mb-1">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-ink">
                    Click to browse or drag & drop file here
                  </p>
                  <p className="text-[11px] text-ink-soft">
                    Supports high-resolution images & multi-page PDF documents
                  </p>
                </>
              )}
            </div>

            {/* Upload Action Button */}
            <div className="flex justify-end gap-3">
              {selectedFile && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  disabled={isUploading}
                  className="px-4 py-2 text-xs font-semibold text-ink-soft hover:text-ink rounded-xl border border-border hover:bg-secondary transition cursor-pointer"
                >
                  Cancel
                </button>
              )}
              <button
                type="button"
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className="inline-flex items-center justify-center gap-2 bg-gradient-brand text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-elegant hover:shadow-glow transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Uploading & Verifying...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Upload & Verify Document</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Uploaded Documents List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h4 className="font-extrabold text-ink text-sm uppercase tracking-wider flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-primary-glow" /> Uploaded Documents ({documents.length})
              </h4>
              <span className="text-xs text-ink-soft">
                {documents.filter((d) => d.verification.status === "verified").length} verified
              </span>
            </div>

            {documents.length === 0 ? (
              <div className="p-8 rounded-2xl border border-dashed border-border text-center space-y-2 bg-surface/50">
                <FileText className="w-8 h-8 text-ink-soft mx-auto opacity-50" />
                <p className="font-bold text-ink text-sm">No documents uploaded yet</p>
                <p className="text-xs text-ink-soft">
                  Upload your supporting documents using the box above to get verified.
                </p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {documents.map((doc) => {
                  const isPending = doc.verification.status === "pending";
                  const isVerified = doc.verification.status === "verified";
                  const isRejected = doc.verification.status === "rejected";

                  return (
                    <div
                      key={doc._id}
                      className={`bg-surface border rounded-2xl p-4 space-y-3.5 text-xs shadow-xs transition-all ${
                        isPending
                          ? "border-amber-500/40 bg-amber-500/5 ring-1 ring-amber-500/20"
                          : isVerified
                          ? "border-emerald-500/30 bg-emerald-500/5"
                          : isRejected
                          ? "border-rose-500/30 bg-rose-500/5"
                          : "border-border"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div
                          onClick={() => handleOpenPreview(doc)}
                          className="flex items-center gap-3 min-w-0 cursor-pointer group flex-1"
                          title="Click to view document modal"
                        >
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition ${
                              isPending
                                ? "bg-amber-500/10 text-amber-500"
                                : isVerified
                                ? "bg-emerald-500/10 text-emerald-500"
                                : isRejected
                                ? "bg-rose-500/10 text-rose-500"
                                : "bg-secondary text-primary-glow"
                            }`}
                          >
                            {isPending ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <FileText className="w-5 h-5" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-ink truncate group-hover:text-primary-glow transition text-sm">
                              {doc.cloudinary.originalName}
                            </p>
                            <p className="text-[11px] text-ink-soft mt-0.5">
                              <span className="capitalize">{doc.documentType.replace(/_/g, " ")}</span> •{" "}
                              {formatSize(doc.cloudinary.size)} •{" "}
                              {new Date(doc.cloudinary.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <VerificationBadge
                            status={doc.verification.status}
                            size="sm"
                          />

                          {/* Preview Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenPreview(doc)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-secondary hover:bg-primary/10 text-ink-soft hover:text-primary-glow text-xs font-semibold rounded-xl border border-border transition cursor-pointer"
                            title="View document modal"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>

                          {/* Open in Cloud Drive */}
                          <Link
                            href={`/drive?search=${encodeURIComponent(doc.cloudinary.originalName)}`}
                            className="p-2 text-ink-soft hover:text-primary-glow rounded-xl hover:bg-secondary border border-border transition"
                            title="View in Cloud Drive"
                          >
                            <HardDrive className="w-3.5 h-3.5" />
                          </Link>

                          {/* Delete Document */}
                          <button
                            type="button"
                            onClick={() => handleDelete(doc._id)}
                            disabled={deletingId === doc._id}
                            className="p-2 text-ink-soft hover:text-rose-500 rounded-xl hover:bg-rose-50 border border-border transition disabled:opacity-30 cursor-pointer"
                            title="Delete document"
                          >
                            {deletingId === doc._id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* PENDING PROCESSING CARD */}
                      {isPending && (
                        <div className="bg-amber-500/10 border border-amber-500/25 rounded-xl p-3 text-[11px] space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                              Document Verification in Progress...
                            </span>
                            <span className="text-[10px] font-semibold bg-amber-500/20 text-amber-700 dark:text-amber-200 px-2 py-0.5 rounded-full">
                              Live Polling Active
                            </span>
                          </div>
                          <p className="text-amber-800/80 dark:text-amber-200/80 leading-relaxed">
                            Extracting text and verifying authenticity. Status will update automatically.
                          </p>
                          <div className="h-1.5 w-full bg-amber-500/20 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full animate-pulse w-3/4" />
                          </div>
                        </div>
                      )}

                      {/* VERIFIED SUCCESS SUMMARY CARD */}
                      {isVerified && doc.ai && (
                        <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-xl p-3.5 text-[11px] space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                              Verification Summary
                            </span>
                            <span className="font-extrabold text-emerald-700 dark:text-emerald-300">
                              Confidence: {doc.verification.confidence}%
                            </span>
                          </div>
                          <p className="text-ink-soft leading-relaxed">
                            {doc.ai.summary}
                          </p>
                        </div>
                      )}

                      {/* REJECTED SUMMARY CARD */}
                      {isRejected && (
                        <div className="bg-rose-500/10 border border-rose-500/25 rounded-xl p-3.5 text-[11px] space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
                              <XCircle className="w-3.5 h-3.5 text-rose-500" />
                              Verification Rejected
                            </span>
                            <span className="font-extrabold text-rose-700 dark:text-rose-300">
                              Confidence: {doc.verification.confidence}%
                            </span>
                          </div>
                          <p className="text-rose-900/80 dark:text-rose-200/80 leading-relaxed">
                            {doc.ai?.summary ||
                              doc.verification.reason ||
                              "Document verification rejected."}
                          </p>

                          {doc.ai?.issues && doc.ai.issues.length > 0 && (
                            <div className="pt-1 text-rose-700 dark:text-rose-300 font-medium space-y-1">
                              {doc.ai.issues.map((issue, idx) => (
                                <div key={idx} className="flex items-start gap-1.5">
                                  <span className="text-rose-500 font-bold">•</span>
                                  <span>{issue}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-surface border-t border-border flex items-center justify-between gap-3 shrink-0">
          <p className="text-[11px] text-ink-soft hidden sm:block">
            Official Document Verification & Credential Audit System
          </p>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto bg-secondary hover:bg-border text-ink font-bold px-6 py-2 rounded-xl text-xs transition cursor-pointer ml-auto"
          >
            Done
          </button>
        </div>
      </div>

      {/* Embedded Document Viewer Modal */}
      <DocumentViewerModal
        document={previewDoc}
        onClose={() => setPreviewDoc(null)}
      />
    </div>,
    document.body
  );
};
