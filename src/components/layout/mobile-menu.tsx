'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils/cn';
import { logoutAction } from '@/app/(auth)/actions/logout';

interface MobileMenuProps {
  user: { email: string } | null;
  profile?: { full_name?: string | null; avatar_url?: string | null } | null;
  navLinks: Array<{ href: string; label: string }>;
}

export function MobileMenu({
  user,
  profile,
  navLinks,
}: MobileMenuProps): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);

  const close = () => setIsOpen(false);

  return (
    <>
      <button
        type="button"
        className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        <span
          className="w-6 h-0.5 bg-slate-700 transition-all"
          style={
            isOpen
              ? { transform: 'rotate(45deg) translateY(4px)' }
              : undefined
          }
        />
        <span
          className="w-6 h-0.5 bg-slate-700 transition-all"
          style={isOpen ? { opacity: 0 } : undefined}
        />
        <span
          className="w-4 h-0.5 bg-slate-700 transition-all"
          style={
            isOpen
              ? { transform: 'rotate(-45deg) translateY(-6px)', width: '1.5rem' }
              : undefined
          }
        />
      </button>

      <div
        className={cn(
          'mob-menu fixed top-20 right-0 bottom-0 w-72 bg-white/95 backdrop-blur-xl border-l border-black/5 p-8 md:hidden z-50',
          isOpen && 'open'
        )}
      >
        <div className="flex flex-col gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={close}
              className="text-lg text-slate-500 hover:text-teal-600 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <hr className="border-black/5" />
          {user ? (
            <>
              <Link
                href="/dashboard"
                onClick={close}
                className="px-6 py-3 bg-teal-600 text-white font-semibold text-center rounded-full"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/settings"
                onClick={close}
                className="text-lg text-slate-500 hover:text-teal-600 text-center"
              >
                Settings
              </Link>
              <form action={logoutAction} className="contents">
                <button
                  type="submit"
                  onClick={close}
                  className="text-lg text-destructive hover:text-destructive/90 text-left"
                >
                  Sign Out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                onClick={close}
                className="text-lg text-slate-500 hover:text-teal-600 text-center"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                onClick={close}
                className="px-6 py-3 bg-teal-600 text-white font-semibold text-center rounded-full"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/20 md:hidden"
          onClick={close}
          aria-label="Close overlay"
        />
      )}
    </>
  );
}
