'use client';

import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { Link2, Plus, Trash2 } from 'lucide-react';
import { ISocialLink } from '../../types';

export const LinksForm: React.FC = () => {
  const { resume, addSocialLink, updateSocialLink, removeSocialLink } = useResumeStore();
  const socialLinks = resume.content.socialLinks || [];

  const handleAddLink = () => {
    const newLink: ISocialLink = {
      id: `soc-${Date.now()}`,
      platform: 'GitHub',
      label: '',
      url: 'https://',
      useLabelAsLink: true,
    };
    addSocialLink(newLink);
  };

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-surface p-4 rounded-2xl border border-border shadow-sm gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Link2 className="w-4 h-4 text-primary-glow" />
            <h3 className="text-sm font-bold text-ink">Websites & Social Links</h3>
          </div>
          <p className="text-xs text-ink-soft mt-1 leading-relaxed">
            Add links to your portfolio, GitHub, LinkedIn, or personal website. They will be clickable in your generated resume and open in a new tab.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddLink}
          className="flex items-center gap-1.5 text-xs font-semibold bg-gradient-brand text-primary-foreground px-3.5 py-1.5 rounded-xl shadow-elegant transition-all hover:shadow-glow cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Link</span>
        </button>
      </div>

      {/* Empty State */}
      {socialLinks.length === 0 ? (
        <div className="text-center py-8 bg-surface/50 rounded-2xl border border-dashed border-border text-ink-soft text-xs">
          No custom links added yet. Click &quot;Add Link&quot; to add your GitHub, LinkedIn, or Portfolio.
        </div>
      ) : (
        socialLinks.map((link) => (
          <div
            key={link.id}
            className="bg-surface p-5 rounded-2xl border border-border space-y-4 shadow-sm"
          >
            {/* Row 1: Label and URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-ink-soft font-semibold text-xs mb-1">
                  Label
                </label>
                <input
                  type="text"
                  value={link.label ?? link.platform ?? ''}
                  onChange={(e) =>
                    updateSocialLink(link.id, {
                      label: e.target.value,
                      platform: e.target.value,
                    })
                  }
                  placeholder="e.g. GitHub, LinkedIn, Portfolio..."
                  className="input-base text-xs"
                />
              </div>

              <div>
                <label className="block text-ink-soft font-semibold text-xs mb-1">
                  URL
                </label>
                <input
                  type="text"
                  value={link.url}
                  onChange={(e) => updateSocialLink(link.id, { url: e.target.value })}
                  placeholder="https://github.com/username"
                  className="input-base text-xs"
                />
              </div>
            </div>

            {/* Row 2: Toggle & Remove Button */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <label className="flex items-center gap-2 text-xs text-ink cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={link.useLabelAsLink ?? true}
                  onChange={(e) => updateSocialLink(link.id, { useLabelAsLink: e.target.checked })}
                  className="w-4 h-4 rounded text-primary border-border focus:ring-primary-glow cursor-pointer accent-primary"
                />
                <span className="font-medium text-ink-soft">Use label as the clickable link text</span>
              </label>

              <button
                type="button"
                onClick={() => removeSocialLink(link.id)}
                className="flex items-center gap-1.5 text-xs text-destructive hover:opacity-80 font-semibold transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
