'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface SubmitButtonProps
  extends Omit<React.ComponentProps<typeof Button>, 'type'> {
  children: React.ReactNode;
  /** When provided, overrides useFormStatus pending (e.g. for client-side mutations). */
  pending?: boolean;
}

export function SubmitButton({
  children,
  disabled: disabledProp,
  pending: pendingProp,
  ...rest
}: SubmitButtonProps): React.ReactElement {
  const { pending: formPending } = useFormStatus();
  const pending = pendingProp ?? formPending;

  return (
    <Button
      type="submit"
      disabled={pending || disabledProp}
      {...rest}
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        children
      )}
    </Button>
  );
}

