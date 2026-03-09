'use server';

import { z } from 'zod';
// import { sendEmail } from '@/lib/email/send'; // TODO: Implement when email system is ready

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export async function submitContactForm(
  formData: FormData
): Promise<
  | { success: true; message?: string }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }
> {
  try {
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
    };

    // Validate input
    const result = contactSchema.safeParse(data);

    if (!result.success) {
      const fieldErrors: Record<string, string[]> = {};
      result.error.issues.forEach((error) => {
        const field = error.path[0] as string;
        if (!fieldErrors[field]) {
          fieldErrors[field] = [];
        }
        fieldErrors[field].push(error.message);
      });

      return {
        success: false,
        error: 'Please correct the errors in the form',
        fieldErrors,
      };
    }

    // TODO: Implement email sending via Resend
    // For now, we'll just log it
    console.log('Contact form submission:', result.data);

    // In production, uncomment this:
    // await sendEmail({
    //   to: process.env.CONTACT_EMAIL || 'contact@meduni.co.uk',
    //   template: 'contact',
    //   data: result.data,
    // });

    return {
      success: true,
      message: 'Thank you for contacting us! We will get back to you soon.',
    };
  } catch (error) {
    console.error('Contact form error:', error);
    return {
      success: false,
      error: 'An error occurred while sending your message. Please try again later.',
    };
  }
}

