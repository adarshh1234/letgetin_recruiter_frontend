import React from 'react';
import { Sparkles, Bot } from 'lucide-react';

interface AIWritingButtonProps {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
  className?: string;
  iconOnly?: boolean;
  variant?: 'default' | 'floating-badge';
  title?: string;
}

export const AIWritingButton: React.FC<AIWritingButtonProps> = ({
  onClick,
  disabled,
  label = 'Write with AI',
  className = '',
  iconOnly = false,
  variant = 'default',
  title,
}) => {
  if (variant === 'floating-badge') {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        title={title || "QuillBot AI Assistant"}
        className={`w-7 h-7 rounded-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white flex items-center justify-center shadow-md border border-emerald-400/40 transition-all cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        <Bot className="w-3.5 h-3.5 text-white" />
      </button>
    );
  }

  if (iconOnly) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        title={title || label}
        className={`p-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary-glow border border-primary/20 transition-all cursor-pointer shrink-0 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        <Sparkles className="w-3.5 h-3.5" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`inline-flex items-center gap-1.5 text-[11px] font-semibold text-primary-glow border border-primary/30 bg-primary/5 hover:bg-primary/10 rounded-lg px-2.5 py-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-xs ${className}`}
    >
      <Sparkles className="w-3.5 h-3.5" />
      <span>{label}</span>
    </button>
  );
};
