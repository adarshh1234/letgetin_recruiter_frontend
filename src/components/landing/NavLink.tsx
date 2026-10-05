import NextLink from 'next/link';
import React from 'react';

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to?: string;
  href?: string;
  children: React.ReactNode;
  className?: string;
}

export function Link({ to, href, children, className, ...props }: LinkProps) {
  const targetPath = href || to || '#';
  return (
    <NextLink href={targetPath} className={className} {...props}>
      {children}
    </NextLink>
  );
}

export default Link;
