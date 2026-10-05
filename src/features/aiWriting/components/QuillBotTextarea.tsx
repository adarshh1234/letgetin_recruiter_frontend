import React, { useCallback, useRef, useState } from 'react';
import { AIWritingAction, AIWritingContext } from '../types';
import { CONTEXT_LABELS, MAX_TEXT_LENGTH } from '../config/writingContexts';
import { aiWritingService } from '../services/aiWritingService';
import { AIWritingMenu } from './AIWritingMenu';
import { AIWritingPreview } from './AIWritingPreview';

interface QuillBotTextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'onChange'> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onApply: (next: string) => void;
  context: AIWritingContext;
  metadata?: Record<string, string>;
  disabled?: boolean;
  containerClassName?: string;
}

interface SelectionRange {
  start: number;
  end: number;
  text: string;
}

export const QuillBotTextarea = React.forwardRef<HTMLTextAreaElement, QuillBotTextareaProps>(
  (
    {
      value,
      onChange,
      onApply,
      context,
      metadata,
      disabled,
      className = '',
      containerClassName = '',
      placeholder = 'Enter description...',
      rows = 4,
      ...rest
    },
    forwardedRef
  ) => {
    const internalRef = useRef<HTMLTextAreaElement | null>(null);

    const [activeAction, setActiveAction] = useState<AIWritingAction | null>(null);
    const [selection, setSelection] = useState<SelectionRange | null>(null);
    const [inFlight, setInFlight] = useState(false);
    const abortRef = useRef<AbortController | null>(null);

    const wordCount = React.useMemo(() => {
      const trimmed = (value || '').trim();
      return trimmed ? trimmed.split(/\s+/).length : 0;
    }, [value]);

    const charCount = (value || '').length;

    const captureSelection = useCallback((): SelectionRange | null => {
      const el = internalRef.current;
      if (!el) return null;
      const { selectionStart, selectionEnd } = el;
      if (selectionStart == null || selectionEnd == null || selectionStart === selectionEnd) return null;
      return { start: selectionStart, end: selectionEnd, text: value.slice(selectionStart, selectionEnd) };
    }, [value]);

    const handleSelectAction = (action: AIWritingAction) => {
      setSelection(captureSelection());
      setActiveAction(action);
    };

    const targetText = selection ? selection.text : value;

    const handleGenerate = async (instruction?: string, onChunk?: (partial: string) => void): Promise<string> => {
      if (inFlight) throw new Error('A request is already in progress.');
      setInFlight(true);
      const controller = new AbortController();
      abortRef.current = controller;
      try {
        const text = activeAction === 'generate' ? undefined : targetText.slice(0, MAX_TEXT_LENGTH);
        return await aiWritingService.generateStream(
          {
            action: activeAction as AIWritingAction,
            context,
            text,
            instruction,
            metadata,
          },
          (partial) => onChunk?.(partial),
          controller.signal
        );
      } finally {
        setInFlight(false);
        abortRef.current = null;
      }
    };

    const handleClosePreview = () => {
      abortRef.current?.abort();
      setActiveAction(null);
    };

    const handleReplace = (result: string) => {
      if (selection) {
        const next = value.slice(0, selection.start) + result + value.slice(selection.end);
        onApply(next);
      } else {
        onApply(result);
      }
    };

    const handleInsert = (result: string) => {
      const el = internalRef.current;
      const cursor = selection ? selection.end : el?.selectionEnd ?? value.length;
      const separator = value.slice(0, cursor).length > 0 && !/\s$/.test(value.slice(0, cursor)) ? ' ' : '';
      const next = value.slice(0, cursor) + separator + result + value.slice(cursor);
      onApply(next);
    };

    return (
      <div className={`relative w-full rounded-2xl border border-border bg-surface shadow-xs transition-all focus-within:border-emerald-500/60 focus-within:ring-2 focus-within:ring-emerald-500/10 ${containerClassName}`}>
        {/* TOP TOOLBAR: Write with AI dropdown at Top-Left & Analysis stats at Top-Right */}
        <div className="flex items-center justify-between px-3 pt-2.5 pb-1.5 border-b border-border/50 bg-surface/60 rounded-t-2xl">
          <AIWritingMenu
            context={context}
            hasSelection={!!selection}
            disabled={disabled || inFlight}
            triggerLabel="Write with AI"
            onSelectAction={handleSelectAction}
          />
          <div className="text-[10px] text-ink-soft/80 flex items-center gap-2 font-medium select-none">
            <span>{wordCount} words</span>
            <span>·</span>
            <span>{charCount} chars</span>
          </div>
        </div>

        {/* MAIN TEXTAREA */}
        <textarea
          ref={(node) => {
            internalRef.current = node;
            if (typeof forwardedRef === 'function') {
              forwardedRef(node);
            } else if (forwardedRef) {
              (forwardedRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
            }
          }}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          rows={rows}
          className={`w-full bg-transparent p-3.5 text-sm text-ink outline-none border-none resize-y min-h-[110px] pb-10 leading-relaxed ${className}`}
          {...rest}
        />

        {/* BOTTOM-RIGHT FLOATING GREEN QUILLBOT ICON BADGE */}
        <div className="absolute bottom-2.5 right-2.5 z-10 flex items-center gap-1.5">
          <AIWritingMenu
            context={context}
            hasSelection={!!selection}
            disabled={disabled || inFlight}
            variant="floating-badge"
            triggerTitle="QuillBot AI Assistant"
            onSelectAction={handleSelectAction}
          />
        </div>

        <AIWritingPreview
          isOpen={activeAction !== null}
          onClose={handleClosePreview}
          contextLabel={CONTEXT_LABELS[context]}
          action={activeAction || 'improve'}
          originalText={targetText}
          onGenerate={handleGenerate}
          onReplace={handleReplace}
          onInsert={handleInsert}
          onSelectAction={handleSelectAction}
        />
      </div>
    );
  }
);

QuillBotTextarea.displayName = 'QuillBotTextarea';
