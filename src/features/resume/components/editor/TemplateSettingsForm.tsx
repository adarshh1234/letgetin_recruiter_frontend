import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { Settings, Palette, Type, AlignLeft, Scaling } from 'lucide-react';
import { CustomSelect, SelectOption } from '../common/CustomSelect';

const FONT_OPTIONS: SelectOption[] = [
  { value: 'Inter', label: 'Inter (Modern Clean)', sublabel: 'Recommended for tech & corporate roles' },
  { value: 'Roboto', label: 'Roboto (Technical Standard)', sublabel: 'Clean geometric standard font' },
  { value: 'Georgia', label: 'Georgia (Classic Serif)', sublabel: 'Traditional elegance for executive/legal roles' },
  { value: 'Outfit', label: 'Outfit (Contemporary)', sublabel: 'Modern headings and stylish layout' },
];

const FONT_SIZE_OPTIONS: SelectOption[] = [
  { value: 'sm', label: 'Compact (Small)', sublabel: 'Fits more content per page' },
  { value: 'md', label: 'Normal (Medium)', sublabel: 'Standard balanced readability' },
  { value: 'lg', label: 'Large (Spacious)', sublabel: 'Enhanced readability and whitespace' },
];

const LINE_SPACING_OPTIONS: SelectOption[] = [
  { value: 'compact', label: 'Tight', sublabel: 'Dense line height' },
  { value: 'normal', label: 'Normal', sublabel: 'Standard balanced spacing' },
  { value: 'relaxed', label: 'Relaxed', sublabel: 'Airy line height' },
];

export const TemplateSettingsForm: React.FC = () => {
  const { resume, updateSettings } = useResumeStore();
  const settings = resume.settings;

  const colorPresets = [
    { name: 'Slate Dark', hex: '#0f172a' },
    { name: 'Indigo Night', hex: '#4f46e5' },
    { name: 'Emerald Forest', hex: '#059669' },
    { name: 'Crimson Rose', hex: '#e11d48' },
    { name: 'Royal Sapphire', hex: '#2563eb' },
  ];

  return (
    <div className="space-y-5 bg-surface p-5 rounded-2xl border border-border shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <h3 className="text-sm font-bold text-ink flex items-center gap-2">
          <Settings className="w-4 h-4 text-primary-glow" />
          Template Styling & Design Tokens
        </h3>
      </div>

      {/* Primary Color Accent */}
      <div>
        <label className="block text-xs font-semibold text-ink-soft mb-2 flex items-center gap-2">
          <Palette className="w-3.5 h-3.5 text-primary-glow" />
          Primary Theme Color
        </label>
        <div className="flex items-center gap-3">
          {colorPresets.map((c) => (
            <button
              key={c.hex}
              onClick={() => updateSettings({ primaryColor: c.hex })}
              style={{ backgroundColor: c.hex }}
              className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer ${
                settings.primaryColor === c.hex ? 'border-primary-glow scale-110 shadow-md ring-2 ring-primary-glow/30' : 'border-transparent opacity-80 hover:opacity-100'
              }`}
              title={c.name}
            />
          ))}
          <input
            type="color"
            value={settings.primaryColor}
            onChange={(e) => updateSettings({ primaryColor: e.target.value })}
            className="w-8 h-8 rounded-xl bg-transparent cursor-pointer border border-border"
          />
        </div>
      </div>

      {/* Font Family Custom Select */}
      <div>
        <label className="block text-xs font-semibold text-ink-soft mb-2 flex items-center gap-2">
          <Type className="w-3.5 h-3.5 text-primary-glow" />
          Typography Font Family
        </label>
        <CustomSelect
          value={settings.fontFamily}
          onChange={(val) => updateSettings({ fontFamily: val })}
          options={FONT_OPTIONS}
        />
      </div>

      {/* Font Size & Line Spacing Custom Selects */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-ink-soft mb-2 flex items-center gap-1.5">
            <Scaling className="w-3.5 h-3.5 text-primary-glow" />
            Font Size
          </label>
          <CustomSelect
            value={settings.fontSize}
            onChange={(val) => updateSettings({ fontSize: val as 'sm' | 'md' | 'lg' })}
            options={FONT_SIZE_OPTIONS}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink-soft mb-2 flex items-center gap-1.5">
            <AlignLeft className="w-3.5 h-3.5 text-primary-glow" />
            Line Spacing
          </label>
          <CustomSelect
            value={settings.lineSpacing}
            onChange={(val) => updateSettings({ lineSpacing: val as 'compact' | 'normal' | 'relaxed' })}
            options={LINE_SPACING_OPTIONS}
          />
        </div>
      </div>
    </div>
  );
};
