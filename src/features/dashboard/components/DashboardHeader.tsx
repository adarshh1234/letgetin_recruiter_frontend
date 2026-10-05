import React from 'react';
import { Logo } from '@/components/landing/Logo';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { Plus, LogOut, Sparkles } from 'lucide-react';

interface DashboardHeaderProps {
  onCreateNew: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onCreateNew }) => {
  const { user, logout } = useAuthStore();

  return (
    <header className="glass border-b border-white/20 text-ink px-6 py-4 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <Logo />
        <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-primary-glow bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
          <Sparkles className="w-3 h-3 text-primary-glow" /> Pro Account
        </span>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onCreateNew}
          className="flex items-center gap-2 bg-gradient-brand text-primary-foreground text-xs font-semibold px-4 py-2.5 rounded-xl shadow-elegant hover:shadow-glow transition-all hover:scale-[1.02] active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Resume</span>
        </button>

        <div className="flex items-center gap-3 border-l border-border pl-4">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-ink">{user?.fullName || 'User Account'}</div>
            <div className="text-[10px] text-ink-soft">{user?.email || 'user@example.com'}</div>
          </div>
          <button
            onClick={() => logout()}
            className="text-ink-soft hover:text-destructive p-2 rounded-xl hover:bg-surface-alt transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
