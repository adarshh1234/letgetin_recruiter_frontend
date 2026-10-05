import React, { useRef, useEffect } from 'react';
import { useResumeStore } from '../../resume/store/useResumeStore';
import { useTailorResumeStore } from '../../tailorResume/store/useTailorResumeStore';

interface EditableTextProps {
  value: string;
  onChange: (newValue: string) => void;
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
  tagName?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
}

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  onChange,
  className = '',
  style = {},
  placeholder = 'Click to edit...',
  tagName: Tag = 'span',
}) => {
  const elementRef = useRef<HTMLElement>(null);
  const isTailorModeActive = useResumeStore((s) => s.isTailorModeActive);
  const session = useTailorResumeStore((s) => s.session);
  const showChanges = useTailorResumeStore((s) => s.showChanges);

  const safeValue = typeof value === 'string'
    ? value
    : (value && typeof value === 'object' && 'summary' in value)
    ? String((value as any).summary)
    : (value && typeof value === 'object' && 'name' in value)
    ? String((value as any).name)
    : String(value || '');

  // Keep DOM innerText synced with value prop when not focused
  useEffect(() => {
    if (elementRef.current && document.activeElement !== elementRef.current) {
      elementRef.current.innerText = safeValue;
    }
  }, [safeValue]);

  const handleBlur = () => {
    if (elementRef.current) {
      const newText = elementRef.current.innerText.trim();
      if (newText !== value) {
        onChange(newText);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && Tag !== 'p' && Tag !== 'div') {
      e.preventDefault();
      elementRef.current?.blur();
    }
  };

  // Determine if this text matches an accepted/edited tailored suggestion
  const trimmedValue = safeValue.trim();
  const isTailored = Boolean(
    isTailorModeActive &&
    showChanges &&
    session?.suggestions &&
    trimmedValue.length > 0 &&
    session.suggestions
      .filter((s) => s.status === 'accepted' || s.status === 'edited')
      .some((s) => {
        const proposed = (s.proposedText || '').trim();
        return proposed.length > 0 && (trimmedValue === proposed || trimmedValue.includes(proposed) || proposed.includes(trimmedValue));
      })
  );

  const tailoredHighlightClass = isTailored
    ? 'bg-emerald-100/90 text-emerald-950 ring-2 ring-emerald-500/60 rounded px-1.5 py-0.5 shadow-xs transition-all duration-300 print:bg-transparent print:ring-0 print:text-inherit print:p-0'
    : '';

  return (
    <Tag
      ref={elementRef as any}
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      style={style}
      data-placeholder={placeholder}
      className={`outline-none hover:ring-1 hover:ring-indigo-400/60 focus:ring-2 focus:ring-indigo-500 focus:bg-indigo-50/80 rounded transition-all cursor-text inline-block min-w-[20px] ${tailoredHighlightClass} ${className}`}
    />
  );
};
