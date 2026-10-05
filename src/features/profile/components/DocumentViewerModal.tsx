import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Download,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  FileText,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  HardDrive,
  FileCheck,
  ShieldCheck,
} from "lucide-react";
import { VerificationDocument } from "../services/verificationService";
import { VerificationBadge } from "./VerificationBadge";

interface DocumentViewerModalProps {
  document: VerificationDocument | null;
  onClose: () => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  document: doc,
  onClose,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [imageError, setImageError] = useState<boolean>(false);
  const [iframeError, setIframeError] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset state on document change
  useEffect(() => {
    setZoomLevel(100);
    setImageError(false);
    setIframeError(false);
  }, [doc]);

  // Close modal on ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (doc) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [doc, onClose]);

  if (!doc || !mounted) return null;

  const mimeType = doc.cloudinary.mimeType || "";
  const rawUrl = doc.cloudinary.cloudinaryUrl || "";
  const fileName = doc.cloudinary.originalName || "";

  // Clean raw Cloudinary URLs for inline delivery
  const cleanUrl =
    rawUrl.includes("cloudinary.com") && rawUrl.includes("/raw/upload/")
      ? rawUrl.replace("/raw/upload/", "/image/upload/fl_inline/")
      : rawUrl;

  const isImage =
    mimeType.startsWith("image/") ||
    /\.(png|jpg|jpeg|webp|gif|heic|svg)$/i.test(fileName);
  const isPdf =
    mimeType === "application/pdf" ||
    /\.pdf$/i.test(fileName) ||
    cleanUrl.includes(".pdf");
  const isDocx = /\.(docx|doc|pptx|ppt|xlsx|xls)$/i.test(fileName);

  // Cloudinary PDF Page 1 PNG Snapshot (works even for raw Cloudinary PDFs!)
  const pdfPngPreviewUrl =
    (isPdf || isDocx) && cleanUrl.includes("cloudinary.com")
      ? cleanUrl
          .replace(/\/raw\/upload\//, "/image/upload/")
          .replace(/\.pdf$/i, ".png")
          .replace("/upload/", "/upload/f_png,pg_1,w_1200/")
      : null;

  // Google Docs Embedded Viewer URL for office docs or PDFs
  const googleDocsViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(cleanUrl)}&embedded=true`;

  const formatSize = (bytes: number) => {
    if (!bytes) return "N/A";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 25, 250));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 25, 50));
  const handleZoomReset = () => setZoomLevel(100);

  // Effective image source for rendering inside zoomable image canvas
  const displayImageUrl = isImage
    ? cleanUrl
    : isPdf && pdfPngPreviewUrl && !imageError
      ? pdfPngPreviewUrl
      : null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      {/* Click backdrop to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Modal Container */}
      <div className="relative w-full max-w-5xl h-[92vh] bg-surface border border-border rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10 animate-scale-up">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-surface/90 backdrop-blur border-b border-border flex items-center justify-between flex-wrap gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary-glow flex items-center justify-center shrink-0">
              <FileCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3
                  className="font-bold text-ink text-base truncate max-w-md"
                  title={fileName}
                >
                  {fileName}
                </h3>
                <VerificationBadge status={doc.verification.status} size="sm" />
              </div>
              <p className="text-xs text-ink-soft flex items-center gap-3 mt-0.5 flex-wrap">
                <span className="capitalize">
                  {doc.documentType.replace(/_/g, " ")}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <HardDrive className="w-3 h-3 text-ink-soft/70" />
                  {formatSize(doc.cloudinary.size)}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-ink-soft/70" />
                  {new Date(doc.cloudinary.uploadedAt).toLocaleDateString()}
                </span>
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 shrink-0">
            {displayImageUrl && (
              <div className="hidden sm:flex items-center gap-1 bg-secondary/60 border border-border p-1 rounded-xl mr-1">
                <button
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 50}
                  className="p-1.5 text-ink-soft hover:text-ink rounded-lg hover:bg-secondary transition disabled:opacity-30 cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-semibold text-ink px-1.5">
                  {zoomLevel}%
                </span>
                <button
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 250}
                  className="p-1.5 text-ink-soft hover:text-ink rounded-lg hover:bg-secondary transition disabled:opacity-30 cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={handleZoomReset}
                  className="p-1.5 text-ink-soft hover:text-ink rounded-lg hover:bg-secondary transition cursor-pointer"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* <a
              href={cleanUrl}
              target="_blank"
              rel="noreferrer"
              download={fileName}
              className="inline-flex items-center gap-1.5 bg-gradient-brand text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-elegant hover:shadow-glow transition cursor-pointer"
              title="Download File"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </a> */}

            {/* <a
              href={cleanUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 text-ink-soft hover:text-ink rounded-xl border border-border hover:bg-secondary transition cursor-pointer"
              title="Open Original Link"
            >
              <ExternalLink className="w-4 h-4" />
            </a> */}

            <button
              onClick={onClose}
              className="p-2 text-ink-soft hover:text-rose-500 rounded-xl border border-border hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
              title="Close Modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Main Body (Document Display + AI Sidebar) */}
        <div className="flex-1 grid lg:grid-cols-[1fr_320px] min-h-0 overflow-hidden bg-slate-900/5 dark:bg-slate-950/50">
          {/* Document Viewer Canvas */}
          <div className="relative flex items-center justify-center p-4 overflow-auto min-h-0">
            {displayImageUrl ? (
              <div className="w-full h-full flex items-center justify-center overflow-auto p-2">
                <img
                  src={displayImageUrl}
                  alt={fileName}
                  onError={() => setImageError(true)}
                  style={{
                    transform: `scale(${zoomLevel / 100})`,
                    transformOrigin: "center center",
                  }}
                  className="max-w-full max-h-full object-contain rounded-2xl shadow-xl transition-transform duration-200"
                />
              </div>
            ) : isPdf && !iframeError ? (
              <iframe
                src={`${cleanUrl}#toolbar=1`}
                title={fileName}
                onError={() => setIframeError(true)}
                className="w-full h-full rounded-2xl border border-border bg-white shadow-inner"
              />
            ) : isDocx && !iframeError ? (
              <iframe
                src={googleDocsViewerUrl}
                title={fileName}
                onError={() => setIframeError(true)}
                className="w-full h-full rounded-2xl border border-border bg-white shadow-inner"
              />
            ) : (
              <div className="p-8 text-center space-y-4 max-w-md bg-surface border border-border rounded-3xl shadow-sm">
                <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary-glow mx-auto flex items-center justify-center">
                  <FileText className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-ink text-base">{fileName}</h4>
                  <p className="text-xs text-ink-soft">
                    Document is ready. Click below to view or download original
                    file.
                  </p>
                </div>
                <a
                  href={cleanUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-brand text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-elegant hover:shadow-glow transition cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" /> Open Original Document
                </a>
              </div>
            )}
          </div>

          {/* Verification Details Sidebar */}
          <div className="border-t lg:border-t-0 lg:border-l border-border bg-surface p-5 space-y-4 overflow-y-auto min-h-0 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <span className="font-extrabold text-ink flex items-center gap-2 text-sm">
                <ShieldCheck className="w-4 h-4 text-primary-glow" /> Verification Breakdown
              </span>
              <span className="font-bold text-ink text-xs bg-secondary px-2.5 py-1 rounded-full border border-border">
                Confidence: {doc.verification.confidence}%
              </span>
            </div>

            {/* Summary Card */}
            <div
              className={`p-3.5 rounded-2xl border space-y-2 ${
                doc.verification.status === "verified"
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-200"
                  : doc.verification.status === "rejected"
                    ? "bg-rose-500/10 border-rose-500/30 text-rose-950 dark:text-rose-200"
                    : "bg-amber-500/10 border-amber-500/30 text-amber-950 dark:text-amber-200"
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-xs">
                {doc.verification.status === "verified" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : doc.verification.status === "rejected" ? (
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                )}
                <span>
                  {doc.verification.status === "verified"
                    ? "Identity Credentials Match"
                    : doc.verification.status === "rejected"
                      ? "Verification Rejected"
                      : "Verification in Progress"}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed opacity-90">
                {doc.ai?.summary ||
                  doc.verification.reason ||
                  "Document submitted for credential verification."}
              </p>
            </div>

            {/* Discrepancies & Issues */}
            {doc.ai?.issues && doc.ai.issues.length > 0 && (
              <div className="space-y-2 pt-1">
                <h5 className="font-bold text-rose-600 dark:text-rose-400 text-xs uppercase tracking-wider">
                  Flagged Discrepancies ({doc.ai.issues.length})
                </h5>
                <div className="space-y-1.5 bg-rose-500/5 border border-rose-500/20 rounded-xl p-3 text-[11px]">
                  {doc.ai.issues.map((issue, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 text-rose-700 dark:text-rose-300"
                    >
                      <span className="text-rose-500 font-bold">•</span>
                      <span className="leading-tight">{issue}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Extracted Fields Metadata Table */}
            {doc.ai?.extractedFields &&
              Object.keys(doc.ai.extractedFields).length > 0 && (
                <div className="space-y-2 pt-2">
                  <h5 className="font-bold text-ink text-xs uppercase tracking-wider">
                    Extracted Fields Metadata
                  </h5>
                  <div className="bg-secondary/40 border border-border rounded-xl p-3 space-y-2 divide-y divide-border/60">
                    {Object.entries(doc.ai.extractedFields).map(
                      ([key, val]) => (
                        <div
                          key={key}
                          className="pt-1.5 first:pt-0 flex items-start justify-between gap-2"
                        >
                          <span className="text-[11px] font-semibold text-ink-soft capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}:
                          </span>
                          <span
                            className="text-[11px] font-medium text-ink truncate max-w-[150px]"
                            title={String(val)}
                          >
                            {String(val) || "N/A"}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

            <div className="pt-2 text-[10px] text-ink-soft text-center border-t border-border">
              Verified Credential Record • Document ID:{" "}
              {doc._id.slice(-8)}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};
