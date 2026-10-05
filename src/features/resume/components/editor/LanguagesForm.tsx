import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { Languages, Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { ILanguage } from '../../types';
import { CustomSelect, SelectOption } from '../common/CustomSelect';

const PROFICIENCY_OPTIONS: SelectOption[] = [
  { value: 'Native', label: 'Native / Mother Tongue', sublabel: 'First language / complete native fluency' },
  { value: 'Fluent', label: 'Fluent / Full Professional', sublabel: 'Able to work, negotiate, and speak with ease' },
  { value: 'Proficient', label: 'Proficient / Professional Working', sublabel: 'Strong technical & conversational ability' },
  { value: 'Intermediate', label: 'Intermediate / Limited Working', sublabel: 'Routine communication capability' },
  { value: 'Basic', label: 'Basic / Elementary', sublabel: 'Simple sentences & vocabulary' },
];

export const LanguagesForm: React.FC = () => {
  const { resume, addLanguage, updateLanguage, removeLanguage, reorderLanguages } = useResumeStore();
  const languages = resume.content.languages || [];

  const handleAdd = () => {
    const newLang: ILanguage = {
      id: `lang-${Date.now()}`,
      language: 'English',
      proficiency: 'Fluent',
    };
    addLanguage(newLang);
  };

  const moveLang = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= languages.length) return;
    const items = [...languages];
    const [moved] = items.splice(index, 1);
    items.splice(targetIndex, 0, moved);
    if (reorderLanguages) reorderLanguages(items);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-surface p-4 rounded-2xl border border-border shadow-sm">
        <div className="flex items-center gap-2">
          <Languages className="w-4 h-4 text-primary-glow" />
          <h3 className="text-sm font-bold text-ink">Languages</h3>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1.5 text-xs font-semibold bg-gradient-brand text-primary-foreground px-3 py-1.5 rounded-xl shadow-elegant transition-all hover:shadow-glow cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Language</span>
        </button>
      </div>

      {languages.length === 0 ? (
        <div className="text-center py-8 bg-surface/50 rounded-2xl border border-dashed border-border text-ink-soft text-xs">
          No languages added yet. Click &quot;Add Language&quot; to specify your spoken/written languages.
        </div>
      ) : (
        languages.map((lang, idx) => (
          <div key={lang.id} className="bg-surface p-5 rounded-2xl border border-border space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-primary-glow bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                  #{idx + 1}
                </span>
                <span className="text-xs font-semibold text-ink">{lang.language || 'Language'}</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => moveLang(idx, 'up')}
                  className="p-1 text-ink-soft hover:text-ink disabled:opacity-30 cursor-pointer"
                  title="Move Up"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={idx === languages.length - 1}
                  onClick={() => moveLang(idx, 'down')}
                  className="p-1 text-ink-soft hover:text-ink disabled:opacity-30 cursor-pointer"
                  title="Move Down"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => removeLanguage(lang.id)}
                  className="p-1 text-destructive hover:opacity-80 ml-2 cursor-pointer"
                  title="Delete Language"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-ink-soft font-semibold mb-1">Language Name</label>
                <input
                  type="text"
                  value={lang.language}
                  onChange={(e) => updateLanguage(lang.id, { language: e.target.value })}
                  placeholder="e.g. English, Spanish, German"
                  className="input-base text-xs"
                />
              </div>

              <div>
                <label className="block text-ink-soft font-semibold mb-1">Proficiency Level</label>
                <CustomSelect
                  value={lang.proficiency}
                  onChange={(val) => updateLanguage(lang.id, { proficiency: val as ILanguage['proficiency'] })}
                  options={PROFICIENCY_OPTIONS}
                />
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
