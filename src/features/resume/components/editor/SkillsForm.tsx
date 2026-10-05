import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { useAiCoachStore } from '../../store/useAiCoachStore';
import { Wrench, Plus, X, Sparkles, Check } from 'lucide-react';
import { ISkill } from '../../types';

export const SkillsForm: React.FC = () => {
  const { resume, addSkill, removeSkill, setActiveResumeContext } = useResumeStore();
  const { triggerSkillsAi } = useAiCoachStore();
  const headline = resume.content.personalInfo.headline || 'Software Engineer';
  const [skillInput, setSkillInput] = useState('');
  const [addedMessage, setAddedMessage] = useState<string | null>(null);

  // De-duplicate skills for display
  const rawSkills = resume.content.skills || [];
  const uniqueSkills: ISkill[] = [];
  const seenSkillNames = new Set<string>();

  rawSkills.forEach((s, idx) => {
    const name = (typeof s === 'string' ? s : s?.name || '').trim();
    if (!name) return;
    const lower = name.toLowerCase();
    if (!seenSkillNames.has(lower)) {
      seenSkillNames.add(lower);
      uniqueSkills.push(
        typeof s === 'string'
          ? { id: `skill-${idx}`, name, category: 'Technical Skills', level: 5 }
          : { ...s, name }
      );
    }
  });

  const handleAdd = (nameToAdd?: string) => {
    const val = (nameToAdd || skillInput).trim();
    if (!val || seenSkillNames.has(val.toLowerCase())) return;

    addSkill(val);
    if (!nameToAdd) setSkillInput('');
    setAddedMessage(`Added "${val}" to your skills!`);
    setTimeout(() => setAddedMessage(null), 2500);
  };

  return (
    <div className="space-y-5 bg-surface p-5 rounded-2xl border border-border shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-border gap-3">
        <div>
          <h3 className="text-sm font-bold text-ink flex items-center gap-2">
            <Wrench className="w-4 h-4 text-primary-glow" />
            Skills & Technical Proficiencies
          </h3>
          <p className="text-xs text-ink-soft mt-0.5">
            Targeting: <span className="text-primary-glow font-semibold">{headline}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => triggerSkillsAi()}
          className="flex items-center gap-1.5 text-xs text-primary-foreground bg-gradient-brand px-3.5 py-1.5 rounded-xl transition-all font-semibold shadow-elegant hover:shadow-glow cursor-pointer"
          title="Open skill recommendations with LetGetIn AI Coach"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Suggest Skills with AI</span>
        </button>
      </div>

      {/* Manual Skill Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={skillInput}
          onFocus={() =>
            setActiveResumeContext({
              section: 'skills',
              field: 'skill',
              value: skillInput,
            })
          }
          onChange={(e) => {
            setSkillInput(e.target.value);
            setActiveResumeContext({
              section: 'skills',
              field: 'skill',
              value: e.target.value,
            });
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="e.g. React, TypeScript, Docker, Node.js..."
          className="input-base text-xs flex-1"
        />
        <button
          type="button"
          onClick={() => handleAdd()}
          className="bg-gradient-brand text-primary-foreground text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-elegant flex items-center gap-1 shrink-0 cursor-pointer hover:shadow-glow"
        >
          <Plus className="w-4 h-4" /> Add Skill
        </button>
      </div>

      {/* Added Confirmation Alert */}
      {addedMessage && (
        <div className="text-xs font-semibold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl flex items-center gap-2 animate-fade-up">
          <Check className="w-4 h-4" />
          {addedMessage}
        </div>
      )}

      {/* Active Resume Skills */}
      <div>
        <div className="text-xs font-semibold text-ink-soft mb-2">
          Active Resume Skills ({uniqueSkills.length}):
        </div>
        {uniqueSkills.length === 0 ? (
          <div className="text-xs text-ink-soft italic py-2">
            No skills added yet. Type a skill above or click &quot;Suggest Skills with AI&quot;.
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {uniqueSkills.map((skill) => (
              <span
                key={skill.id}
                className="bg-surface text-ink border border-border text-xs px-3 py-1 rounded-full flex items-center gap-2 shadow-xs font-medium"
              >
                {skill.name}
                <button
                  type="button"
                  onClick={() => removeSkill(skill.id)}
                  className="text-ink-soft hover:text-destructive transition-colors cursor-pointer"
                  title="Remove skill"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
