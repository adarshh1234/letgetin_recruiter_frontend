import React, { useState } from 'react';
import { Sparkles, RefreshCw, Plus, X, AlertTriangle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { aiWritingService } from '../services/aiWritingService';
import { AIWritingButton } from './AIWritingButton';

interface AISkillSuggestButtonProps {
  existingSkills: string[];
  metadata?: Record<string, string>;
  onAddSkill: (skill: string) => void;
  label?: string;
}

export const AISkillSuggestButton: React.FC<AISkillSuggestButtonProps> = ({
  existingSkills,
  metadata,
  onAddSkill,
  label = 'Suggest Skills',
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [added, setAdded] = useState<Set<string>>(new Set());

  const fetchSuggestions = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await aiWritingService.generate({
        action: 'suggest-skills',
        context: 'skills',
        text: existingSkills.length > 0 ? existingSkills.join(', ') : undefined,
        metadata,
      });
      const existingLower = new Set(existingSkills.map((s) => s.toLowerCase()));
      const parsed = result
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && !existingLower.has(s.toLowerCase()));
      setSuggestions(Array.from(new Set(parsed)));
      setAdded(new Set());
    } catch (err: any) {
      setError(err?.error?.message || err?.message || "AI couldn't generate suggestions right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next && suggestions.length === 0 && !loading) fetchSuggestions();
      }}
    >
      <PopoverTrigger render={<AIWritingButton onClick={() => {}} label={label} />} />
      <PopoverContent
        align="start"
        sideOffset={6}
        className="w-72 bg-surface border border-border text-ink rounded-xl shadow-elegant ring-0 p-3"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-ink flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary-glow" />
            Suggested Skills
          </span>
          <button
            type="button"
            onClick={fetchSuggestions}
            disabled={loading}
            className="p-1 text-ink-soft hover:text-primary-glow rounded-md transition-colors cursor-pointer disabled:opacity-50"
            title="Regenerate"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-4 text-ink-soft text-xs gap-2">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-primary-glow" />
            Generating...
          </div>
        )}

        {!loading && error && (
          <div className="text-[11px] text-destructive bg-destructive/5 border border-destructive/20 rounded-lg px-2.5 py-2 flex items-start gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && suggestions.length === 0 && (
          <div className="text-[11px] text-ink-soft italic py-2">No new suggestions right now.</div>
        )}

        {!loading && !error && suggestions.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((skill) => {
              const isAdded = added.has(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  disabled={isAdded}
                  onClick={() => {
                    onAddSkill(skill);
                    setAdded((prev) => new Set(prev).add(skill));
                  }}
                  className={`flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full border transition-colors cursor-pointer ${
                    isAdded
                      ? 'bg-primary/10 border-primary/20 text-primary-glow cursor-default'
                      : 'bg-surface-alt border-border text-ink hover:border-primary-glow/40 hover:text-primary-glow'
                  }`}
                >
                  {isAdded ? <X className="w-3 h-3 rotate-45" /> : <Plus className="w-3 h-3" />}
                  {skill}
                </button>
              );
            })}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
