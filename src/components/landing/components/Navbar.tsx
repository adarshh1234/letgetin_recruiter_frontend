import React, { useState } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';
import { useScrolled } from '../hooks/useScrolled';
import { LANDING_NAV_LINKS } from '../constants/landing.constants';
import { Button } from './ui/Button';

interface NavbarProps {
  onOpenDemo: () => void;
  onOpenSignIn: () => void;
  onNavigate?: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenDemo, onOpenSignIn, onNavigate }) => {
  const isScrolled = useScrolled(20);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-sky-100/80 shadow-xs'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Brand Logo */}
          <a
            href="/"
            onClick={(e) => {
              if (onNavigate) {
                e.preventDefault();
                onNavigate('/');
              }
            }}
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#063970] flex items-center justify-center text-white font-bold text-sm shadow-xs group-hover:bg-brand-600 transition-colors">
              <span className="font-display">L</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-display text-xl font-bold tracking-tight text-[#061f3d]">
                Let<span className="text-gradient-blue">Get</span>In
              </span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-pill-bg text-pill-text border border-pill-border tracking-wider">
                BETA
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-8 text-[13.5px] font-medium text-slate-600">
            {LANDING_NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-brand-600 transition-colors duration-150 py-1"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center space-x-6">
            <button
              onClick={onOpenSignIn}
              className="text-[13.5px] font-semibold text-[#0a192f] hover:text-brand-600 transition-colors px-2 py-1.5 cursor-pointer"
            >
              Sign In
            </button>
            <Button
              onClick={onOpenDemo}
              variant="gradient"
              size="md"
            >
              <span>Get In — Free</span>
            </Button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-[#0a192f] hover:bg-sky-50 transition-colors"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-sky-100 bg-white px-6 pt-4 pb-6 space-y-4 shadow-xl animate-in slide-in-from-top duration-200">
          <nav className="space-y-3">
            {LANDING_NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-medium text-slate-700 hover:text-brand-600 py-1"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-4 border-t border-sky-100 flex flex-col space-y-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSignIn();
              }}
              className="w-full text-center py-2.5 text-sm font-semibold text-[#0a192f] border border-slate-200 rounded-xl hover:bg-sky-50"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDemo();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-white btn-gradient-blue rounded-xl shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-sky-300" />
              <span>Get In — Free</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
