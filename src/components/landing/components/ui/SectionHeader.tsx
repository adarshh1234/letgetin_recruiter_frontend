import React, { ReactNode } from 'react';
import { Badge } from './Badge';

export interface SectionHeaderProps {
  badge?: string;
  badgeIcon?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  className?: string;
  align?: 'center' | 'left';
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badge,
  badgeIcon,
  title,
  subtitle,
  className = '',
  align = 'center'
}) => {
  const alignmentClass = align === 'center' ? 'text-center mx-auto' : 'text-left';

  return (
    <div className={`max-w-3xl ${alignmentClass} ${className}`}>
      {badge && (
        <div className="mb-4">
          <Badge icon={badgeIcon} variant="pill">
            <span className="uppercase tracking-wider text-[11px] font-bold">{badge}</span>
          </Badge>
        </div>
      )}

      <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-[#061f3d] tracking-[-0.035em] leading-tight mb-4">
        {title}
      </h2>

      {subtitle && (
        <p className="text-base sm:text-lg text-slate-500 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};
