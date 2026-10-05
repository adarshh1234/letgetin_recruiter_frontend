import { useState, useEffect } from 'react';

/**
 * Custom hook to detect if window scroll Y exceeds a given threshold
 * @param threshold scroll offset in pixels (default: 20)
 */
export const useScrolled = (threshold: number = 20): boolean => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > threshold);
    };

    // Initial check
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return isScrolled;
};
