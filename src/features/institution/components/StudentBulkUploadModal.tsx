import React, { useRef, useState } from "react";
import { AlertCircle, CheckCircle2, Download, FileSpreadsheet, Info, Loader2, UploadCloud, X } from "lucide-react";
import { institutionService } from "../services/institutionService";
import { BulkUploadResult } from "../types";

interface StudentBulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// Matches the existing Student input fields (see InstitutionStudentsPage's Add Student form and
// studentImport.util.ts's REQUIRED_HEADERS). Two example rows only — never persisted anywhere.
const SAMPLE_CSV = `name,email,course,year,status
John Doe,john@example.com,B.Tech Computer Science,2026,Active
Jane Smith,jane@example.com,BCA,2025,Active
`;

function downloadSampleCsv() {
  const blob = new Blob([SAMPLE_CSV], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "student-bulk-upload-sample.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function StudentBulkUploadModal({ isOpen, onClose, onSuccess }: StudentBulkUploadModalProps) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<BulkUploadResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const reset = () => {
    setSelectedFile(null);
    setErrorMessage(null);
    setResult(null);
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const validateAndSet = (file: File) => {
    setErrorMessage(null);
    if (!/\.(csv|xlsx?)$/i.test(file.name)) {
      setErrorMessage("Please select a .csv or .xlsx file.");
      return;
    }
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setErrorMessage(null);
    try {
      const res = await institutionService.bulkUploadStudents(selectedFile);
      setResult(res);
      onSuccess();
    } catch (err: unknown) {
      setErrorMessage((err as { message?: string })?.message || "Failed to upload the file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg bg-surface border border-border rounded-3xl shadow-2xl overflow-hidden p-6 space-y-5 animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary-glow flex items-center justify-center">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-ink text-base">Bulk Upload Students</h3>
              <p className="text-[11px] text-ink-soft">CSV or XLSX with columns: name, email, course, year, skills, status</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-1.5 text-ink-soft hover:text-ink hover:bg-surface-alt rounded-xl transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!result && (
          <>
            <div className="flex items-start gap-2.5 bg-primary/5 border border-primary/15 rounded-xl px-3.5 py-3 text-xs text-ink-soft">
              <Info className="w-4 h-4 text-primary-glow shrink-0 mt-0.5" />
              <span>
                Download the sample CSV and add student details using the same format and column headers. Once
                completed, upload the CSV file here to bulk add students.
              </span>
            </div>

            <button
              type="button"
              onClick={downloadSampleCsv}
              className="inline-flex items-center gap-2 text-xs font-semibold border border-border text-ink px-3.5 py-2 rounded-xl hover:bg-surface-alt transition w-full justify-center"
            >
              <Download className="w-3.5 h-3.5" /> Download Sample CSV
            </button>
          </>
        )}

        {errorMessage && (
          <div className="bg-destructive/10 border border-destructive/30 text-destructive text-xs p-3 rounded-xl flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">{errorMessage}</div>
          </div>
        )}

        {result ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3.5 py-3 text-sm font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              {result.imported} student{result.imported === 1 ? "" : "s"} imported.
            </div>
            {result.duplicates > 0 && (
              <p className="text-xs text-ink-soft">{result.duplicates} row(s) skipped — already on your roster.</p>
            )}
            {result.failed.length > 0 && (
              <div className="max-h-40 overflow-y-auto border border-border rounded-xl divide-y divide-border">
                {result.failed.map((f, i) => (
                  <div key={i} className="px-3 py-2 text-xs text-ink-soft">
                    Row {f.row}: {f.reason}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : !selectedFile ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              if (e.dataTransfer.files?.[0]) validateAndSet(e.dataTransfer.files[0]);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition cursor-pointer flex flex-col items-center justify-center space-y-3 ${
              dragOver ? "border-primary-glow bg-primary/5 scale-[0.99]" : "border-border hover:border-primary-glow/60 hover:bg-secondary/40"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && validateAndSet(e.target.files[0])}
            />
            <div className="w-14 h-14 rounded-2xl bg-secondary text-primary-glow flex items-center justify-center shadow-inner">
              <FileSpreadsheet className="w-7 h-7" />
            </div>
            <p className="font-bold text-ink text-sm">Click to browse or drag &amp; drop file here</p>
            <p className="text-xs text-ink-soft">Supports .csv and .xlsx</p>
          </div>
        ) : (
          <div className="bg-secondary/50 border border-border rounded-2xl p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary-glow flex items-center justify-center shrink-0">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <p className="font-bold text-ink text-xs truncate">{selectedFile.name}</p>
            </div>
            {!isUploading && (
              <button onClick={() => setSelectedFile(null)} className="text-xs text-destructive hover:underline font-bold shrink-0">
                Change
              </button>
            )}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
          {result ? (
            <button
              onClick={handleClose}
              className="inline-flex items-center gap-2 bg-gradient-brand text-primary-foreground font-bold text-xs px-5 py-2.5 rounded-xl shadow-elegant hover:shadow-glow transition"
            >
              Done
            </button>
          ) : (
            <>
              <button onClick={handleClose} disabled={isUploading} className="px-4 py-2 text-xs font-bold text-ink-soft hover:text-ink rounded-xl transition">
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className="inline-flex items-center gap-2 bg-gradient-brand text-primary-foreground font-bold text-xs px-5 py-2.5 rounded-xl shadow-elegant hover:shadow-glow transition disabled:opacity-40"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4" /> Upload &amp; Process
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
