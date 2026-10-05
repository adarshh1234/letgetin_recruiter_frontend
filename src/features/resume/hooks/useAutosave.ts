import { useEffect, useRef } from 'react';
import { useResumeStore } from '../store/useResumeStore';
import { useAuthStore } from '../../auth/store/useAuthStore';

const AUTOSAVE_DEBOUNCE_MS = 2000;

export const useAutosave = () => {
  const { resume, isDirty, saveResume, isTailorModeActive } = useResumeStore();
  const { isAuthenticated } = useAuthStore();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Only trigger autosave if state is dirty (has changes)
    if (!isDirty) return;
    // Skip persisting while a Tailor Resume review is in progress - the live preview may
    // reflect staged/pending suggestions that haven't been explicitly saved yet.
    if (isTailorModeActive) return;

    // Clear previous pending debounce timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Set 2-second debounced background save
    timerRef.current = setTimeout(() => {
      // Check network connectivity before saving
      if (typeof window !== 'undefined' && !navigator.onLine && isAuthenticated) {
        console.warn('Network offline. Autosave deferred.');
        return;
      }

      saveResume();
    }, AUTOSAVE_DEBOUNCE_MS);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [resume, isDirty, isTailorModeActive, isAuthenticated, saveResume]);

  // Window unload listener to flush unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty && !isTailorModeActive) {
        saveResume();
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty, isTailorModeActive, isAuthenticated, saveResume]);
};
