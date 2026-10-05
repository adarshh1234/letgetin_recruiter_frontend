import React from 'react';
import Link from 'next/link';

export interface LogoProps {
  dark?: boolean;
  className?: string;
  href?: string;
}

export function Logo({ dark = false, className = '', href = '/' }: LogoProps) {
  return (
    <Link href={href} className={`inline-flex items-center gap-2.5 font-bold group shrink-0 ${className}`}>
      <div
        className={
          dark
            ? "w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white font-bold text-sm"
            : "w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center text-primary-foreground font-bold text-sm shadow-glow"
        }
      >
        L
      </div>
      <span
        className={`text-xl font-bold tracking-tight ${dark ? "text-white" : "text-ink"}`}
      >
        Let<span className={dark ? "text-primary-glow" : "text-primary-glow"}>Get</span>In
      </span>
    </Link>
  );
}

export default Logo;
