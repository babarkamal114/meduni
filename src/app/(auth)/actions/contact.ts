'use server';

import { z } from 'zod';
import { sendEmail } from '@/lib/email/resend';

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

    const contactEmail = process.env.CONTACT_EMAIL || 'info@meduni.co.uk';

    const { success, error } = await sendEmail({
      to: contactEmail,
      subject: `Contact Form: ${result.data.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${result.data.name}</p>
        <p><strong>Email:</strong> ${result.data.email}</p>
        <p><strong>Subject:</strong> ${result.data.subject}</p>
        <hr />
        <p>${result.data.message.replace(/\n/g, '<br />')}</p>
      `,
    });

    if (!success) {
      console.error('Contact form email error:', error);
      return {
        success: false,
        error: 'We couldn\'t send your message right now. Please try again or email us directly.',
      };
    }

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
