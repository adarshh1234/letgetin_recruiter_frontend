import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'gradient' | 'outline' | 'white' | 'ghost' | 'secondary';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  className?: string;
  icon?: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'gradient',
  size = 'md',
  isLoading = false,
  className = '',
  icon,
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-bold transition-all duration-200 cursor-pointer active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none';

  const sizeClasses = {
    sm: 'px-3.5 py-1.5 text-xs rounded-lg',
    md: 'px-6 py-2.5 text-[13.5px] rounded-full shadow-xs',
    lg: 'px-8 py-3.5 text-base rounded-full shadow-sm'
  };

  const variantClasses = {
    gradient: 'text-white btn-gradient-blue hover:shadow-blue-glow',
    outline: 'text-[#0a192f] bg-white hover:bg-sky-50 border border-sky-200 shadow-2xs',
    white: 'text-[#063970] bg-white hover:bg-sky-50 shadow-lg hover:shadow-xl',
    ghost: 'text-slate-600 hover:text-[#061f3d] hover:bg-slate-100/60',
    secondary: 'text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md'
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
      ) : icon ? (
        <span className="mr-2 inline-flex">{icon}</span>
      ) : null}
      {children}
    </button>
  );
};
