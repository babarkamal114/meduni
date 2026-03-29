'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormMessage } from './form-message';

interface FormFieldProps extends Omit<React.ComponentProps<typeof Input>, 'id'> {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
}

export function FormField({
  id,
  label,
  error,
  required,
  className,
  ...inputProps
}: FormFieldProps): React.ReactElement {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-red-600 ml-0.5" aria-hidden="true">*</span>}
      </Label>
      <Input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        error={!!error}
        className={className}
        {...inputProps}
      />
      {error && (
        <FormMessage id={`${id}-error`} message={error} type="error" />
      )}
    </div>
  );
}
