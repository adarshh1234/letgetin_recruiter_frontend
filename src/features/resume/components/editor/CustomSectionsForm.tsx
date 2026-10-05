'use client';

import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { LayoutGrid, Plus, Trash2, Minus } from 'lucide-react';
import { ICustomSection } from '../../types';

export const CustomSectionsForm: React.FC = () => {
  const {
    resume,
    addCustomSection,
    updateCustomSection,
    removeCustomSection,
    addCustomSectionItem,
    updateCustomSectionItem,
    removeCustomSectionItem,
  } = useResumeStore();

  const customSections = resume.content.customSections || [];

  const handleAddNewSection = () => {
    const newSection: ICustomSection = {
      id: `custom-sec-${Date.now()}`,
      title: 'Custom Section',
      items: [
        {
          id: `item-${Date.now()}`,
          title: '',
          subtitle: '',
          date: '',
          description: '',
        },
      ],
    };
    addCustomSection(newSection);
  };

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-surface p-4 rounded-2xl border border-border shadow-sm gap-3">
        <div>
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-primary-glow" />
            <h3 className="text-sm font-bold text-ink">Custom Sections</h3>
          </div>
          <p className="text-xs text-ink-soft mt-1 leading-relaxed">
            Create your own sections (e.g. Publications, Hobbies, Conferences, Awards, Volunteering). They appear in your resume preview.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddNewSection}
          className="flex items-center gap-1.5 text-xs font-semibold bg-gradient-brand text-primary-foreground px-3.5 py-1.5 rounded-xl shadow-elegant transition-all hover:shadow-glow cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Section</span>
        </button>
      </div>

      {/* Empty State */}
      {customSections.length === 0 ? (
        <div className="text-center py-8 bg-surface/50 rounded-2xl border border-dashed border-border text-ink-soft text-xs">
          No custom sections yet. Click &quot;Add Section&quot; to create one.
        </div>
      ) : (
        customSections.map((sec) => (
          <div
            key={sec.id}
            className="bg-surface p-5 rounded-2xl border border-border space-y-4 shadow-sm"
          >
            {/* Section Header with Editable Title and Delete */}
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-border">
              <input
                type="text"
                value={sec.title}
                onChange={(e) => updateCustomSection(sec.id, { title: e.target.value })}
                placeholder="Section Name (e.g. Publications, Awards, Volunteering)"
                className="input-base text-xs font-bold text-ink flex-1 bg-surface-alt/70"
              />

              <button
                type="button"
                onClick={() => removeCustomSection(sec.id)}
                className="p-2 text-ink-soft hover:text-destructive hover:bg-surface-alt rounded-lg transition-colors cursor-pointer shrink-0"
                title="Delete this custom section"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Entries List */}
            <div className="space-y-3">
              {(sec.items || []).map((item) => (
                <div
                  key={item.id}
                  className="bg-surface-alt/50 border border-border/80 rounded-xl p-4 space-y-3 shadow-xs"
                >
                  {/* Row 1: Title & Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-ink-soft font-semibold text-[11px] mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) =>
                          updateCustomSectionItem(sec.id, item.id, { title: e.target.value })
                        }
                        placeholder="e.g. Research Paper Title / Award Name / Conference"
                        className="input-base text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-ink-soft font-semibold text-[11px] mb-1">
                        Date
                      </label>
                      <input
                        type="text"
                        value={item.date || ''}
                        onChange={(e) =>
                          updateCustomSectionItem(sec.id, item.id, { date: e.target.value })
                        }
                        placeholder="e.g. 2023 or 2023-05"
                        className="input-base text-xs"
                      />
                    </div>
                  </div>

                  {/* Row 2: Subtitle (optional) */}
                  <div>
                    <label className="block text-ink-soft font-semibold text-[11px] mb-1">
                      Subtitle (optional)
                    </label>
                    <input
                      type="text"
                      value={item.subtitle || ''}
                      onChange={(e) =>
                        updateCustomSectionItem(sec.id, item.id, { subtitle: e.target.value })
                      }
                      placeholder="e.g. IEEE Transactions / Organization / Publisher"
                      className="input-base text-xs"
                    />
                  </div>

                  {/* Row 3: Description (one line per bullet point) */}
                  <div>
                    <label className="block text-ink-soft font-semibold text-[11px] mb-1">
                      Description (one line per bullet point)
                    </label>
                    <textarea
                      rows={2}
                      value={item.description || ''}
                      onChange={(e) =>
                        updateCustomSectionItem(sec.id, item.id, { description: e.target.value })
                      }
                      onFocus={(e) => {
                        e.target.style.height = 'auto';
                        e.target.style.height = `${Math.max(60, e.target.scrollHeight)}px`;
                      }}
                      onInput={(e: any) => {
                        e.target.style.height = 'auto';
                        e.target.style.height = `${Math.max(48, e.target.scrollHeight)}px`;
                      }}
                      placeholder="Details, key outcomes, or bullet points..."
                      className="input-base text-xs leading-relaxed resize-y overflow-hidden transition-all min-h-[48px]"
                    />
                  </div>

                  {/* Remove Entry Link */}
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => removeCustomSectionItem(sec.id, item.id)}
                      className="text-xs font-semibold text-ink-soft hover:text-destructive flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                      <span>Remove entry</span>
                    </button>
                  </div>
                </div>
              ))}

              {/* Add Entry Button */}
              <button
                type="button"
                onClick={() => addCustomSectionItem(sec.id)}
                className="w-full py-2.5 border border-dashed border-border hover:border-primary-glow/50 bg-surface-alt/30 hover:bg-surface-alt text-xs font-semibold text-ink-soft hover:text-ink rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add entry</span>
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
