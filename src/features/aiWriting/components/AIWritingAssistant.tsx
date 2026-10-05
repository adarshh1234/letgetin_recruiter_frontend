import React, { useCallback, useRef, useState } from 'react';
import { AIWritingAction, AIWritingContext } from '../types';
import { CONTEXT_LABELS, MAX_TEXT_LENGTH } from '../config/writingContexts';
import { aiWritingService } from '../services/aiWritingService';
import { AIWritingMenu } from './AIWritingMenu';
import { AIWritingPreview } from './AIWritingPreview';

interface AIWritingAssistantProps {
  value: string;
  context: AIWritingContext;
  metadata?: Record<string, string>;
  onApply: (next: string) => void;
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>;
  label?: string;
  className?: string;
  disabled?: boolean;
  iconOnly?: boolean;
  title?: string;
}

interface SelectionRange {
  start: number;
  end: number;
  text: string;
}

export const AIWritingAssistant: React.FC<AIWritingAssistantProps> = ({
  value,
  context,
  metadata,
  onApply,
  textareaRef,
  label,
  className,
  disabled,
  iconOnly,
  title,
}) => {
  const [activeAction, setActiveAction] = useState<AIWritingAction | null>(null);
  const [selection, setSelection] = useState<SelectionRange | null>(null);
  const [inFlight, setInFlight] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const captureSelection = useCallback((): SelectionRange | null => {
    const el = textareaRef?.current;
    if (!el) return null;
    const { selectionStart, selectionEnd } = el;
    if (selectionStart == null || selectionEnd == null || selectionStart === selectionEnd) return null;
    return { start: selectionStart, end: selectionEnd, text: value.slice(selectionStart, selectionEnd) };
  }, [textareaRef, value]);

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
    const el = textareaRef?.current;
    const cursor = selection ? selection.end : el?.selectionEnd ?? value.length;
    const separator = value.slice(0, cursor).length > 0 && !/\s$/.test(value.slice(0, cursor)) ? ' ' : '';
    const next = value.slice(0, cursor) + separator + result + value.slice(cursor);
    onApply(next);
  };

  return (
    <>
      <div className={`flex items-center justify-between gap-2 mt-2 ${className}`}>
        <AIWritingMenu
          context={context}
          hasSelection={!!selection}
          disabled={disabled || inFlight}
          triggerLabel={label || "Write with AI"}
          iconOnly={iconOnly}
          triggerTitle={title}
          onSelectAction={handleSelectAction}
        />
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            AI Assistant
          </span>
          <AIWritingMenu
            context={context}
            hasSelection={!!selection}
            disabled={disabled || inFlight}
            variant="floating-badge"
            triggerTitle="QuillBot AI Assistant"
            onSelectAction={handleSelectAction}
          />
        </div>
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
    </>
  );
};
