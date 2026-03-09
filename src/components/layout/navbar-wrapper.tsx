import { cn } from '@/lib/utils/cn';

interface NavbarWrapperProps {
  children: React.ReactNode;
}

export function NavbarWrapper({ children }: NavbarWrapperProps): React.ReactElement {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 nav-b border-b border-black/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">{children}</div>
      </div>
    </nav>
  );
}
