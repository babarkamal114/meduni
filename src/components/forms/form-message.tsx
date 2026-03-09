import { cn } from '@/lib/utils/cn';

interface FormMessageProps {
  message?: string;
  type?: 'error' | 'success' | 'info';
  className?: string;
}

export function FormMessage({
  message,
  type = 'error',
  className,
}: FormMessageProps): React.ReactElement | null {
  if (!message) {
    return null;
  }

  const styles = {
    error: 'text-destructive',
    success: 'text-green-600',
    info: 'text-blue-600',
  };

  return (
    <p className={cn('text-sm font-medium', styles[type], className)}>
      {message}
    </p>
  );
}

