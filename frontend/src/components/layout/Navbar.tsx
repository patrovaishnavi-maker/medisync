'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '../ui/Logo';
import { Menu, X, ArrowRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Logo size="md" />

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className={`text-xs font-semibold tracking-wide transition-colors ${
                pathname === '/' ? 'text-primary' : 'text-typography-secondary hover:text-navy'
              }`}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`text-xs font-semibold tracking-wide transition-colors ${
                pathname === '/about' ? 'text-primary' : 'text-typography-secondary hover:text-navy'
              }`}
            >
              About
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-primary hover:bg-primary-600 px-4 py-2 rounded-lg shadow-xs transition-colors"
            >
              <span>Access Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-typography-secondary hover:text-navy hover:bg-surface-subtle"
              aria-label="Toggle Navigation"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-white px-4 pt-2 pb-4 space-y-2">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className={`block py-2 text-xs font-semibold ${
              pathname === '/' ? 'text-primary' : 'text-navy hover:text-primary'
            }`}
          >
            Home
          </Link>
          <Link
            href="/about"
            onClick={() => setIsOpen(false)}
            className={`block py-2 text-xs font-semibold ${
              pathname === '/about' ? 'text-primary' : 'text-navy hover:text-primary'
            }`}
          >
            About
          </Link>
          <div className="pt-2">
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-white bg-primary rounded-lg"
            >
              <span>Access Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
