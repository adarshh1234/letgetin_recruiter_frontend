import React from 'react';
import Link from 'next/link';
import { IResume } from '../../resume/types';
import { FileText, Edit, Trash2, Calendar, LayoutTemplate, CheckCircle2, Star } from 'lucide-react';

interface ResumeCardProps {
  resume: IResume;
  onDelete: (id: string) => void;
  onSetActive?: (id: string) => void;
  isSettingActive?: boolean;
}

export const ResumeCard: React.FC<ResumeCardProps> = ({
  resume,
  onDelete,
  onSetActive,
  isSettingActive,
}) => {
  return (
    <div
      className={`bg-surface border ${
        resume.isActive
          ? 'border-emerald-500/60 ring-2 ring-emerald-500/20 shadow-glow'
          : 'border-border hover:border-primary-glow/60'
      } rounded-3xl p-6 transition-all card-hover shadow-elegant flex flex-col justify-between group relative overflow-hidden`}
    >
      {/* Top Banner / Badge */}
      {resume.isActive && (
        <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-extrabold px-3 py-1 rounded-bl-xl shadow-xs flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          <span>Active for Applications</span>
        </div>
      )}

      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-brand flex items-center justify-center text-primary-foreground font-bold shadow-glow group-hover:scale-105 transition-transform">
            <FileText className="w-6 h-6" />
          </div>
          <button
            onClick={() => onDelete(resume.id)}
            className="text-ink-soft hover:text-destructive p-2 rounded-xl hover:bg-surface-alt transition-colors"
            title="Delete Resume"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-base font-bold text-ink group-hover:text-primary-glow transition-colors truncate">
            {resume.title}
          </h3>
        </div>
        <p className="text-xs text-ink-soft line-clamp-1 mb-4">
          {resume.content?.personalInfo?.headline || 'Software Professional'}
        </p>

        <div className="space-y-2 text-xs text-ink-soft font-medium mb-4">
          <div className="flex items-center gap-2">
            <LayoutTemplate className="w-4 h-4 text-primary-glow" />
            <span className="capitalize">{resume.templateId ? resume.templateId.replace('-', ' ') : 'Modern'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-ink-soft" />
            <span>Updated {resume.updatedAt ? new Date(resume.updatedAt).toLocaleDateString() : 'Recently'}</span>
          </div>
        </div>
      </div>

      <div className="pt-4 mt-2 border-t border-border space-y-2">
        {!resume.isActive && onSetActive && (
          <button
            type="button"
            onClick={() => onSetActive(resume.id)}
            disabled={isSettingActive}
            className="w-full text-xs font-bold text-ink-soft hover:text-ink hover:bg-surface-alt/80 border border-border py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Star className="w-3.5 h-3.5 text-amber-500" />
            <span>Set as Active Resume</span>
          </button>
        )}

        <Link
          href={`/builder?id=${resume.id}`}
          className="w-full bg-gradient-brand text-primary-foreground text-xs font-semibold py-2.5 rounded-xl shadow-elegant hover:shadow-glow transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
        >
          <Edit className="w-4 h-4" />
          <span>Open in Editor</span>
        </Link>
      </div>
    </div>
  );
};
