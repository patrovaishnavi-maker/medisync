import React from 'react';
import Link from 'next/link';
import { Activity } from 'lucide-react';

interface LogoProps {
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
  href?: string;
}

export const Logo: React.FC<LogoProps> = ({ showTagline = false, size = 'md', href = '/' }) => {
  const iconSize = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-7 h-7',
  }[size];

  const textSize = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
  }[size];

  const content = (
    <div className="flex items-center gap-2.5">
      <div className="flex items-center justify-center rounded-lg bg-primary p-1.5 text-white shadow-xs">
        <Activity className={`${iconSize} stroke-[2.2]`} />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-bold tracking-tight text-navy ${textSize}`}>
            Medi<span className="text-primary">Sync</span>
            <span className="text-teal-600 text-xs font-semibold ml-0.5">2.0</span>
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] font-medium text-typography-secondary tracking-wide">
            Connected Healthcare Platform
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block transition-opacity hover:opacity-95">
        {content}
      </Link>
    );
  }

  return content;
};
