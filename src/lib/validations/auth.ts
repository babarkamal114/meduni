import { z } from 'zod';
import type { ZodError } from 'zod';

export const signInSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signUpSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(72, 'Password is too long'),
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(200, 'Name is too long').optional(),
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;

/** Maps Zod validation errors to field name -> first message per field for form display. */
export function formatZodFieldErrors(error: ZodError): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const field = (issue.path[0] as string) ?? '_form';
    if (!fieldErrors[field]) fieldErrors[field] = [];
    if (fieldErrors[field].length === 0) fieldErrors[field].push(issue.message);
  }
  return fieldErrors;
}

