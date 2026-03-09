import { NextResponse } from 'next/server';

// Dummy knowledge base - will be replaced with OpenAI integration
const knowledgeBase: Record<string, string> = {
  webinars: 'You can browse all our webinars at /webinars. We offer expert-led sessions across various medical specialties. You can purchase individual webinars and get lifetime access to replays.',
  login: 'To log in, go to /sign-in and enter your email and password. If you forgot your password, click "Forgot password?" to reset it. You can also sign in with Google or Apple.',
  support: 'You can contact our support team through the contact form at /contact, or email us at contact@meduni.co.uk. We typically respond within 24 hours.',
  pricing: 'Webinar prices vary depending on the topic and expert. You can see the price for each webinar on its detail page. We accept all major credit and debit cards.',
  refunds: 'We offer refunds up to 48 hours before a live webinar starts. After that, refunds are not available, but you\'ll have access to the replay. Contact support to request a refund.',
  replay: 'Yes! All webinars are recorded. The replay will be available in your dashboard within 24 hours after the live session ends. You can watch it anytime with your purchase.',
  account: 'To create an account, go to /sign-up and enter your details. You can also sign up with Google or Apple for faster registration.',
  payment: 'We accept all major credit and debit cards (Visa, Mastercard, American Express) via Stripe. We also support PayPal for your convenience.',
};

// Simple keyword matching for dummy responses
function getDummyResponse(message: string): string {
  const lowerMessage = message.toLowerCase();

  // Check for specific keywords
  if (lowerMessage.includes('webinar') || lowerMessage.includes('webinars')) {
    return knowledgeBase.webinars;
  }
  if (lowerMessage.includes('login') || lowerMessage.includes('sign in') || lowerMessage.includes('password')) {
    return knowledgeBase.login;
  }
  if (lowerMessage.includes('support') || lowerMessage.includes('contact') || lowerMessage.includes('help')) {
    return knowledgeBase.support;
  }
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('pricing')) {
    return knowledgeBase.pricing;
  }
  if (lowerMessage.includes('refund') || lowerMessage.includes('money back')) {
    return knowledgeBase.refunds;
  }
  if (lowerMessage.includes('replay') || lowerMessage.includes('recording') || lowerMessage.includes('watch later')) {
    return knowledgeBase.replay;
  }
  if (lowerMessage.includes('account') || lowerMessage.includes('sign up') || lowerMessage.includes('register')) {
    return knowledgeBase.account;
  }
  if (lowerMessage.includes('payment') || lowerMessage.includes('pay') || lowerMessage.includes('card')) {
    return knowledgeBase.payment;
  }
  if (lowerMessage.includes('how') && lowerMessage.includes('work')) {
    return 'MedUni is a medical education platform where you can:\n\n1. Browse and purchase expert-led webinars\n2. Attend live sessions or watch replays\n3. Access comprehensive learning materials\n4. Connect with other medical professionals\n\nTo get started, simply create an account and explore our webinars!';
  }

  // Default response
  return 'Thank you for your question! I\'m a dummy chatbot for now, but I can help with basic information about:\n\n• Webinars and how to purchase them\n• Account and login issues\n• Payment and pricing\n• Replays and recordings\n• Refunds and support\n\nPlease ask me about any of these topics, or contact our support team at contact@meduni.co.uk for more specific help.';
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Simulate API delay (1-2 seconds)
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

    // Get dummy response based on keywords
    const response = getDummyResponse(message);

    return NextResponse.json({
      response,
      // Include metadata for future OpenAI integration
      metadata: {
        model: 'dummy',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Chatbot API error:', error);
    return NextResponse.json(
      { error: 'An error occurred processing your message' },
      { status: 500 }
    );
  }
}

