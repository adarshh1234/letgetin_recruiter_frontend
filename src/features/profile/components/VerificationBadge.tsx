import React from 'react';
import { CheckCircle2, Loader2, XCircle, AlertCircle } from 'lucide-react';
import { VerificationStatus } from '../services/verificationService';

interface VerificationBadgeProps {
  status: VerificationStatus;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  status,
  size = 'md',
  showLabel = true,
}) => {
  const getBadgeDetails = () => {
    switch (status) {
      case 'verified':
        return {
          label: 'Verified',
          icon: CheckCircle2,
          color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400',
          animateIcon: false,
        };
      case 'pending':
        return {
          label: 'Verifying',
          icon: Loader2,
          color: 'bg-amber-500/15 text-amber-600 border-amber-500/30 dark:bg-amber-500/25 dark:text-amber-300 ring-1 ring-amber-500/20',
          animateIcon: true,
        };
      case 'rejected':
        return {
          label: 'Rejected',
          icon: XCircle,
          color: 'bg-rose-500/10 text-rose-600 border-rose-500/20 dark:bg-rose-500/20 dark:text-rose-400',
          animateIcon: false,
        };
      case 'unsubmitted':
      default:
        return {
          label: 'Not Submitted',
          icon: AlertCircle,
          color: 'bg-slate-500/10 text-slate-500 border-slate-500/20 dark:bg-slate-500/20 dark:text-slate-400',
          animateIcon: false,
        };
    }
  };

  const { label, icon: Icon, color, animateIcon } = getBadgeDetails();

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-xs font-bold gap-2',
  }[size];

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  }[size];

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border ${color} ${sizeClasses} transition-all duration-300`}
    >
      <Icon className={`${iconSizes} shrink-0 ${animateIcon ? 'animate-spin text-amber-500' : ''}`} />
      {showLabel && <span>{label}</span>}
      {status === 'pending' && (
        <span className="relative flex h-1.5 w-1.5 ml-0.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
        </span>
      )}
    </span>
  );
};
