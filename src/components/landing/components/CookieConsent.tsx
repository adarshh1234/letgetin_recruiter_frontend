import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { CookiePreferencesModal, CookiePreferences } from './CookiePreferencesModal';

const COOKIE_STORAGE_KEY = 'cookieConsent';

export interface StoredCookieConsent {
  status: 'accepted' | 'rejected' | 'dismissed' | 'custom';
  preferences: CookiePreferences;
  timestamp?: string;
}

export const CookieConsent: React.FC<{ onNavigateToCookiePolicy?: () => void }> = ({ onNavigateToCookiePolicy }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [currentPreferences, setCurrentPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(COOKIE_STORAGE_KEY);
      if (stored) {
        const parsed: StoredCookieConsent = JSON.parse(stored);
        if (parsed && parsed.status) {
          if (parsed.preferences) {
            setCurrentPreferences(parsed.preferences);
          }
          setIsVisible(false);
          return;
        }
      }
      // If no consent exists, display the banner
      setIsVisible(true);
    } catch (e) {
      console.warn('Unable to access localStorage for cookie consent', e);
      setIsVisible(true);
    }
  }, []);

  const saveConsent = (
    status: 'accepted' | 'rejected' | 'dismissed' | 'custom',
    preferences: CookiePreferences
  ) => {
    const consentData: StoredCookieConsent = {
      status,
      preferences,
      timestamp: new Date().toISOString(),
    };
    try {
      localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(consentData));
    } catch (e) {
      console.warn('Failed to save cookie consent to localStorage', e);
    }
    setCurrentPreferences(preferences);
    setIsVisible(false);
    setIsPreferencesOpen(false);
  };

  const handleAcceptAll = () => {
    saveConsent('accepted', {
      necessary: true,
      analytics: true,
      marketing: true,
    });
  };

  const handleRejectAll = () => {
    saveConsent('rejected', {
      necessary: true,
      analytics: false,
      marketing: false,
    });
  };

  const handleDismiss = () => {
    saveConsent('dismissed', {
      necessary: true,
      analytics: false,
      marketing: false,
    });
  };

  const handleSaveCustomPreferences = (prefs: CookiePreferences) => {
    saveConsent('custom', prefs);
  };

  const handleCookiePolicyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Close the banner and navigate to the dedicated Cookie Policy full page
    setIsVisible(false);
    setIsPreferencesOpen(false);
    if (onNavigateToCookiePolicy) {
      onNavigateToCookiePolicy();
    }
  };

  if (!isVisible && !isPreferencesOpen) {
    return null;
  }

  return (
    <>
      {isVisible && (
        <aside
          role="region"
          aria-label="Cookie consent banner"
          className="fixed bottom-0 inset-x-0 z-[100] bg-white border-t border-slate-200/90 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] py-3 sm:py-3.5 px-4 sm:px-6 lg:px-8 text-slate-800 font-sans transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
        >
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-6">
            {/* Cookie text on left */}
            <div className="flex-1 text-[13px] sm:text-sm text-slate-700 leading-snug">
              We and our vendors use cookies and similar technologies to enhance your experience,
              analyze site traffic, personalize content, and deliver targeted advertising. We need
              your consent to use non-essential cookies. You can choose which categories to allow
              below. For more details, please see our{' '}
              <button
                type="button"
                onClick={handleCookiePolicyClick}
                className="text-slate-900 underline underline-offset-2 hover:text-brand-600 transition-colors font-medium focus-visible:ring-2 focus-visible:ring-brand-500 focus:outline-none rounded-xs cursor-pointer bg-transparent border-none p-0"
              >
                Cookie Policy
              </button>
              .
            </div>

            {/* Action buttons & controls matching reference design */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0 w-full sm:w-auto justify-start sm:justify-end">
              <button
                type="button"
                onClick={handleCookiePolicyClick}
                className="text-[13px] sm:text-sm text-slate-900 underline underline-offset-2 hover:text-brand-600 transition-colors font-medium py-1.5 px-1 focus-visible:ring-2 focus-visible:ring-brand-500 focus:outline-none rounded-xs cursor-pointer bg-transparent border-none"
              >
                Cookie Policy
              </button>

              <button
                type="button"
                onClick={() => setIsPreferencesOpen(true)}
                className="px-3.5 sm:px-4 py-1.5 sm:py-2 text-[13px] sm:text-sm font-medium text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-brand-500 focus:outline-none cursor-pointer"
              >
                Customize My Choices
              </button>

              <button
                type="button"
                onClick={handleRejectAll}
                className="px-3.5 sm:px-4 py-1.5 sm:py-2 text-[13px] sm:text-sm font-medium text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-brand-500 focus:outline-none cursor-pointer"
              >
                Reject All
              </button>

              <button
                type="button"
                onClick={handleAcceptAll}
                className="px-3.5 sm:px-4 py-1.5 sm:py-2 text-[13px] sm:text-sm font-medium text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-brand-500 focus:outline-none cursor-pointer"
              >
                Accept All
              </button>

              <button
                type="button"
                onClick={handleDismiss}
                aria-label="Close cookie consent banner"
                className="p-1.5 sm:p-2 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-lg transition-colors ml-1 focus-visible:ring-2 focus-visible:ring-brand-500 focus:outline-none cursor-pointer"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Preferences Modal Dialog */}
      <CookiePreferencesModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
        onSavePreferences={handleSaveCustomPreferences}
        onAcceptAll={handleAcceptAll}
        onRejectAll={handleRejectAll}
        initialPreferences={currentPreferences}
      />
    </>
  );
};
