import Link from 'next/link';
import { MobileMenu } from '@/components/layout/mobile-menu';
import { NavbarWrapper } from '@/components/layout/navbar-wrapper';
import { siteConfig } from '@/config/site';
import { GlowButton } from '@/components/marketing/glow-button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { logoutAction } from '@/app/(auth)/actions/logout';
import { getUser } from '@/lib/auth/getUser';
import { GraduationCap, ChevronDown } from 'lucide-react';

export async function Navbar() {
  const user = await getUser();

  return (
    <NavbarWrapper>
      <Link href="/" className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
        <span className="font-serif text-2xl tracking-tight text-slate-900">
          {siteConfig.name}
        </span>
      </Link>
      <div className="hidden md:flex items-center gap-8">
        {siteConfig.navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm text-slate-600 hover:text-teal-600 transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>
      <div className="hidden md:flex md:items-center md:gap-2">
        {user ? (
          <>
            <Link
              href="/dashboard"
              className="glow-btn px-6 py-2.5 bg-teal-600 text-white font-semibold text-sm rounded-full relative z-10 inline-block"
            >
              Dashboard
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="ml-3 flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500/50 p-1"
                  aria-label="User menu"
                >
                  <Avatar className="h-9 w-9 border-2 border-slate-200">
                    {user.avatar_url ? (
                      <AvatarImage
                        src={user.avatar_url}
                        alt={user.full_name || user.email || ''}
                      />
                    ) : null}
                    <AvatarFallback className="bg-teal-500/10 text-teal-600 font-semibold">
                      {user.full_name
                        ? user.full_name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()
                            .slice(0, 2)
                        : user.email?.[0].toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4 text-slate-500" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5 border-b">
                  <p className="text-sm font-medium">{user.full_name || 'User'}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer">
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings" className="cursor-pointer">
                    Settings
                  </Link>
                </DropdownMenuItem>
                <form action={logoutAction}>
                  <DropdownMenuItem asChild>
                    <button
                      type="submit"
                      className="w-full cursor-pointer text-destructive focus:text-destructive text-left"
                    >
                      Sign Out
                    </button>
                  </DropdownMenuItem>
                </form>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <>
            <Link
              href="/sign-in"
              className="text-sm text-slate-600 hover:text-teal-600 transition-colors font-medium px-4 py-2"
            >
              Sign In
            </Link>
            <GlowButton href="/sign-up">Sign Up</GlowButton>
          </>
        )}
      </div>
      <MobileMenu
        user={user ? { email: user.email } : null}
        profile={user ? { full_name: user.full_name, avatar_url: user.avatar_url } : null}
        navLinks={[...siteConfig.navLinks]}
      />
    </NavbarWrapper>
  );
}
