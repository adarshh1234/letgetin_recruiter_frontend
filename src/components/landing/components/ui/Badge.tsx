import React, { ReactNode } from 'react';

export type BadgeVariant = 'pill' | 'fit' | 'outline' | 'success' | 'white';

export interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
  icon?: ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'pill',
  className = '',
  icon
}) => {
  const variantStyles = {
    pill: 'bg-pill-bg border border-pill-border text-pill-text shadow-2xs',
    fit: 'bg-fit-bg border border-fit-border text-fit-text shadow-2xs',
    outline: 'bg-white border border-slate-200 text-slate-700',
    success: 'bg-emerald-50 border border-emerald-200 text-emerald-700',
    white: 'bg-white/10 border border-white/20 text-white backdrop-blur-md'
  };

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${variantStyles[variant]} ${className}`}>
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </div>
  );
};
