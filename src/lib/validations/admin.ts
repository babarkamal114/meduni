import { z } from 'zod';
import type { ZodError } from 'zod';

export function formatZodFieldErrors(error: ZodError): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const field = (issue.path[0] as string) ?? '_form';
    if (!fieldErrors[field]) fieldErrors[field] = [];
    if (fieldErrors[field].length === 0) fieldErrors[field].push(issue.message);
  }
  return fieldErrors;
}

export const webinarSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  expert: z.string().min(1, 'Expert is required').max(200),
  duration: z.string().min(1, 'Duration is required'),
  price: z.string().min(1, 'Price is required'),
  status: z.enum(['live', 'upcoming', 'recorded'], 'Status is required'),
  scheduledAt: z.string().min(1, 'Scheduled date and time is required'),
  hasReplay: z.boolean().default(false),
  outcomes: z.string().default(''),
});

export const moduleSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(2000).default(''),
  pass_threshold_percent: z.coerce.number().int().min(1, 'Must be at least 1%').max(100, 'Cannot exceed 100%').default(80),
});

export const lessonSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  stepType: z.enum(['content', 'quiz']).default('content'),
  duration: z.string().default(''),
  body: z.string().default(''),
  hasVideo: z.boolean().default(false),
  videoUrl: z.string().url('Must be a valid URL').or(z.literal('')).default(''),
  videoDuration: z.string().default(''),
});

export const caseStudySchema = z.object({
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must only contain lowercase letters, numbers, and hyphens'),
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(2000).default(''),
  outcome_title: z.string().default(''),
  outcome_body: z.string().default(''),
});

export const contentItemSchema = z.object({
  type: z.enum(['pdf', 'video', 'quiz']).default('pdf'),
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(2000).default(''),
  meta: z.string().default(''),
  estimatedTime: z.string().default(''),
  downloadUrl: z.string().url('Must be a valid URL').or(z.literal('')).default(''),
  videoUrl: z.string().url('Must be a valid URL').or(z.literal('')).default(''),
});
