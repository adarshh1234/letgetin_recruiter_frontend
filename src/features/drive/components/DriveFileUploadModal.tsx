import React, { useState, useRef } from "react";
import { UploadCloud, X, FileText, AlertCircle, Loader2, CheckCircle2, HardDrive } from "lucide-react";
import { DriveService, DriveFile, StorageStats } from "../services/driveService";

interface DriveFileUploadModalProps {
  isOpen: boolean;
  remainingBytes: number;
  onClose: () => void;
  onSuccess: (data: { file: DriveFile; stats: StorageStats }) => void;
}

export const DriveFileUploadModal: React.FC<DriveFileUploadModalProps> = ({
  isOpen,
  remainingBytes,
  onClose,
  onSuccess,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const remainingMb = (remainingBytes / (1024 * 1024)).toFixed(2);

  const validateFile = (file: File): boolean => {
    setErrorMessage(null);
    if (file.size > remainingBytes) {
      const fileMb = (file.size / (1024 * 1024)).toFixed(2);
      setErrorMessage(
        `File size (${fileMb} MB) exceeds your remaining storage quota (${remainingMb} MB). Free up space or upload a smaller file.`
      );
      return false;
    }
    return true;
  };

  const handleFileSelect = (file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleStartUpload = async () => {
    if (!selectedFile) return;
    if (!validateFile(selectedFile)) return;

    setIsUploading(true);
    setUploadProgress(0);
    setErrorMessage(null);

    try {
      const result = await DriveService.uploadFile(selectedFile, (progress) => {
        setUploadProgress(progress);
      });
      onSuccess(result);
      handleReset();
      onClose();
    } catch (err: any) {
      setErrorMessage(
        err?.message || err?.error?.message || "Failed to upload file to drive."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setErrorMessage(null);
    setUploadProgress(0);
    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg bg-surface border border-border rounded-3xl shadow-2xl overflow-hidden p-6 space-y-5 animate-in zoom-in-95">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary-glow flex items-center justify-center font-bold">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-ink text-base">Upload File to Drive</h3>
              <p className="text-[11px] text-ink-soft">
                {remainingMb} MB storage space available
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isUploading}
            className="p-1.5 text-ink-soft hover:text-ink hover:bg-surface-alt rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs p-3 rounded-xl flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
            <div className="flex-1">{errorMessage}</div>
          </div>
        )}

        {/* Dropzone Area */}
        {!selectedFile ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition cursor-pointer flex flex-col items-center justify-center space-y-3 ${
              dragOver
                ? "border-primary-glow bg-primary/5 scale-[0.99]"
                : "border-border hover:border-primary-glow/60 hover:bg-secondary/40"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleInputChange}
              className="hidden"
            />
            <div className="w-14 h-14 rounded-2xl bg-secondary text-primary-glow flex items-center justify-center shadow-inner">
              <UploadCloud className="w-7 h-7 animate-bounce" />
            </div>
            <div>
              <p className="font-bold text-ink text-sm">
                Click to browse or drag & drop file here
              </p>
              <p className="text-xs text-ink-soft mt-1">
                Supports PDF, DOCX, Images, XLSX, ZIP, Audio, Video & any file format
              </p>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-primary-glow bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
              Max limit: {remainingMb} MB remaining
            </span>
          </div>
        ) : (
          /* Selected File Preview Box */
          <div className="bg-secondary/50 border border-border rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary-glow flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-ink text-xs truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-[10px] text-ink-soft">
                    {formatFileSize(selectedFile.size)} • {selectedFile.type || "File"}
                  </p>
                </div>
              </div>
              {!isUploading && (
                <button
                  onClick={handleReset}
                  className="text-xs text-rose-500 hover:underline font-bold"
                >
                  Change
                </button>
              )}
            </div>

            {/* Upload Progress Bar */}
            {isUploading && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-ink flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-primary-glow" />
                    Uploading to Cloudinary...
                  </span>
                  <span className="text-primary-glow font-bold">{uploadProgress}%</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden border border-border">
                  <div
                    className="h-full bg-gradient-brand transition-all duration-300 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal Footer Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            className="px-4 py-2 text-xs font-bold text-ink-soft hover:text-ink rounded-xl transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleStartUpload}
            disabled={!selectedFile || isUploading}
            className="inline-flex items-center gap-2 bg-gradient-brand text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-elegant hover:shadow-glow transition cursor-pointer disabled:opacity-40"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4" />
                <span>Upload to Drive</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
