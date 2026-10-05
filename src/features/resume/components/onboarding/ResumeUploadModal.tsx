'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, CheckCircle2, AlertCircle, Loader2, Sparkles, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ResumeImportService } from '../../services/ResumeImportService';
import { useAuthStore } from '@/features/auth/store/useAuthStore';

interface ResumeUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeUploadModal: React.FC<ResumeUploadModalProps> = ({ isOpen, onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pasteText, setPasteText] = useState('');
  const [inputMode, setInputMode] = useState<'file' | 'text'>('file');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.size > 15 * 1024 * 1024) {
        setError('File size exceeds 15MB limit.');
        return;
      }
      setFile(selected);
      setError(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selected = e.dataTransfer.files[0];
      setFile(selected);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    setIsParsing(true);
    setError(null);

    try {
      let imported: any = null;
      if (inputMode === 'file') {
        if (!file) {
          setError('Please select a file to upload.');
          setIsParsing(false);
          return;
        }
        imported = await ResumeImportService.importFromFile(file);
      } else {
        if (!pasteText.trim()) {
          setError('Please paste your resume text.');
          setIsParsing(false);
          return;
        }
        imported = await ResumeImportService.importFromText(pasteText);
      }

      setIsParsing(false);
      onClose();
      useAuthStore.getState().completeOnboarding().catch(() => {});
      if (imported?.id) {
        router.push(`/builder?id=${imported.id}`);
      } else {
        router.push('/builder');
      }
    } catch (err: any) {
      console.error('Resume Import Error:', err);
      setError(err.message || 'Failed to import resume. Please verify your file or text content.');
      setIsParsing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-xl bg-surface border border-white/20 rounded-3xl p-6 sm:p-8 shadow-elegant text-ink overflow-hidden"
        >
          {/* Background Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary-glow/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary-deep/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            disabled={isParsing}
            className="absolute top-4 right-4 p-2 text-ink-soft hover:text-ink transition-colors rounded-xl hover:bg-surface-alt disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-brand text-primary-foreground rounded-2xl shadow-glow">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-ink">Upload & AI Extract Resume</h2>
              <p className="text-sm text-ink-soft">Import your PDF, DOCX, or paste text to convert into resume schema</p>
            </div>
          </div>

          {/* Mode Selection Tabs */}
          <div className="flex bg-surface-alt p-1 rounded-2xl border border-border mb-6">
            <button
              onClick={() => { setInputMode('file'); setError(null); }}
              className={`flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all ${
                inputMode === 'file'
                  ? 'bg-gradient-brand text-primary-foreground shadow-elegant'
                  : 'text-ink-soft hover:text-ink'
              }`}
            >
              Upload File (PDF / DOCX / TXT)
            </button>
            <button
              onClick={() => { setInputMode('text'); setError(null); }}
              className={`flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all ${
                inputMode === 'text'
                  ? 'bg-gradient-brand text-primary-foreground shadow-elegant'
                  : 'text-ink-soft hover:text-ink'
              }`}
            >
              Paste Raw Text
            </button>
          </div>

          {/* Modal Body */}
          {inputMode === 'file' ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                isDragOver
                  ? 'border-primary-glow bg-primary/10'
                  : file
                  ? 'border-success/50 bg-success/5'
                  : 'border-border bg-surface-alt hover:border-primary-glow/60'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc,.txt"
                onChange={handleFileChange}
                className="hidden"
              />
              {file ? (
                <>
                  <div className="p-3 bg-success/10 text-success rounded-full">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="font-semibold text-ink text-sm">{file.name}</p>
                    <p className="text-xs text-ink-soft mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <span className="text-xs text-primary-glow underline">Click to choose a different file</span>
                </>
              ) : (
                <>
                  <div className="p-3 bg-gradient-brand text-primary-foreground rounded-2xl shadow-glow">
                    <Upload className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="font-medium text-ink text-sm">Drag & drop your resume file here</p>
                    <p className="text-xs text-ink-soft mt-1">Supports PDF, DOCX, and TXT up to 15MB</p>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div>
              <textarea
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                placeholder="Paste your existing resume content, work experiences, skills, and summary here..."
                rows={7}
                className="input-base font-mono text-xs"
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 flex items-center gap-2 text-xs text-destructive bg-destructive/10 border border-destructive/20 p-3 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isParsing}
              className="px-4 py-2 text-xs font-semibold text-ink-soft hover:text-ink transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isParsing || (inputMode === 'file' && !file) || (inputMode === 'text' && !pasteText.trim())}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-brand text-primary-foreground text-xs font-semibold rounded-xl transition-all shadow-elegant hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95"
            >
              {isParsing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>AI Extracting & Normalizing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Parse & Convert Resume</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
