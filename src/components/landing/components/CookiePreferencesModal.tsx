import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Check } from 'lucide-react';

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

interface CookiePreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePreferences: (preferences: CookiePreferences) => void;
  onAcceptAll: () => void;
  onRejectAll: () => void;
  initialPreferences?: CookiePreferences;
}

export const CookiePreferencesModal: React.FC<CookiePreferencesModalProps> = ({
  isOpen,
  onClose,
  onSavePreferences,
  onAcceptAll,
  onRejectAll,
  initialPreferences = { necessary: true, analytics: false, marketing: false },
}) => {
  const [preferences, setPreferences] = useState<CookiePreferences>(initialPreferences);

  useEffect(() => {
    if (isOpen) {
      setPreferences(initialPreferences);
    }
  }, [isOpen, initialPreferences]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleToggle = (category: keyof CookiePreferences) => {
    if (category === 'necessary') return; // Cannot toggle necessary cookies
    setPreferences((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleSave = () => {
    onSavePreferences(preferences);
  };

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-preferences-title"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden relative animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 sm:p-7 border-b border-slate-100 flex items-start justify-between">
          <div className="pr-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600 font-mono mb-1">
              <ShieldCheck className="w-4 h-4 text-brand-600" />
              <span>Privacy & Consent</span>
            </div>
            <h2 id="cookie-preferences-title" className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Cookie Preferences
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Manage how cookies are used on this site. You can adjust your consent preferences at any time.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cookie preferences dialog"
            className="p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors shrink-0 focus-visible:ring-2 focus-visible:ring-brand-500 focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories Body */}
        <div className="p-6 sm:p-7 overflow-y-auto space-y-5 text-sm">
          {/* Necessary Cookies */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex-1 pr-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-slate-900">Necessary Cookies</span>
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-100 text-emerald-800 rounded-full">
                  Always Active
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Essential for core website functionality, security, session integrity, and user authentication. These cannot be disabled.
              </p>
            </div>
            <div className="shrink-0 flex items-center">
              <div
                className="w-11 h-6 bg-emerald-500 rounded-full p-1 cursor-not-allowed opacity-80 flex items-center"
                title="Always active"
                aria-hidden="true"
              >
                <div className="w-4 h-4 bg-white rounded-full shadow-xs transform translate-x-5 transition-transform flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-emerald-600 stroke-[3]" />
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Cookies */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 transition-colors">
            <div className="flex-1 pr-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-slate-900">Analytics Cookies</span>
                <span className="text-xs text-slate-500 font-mono">Performance & Insights</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Allow us to analyze site traffic, measure performance, and understand user interaction to continually improve our platform.
              </p>
            </div>
            <div className="shrink-0 flex items-center">
              <button
                type="button"
                role="switch"
                aria-checked={preferences.analytics}
                aria-label="Toggle Analytics Cookies"
                onClick={() => handleToggle('analytics')}
                className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out focus-visible:ring-2 focus-visible:ring-brand-500 focus:outline-none flex items-center ${
                  preferences.analytics ? 'bg-brand-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full shadow-xs transform transition-transform duration-200 ease-in-out flex items-center justify-center ${
                    preferences.analytics ? 'translate-x-5' : 'translate-x-0'
                  }`}
                >
                  {preferences.analytics && <Check className="w-2.5 h-2.5 text-brand-600 stroke-[3]" />}
                </div>
              </button>
            </div>
          </div>

          {/* Marketing Cookies */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 transition-colors">
            <div className="flex-1 pr-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-slate-900">Marketing & Advertising Cookies</span>
                <span className="text-xs text-slate-500 font-mono">Personalization</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Used to deliver relevant announcements, personalized recommendations, and measure the effectiveness of marketing campaigns.
              </p>
            </div>
            <div className="shrink-0 flex items-center">
              <button
                type="button"
                role="switch"
                aria-checked={preferences.marketing}
                aria-label="Toggle Marketing and Advertising Cookies"
                onClick={() => handleToggle('marketing')}
                className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out focus-visible:ring-2 focus-visible:ring-brand-500 focus:outline-none flex items-center ${
                  preferences.marketing ? 'bg-brand-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full shadow-xs transform transition-transform duration-200 ease-in-out flex items-center justify-center ${
                    preferences.marketing ? 'translate-x-5' : 'translate-x-0'
                  }`}
                >
                  {preferences.marketing && <Check className="w-2.5 h-2.5 text-brand-600 stroke-[3]" />}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 sm:p-6 bg-slate-50 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onRejectAll}
              className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-brand-500 focus:outline-none cursor-pointer"
            >
              Reject Optional
            </button>
            <button
              type="button"
              onClick={onAcceptAll}
              className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-brand-500 focus:outline-none cursor-pointer"
            >
              Accept All
            </button>
          </div>
          <button
            type="button"
            onClick={handleSave}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-white bg-[#063970] hover:bg-[#07498c] rounded-lg shadow-xs transition-colors focus-visible:ring-2 focus-visible:ring-brand-500 focus:outline-none cursor-pointer"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
