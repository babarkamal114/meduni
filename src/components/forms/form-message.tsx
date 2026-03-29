import { cn } from '@/lib/utils/cn';

interface FormMessageProps {
  message?: string;
  type?: 'error' | 'success' | 'info';
  id?: string;
  className?: string;
}

export function FormMessage({
  message,
  type = 'error',
  id,
  className,
}: FormMessageProps): React.ReactElement | null {
  if (!message) {
    return null;
  }

  const styles = {
    error: 'text-red-600',
    success: 'text-green-600',
    info: 'text-blue-600',
  };

  return (
    <p id={id} className={cn('text-sm font-medium', styles[type], className)} role="alert">
      {message}
    </p>
  );
}

