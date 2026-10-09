import React from 'react';
import Link from 'next/link';
import { Activity, ShieldCheck } from 'lucide-react';

interface LogoProps {
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
  href?: string;
}

export const Logo: React.FC<LogoProps> = ({ showTagline = false, size = 'md', href = '/' }) => {
  const iconSize = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  }[size];

  const textSize = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  }[size];

  const content = (
    <div className="flex items-center gap-2.5">
      <div className="relative flex items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary p-2 text-white shadow-md shadow-primary/20">
        <Activity className={`${iconSize} stroke-[2.5]`} />
        <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-white">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        </span>
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-bold tracking-tight text-navy ${textSize}`}>
            Medi<span className="text-primary">Sync</span>
          </span>
          <span className="rounded bg-primary-50 px-1.5 py-0.5 text-[10px] font-semibold text-primary border border-primary-200">
            ABDM
          </span>
        </div>
        {showTagline && (
          <span className="text-[11px] font-medium text-typography-secondary tracking-wide">
            Connected Care. Healthier Lives.
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block transition-transform hover:scale-[1.01]">
        {content}
      </Link>
    );
  }

  return content;
};
