import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Wand2 } from 'lucide-react';
import { AIWritingAction, AIWritingContext } from '../types';
import { ACTION_LABELS, CONTEXT_ACTIONS } from '../config/writingContexts';
import { AIWritingButton } from './AIWritingButton';

interface AIWritingMenuProps {
  context: AIWritingContext;
  hasSelection: boolean;
  disabled?: boolean;
  triggerLabel?: string;
  iconOnly?: boolean;
  variant?: 'default' | 'floating-badge';
  triggerTitle?: string;
  onSelectAction: (action: AIWritingAction) => void;
}

interface ACTION_GROUP {
  title: string;
  actions: AIWritingAction[];
}

export const AIWritingMenu: React.FC<AIWritingMenuProps> = ({
  context,
  hasSelection,
  disabled,
  triggerLabel,
  iconOnly,
  variant = 'default',
  triggerTitle,
  onSelectAction,
}) => {
  const [open, setOpen] = React.useState(false);
  const actions = CONTEXT_ACTIONS[context] || [];

  const groups: ACTION_GROUP[] = React.useMemo(() => {
    const isQuillBotContext = ['candidate-bio', 'company-about', 'startup-about', 'institution-about', 'job-description'].includes(context);
    if (!isQuillBotContext) {
      return [{ title: '', actions }];
    }
    return [
      {
        title: 'Core QuillBot Modes',
        actions: ['improve', 'rewrite', 'professional', 'grammar', 'simplify', 'expand', 'shorten', 'humanize'],
      },
      {
        title: 'Change Tone',
        actions: ['tone-formal', 'tone-friendly', 'tone-persuasive', 'tone-confident'],
      },
      {
        title: 'Translate Language',
        actions: ['translate-es', 'translate-fr', 'translate-de', 'translate-hi', 'translate-zh', 'translate-ja'],
      },
      {
        title: 'Tools & Analysis',
        actions: ['summarize', 'analyze', 'custom', 'generate'],
      },
    ];
  }, [actions, context]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <AIWritingButton
            onClick={() => {}}
            disabled={disabled}
            label={triggerLabel}
            iconOnly={iconOnly}
            variant={variant}
            title={triggerTitle}
          />
        }
      />
      <PopoverContent
        align="start"
        sideOffset={6}
        className="w-64 bg-surface border border-border text-ink rounded-2xl shadow-2xl ring-0 p-2 max-h-96 overflow-y-auto"
      >
        {hasSelection && (
          <div className="px-2.5 py-1.5 mb-2 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
            Applies to selected text only
          </div>
        )}
        <div className="space-y-3">
          {groups.map((group, idx) => {
            const validActions = group.actions.filter((a) => actions.includes(a));
            if (validActions.length === 0) return null;
            return (
              <div key={idx} className="space-y-1">
                {group.title && (
                  <div className="px-2 text-[10px] font-extrabold uppercase tracking-wider text-ink-soft/80">
                    {group.title}
                  </div>
                )}
                <div className="flex flex-col gap-0.5">
                  {validActions.map((action) => (
                    <button
                      key={action}
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        onSelectAction(action);
                      }}
                      className="flex items-center gap-2 text-left text-xs font-medium text-ink px-2.5 py-1.5 rounded-lg hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                    >
                      <Wand2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{ACTION_LABELS[action]}</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};
