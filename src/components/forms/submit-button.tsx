'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface SubmitButtonProps
  extends Omit<React.ComponentProps<typeof Button>, 'type'> {
  children: React.ReactNode;
}

export function SubmitButton({
  children,
  disabled: disabledProp,
  ...rest
}: SubmitButtonProps): React.ReactElement {
  const { pending } = useFormStatus();

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

