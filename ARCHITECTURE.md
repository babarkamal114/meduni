============
BEGIN ARCHITECTURE.md

```markdown
# MedUni Platform - Complete Architecture Document

**Project:** MedUni Educational & Webinar Platform  
**Tech Stack:** Next.js 15, Supabase, Vercel, Stripe, Zoom, Resend, OpenAI  
**Budget:** £1,200 GBP  
**Timeline:** 3-4 weeks  
**Version:** 1.0  
**Last Updated:** November 2025

---

## Table of Contents

1. [Tech & Architecture Overview](#tech--architecture-overview)
2. [App & Folder Structure](#app--folder-structure)
3. [Database Schema & RLS Design](#database-schema--rls-design)
4. [Reusable Component Inventory](#reusable-component-inventory)
5. [API & Integration Flows](#api--integration-flows)
6. [Implementation Phases](#implementation-phases)
7. [Performance, Security & SEO](#performance-security--seo)
8. [Testing & Quality Assurance](#testing--quality-assurance)
9. [Deployment & Maintenance](#deployment--maintenance)

---

## Tech & Architecture Overview

### Core Technology Stack

#### Frontend & Framework
- **Next.js 15** (App Router) - React framework with SSR, RSC, and ISR
- **React 19** - UI library with Server Components
- **TypeScript 5.x** - Type safety and developer experience
- **Tailwind CSS 3.x** - Utility-first styling
- **shadcn/ui** - Accessible component library built on Radix UI

#### Backend & Database
- **Supabase**
  - PostgreSQL 15 (managed database)
  - Supabase Auth (authentication service)
  - Supabase Storage (file storage with CDN)
  - Row-Level Security (RLS) for data protection
  - Real-time subscriptions (optional for future features)
- **Node.js** runtime for API routes and server actions

#### Third-Party Integrations
- **Stripe** - Primary payment processor (one-time purchases, subscriptions)
- **PayPal** - Secondary payment option (optional)
- **Zoom API** - Webinar meeting creation and management
- **Resend** - Transactional email delivery
- **OpenAI API (GPT-4)** - AI chatbot functionality

#### Infrastructure
- **Vercel** - Deployment platform
  - Global CDN
  - Edge Network
  - Automatic HTTPS
  - CI/CD with GitHub integration
  - Environment management (dev, preview, production)
  - Serverless Functions (Node.js runtime)
  - Edge Functions (for lightweight operations)

#### Development Tools
- **TypeScript** - Static typing
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Zod** - Runtime validation and type inference

---

### Architectural Principles

#### 1. Server-First Architecture

**Default to Server Components**
- All components are Server Components unless explicitly marked with `"use client"`
- Server Components enable:
  - Zero JavaScript sent to client by default
  - Direct database access (secure)
  - Better SEO (fully rendered HTML)
  - Reduced bundle size
  - Automatic code splitting

**Client Components Used For:**
- Interactive elements (forms, buttons with state)
- Browser APIs (localStorage, window)
- Event handlers (onClick, onChange)
- State management (useState, useReducer)
- Effects (useEffect)
- Real-time features (chatbot, live updates)

#### 2. Data Fetching Strategy

**Server Components**
```typescript
// Fetch directly in Server Components
async function WebinarList() {
  const supabase = createServerClient()
  const { data: webinars } = await supabase
    .from('webinars')
    .select('*')
    .eq('status', 'published')
  
  return <div>{/* render webinars */}</div>
}
```

**Server Actions for Mutations**
```typescript
// src/lib/actions/webinars.ts
'use server'

export async function purchaseWebinar(webinarId: string) {
  const supabase = createServerClient()
  // Mutation logic
  revalidatePath('/dashboard/webinars')
}
```

**API Routes Only For:**
- Webhook handlers (external services calling us)
- Third-party integrations requiring secrets
- Rate-limited operations
- Streaming responses (AI chatbot)

#### 3. Caching Strategy

**Page-Level Caching**
```typescript
// Static pages (1 hour cache)
export const revalidate = 3600

// Dynamic pages (5 minutes)
export const revalidate = 300

// No cache (admin, user-specific)
export const revalidate = 0
```

**Tag-Based Revalidation**
```typescript
// Tag data on fetch
fetch(url, {
  next: { tags: ['webinars'] }
})

// Invalidate after mutation
revalidateTag('webinars')
```

**Cache Hierarchy:**
1. Marketing pages: 1 hour (3600s)
2. Webinar catalogue: 5 minutes (300s)
3. Dashboard: No cache (always fresh)
4. Admin: No cache (always fresh)

#### 4. Authentication Flow

```
User Access → Middleware Check → Protected Route
     ↓
  Valid JWT? 
     ↓
   Yes: Continue
   No: Redirect to /sign-in
     ↓
Protected Component → Check User Role (RLS)
     ↓
  Render Based on Permissions
```

**Session Management:**
- JWT tokens stored in HTTP-only cookies
- Short-lived sessions (1 hour)
- Refresh tokens for seamless renewal
- Server-side session validation on every request

#### 5. Security Layers

**Layer 1: Middleware**
- Route-level authentication check
- Redirects unauthenticated users
- Located in `src/middleware.ts`

**Layer 2: RLS Policies**
- Database-level security
- User can only access own data
- Admins bypass certain restrictions
- Enforced by Supabase (not bypassable from client)

**Layer 3: Server Actions**
- Input validation with Zod
- Permission checks
- Rate limiting
- CSRF protection (Next.js built-in)

**Layer 4: API Routes**
- Webhook signature verification
- Request validation
- Rate limiting per user/IP

---

### High-Level User Flows

#### Flow 1: User Purchases Webinar

```
1. User browses /webinars
   ↓
2. Server Component renders webinar list from Supabase
   ↓
3. User clicks webinar → /webinars/[slug]
   ↓
4. Server Component checks if user owns webinar
   ↓
5. User clicks "Buy Now" → /checkout/[webinarId]
   ↓
6. Checkout page loads Stripe Elements (Client Component)
   ↓
7. User completes payment
   ↓
8. Stripe webhook → /api/webhooks/stripe
   ↓
9. Webhook creates webinar_access record
   ↓
10. Resend sends confirmation email (with Zoom link)
    ↓
11. User redirected to /checkout/[webinarId]/success
    ↓
12. User navigates to /dashboard/webinars
    ↓
13. Purchased webinar now visible
```

**Detailed Steps:**
1. User browses public webinar catalogue (`/webinars`)
2. Server Component fetches published webinars from Supabase
3. User clicks specific webinar → Navigate to `/webinars/[slug]`
4. Server Component checks if user already has access (query `webinar_access` table)
5. If not, show "Buy Now" button
6. User clicks → Navigate to `/checkout/[webinarId]`
7. Checkout page creates Stripe Payment Intent via Server Action
8. Stripe Elements form loads (Client Component)
9. User enters payment details and submits
10. Stripe processes payment
11. Stripe sends webhook to `/api/webhooks/stripe`
12. Webhook handler verifies signature
13. Create record in `webinar_access` table with user_id and webinar_id
14. Send confirmation email via Resend (includes Zoom link, receipt)
15. Redirect user to `/checkout/[webinarId]/success`
16. User navigates to `/dashboard/webinars`
17. Server Component queries webinars where user has access
18. Purchased webinar now visible in dashboard

#### Flow 2: Attending Live Webinar

```
1. Automated job checks upcoming webinars (24h before)
   ↓
2. Send reminder email via Resend
   ↓
3. User logs into dashboard
   ↓
4. Server Component queries user's webinars
   ↓
5. "Join Live" button visible 15min before start
   ↓
6. User clicks "Join Live"
   ↓
7. Server Action verifies access
   ↓
8. Server Action gets/generates Zoom join URL
   ↓
9. Mark attended_live = true
   ↓
10. Redirect to Zoom meeting
    ↓
11. User attends webinar
    ↓
12. Post-webinar: Send thank-you email
```

**Detailed Steps:**
1. Vercel Cron job runs daily (`/api/cron/reminders`)
2. Query webinars with `scheduled_at` in next 24 hours
3. For each webinar, query users with access
4. Send reminder email via Resend with webinar details and "Join Live" button
5. User logs into dashboard at webinar time
6. Navigate to `/dashboard/webinars`
7. Server Component queries `webinar_access` table for user's webinars
8. Filters for webinars with `scheduled_at` within next 24 hours
9. "Join Live" button appears 15 minutes before `scheduled_at`
10. User clicks "Join Live" → Triggers Server Action
11. Server Action verifies user has `webinar_access` record for this webinar
12. Server Action calls Zoom API to get or generate meeting join URL
13. Server Action updates `webinar_access.attended_live = true`
14. Redirect user to Zoom meeting URL (external link)
15. User attends webinar on Zoom platform
16. After webinar ends (detected by `scheduled_at + duration_minutes` or Zoom webhook)
17. Automated job sends thank-you email with:
    - Feedback survey link
    - Notification that replay will be available soon
    - Related learning materials

#### Flow 3: Watching Replay

```
1. Admin uploads replay video
   ↓
2. Video uploaded to Supabase Storage
   ↓
3. Update webinar.replay_url in database
   ↓
4. User navigates to /dashboard/webinars
   ↓
5. Server Component shows "Watch Replay" badge
   ↓
6. User clicks webinar → /dashboard/webinars/[slug]/replay
   ↓
7. Server Component verifies access
   ↓
8. Server Action generates signed URL (1h expiry)
   ↓
9. VideoPlayer (Client Component) loads video
   ↓
10. Progress tracked every 30s
    ↓
11. Resume from last position on return
```

**Detailed Steps:**
1. Admin logs into admin panel (`/admin`)
2. Navigate to webinar management (`/admin/webinars/[id]`)
3. Click "Upload Replay" → `/admin/webinars/[id]/upload`
4. File picker opens (Client Component with drag-drop)
5. Select video file (MP4, max 2GB recommended)
6. Upload to Supabase Storage bucket (`webinar-replays`) with progress bar
7. On success, Server Action updates `webinars.replay_url` with storage path
8. User logs into dashboard
9. Navigate to "My Webinars" (`/dashboard/webinars`)
10. Server Component queries webinars where:
    - User has `webinar_access` record
    - `replay_url IS NOT NULL`
11. Shows "Watch Replay" badge on webinar cards
12. User clicks webinar → Navigate to `/dashboard/webinars/[slug]/replay`
13. Server Component verifies user has access (checks `webinar_access`)
14. If no access, redirect to purchase page
15. Server Action generates signed URL from Supabase Storage (1 hour expiry)
16. Pass signed URL to VideoPlayer (Client Component)
17. VideoPlayer checks for saved progress in `webinar_access.replay_watched_seconds`
18. Start playback from saved position
19. Every 30 seconds, call Server Action to update progress
20. On video completion, optionally mark as "completed"

#### Flow 4: Email Automation

**Email Triggers:**

| Trigger | Template | Timing | Content |
|---------|----------|--------|---------|
| User signup | `welcome.tsx` | Immediate | Welcome message, dashboard link, getting started tips |
| Payment success | `payment-success.tsx` | Immediate | Receipt, Zoom link, calendar invite (.ics), webinar details |
| 24h before webinar | `webinar-reminder.tsx` | Scheduled (cron) | Reminder, join instructions, what to prepare |
| After webinar | `webinar-thankyou.tsx` | 1h after end | Thank you, feedback link, replay notification, related content |
| Subscription renewal | `subscription-renewal.tsx` | 7 days before | Renewal notice, amount, manage subscription link |
| Password reset | Supabase template | Immediate | Secure reset link (Supabase Auth handles this) |

**Email Architecture:**

```
Trigger Event
   ↓
Server Action or Webhook
   ↓
Build Email (React Component → HTML)
   ↓
Resend API
   ↓
User Inbox
   ↓
Log to email_events table
```

**Implementation:**
1. Templates in `src/lib/email/templates/` as React components
2. Use React Email library to render components to HTML
3. Send via Resend API from verified domain (`noreply@meduni.co.uk`)
4. All emails logged to `email_events` table with status
5. Failed deliveries logged with error messages
6. Retry logic for transient failures (network issues)

**Example Email Template:**
```typescript
// src/lib/email/templates/payment-success.tsx
export function PaymentSuccessEmail({ userName, webinarTitle, zoomLink, amount }) {
  return (
    <Html>
      <Head />
      <Body>
        <Container>
          <Heading>Payment Confirmed!</Heading>
          <Text>Hi {userName},</Text>
          <Text>Thank you for purchasing {webinarTitle}.</Text>
          <Text>Amount paid: £{amount}</Text>
          <Button href={zoomLink}>Join Webinar</Button>
        </Container>
      </Body>
    </Html>
  )
}
```

#### Flow 5: AI Chatbot Interaction

```
1. User opens chatbot widget (floating button)
   ↓
2. Chat window renders (Client Component)
   ↓
3. User types message
   ↓
4. POST to /api/chatbot
   ↓
5. Rate limit check (10 req/min)
   ↓
6. Fetch user context from Supabase
   ↓
7. Load FAQ knowledge base
   ↓
8. Build system prompt
   ↓
9. Stream OpenAI completion
   ↓
10. Client displays response in real-time
    ↓
11. Log interaction to database
```

**Detailed Steps:**
1. Chatbot widget visible on all pages (floating button, bottom-right corner)
2. Client Component manages open/closed state with React Context
3. User clicks widget → Opens chat window overlay (modal)
4. Chat window shows greeting message: "Hi! I'm the MedUni assistant. How can I help?"
5. Display quick action buttons:
   - "View upcoming webinars"
   - "Help with login"
   - "Contact support"
6. User types question in input field
7. On submit, POST to `/api/chatbot` with:
   - `message` (user's question)
   - `conversationHistory` (last 10 messages for context)
8. API route checks rate limit (Redis or in-memory cache):
   - 10 requests per minute per user_id
   - If over limit, return 429 error with retry-after header
9. Fetch user context from Supabase:
   - User profile (name, email, role)
   - Purchased webinars (titles, dates)
   - Recent activity (last login, last purchase)
10. Load FAQ knowledge base from `src/lib/ai/knowledge-base.ts`:
    - Common questions about MedUni
    - Pricing information
    - Technical support guides
11. Build system prompt:
    ```
    You are a helpful assistant for MedUni, a medical education platform.
    User context: {name}, has purchased {webinarCount} webinars.
    Current date: {currentDate}
    Use the FAQ knowledge base to answer questions.
    If you don't know, direct user to contact support.
    ```
12. Call OpenAI API with streaming enabled:
    ```typescript
    const stream = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        ...conversationHistory,
        { role: 'user', content: message }
      ],
      stream: true
    })
    ```
13. Stream response back to client via Server-Sent Events
14. Client Component updates UI in real-time (typing effect)
15. When complete, log interaction to `chatbot_interactions` table:
    - user_id, session_id, message, response, tokens_used, created_at
16. Show quick actions based on detected intent:
    - If mentions "password" → Show "Reset password" button
    - If mentions "webinar" → Show "View webinars" button
    - If mentions "help" → Show "Contact support" button
17. User can provide feedback (thumbs up/down) on response

**Chatbot Capabilities:**
- Answer FAQs (pricing, schedule, how to join webinars)
- Provide technical support (login issues, video playback problems)
- Guide users to relevant pages (dashboard, webinars, billing)
- Recommend webinars based on user interests
- Explain features and how to use the platform
- Troubleshoot common issues
- **Cannot access:** Payment details, passwords, personal health information

---

## App & Folder Structure

### Complete Directory Tree

```
meduni-platform/
├── .next/                          # Next.js build output (gitignored)
├── node_modules/                   # Dependencies (gitignored)
├── public/                         # Static assets
│   ├── images/
│   │   ├── logo.svg
│   │   ├── logo-white.svg
│   │   ├── hero-bg.jpg
│   │   ├── default-avatar.png
│   │   └── og-image.jpg            # Open Graph image (1200x630)
│   ├── icons/
│   │   ├── favicon.ico
│   │   ├── icon-192.png
│   │   ├── icon-512.png
│   │   └── apple-touch-icon.png
│   ├── robots.txt
│   └── sitemap.xml                 # Auto-generated by Next.js
│
├── supabase/                       # Supabase configuration
│   ├── migrations/                 # Database migrations
│   │   ├── 20250101000000_initial_schema.sql
│   │   ├── 20250102000000_add_rls_policies.sql
│   │   ├── 20250103000000_add_indexes.sql
│   │   └── 20250104000000_add_functions.sql
│   ├── seed.sql                    # Development seed data
│   └── config.toml                 # Supabase project config
│
├── src/
│   ├── app/                        # Next.js 15 App Router
│   │   ├── layout.tsx              # Root layout (HTML, fonts, providers)
│   │   ├── page.tsx                # Homepage
│   │   ├── globals.css             # Global styles (Tailwind imports)
│   │   ├── error.tsx               # Global error boundary
│   │   ├── not-found.tsx           # 404 page
│   │   ├── loading.tsx             # Root loading UI
│   │   ├── favicon.ico             # Favicon
│   │   │
│   │   ├── (marketing)/            # Route group: public pages
│   │   │   ├── layout.tsx          # Marketing layout (Navbar, Footer)
│   │   │   ├── about/
│   │   │   │   ├── page.tsx
│   │   │   │   └── loading.tsx
│   │   │   ├── contact/
│   │   │   │   └── page.tsx
│   │   │   ├── pricing/
│   │   │   │   └── page.tsx
│   │   │   └── webinars/
│   │   │       ├── page.tsx        # Webinar catalogue
│   │   │       ├── loading.tsx
│   │   │       └── [slug]/
│   │   │           ├── page.tsx    # Webinar detail
│   │   │           └── loading.tsx
│   │   │
│   │   ├── (auth)/                 # Route group: authentication
│   │   │   ├── layout.tsx          # Auth layout (centered, minimal)
│   │   │   ├── sign-in/
│   │   │   │   └── page.tsx
│   │   │   ├── sign-up/
│   │   │   │   └── page.tsx
│   │   │   ├── reset-password/
│   │   │   │   └── page.tsx
│   │   │   ├── verify-email/
│   │   │   │   └── page.tsx
│   │   │   └── auth-error/
│   │   │       └── page.tsx
│   │   │
│   │   ├── dashboard/              # Protected: student area
│   │   │   ├── layout.tsx          # Dashboard shell (sidebar, header)
│   │   │   ├── page.tsx            # Dashboard home (overview)
│   │   │   ├── loading.tsx         # Dashboard loading state
│   │   │   ├── webinars/
│   │   │   │   ├── page.tsx        # My webinars list
│   │   │   │   ├── loading.tsx
│   │   │   │   └── [slug]/
│   │   │   │       ├── page.tsx    # Webinar detail
│   │   │   │       └── replay/
│   │   │   │           ├── page.tsx # Video player
│   │   │   │           └── loading.tsx
│   │   │   ├── learning/
│   │   │   │   ├── page.tsx        # Learning materials
│   │   │   │   ├── loading.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx    # Content detail
│   │   │   ├── billing/
│   │   │   │   ├── page.tsx        # Billing history
│   │   │   │   └── invoices/
│   │   │   │       └── [id]/
│   │   │   │           └── page.tsx
│   │   │   └── settings/
│   │   │       ├── page.tsx        # User settings
│   │   │       ├── profile/
│   │   │       │   └── page.tsx
│   │   │       ├── security/
│   │   │       │   └── page.tsx
│   │   │       └── notifications/
│   │   │           └── page.tsx
│   │   │
│   │   ├── admin/                  # Protected: admin area
│   │   │   ├── layout.tsx          # Admin layout
│   │   │   ├── page.tsx            # Admin dashboard
│   │   │   ├── webinars/
│   │   │   │   ├── page.tsx        # Webinar list
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx    # Create webinar
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx    # Edit webinar
│   │   │   │       ├── upload/
│   │   │   │       │   └── page.tsx # Upload replay
│   │   │   │       └── attendees/
│   │   │   │           └── page.tsx # View attendees
│   │   │   ├── content/
│   │   │   │   ├── page.tsx        # Content list
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx    # Create content
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx    # Edit content
│   │   │   ├── users/
│   │   │   │   ├── page.tsx        # User list
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx    # Edit user
│   │   │   └── analytics/
│   │   │       └── page.tsx        # Analytics dashboard
│   │   │
│   │   ├── checkout/
│   │   │   └── [webinarId]/
│   │   │       ├── page.tsx        # Checkout page
│   │   │       └── success/
│   │   │           └── page.tsx    # Success page
│   │   │
│   │   └── api/                    # API routes
│   │       ├── webhooks/
│   │       │   ├── stripe/
│   │       │   │   └── route.ts    # Stripe webhook
│   │       │   ├── paypal/
│   │       │   │   └── route.ts    # PayPal webhook
│   │       │   └── zoom/
│   │       │       └── route.ts    # Zoom webhook
│   │       ├── chatbot/
│   │       │   └── route.ts        # AI chatbot endpoint
│   │       ├── cron/
│   │       │   ├── reminders/
│   │       │   │   └── route.ts    # Email reminders
│   │       │   └── cleanup/
│   │       │       └── route.ts    # Database cleanup
│   │       └── health/
│   │           └── route.ts        # Health check
│   │
│   ├── components/                 # React components
│   │   ├── ui/                     # shadcn/ui primitives
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── card.tsx
│   │   │   ├── modal.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── select.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── toaster.tsx
│   │   │   ├── alert.tsx
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── label.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── radio-group.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── slider.tsx
│   │   │   ├── tooltip.tsx
│   │   │   ├── popover.tsx
│   │   │   ├── calendar.tsx
│   │   │   └── command.tsx
│   │   │
│   │   ├── layout/                 # Layout components
│   │   │   ├── navbar.tsx
│   │   │   ├── footer.tsx
│   │   │   ├── dashboard-shell.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── admin-sidebar.tsx
│   │   │   ├── breadcrumbs.tsx
│   │   │   ├── user-menu.tsx
│   │   │   ├── mobile-menu.tsx
│   │   │   └── page-header.tsx
│   │   │
│   │   ├── webinars/               # Webinar components
│   │   │   ├── webinar-card.tsx
│   │   │   ├── webinar-list.tsx
│   │   │   ├── webinar-grid.tsx
│   │   │   ├── webinar-filters.tsx
│   │   │   ├── webinar-details.tsx
│   │   │   ├── webinar-player.tsx
│   │   │   ├── join-webinar-button.tsx
│   │   │   ├── webinar-countdown.tsx
│   │   │   └── expert-bio.tsx
│   │   │
│   │   ├── dashboard/              # Dashboard widgets
│   │   │   ├── stats-card.tsx
│   │   │   ├── upcoming-webinars.tsx
│   │   │   ├── recent-content.tsx
│   │   │   ├── progress-card.tsx
│   │   │   ├── activity-feed.tsx
│   │   │   └── empty-state.tsx
│   │   │
│   │   ├── admin/                  # Admin components
│   │   │   ├── webinar-form.tsx
│   │   │   ├── user-table.tsx
│   │   │   ├── content-editor.tsx
│   │   │   ├── upload-replay.tsx
│   │   │   ├── admin-stats.tsx
│   │   │   ├── data-table.tsx
│   │   │   ├── data-table-pagination.tsx
│   │   │   ├── data-table-toolbar.tsx
│   │   │   └── analytics-chart.tsx
│   │   │
│   │   ├── forms/                  # Form components
│   │   │   ├── contact-form.tsx
│   │   │   ├── sign-in-form.tsx
│   │   │   ├── sign-up-form.tsx
│   │   │   ├── reset-password-form.tsx
│   │   │   ├── checkout-form.tsx
│   │   │   └── profile-form.tsx
│   │   │
│   │   ├── chatbot/                # AI chatbot
│   │   │   ├── chatbot-widget.tsx
│   │   │   ├── chatbot-window.tsx
│   │   │   ├── message-list.tsx
│   │   │   ├── message-bubble.tsx
│   │   │   ├── quick-actions.tsx
│   │   │   └── typing-indicator.tsx
│   │   │
│   │   └── providers/              # Context providers
│   │       ├── theme-provider.tsx
│   │       ├── toast-provider.tsx
│   │       └── query-provider.tsx
│   │
│   ├── lib/                        # Utility libraries
│   │   ├── supabase/
│   │   │   ├── client.ts           # Browser client
│   │   │   ├── server.ts           # Server client (cookies)
│   │   │   ├── admin.ts            # Admin client (service key)
│   │   │   └── middleware.ts       # Auth middleware helper
│   │   │
│   │   ├── auth/
│   │   │   ├── session.ts          # Session management
│   │   │   ├── permissions.ts      # Role checks
│   │   │   └── actions.ts          # Auth server actions
│   │   │
```markdown
│   │   ├── actions/                # Server actions
│   │   │   ├── webinars.ts         # Webinar CRUD operations
│   │   │   ├── access.ts           # Access management
│   │   │   ├── replays.ts          # Replay management
│   │   │   ├── content.ts          # Content operations
│   │   │   ├── attendance.ts       # Attendance tracking
│   │   │   └── users.ts            # User management
│   │   │
│   │   ├── payments/
│   │   │   ├── stripe.ts           # Stripe SDK setup
│   │   │   ├── paypal.ts           # PayPal SDK setup
│   │   │   └── actions.ts          # Payment server actions
│   │   │
│   │   ├── zoom/
│   │   │   ├── client.ts           # Zoom API client
│   │   │   └── actions.ts          # Zoom server actions
│   │   │
│   │   ├── email/
│   │   │   ├── resend.ts           # Resend client
│   │   │   ├── send.ts             # Send helper functions
│   │   │   └── templates/          # Email templates
│   │   │       ├── welcome.tsx
│   │   │       ├── payment-success.tsx
│   │   │       ├── webinar-reminder.tsx
│   │   │       ├── webinar-thankyou.tsx
│   │   │       ├── subscription-renewal.tsx
│   │   │       └── base-layout.tsx # Email base template
│   │   │
│   │   ├── ai/
│   │   │   ├── openai.ts           # OpenAI client
│   │   │   ├── prompts.ts          # System prompts
│   │   │   └── knowledge-base.ts   # FAQ data
│   │   │
│   │   ├── validations/            # Zod schemas
│   │   │   ├── auth.ts
│   │   │   ├── webinar.ts
│   │   │   ├── payment.ts
│   │   │   ├── user.ts
│   │   │   └── content.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── cn.ts               # Tailwind class merger
│   │   │   ├── date.ts             # Date formatting
│   │   │   ├── currency.ts         # Price formatting
│   │   │   ├── url.ts              # URL helpers
│   │   │   ├── errors.ts           # Error handling
│   │   │   └── file.ts             # File upload helpers
│   │   │
│   │   └── seo/
│   │       ├── metadata.ts         # Next.js metadata helpers
│   │       └── structured-data.ts  # Schema.org JSON-LD
│   │
│   ├── types/                      # TypeScript definitions
│   │   ├── database.ts             # Supabase generated types
│   │   ├── supabase.ts             # Extended Supabase types
│   │   ├── webinar.ts              # Webinar types
│   │   ├── user.ts                 # User types
│   │   ├── payment.ts              # Payment types
│   │   ├── content.ts              # Content types
│   │   └── api.ts                  # API types
│   │
│   ├── config/                     # Configuration
│   │   ├── site.ts                 # Site metadata
│   │   ├── navigation.ts           # Nav links
│   │   └── constants.ts            # App constants
│   │
│   ├── hooks/                      # Custom React hooks
│   │   ├── use-user.ts             # User hook
│   │   ├── use-toast.ts            # Toast hook
│   │   ├── use-media-query.ts      # Media query hook
│   │   └── use-debounce.ts         # Debounce hook
│   │
│   └── middleware.ts               # Next.js middleware
│
├── .env.local                      # Environment variables (gitignored)
├── .env.example                    # Example env file
├── .eslintrc.json                  # ESLint config
├── .prettierrc                     # Prettier config
├── .gitignore
├── next.config.js                  # Next.js config
├── tailwind.config.ts              # Tailwind config
├── tsconfig.json                   # TypeScript config
├── package.json
├── package-lock.json
├── vercel.json                     # Vercel config (cron jobs)
├── README.md
├── ARCHITECTURE.md                 # This file
└── PROJECT_INSTRUCTIONS.txt        # Cursor instructions
```

---

## Database Schema & RLS Design

### Database Architecture Overview

**Philosophy:**
- Every table has RLS (Row-Level Security) enabled
- Users can only access their own data unless they're admins
- All foreign keys properly indexed
- Timestamps on all tables (created_at, updated_at)
- Soft deletes where appropriate (status fields instead of DELETE)

### Table 1: `profiles`

**Purpose:** Extended user information beyond Supabase Auth

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);

-- Trigger to keep updated_at fresh
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger to auto-create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
```

**Columns:**

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | UUID | NO | Primary key, references auth.users(id) |
| email | TEXT | NO | User email (denormalized for convenience) |
| full_name | TEXT | YES | User's display name |
| avatar_url | TEXT | YES | Profile picture URL (Supabase Storage or Gravatar) |
| role | TEXT | NO | 'student' or 'admin' (default: 'student') |
| created_at | TIMESTAMPTZ | NO | Account creation timestamp |
| updated_at | TIMESTAMPTZ | NO | Last profile update timestamp |

**RLS Policies:**

```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile; admins can view all
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- Users can update their own profile (except role); admins can update any
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ))
  WITH CHECK (
    (auth.uid() = id AND role = (SELECT role FROM profiles WHERE id = auth.uid()))
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Only system can insert (via trigger)
CREATE POLICY "System can insert profiles"
  ON profiles FOR INSERT
  WITH CHECK (false); -- Prevents manual inserts
```

**Business Rules:**
- Profile automatically created when user signs up (via trigger)
- Users cannot change their own role (prevents privilege escalation)
- Admins can change any user's role
- Email is denormalized from auth.users for query convenience

---

### Table 2: `webinars`

**Purpose:** Core webinar/event information

```sql
CREATE TABLE webinars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  expert_name TEXT NOT NULL,
  expert_bio TEXT,
  expert_avatar TEXT,
  topic TEXT NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  price_gbp DECIMAL(10,2) NOT NULL,
  capacity INTEGER,
  zoom_meeting_id TEXT,
  zoom_join_url TEXT,
  zoom_password TEXT,
  replay_url TEXT,
  replay_duration INTEGER,
  thumbnail_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'completed', 'cancelled')),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE UNIQUE INDEX idx_webinars_slug ON webinars(slug);
CREATE INDEX idx_webinars_status ON webinars(status);
CREATE INDEX idx_webinars_scheduled_at ON webinars(scheduled_at);
CREATE INDEX idx_webinars_topic ON webinars(topic);
CREATE INDEX idx_webinars_status_scheduled ON webinars(status, scheduled_at);

-- Full-text search
CREATE INDEX idx_webinars_search ON webinars USING gin(to_tsvector('english', title || ' ' || description || ' ' || expert_name));

-- Trigger
CREATE TRIGGER update_webinars_updated_at
  BEFORE UPDATE ON webinars
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

**Columns:**

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | UUID | NO | Primary key |
| slug | TEXT | NO | URL-friendly identifier (unique) |
| title | TEXT | NO | Webinar title |
| description | TEXT | NO | Full description (markdown supported) |
| expert_name | TEXT | NO | Speaker/instructor name |
| expert_bio | TEXT | YES | Speaker credentials and background |
| expert_avatar | TEXT | YES | Speaker photo URL |
| topic | TEXT | NO | Category/specialty (e.g., "Cardiology", "Surgery") |
| scheduled_at | TIMESTAMPTZ | NO | Live session date and time |
| duration_minutes | INTEGER | NO | Expected duration (default: 60) |
| price_gbp | DECIMAL(10,2) | NO | Purchase price in GBP |
| capacity | INTEGER | YES | Max attendees (NULL = unlimited) |
| zoom_meeting_id | TEXT | YES | Zoom meeting ID (generated by API) |
| zoom_join_url | TEXT | YES | Zoom join link |
| zoom_password | TEXT | YES | Zoom meeting password (if required) |
| replay_url | TEXT | YES | Supabase Storage path for recording |
| replay_duration | INTEGER | YES | Video length in seconds |
| thumbnail_url | TEXT | YES | Preview image URL |
| status | TEXT | NO | 'draft', 'published', 'completed', 'cancelled' |
| created_by | UUID | YES | Admin who created it (references profiles) |
| created_at | TIMESTAMPTZ | NO | Creation timestamp |
| updated_at | TIMESTAMPTZ | NO | Last modification timestamp |

**RLS Policies:**

```sql
-- Enable RLS
ALTER TABLE webinars ENABLE ROW LEVEL SECURITY;

-- Public can view published webinars
CREATE POLICY "Public can view published webinars"
  ON webinars FOR SELECT
  USING (status = 'published' OR auth.uid() IS NOT NULL);

-- Authenticated users can view webinars they purchased
CREATE POLICY "Users can view purchased webinars"
  ON webinars FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM webinar_access 
      WHERE webinar_access.webinar_id = webinars.id 
      AND webinar_access.user_id = auth.uid()
    )
  );

-- Admins can view all webinars
CREATE POLICY "Admins can view all webinars"
  ON webinars FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- Only admins can insert webinars
CREATE POLICY "Admins can insert webinars"
  ON webinars FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- Only admins can update webinars
CREATE POLICY "Admins can update webinars"
  ON webinars FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- Only admins can delete (soft delete via status)
CREATE POLICY "Admins can delete webinars"
  ON webinars FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));
```

**Business Rules:**
- Slug must be unique (auto-generated from title if not provided)
- Status workflow: draft → published → completed
- Can be cancelled at any status
- Zoom links generated when status changes to 'published'
- Replay URL populated after webinar completes
- Capacity checking enforced in application logic (not database constraint)

---

### Table 3: `webinar_access`

**Purpose:** Track user purchases and access permissions

```sql
CREATE TABLE webinar_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  webinar_id UUID NOT NULL REFERENCES webinars(id) ON DELETE CASCADE,
  access_type TEXT NOT NULL DEFAULT 'both' CHECK (access_type IN ('live', 'replay', 'both')),
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  amount_paid DECIMAL(10,2) NOT NULL,
  payment_provider TEXT NOT NULL CHECK (payment_provider IN ('stripe', 'paypal', 'manual')),
  payment_id TEXT,
  attended_live BOOLEAN DEFAULT FALSE,
  replay_watched_seconds INTEGER DEFAULT 0,
  replay_completed BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, webinar_id)
);

-- Indexes
CREATE INDEX idx_webinar_access_user_id ON webinar_access(user_id);
CREATE INDEX idx_webinar_access_webinar_id ON webinar_access(webinar_id);
CREATE INDEX idx_webinar_access_payment_id ON webinar_access(payment_id);
CREATE INDEX idx_webinar_access_purchased_at ON webinar_access(purchased_at);

-- Composite index for common queries
CREATE INDEX idx_webinar_access_user_webinar ON webinar_access(user_id, webinar_id);
```

**Columns:**

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | UUID | NO | Primary key |
| user_id | UUID | NO | References profiles(id) |
| webinar_id | UUID | NO | References webinars(id) |
| access_type | TEXT | NO | 'live', 'replay', or 'both' (default: 'both') |
| purchased_at | TIMESTAMPTZ | NO | Payment completion timestamp |
| amount_paid | DECIMAL(10,2) | NO | Price paid in GBP |
| payment_provider | TEXT | NO | 'stripe', 'paypal', or 'manual' |
| payment_id | TEXT | YES | External payment reference (Stripe charge ID, etc.) |
| attended_live | BOOLEAN | NO | Whether user joined live session (default: false) |
| replay_watched_seconds | INTEGER | NO | Current replay progress in seconds (default: 0) |
| replay_completed | BOOLEAN | NO | Whether user finished watching (default: false) |
| expires_at | TIMESTAMPTZ | YES | Optional expiry for time-limited access |
| created_at | TIMESTAMPTZ | NO | Record creation timestamp |

**RLS Policies:**

```sql
-- Enable RLS
ALTER TABLE webinar_access ENABLE ROW LEVEL SECURITY;

-- Users can view their own access records
CREATE POLICY "Users can view own access"
  ON webinar_access FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can view all access records
CREATE POLICY "Admins can view all access"
  ON webinar_access FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- Users can update their own progress (replay_watched_seconds, replay_completed)
CREATE POLICY "Users can update own progress"
  ON webinar_access FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id 
    AND (OLD.replay_watched_seconds IS DISTINCT FROM NEW.replay_watched_seconds
         OR OLD.replay_completed IS DISTINCT FROM NEW.replay_completed)
  );

-- Only system/webhooks can insert (uses service key, bypasses RLS)
-- Admins can manually grant access
CREATE POLICY "Admins can insert access"
  ON webinar_access FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- Admins can update access records
CREATE POLICY "Admins can update access"
  ON webinar_access FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- Only admins can revoke access (delete)
CREATE POLICY "Admins can delete access"
  ON webinar_access FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));
```

**Business Rules:**
- Unique constraint on (user_id, webinar_id) prevents duplicate purchases
- Payment webhooks create records using service key (bypasses RLS)
- Users can update their own viewing progress
- `expires_at` used for time-limited promotions (e.g., "7-day access")
- `attended_live` marked true when user clicks "Join Live"
- `replay_completed` marked true when `replay_watched_seconds` reaches 90% of `replay_duration`

---

### Table 4: `content_items`

**Purpose:** Weekly learning materials (case studies, articles, PDFs)

```sql
CREATE TABLE content_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  content_type TEXT NOT NULL CHECK (content_type IN ('case_study', 'article', 'quiz', 'video', 'pdf')),
  body TEXT,
  file_url TEXT,
  thumbnail_url TEXT,
  published_at TIMESTAMPTZ,
  topic TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  estimated_time INTEGER,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_content_items_published_at ON content_items(published_at);
CREATE INDEX idx_content_items_topic ON content_items(topic);
CREATE INDEX idx_content_items_type ON content_items(content_type);
CREATE INDEX idx_content_items_published_topic ON content_items(published_at, topic) WHERE published_at IS NOT NULL;

-- Full-text search
CREATE INDEX idx_content_items_search ON content_items USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || COALESCE(body, '')));

-- Trigger
CREATE TRIGGER update_content_items_updated_at
  BEFORE UPDATE ON content_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

**Columns:**

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | UUID | NO | Primary key |
| title | TEXT | NO | Content title |
| description | TEXT | YES | Brief summary/excerpt |
| content_type | TEXT | NO | 'case_study', 'article', 'quiz', 'video', 'pdf' |
| body | TEXT | YES | Main content (markdown or HTML) |
| file_url | TEXT | YES | PDF/video URL from Supabase Storage |
| thumbnail_url | TEXT | YES | Preview image |
| published_at | TIMESTAMPTZ | YES | Publication date (NULL = draft) |
| topic | TEXT | NO | Medical specialty |
| difficulty | TEXT | YES | 'beginner', 'intermediate', 'advanced' |
| estimated_time | INTEGER | YES | Reading/viewing time in minutes |
| created_by | UUID | YES | Admin who created it |
| created_at | TIMESTAMPTZ | NO | Creation timestamp |
| updated_at | TIMESTAMPTZ | NO | Last edit timestamp |

**RLS Policies:**

```sql
-- Enable RLS
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;

-- Authenticated users can view published content
CREATE POLICY "Users can view published content"
  ON content_items FOR SELECT
  USING (auth.uid() IS NOT NULL AND published_at <= NOW());

-- Admins can view all content (including drafts)
CREATE POLICY "Admins can view all content"
  ON content_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- Only admins can create content
CREATE POLICY "Admins can create content"
  ON content_items FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- Only admins can update content
CREATE POLICY "Admins can update content"
  ON content_items FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- Only admins can delete content
CREATE POLICY "Admins can delete content"
  ON content_items FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));
```

**Business Rules:**
- Content is draft until `published_at` is set
- Published content visible to all authenticated users (no paywall for now)
- Can schedule future publication by setting `published_at` in future
- `file_url` used for PDFs and videos stored in Supabase Storage
- `body` field supports markdown for rich text

---

### Table 5: `payment_events`

**Purpose:** Audit log for all payment-related events

```sql
CREATE TABLE payment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('stripe', 'paypal')),
  provider_event_id TEXT UNIQUE NOT NULL,
  amount DECIMAL(10,2),
  currency TEXT DEFAULT 'GBP',
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_payment_events_user_id ON payment_events(user_id);
CREATE INDEX idx_payment_events_created_at ON payment_events(created_at);
CREATE INDEX idx_payment_events_provider ON payment_events(provider);
CREATE UNIQUE INDEX idx_payment_events_provider_id ON payment_events(provider_event_id);
CREATE INDEX idx_payment_events_type ON payment_events(event_type);
```

**Columns:**

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | UUID | NO | Primary key |
| user_id | UUID | YES | References profiles(id), SET NULL on delete |
| event_type | TEXT | NO | E.g., 'payment.success', 'payment.failed', 'refund' |
| provider | TEXT | NO | 'stripe' or 'paypal' |
| provider_event_id | TEXT | NO | Webhook event ID (unique, prevents duplicates) |
| amount | DECIMAL(10,2) | YES | Transaction amount |
| currency | TEXT | YES | Currency code (default: 'GBP') |
| metadata | JSONB | YES | Additional event data (raw webhook payload) |
| created_at | TIMESTAMPTZ | NO | Event timestamp |

**RLS Policies:**

```sql
-- Enable RLS
ALTER TABLE payment_events ENABLE ROW LEVEL SECURITY;

-- Only admins can view payment events
CREATE POLICY "Admins can view payment events"
  ON payment_events FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- No manual inserts (only via service key in webhooks)
-- No updates (immutable audit log)
-- No deletes (permanent record)
```

**Business Rules:**
- Immutable audit log (no updates or deletes)
- `provider_event_id` unique to prevent duplicate webhook processing
- All webhook events logged, even failures
- Metadata stores full webhook payload for debugging
- Used for compliance, debugging, and analytics

---

### Table 6: `email_events` (Optional)

**Purpose:** Log all outbound emails for tracking and debugging

```sql
CREATE TABLE email_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  email_type TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'bounced', 'delivered')),
  provider_message_id TEXT,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  error TEXT
);

-- Indexes
CREATE INDEX idx_email_events_user_id ON email_events(user_id);
CREATE INDEX idx_email_events_sent_at ON email_events(sent_at);
CREATE INDEX idx_email_events_status ON email_events(status);
CREATE INDEX idx_email_events_type ON email_events(email_type);
```

**Columns:**

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | UUID | NO | Primary key |
| user_id | UUID | YES | References profiles(id) |
| email_type | TEXT | NO | E.g., 'welcome', 'payment_success', 'reminder' |
| recipient_email | TEXT | NO | Destination email address |
| subject | TEXT | NO | Email subject line |
| status | TEXT | NO | 'sent', 'failed', 'bounced', 'delivered' |
| provider_message_id | TEXT | YES | Resend message ID for tracking |
| sent_at | TIMESTAMPTZ | NO | Send timestamp |
| error | TEXT | YES | Error message if failed |

**RLS Policies:**

```sql
-- Enable RLS
ALTER TABLE email_events ENABLE ROW LEVEL SECURITY;

-- Only admins can view email events
CREATE POLICY "Admins can view email events"
  ON email_events FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- Service key can insert (email sending functions)
-- Service key can update status (delivery webhooks from Resend)
```

**Business Rules:**
- Log every email sent through the platform
- Update status when Resend webhooks report delivery/bounce
- Used for debugging email issues
- Helps track email deliverability rates

---

### Table 7: `chatbot_interactions` (Optional)

**Purpose:** Log AI chatbot conversations for analytics and improvement

```sql
CREATE TABLE chatbot_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  session_id TEXT NOT NULL,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  tokens_used INTEGER,
  helpful BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_chatbot_user_id ON chatbot_interactions(user_id);
CREATE INDEX idx_chatbot_session_id ON chatbot_interactions(session_id);
CREATE INDEX idx_chatbot_created_at ON chatbot_interactions(created_at);
CREATE INDEX idx_chatbot_helpful ON chatbot_interactions(helpful) WHERE helpful IS NOT NULL;
```

**Columns:**

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | UUID | NO | Primary key |
| user_id | UUID | YES | References profiles(id), NULL for anonymous users |
| session_id | TEXT | NO | Browser session identifier (UUID) |
| message | TEXT | NO | User's question |
| response | TEXT | NO | AI's answer |
| tokens_used | INTEGER | YES | OpenAI token count for cost tracking |
| helpful | BOOLEAN | YES | User feedback (thumbs up/down), NULL if no feedback |
| created_at | TIMESTAMPTZ | NO | Interaction timestamp |

**RLS Policies:**

```sql
-- Enable RLS
ALTER TABLE chatbot_interactions ENABLE ROW LEVEL SECURITY;

-- Users can view their own interactions
CREATE POLICY "Users can view own interactions"
  ON chatbot_interactions FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can view all interactions
CREATE POLICY "Admins can view all interactions"
  ON chatbot_interactions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- API route can insert (uses service key or checks auth)
-- Users can update helpful feedback on their own interactions
CREATE POLICY "Users can update helpful feedback"
  ON chatbot_interactions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id 
    AND (OLD.helpful IS DISTINCT FROM NEW.helpful)
  );
```

**Business Rules:**
- Log every chatbot interaction
- Session ID tracks conversation threads
- Anonymous users have NULL user_id but valid session_id
- Tokens tracked for OpenAI cost monitoring
- Helpful feedback used to improve responses

---

### Database Functions

#### Function: `update_updated_at_column()`

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

**Purpose:** Automatically update `updated_at` timestamp on row updates

---

#### Function: `handle_new_user()`

```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Purpose:** Automatically create profile when user signs up

---

### Database Relationships

```
auth.users (Supabase)
    ↓ (1:1)
profiles
    ↓ (1:N)
webinar_access
    ↓ (N:1)
webinars

profiles (admin)
    ↓ (1:N)
webinars (created_by)

profiles (admin)
    ↓ (1:N)
content_items (created_by)

profiles
    ↓ (1:N)
payment_events

profiles
    ↓ (1:N)
email_events

profiles
    ↓ (1:N)
chatbot_interactions
```

---

## Reusable Component Inventory

### UI Primitives (shadcn/ui) - Client Components

All components in `src/components/ui/` are from shadcn/ui library. Install as needed:

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
# ... etc
```

```markdown
#### Button (`components/ui/button.tsx`)

**Purpose:** Clickable button with multiple variants and sizes

**Props:**
- `variant`: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
- `size`: 'default' | 'sm' | 'lg' | 'icon'
- `disabled`: boolean
- `asChild`: boolean (render as child component)
- Standard HTML button props (onClick, type, etc.)

**Type:** Client Component (interactive)

**Usage:**
```typescript
<Button variant="default" size="lg" onClick={handleClick}>
  Click me
</Button>
```

---

#### Input (`components/ui/input.tsx`)

**Purpose:** Text input field with validation states

**Props:**
- `type`: 'text' | 'email' | 'password' | 'number' | etc.
- `placeholder`: string
- `error`: boolean (for error styling)
- `disabled`: boolean
- Standard HTML input props

**Type:** Client Component

**Usage:**
```typescript
<Input 
  type="email" 
  placeholder="Enter email" 
  error={!!errors.email}
/>
```

---

#### Card (`components/ui/card.tsx`)

**Purpose:** Container with border, shadow, and padding

**Sub-components:**
- `Card`: Main container
- `CardHeader`: Top section
- `CardTitle`: Title text
- `CardDescription`: Subtitle text
- `CardContent`: Main content area
- `CardFooter`: Bottom section

**Type:** Server Component (unless needs onClick)

**Usage:**
```typescript
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content here</CardContent>
  <CardFooter>Footer actions</CardFooter>
</Card>
```

---

#### Dialog/Modal (`components/ui/dialog.tsx`)

**Purpose:** Modal dialog overlay with backdrop

**Sub-components:**
- `Dialog`: Root component
- `DialogTrigger`: Button to open
- `DialogContent`: Modal content
- `DialogHeader`: Header section
- `DialogTitle`: Title
- `DialogDescription`: Description
- `DialogFooter`: Footer with actions

**Type:** Client Component (portal + state)

**Usage:**
```typescript
<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
    </DialogHeader>
    <p>Content</p>
    <DialogFooter>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

#### Badge (`components/ui/badge.tsx`)

**Purpose:** Small label for status/category

**Props:**
- `variant`: 'default' | 'secondary' | 'destructive' | 'outline'

**Type:** Server Component

**Usage:**
```typescript
<Badge variant="secondary">Published</Badge>
```

---

#### Skeleton (`components/ui/skeleton.tsx`)

**Purpose:** Loading placeholder with shimmer effect

**Props:**
- `className`: string (for custom sizing)

**Type:** Server Component

**Usage:**
```typescript
<Skeleton className="h-12 w-full" />
```

---

### Layout Components

#### Navbar (`components/layout/navbar.tsx`)

**Purpose:** Top navigation bar for marketing pages

**Props:**
- None (fetches user session internally)

**Features:**
- Logo (links to /)
- Nav links (About, Webinars, Pricing, Contact)
- Auth button ("Sign In" or user menu if logged in)
- Mobile hamburger menu
- Sticky positioning on scroll

**Type:** Server Component (fetches session server-side)

**Implementation:**
```typescript
// Server Component
export async function Navbar() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <nav className="container flex h-16 items-center justify-between">
        <Logo />
        <DesktopNav />
        <AuthButton user={user} />
        <MobileMenuButton />
      </nav>
    </header>
  )
}
```

---

#### Footer (`components/layout/footer.tsx`)

**Purpose:** Site footer with links and copyright

**Props:** None

**Features:**
- Logo
- Quick links (About, Contact, Privacy, Terms)
- Social media icons
- Copyright notice

**Type:** Server Component

**Implementation:**
```typescript
export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Logo />
            <p className="text-sm text-muted-foreground mt-4">
              MedUni - Medical Education Platform
            </p>
          </div>
          <FooterLinks title="Company" links={companyLinks} />
          <FooterLinks title="Resources" links={resourceLinks} />
          <FooterLinks title="Legal" links={legalLinks} />
        </div>
        <Separator className="my-8" />
        <p className="text-center text-sm text-muted-foreground">
          © 2025 MedUni. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
```

---

#### DashboardShell (`components/layout/dashboard-shell.tsx`)

**Purpose:** Wrapper layout for authenticated dashboard pages

**Props:**
- `children`: ReactNode
- `title`: string (page title)
- `description`: string (optional subtitle)

**Features:**
- Sidebar navigation
- Header with breadcrumbs
- User menu dropdown
- Mobile-responsive (sidebar collapses to drawer)

**Type:** Server Component (shell) with Client Component user menu

**Implementation:**
```typescript
export function DashboardShell({ 
  children, 
  title, 
  description 
}: DashboardShellProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <DashboardHeader title={title} description={description} />
        <main className="container py-6">{children}</main>
      </div>
    </div>
  )
}
```

---

#### Sidebar (`components/layout/sidebar.tsx`)

**Purpose:** Navigation sidebar for student dashboard

**Props:**
- `currentPath`: string (to highlight active link)

**Features:**
- Nav links (Dashboard, Webinars, Learning, Billing, Settings)
- Icons for each section
- Active state highlighting
- Collapse button for mobile

**Type:** Server Component

**Nav Items:**
```typescript
const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/dashboard/webinars', label: 'My Webinars', icon: Video },
  { href: '/dashboard/learning', label: 'Learning', icon: BookOpen },
  { href: '/dashboard/billing', label: 'Billing', icon: CreditCard },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]
```

---

#### AdminSidebar (`components/layout/admin-sidebar.tsx`)

**Purpose:** Navigation sidebar for admin panel

**Props:**
- `currentPath`: string

**Features:**
- Admin-specific nav links
- Different color scheme
- Admins-only indicator

**Type:** Server Component

**Nav Items:**
```typescript
const adminNavItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/webinars', label: 'Webinars', icon: Video },
  { href: '/admin/content', label: 'Content', icon: FileText },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart },
]
```

---

### Webinar Components

#### WebinarCard (`components/webinars/webinar-card.tsx`)

**Purpose:** Display single webinar in grid or list view

**Props:**
```typescript
interface WebinarCardProps {
  webinar: {
    id: string
    slug: string
    title: string
    expert_name: string
    expert_avatar: string
    scheduled_at: string
    duration_minutes: number
    price_gbp: number
    thumbnail_url: string
    topic: string
  }
  userHasAccess: boolean
  variant: 'grid' | 'list'
}
```

**Features:**
- Thumbnail image with aspect ratio
- Title and expert name
- Date/time display
- Price or "Owned" badge
- "View" or "Buy" button
- Topic badge
- Hover effects

**Type:** Server Component (pass data as props)

**Implementation:**
```typescript
export function WebinarCard({ webinar, userHasAccess, variant }: WebinarCardProps) {
  const isUpcoming = new Date(webinar.scheduled_at) > new Date()
  
  return (
    <Card className={cn(
      'overflow-hidden transition-shadow hover:shadow-lg',
      variant === 'list' && 'flex flex-row'
    )}>
      <Link href={`/webinars/${webinar.slug}`}>
        <div className="relative aspect-video">
          <Image 
            src={webinar.thumbnail_url} 
            alt={webinar.title}
            fill
            className="object-cover"
          />
          {userHasAccess && (
            <Badge className="absolute top-2 right-2">Owned</Badge>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <Badge variant="secondary">{webinar.topic}</Badge>
        <h3 className="font-semibold text-lg mt-2">{webinar.title}</h3>
        <div className="flex items-center gap-2 mt-2">
          <Avatar>
            <AvatarImage src={webinar.expert_avatar} />
            <AvatarFallback>{webinar.expert_name[0]}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">
            {webinar.expert_name}
          </span>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            {formatDate(webinar.scheduled_at)}
          </div>
          {!userHasAccess && (
            <span className="font-semibold">£{webinar.price_gbp}</span>
          )}
        </div>
        <Button 
          className="w-full mt-4" 
          variant={userHasAccess ? 'secondary' : 'default'}
          asChild
        >
          <Link href={`/webinars/${webinar.slug}`}>
            {userHasAccess ? 'View Details' : 'Learn More'}
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
```

---

#### WebinarList (`components/webinars/webinar-list.tsx`)

**Purpose:** Grid/list container for multiple webinars

**Props:**
```typescript
interface WebinarListProps {
  webinars: Webinar[]
  userAccessMap: Record<string, boolean> // webinar_id → hasAccess
  view: 'grid' | 'list'
  emptyMessage?: string
}
```

**Features:**
- Responsive grid (1 col mobile, 2 tablet, 3 desktop)
- Empty state when no webinars
- Loading skeleton support

**Type:** Server Component

**Implementation:**
```typescript
export function WebinarList({ 
  webinars, 
  userAccessMap, 
  view,
  emptyMessage = 'No webinars found'
}: WebinarListProps) {
  if (webinars.length === 0) {
    return <EmptyState message={emptyMessage} />
  }
  
  return (
    <div className={cn(
      'gap-6',
      view === 'grid' && 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      view === 'list' && 'flex flex-col space-y-4'
    )}>
      {webinars.map((webinar) => (
        <WebinarCard
          key={webinar.id}
          webinar={webinar}
          userHasAccess={userAccessMap[webinar.id] || false}
          variant={view}
        />
      ))}
    </div>
  )
}
```

---

#### WebinarFilters (`components/webinars/webinar-filters.tsx`)

**Purpose:** Filter and sort controls for webinar catalogue

**Props:**
```typescript
interface WebinarFiltersProps {
  topics: string[]
  selectedTopic: string | null
  sortBy: 'date' | 'price' | 'popularity'
  onFilterChange: (filters: FilterState) => void
}
```

**Features:**
- Topic dropdown (multi-select)
- Date range picker (optional)
- Sort dropdown (upcoming, price low-high, popular)
- Search input
- Clear filters button
- URL params sync (shareable links)

**Type:** Client Component (interactive filters)

**Implementation:**
```typescript
'use client'

export function WebinarFilters({ 
  topics, 
  selectedTopic, 
  sortBy, 
  onFilterChange 
}: WebinarFiltersProps) {
  const [search, setSearch] = useState('')
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    // Sync with URL params
  }, [])
  
  const handleTopicChange = (topic: string) => {
    onFilterChange({ topic, sortBy, search })
  }
  
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <Input
        placeholder="Search webinars..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="md:w-1/3"
      />
      <Select value={selectedTopic || 'all'} onValueChange={handleTopicChange}>
        <SelectTrigger>
          <SelectValue placeholder="All Topics" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Topics</SelectItem>
          {topics.map((topic) => (
            <SelectItem key={topic} value={topic}>{topic}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={sortBy} onValueChange={(val) => onFilterChange({ sortBy: val })}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="date">Upcoming First</SelectItem>
          <SelectItem value="price">Price: Low to High</SelectItem>
          <SelectItem value="popularity">Most Popular</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
```

---

#### WebinarPlayer (`components/webinars/webinar-player.tsx`)

**Purpose:** Video player for replay viewing with progress tracking

**Props:**
```typescript
interface WebinarPlayerProps {
  videoUrl: string // Signed Supabase URL
  title: string
  duration: number // seconds
  lastPosition: number // seconds
  onProgress: (seconds: number) => void
}
```

**Features:**
- Custom controls (play/pause, seek, volume, speed, fullscreen)
- Progress tracking (save every 30s)
- Resume from last position
- Playback speed control (0.5x, 1x, 1.5x, 2x)
- Keyboard shortcuts (space, arrows)
- Picture-in-picture support

**Type:** Client Component (HTML5 video API)

**Implementation:**
```typescript
'use client'

export function WebinarPlayer({
  videoUrl,
  title,
  duration,
  lastPosition,
  onProgress
}: WebinarPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(lastPosition)
  
  useEffect(() => {
    // Start from last position
    if (videoRef.current) {
      videoRef.current.currentTime = lastPosition
    }
  }, [lastPosition])
  
  useEffect(() => {
    // Save progress every 30 seconds
    const interval = setInterval(() => {
      if (videoRef.current && isPlaying) {
        onProgress(videoRef.current.currentTime)
      }
    }, 30000)
    
    return () => clearInterval(interval)
  }, [isPlaying, onProgress])
  
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }
  
  return (
    <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full"
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onEnded={() => setIsPlaying(false)}
      />
      
      {/* Custom controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <Progress value={(currentTime / duration) * 100} />
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" onClick={togglePlay}>
              {isPlaying ? <Pause /> : <Play />}
            </Button>
            <span className="text-white text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <SpeedControl />
            <VolumeControl />
            <FullscreenButton />
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

#### JoinWebinarButton (`components/webinars/join-webinar-button.tsx`)

**Purpose:** Dynamic button for joining live webinars with countdown

**Props:**
```typescript
interface JoinWebinarButtonProps {
  webinarId: string
  scheduledAt: string
  zoomUrl: string | null
  userHasAccess: boolean
}
```

**Features:**
- Shows countdown until webinar starts
- Enables 15 minutes before scheduled_at
- Triggers Server Action to mark attendance
- Redirects to Zoom
- Disabled states with helpful messages

**Type:** Client Component (countdown timer)

**Implementation:**
```typescript
'use client'

export function JoinWebinarButton({
  webinarId,
  scheduledAt,
  zoomUrl,
  userHasAccess
}: JoinWebinarButtonProps) {
  const [timeUntil, setTimeUntil] = useState<number>(0)
  const [canJoin, setCanJoin] = useState(false)
  
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime()
      const start = new Date(scheduledAt).getTime()
      const diff = start - now
      
      setTimeUntil(diff)
      // Can join 15 minutes before
      setCanJoin(diff <= 15 * 60 * 1000 && diff > -120 * 60 * 1000)
    }, 1000)
    
    return () => clearInterval(interval)
  }, [scheduledAt])
  
  const handleJoin = async () => {
    // Server Action to mark attendance and get/verify Zoom link
    const result = await joinWebinar(webinarId)
    if (result.success) {
      window.open(result.zoomUrl, '_blank')
    }
  }
  
  if (!userHasAccess) {
    return (
      <Button disabled>
        Purchase to join
      </Button>
    )
  }
  
  if (timeUntil > 15 * 60 * 1000) {
    return (
      <Button disabled>
        Join available in {formatCountdown(timeUntil)}
      </Button>
    )
  }
  
  if (!canJoin) {
    return (
      <Button disabled>
        Webinar has ended
      </Button>
    )
  }
  
  return (
    <Button onClick={handleJoin} size="lg" className="w-full">
      <Video className="mr-2" />
      Join Live Now
    </Button>
  )
}
```

---

### Dashboard Components

#### StatsCard (`components/dashboard/stats-card.tsx`)

**Purpose:** Display key metrics in dashboard overview

**Props:**
```typescript
interface StatsCardProps {
  title: string
  value: string | number
  icon: React.ComponentType
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: 'default' | 'success' | 'warning' | 'error'
}
```

**Type:** Server Component

**Implementation:**
```typescript
export function StatsCard({ title, value, icon: Icon, trend, color }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-2">{value}</p>
            {trend && (
              <p className={cn(
                'text-sm mt-2',
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              )}>
                {trend.isPositive ? '↑' : '↓'} {trend.value}%
              </p>
            )}
          </div>
          <div className={cn(
            'p-3 rounded-full',
            color === 'success' && 'bg-green-100 text-green-600',
            color === 'warning' && 'bg-yellow-100 text-yellow-600',
            color === 'error' && 'bg-red-100 text-red-600',
            !color && 'bg-primary/10 text-primary'
          )}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

---

#### UpcomingWebinars (`components/dashboard/upcoming-webinars.tsx`)

**Purpose:** List of user's upcoming purchased webinars

**Props:**
```typescript
interface UpcomingWebinarsProps {
  webinars: Array<{
    id: string
    slug: string
    title: string
    scheduled_at: string
    expert_name: string
    thumbnail_url: string
  }>
}
```

**Type:** Server Component with Client Component for join button

---

#### EmptyState (`components/dashboard/empty-state.tsx`)

**Purpose:** Placeholder when user has no data

**Props:**
```typescript
interface EmptyStateProps {
  icon?: React.ComponentType
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
}
```

**Type:** Server Component

**Implementation:**
```typescript
export function EmptyState({
  icon: Icon = FileQuestion,
  title,
  description,
  actionLabel,
  actionHref
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-6 mb-4">
        <Icon className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      {actionLabel && actionHref && (
        <Button asChild>
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  )
}
```

---

### Admin Components

#### WebinarForm (`components/admin/webinar-form.tsx`)

**Purpose:** Create/edit webinar with all fields and validation

**Props:**
```typescript
interface WebinarFormProps {
  webinar?: Webinar // For edit mode
  onSubmit: (data: WebinarFormData) => Promise<void>
  isLoading: boolean
}
```

**Features:**
- All webinar fields (title, description, expert, date, price, etc.)
- Image upload for thumbnail
- Rich text editor for description
- Date/time picker for scheduling
- Zoom integration (create meeting button)
- Draft/publish toggle
- Client-side and server-side validation (Zod)

**Type:** Client Component (complex form with validation)

---

#### UserTable (`components/admin/user-table.tsx`)

**Purpose:** Display and manage users with sorting/filtering

**Props:**
```typescript
interface UserTableProps {
  users: User[]
  onEdit: (userId: string) => void
  onDelete: (userId: string) => void
}
```

**Features:**
- Sortable columns (name, email, role, created_at)
- Search/filter by email or name
- Role badges
- Actions dropdown (edit, change role, delete)
- Pagination
- Bulk actions (optional)

**Type:** Client Component (interactive table)

---

#### UploadReplay (`components/admin/upload-replay.tsx`)

**Purpose:** Upload webinar replay video to Supabase Storage

**Props:**
```typescript
interface UploadReplayProps {
  webinarId: string
  onComplete: () => void
}
```

**Features:**
- Drag-and-drop file upload
- Progress bar
- File type validation (MP4, MOV)
- Size limit check (2GB)
- Video preview after upload
- Cancel upload button

**Type:** Client Component (file upload)

---

### Form Components

#### CheckoutForm (`components/forms/checkout-form.tsx`)

**Purpose:** Stripe payment form with Elements

**Props:**
```typescript
interface CheckoutFormProps {
  webinarId: string
  amount: number
  onSuccess: () => void
}
```

**Features:**
- Stripe CardElement
- Billing details fields
- Payment processing state
- Error handling
- Success redirect

**Type:** Client Component (Stripe Elements)

**Implementation:**
```typescript
'use client'

import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export function CheckoutForm({ webinarId, amount, onSuccess }: CheckoutFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutFormInner webinarId={webinarId} amount={amount} onSuccess={onSuccess} />
    </Elements>
  )
}

function CheckoutFormInner({ webinarId, amount, onSuccess }: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return
    
    setIsProcessing(true)
    setError(null)
    
    try {
      // Create payment intent via Server Action
      const { clientSecret } = await createPaymentIntent(webinarId, amount)
      
      // Confirm payment
      const { error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      })
      
      if (stripeError) {
        setError(stripeError.message || 'Payment failed')
      } else {
        onSuccess()
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border rounded-lg">
        <CardElement options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
          },
        }} />
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className="w-full"
        size="lg"
      >
        {isProcessing ? 'Processing...' : `Pay £${amount}`}
      </Button>
    </form>
  )
}
```

---

### Chatbot Components

#### ChatbotWidget (`components/chatbot/chatbot-widget.tsx`)

**Purpose:** Floating chat button in bottom-right corner

**Props:** None (manages own state)

**Features:**
- Floating action button
- Badge with unread count (optional)
- Pulse animation when first loaded
- onClick opens chat window

**Type:** Client Component

**Implementation:**
```typescript
'use client'

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <>
      <Button
        size="icon"
        className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg z-50"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
      
      {isOpen && (
        <ChatbotWindow onClose={() => setIsOpen(false)} />
      )}
    </>
  )
}
```

---

#### ChatbotWindow (`components/chatbot/chatbot-window.tsx`)

**Purpose:** Chat interface overlay

**Props:**
```typescript
interface ChatbotWindowProps {
  onClose: () => void
}
```

**Features:**
- Message list (scrollable)
- Input field with send button
- Typing indicator while AI responds
- Quick action buttons
- Close button
- Minimize option (future)

**Type:** Client Component (manages chat state, API calls)

**Implementation:**
```typescript
'use client'

export function ChatbotWindow({ onClose }: ChatbotWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi! How can I help you today?' }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const sendMessage = async () => {
    if (!input.trim()) return
    
    const userMessage = { role: 'user' as const, content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          conversationHistory: messages
        }),
      })
      
      if (!response.ok) throw new Error('Failed to get response')
      
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let aiResponse = ''
      ```markdown
      // Stream response
      while (true) {
        const { done, value } = await reader!.read()
        if (done) break
        
        const chunk = decoder.decode(value)
        aiResponse += chunk
        
        // Update last message in real-time
        setMessages((prev) => {
          const newMessages = [...prev]
          const lastMessage = newMessages[newMessages.length - 1]
          
          if (lastMessage?.role === 'assistant') {
            lastMessage.content = aiResponse
          } else {
            newMessages.push({ role: 'assistant', content: aiResponse })
          }
          
          return newMessages
        })
      }
    } catch (error) {
      console.error('Chat error:', error)
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }
      ])
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="fixed bottom-20 right-4 w-96 h-[600px] bg-background border rounded-lg shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 bg-green-500 rounded-full" />
          <h3 className="font-semibold">MedUni Assistant</h3>
        </div>
        <Button size="icon" variant="ghost" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Messages */}
      <MessageList messages={messages} isLoading={isLoading} />
      
      {/* Quick Actions */}
      <QuickActions onSelect={(action) => setInput(action)} />
      
      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <Button onClick={sendMessage} disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
```

---

#### MessageList (`components/chatbot/message-list.tsx`)

**Purpose:** Scrollable chat message history

**Props:**
```typescript
interface MessageListProps {
  messages: Array<{
    role: 'user' | 'assistant'
    content: string
  }>
  isLoading: boolean
}
```

**Features:**
- Auto-scroll to bottom on new message
- Message bubbles with different styles for user/assistant
- Timestamps
- Typing indicator

**Type:** Client Component (scroll behavior)

---

#### QuickActions (`components/chatbot/quick-actions.tsx`)

**Purpose:** Suggested actions/questions

**Props:**
```typescript
interface QuickActionsProps {
  onSelect: (action: string) => void
}
```

**Features:**
- Button grid with common queries
- Examples: "View webinars", "Reset password", "Contact support"
- Disappears after first user message

**Type:** Client Component

---

## API & Integration Flows

### Payment Integration (Stripe)

#### Setup

```typescript
// src/lib/payments/stripe.ts
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})
```

#### Create Payment Intent (Server Action)

```typescript
// src/lib/payments/actions.ts
'use server'

export async function createPaymentIntent(webinarId: string, amount: number) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Unauthorized')
  
  // Check if user already owns webinar
  const { data: existingAccess } = await supabase
    .from('webinar_access')
    .select('id')
    .eq('user_id', user.id)
    .eq('webinar_id', webinarId)
    .single()
  
  if (existingAccess) {
    throw new Error('You already own this webinar')
  }
  
  // Create Stripe payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to pence
    currency: 'gbp',
    metadata: {
      user_id: user.id,
      webinar_id: webinarId,
    },
  })
  
  return { clientSecret: paymentIntent.client_secret }
}
```

#### Webhook Handler

```typescript
// src/app/api/webhooks/stripe/route.ts
import { headers } from 'next/headers'
import { stripe } from '@/lib/payments/stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail } from '@/lib/email/send'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')!
  
  let event: Stripe.Event
  
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return new Response('Webhook Error', { status: 400 })
  }
  
  // Handle payment success
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent
    const { user_id, webinar_id } = paymentIntent.metadata
    
    // Use admin client to bypass RLS
    const supabase = createAdminClient()
    
    // Create webinar access
    const { error: accessError } = await supabase
      .from('webinar_access')
      .insert({
        user_id,
        webinar_id,
        access_type: 'both',
        amount_paid: paymentIntent.amount / 100,
        payment_provider: 'stripe',
        payment_id: paymentIntent.id,
      })
    
    if (accessError) {
      console.error('Failed to create access:', accessError)
      return new Response('Error creating access', { status: 500 })
    }
    
    // Log payment event
    await supabase.from('payment_events').insert({
      user_id,
      event_type: 'payment.success',
      provider: 'stripe',
      provider_event_id: event.id,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
      metadata: paymentIntent,
    })
    
    // Get webinar and user details
    const { data: webinar } = await supabase
      .from('webinars')
      .select('title, scheduled_at, zoom_join_url')
      .eq('id', webinar_id)
      .single()
    
    const { data: user } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', user_id)
      .single()
    
    // Send confirmation email
    if (webinar && user) {
      await sendEmail({
        to: user.email,
        template: 'payment-success',
        data: {
          userName: user.full_name,
          webinarTitle: webinar.title,
          scheduledAt: webinar.scheduled_at,
          zoomUrl: webinar.zoom_join_url,
          amount: paymentIntent.amount / 100,
        },
      })
    }
  }
  
  return new Response(JSON.stringify({ received: true }), { status: 200 })
}
```

---

### Zoom Integration

#### Setup

```typescript
// src/lib/zoom/client.ts
import axios from 'axios'
import jwt from 'jsonwebtoken'

function generateZoomToken() {
  const payload = {
    iss: process.env.ZOOM_API_KEY,
    exp: Date.now() + 5000,
  }
  return jwt.sign(payload, process.env.ZOOM_API_SECRET!)
}

export const zoomClient = axios.create({
  baseURL: 'https://api.zoom.us/v2',
  headers: {
    Authorization: `Bearer ${generateZoomToken()}`,
  },
})
```

#### Create Meeting (Server Action)

```typescript
// src/lib/zoom/actions.ts
'use server'

import { zoomClient } from './client'
import { createAdminClient } from '@/lib/supabase/admin'

export async function createZoomMeeting(webinarId: string) {
  const supabase = createAdminClient()
  
  // Get webinar details
  const { data: webinar, error } = await supabase
    .from('webinars')
    .select('title, scheduled_at, duration_minutes')
    .eq('id', webinarId)
    .single()
  
  if (error || !webinar) {
    throw new Error('Webinar not found')
  }
  
  // Create Zoom meeting
  const response = await zoomClient.post('/users/me/meetings', {
    topic: webinar.title,
    type: 2, // Scheduled meeting
    start_time: new Date(webinar.scheduled_at).toISOString(),
    duration: webinar.duration_minutes,
    timezone: 'Europe/London',
    settings: {
      host_video: true,
      participant_video: true,
      join_before_host: false,
      mute_upon_entry: true,
      watermark: false,
      audio: 'both',
      auto_recording: 'cloud',
    },
  })
  
  const meetingData = response.data
  
  // Update webinar with Zoom details
  await supabase
    .from('webinars')
    .update({
      zoom_meeting_id: meetingData.id.toString(),
      zoom_join_url: meetingData.join_url,
      zoom_password: meetingData.password,
    })
    .eq('id', webinarId)
  
  return {
    success: true,
    meetingId: meetingData.id,
    joinUrl: meetingData.join_url,
  }
}
```

#### Join Meeting (Server Action)

```typescript
// src/lib/zoom/actions.ts
'use server'

export async function joinWebinar(webinarId: string) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Unauthorized')
  
  // Verify user has access
  const { data: access } = await supabase
    .from('webinar_access')
    .select('id')
    .eq('user_id', user.id)
    .eq('webinar_id', webinarId)
    .single()
  
  if (!access) {
    throw new Error('You do not have access to this webinar')
  }
  
  // Get Zoom URL
  const { data: webinar } = await supabase
    .from('webinars')
    .select('zoom_join_url, scheduled_at, duration_minutes')
    .eq('id', webinarId)
    .single()
  
  if (!webinar?.zoom_join_url) {
    throw new Error('Zoom link not available')
  }
  
  // Check if webinar is live (15min before to 2h after)
  const now = new Date()
  const start = new Date(webinar.scheduled_at)
  const end = new Date(start.getTime() + webinar.duration_minutes * 60000 + 120 * 60000)
  const canJoin = now >= new Date(start.getTime() - 15 * 60000) && now <= end
  
  if (!canJoin) {
    throw new Error('Webinar is not currently live')
  }
  
  // Mark attendance
  await supabase
    .from('webinar_access')
    .update({ attended_live: true })
    .eq('user_id', user.id)
    .eq('webinar_id', webinarId)
  
  return {
    success: true,
    zoomUrl: webinar.zoom_join_url,
  }
}
```

---

### Email Integration (Resend)

#### Setup

```typescript
// src/lib/email/resend.ts
import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)
```

#### Send Email Helper

```typescript
// src/lib/email/send.ts
import { resend } from './resend'
import { createAdminClient } from '@/lib/supabase/admin'
import * as templates from './templates'

interface SendEmailOptions {
  to: string
  template: keyof typeof templates
  data: any
}

export async function sendEmail({ to, template, data }: SendEmailOptions) {
  const supabase = createAdminClient()
  
  // Get template component
  const TemplateComponent = templates[template]
  if (!TemplateComponent) {
    throw new Error(`Template ${template} not found`)
  }
  
  // Render template
  const emailHtml = await render(TemplateComponent(data))
  
  try {
    // Send email
    const result = await resend.emails.send({
      from: 'MedUni <noreply@meduni.co.uk>',
      to,
      subject: getSubject(template, data),
      html: emailHtml,
    })
    
    // Log email event
    await supabase.from('email_events').insert({
      user_id: data.userId || null,
      email_type: template,
      recipient_email: to,
      subject: getSubject(template, data),
      status: 'sent',
      provider_message_id: result.id,
    })
    
    return { success: true, messageId: result.id }
  } catch (error) {
    console.error('Email send failed:', error)
    
    // Log failure
    await supabase.from('email_events').insert({
      user_id: data.userId || null,
      email_type: template,
      recipient_email: to,
      subject: getSubject(template, data),
      status: 'failed',
      error: error.message,
    })
    
    throw error
  }
}

function getSubject(template: string, data: any): string {
  const subjects: Record<string, string> = {
    'welcome': 'Welcome to MedUni!',
    'payment-success': `Payment Confirmed - ${data.webinarTitle}`,
    'webinar-reminder': `Reminder: ${data.webinarTitle} starts in 24 hours`,
    'webinar-thankyou': `Thank you for attending ${data.webinarTitle}`,
    'subscription-renewal': 'Your MedUni subscription is renewing soon',
  }
  return subjects[template] || 'MedUni Notification'
}
```

#### Email Template Example

```typescript
// src/lib/email/templates/payment-success.tsx
import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Button,
  Hr,
} from '@react-email/components'

interface PaymentSuccessEmailProps {
  userName: string
  webinarTitle: string
  scheduledAt: string
  zoomUrl: string
  amount: number
}

export function PaymentSuccessEmail({
  userName,
  webinarTitle,
  scheduledAt,
  zoomUrl,
  amount,
}: PaymentSuccessEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#f6f9fc', fontFamily: 'sans-serif' }}>
        <Container style={{ 
          backgroundColor: '#ffffff', 
          margin: '40px auto',
          padding: '40px',
          borderRadius: '8px',
        }}>
          <Heading style={{ color: '#1a1a1a' }}>
            Payment Confirmed! 🎉
          </Heading>
          
          <Text>Hi {userName},</Text>
          
          <Text>
            Thank you for purchasing <strong>{webinarTitle}</strong>.
          </Text>
          
          <Text>
            <strong>Amount paid:</strong> £{amount.toFixed(2)}<br />
            <strong>Date & Time:</strong> {new Date(scheduledAt).toLocaleString('en-GB')}
          </Text>
          
          <Button
            href={zoomUrl}
            style={{
              backgroundColor: '#0066cc',
              color: '#ffffff',
              padding: '12px 24px',
              borderRadius: '6px',
              textDecoration: 'none',
              display: 'inline-block',
              marginTop: '16px',
            }}
          >
            Add to Calendar
          </Button>
          
          <Hr style={{ margin: '32px 0' }} />
          
          <Text style={{ color: '#666', fontSize: '14px' }}>
            You'll receive a reminder email 24 hours before the webinar starts.
            The join link will be active 15 minutes before the scheduled time.
          </Text>
          
          <Text style={{ color: '#666', fontSize: '14px', marginTop: '24px' }}>
            Questions? Reply to this email or visit our{' '}
            <a href="https://meduni.co.uk/contact">support page</a>.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
```

---

### AI Chatbot Integration (OpenAI)

#### Setup

```typescript
// src/lib/ai/openai.ts
import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})
```

#### System Prompt

```typescript
// src/lib/ai/prompts.ts
export function buildSystemPrompt(userContext: any): string {
  return `You are a helpful assistant for MedUni, a medical education platform that offers webinars and learning materials for medical professionals.

User Context:
- Name: ${userContext.fullName || 'User'}
- Purchased webinars: ${userContext.webinarCount || 0}
- Role: ${userContext.role || 'student'}

Your responsibilities:
1. Answer questions about MedUni's services, pricing, and features
2. Help users navigate the platform
3. Provide technical support for common issues (login, video playback, etc.)
4. Recommend relevant webinars based on user interests
5. Direct users to appropriate resources or human support when needed

Guidelines:
- Be friendly, professional, and concise
- Use UK English spelling and date formats
- If you don't know something, admit it and suggest contacting support
- Never make up information about specific webinars or features
- Do not access or discuss sensitive information (passwords, payment details)
- When recommending webinars, only suggest from the provided list

Current date: ${new Date().toLocaleDateString('en-GB')}
`
}
```

#### Knowledge Base

```typescript
// src/lib/ai/knowledge-base.ts
export const faqKnowledgeBase = [
  {
    question: 'How do I join a live webinar?',
    answer: 'To join a live webinar: 1) Purchase the webinar from the catalogue, 2) Go to your dashboard, 3) The "Join Live" button will appear 15 minutes before the scheduled time, 4) Click it to open Zoom.',
  },
  {
    question: 'Can I watch a replay if I miss the live session?',
    answer: 'Yes! All webinars are recorded. The replay will be available in your dashboard within 24 hours after the live session ends. You can watch it anytime with your purchase.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit and debit cards (Visa, Mastercard, American Express) via Stripe. We also support PayPal for your convenience.',
  },
  {
    question: 'How do I reset my password?',
    answer: 'Click "Forgot password?" on the sign-in page, enter your email, and we\'ll send you a secure reset link. Follow the link to set a new password.',
  },
  {
    question: 'Do you offer refunds?',
    answer: 'Yes, we offer refunds up to 48 hours before a live webinar starts. After that, refunds are not available, but you\'ll have access to the replay. Contact support to request a refund.',
  },
  // Add more FAQs as needed
]
```

#### API Route

```typescript
// src/app/api/chatbot/route.ts
import { openai } from '@/lib/ai/openai'
import { buildSystemPrompt, faqKnowledgeBase } from '@/lib/ai/prompts'
import { createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// Rate limiting (simple in-memory, use Redis for production)
const rateLimits = new Map<string, number[]>()

function checkRateLimit(userId: string): boolean {
  const now = Date.now()
  const userRequests = rateLimits.get(userId) || []
  
  // Remove requests older than 1 minute
  const recentRequests = userRequests.filter(time => now - time < 60000)
  
  if (recentRequests.length >= 10) {
    return false // Rate limit exceeded
  }
  
  recentRequests.push(now)
  rateLimits.set(userId, recentRequests)
  return true
}

export async function POST(req: Request) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }
  
  // Check rate limit
  if (!checkRateLimit(user.id)) {
    return new Response('Too many requests', { status: 429 })
  }
  
  const { message, conversationHistory } = await req.json()
  
  // Fetch user context
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single()
  
  const { count: webinarCount } = await supabase
    .from('webinar_access')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
  
  const userContext = {
    fullName: profile?.full_name,
    role: profile?.role,
    webinarCount,
  }
  
  // Build messages
  const messages = [
    { role: 'system', content: buildSystemPrompt(userContext) },
    { role: 'system', content: `FAQ Knowledge Base:\n${JSON.stringify(faqKnowledgeBase, null, 2)}` },
    ...conversationHistory,
    { role: 'user', content: message },
  ]
  
  // Stream response
  const stream = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages,
    stream: true,
    max_tokens: 500,
    temperature: 0.7,
  })
  
  // Convert OpenAI stream to Response stream
  const encoder = new TextEncoder()
  const readableStream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content || ''
          controller.enqueue(encoder.encode(text))
        }
        controller.close()
        
        // Log interaction
        const adminSupabase = createAdminClient()
        await adminSupabase.from('chatbot_interactions').insert({
          user_id: user.id,
          session_id: req.headers.get('x-session-id') || 'unknown',
          message,
          response: 'Streaming response (not stored)',
          tokens_used: 0, // Would need to calculate
        })
      } catch (error) {
        controller.error(error)
      }
    },
  })
  
  return new Response(readableStream, {
    headers: {
      'Content-Type': 'text/plain',
      'Transfer-Encoding': 'chunked',
    },
  })
}
```

---

## Implementation Phases

### Phase 0: Setup & Configuration (Days 1-2)

**Objective:** Initialize project with all dependencies and infrastructure

**Tasks:**
1. Create Next.js 15 project with TypeScript
   ```bash
   npx create-next-app@latest meduni-platform --typescript --tailwind --app
   cd meduni-platform
   ```

2. Install dependencies
   ```bash
   npm install @supabase/supabase-js @supabase/ssr
   npm install stripe @stripe/stripe-js @stripe/react-stripe-js
   npm install resend react-email
   npm install openai
   npm install zod
   npm install date-fns
   npm install lucide-react
   npx shadcn-ui@latest init
   ```

3. Set up Supabase project
   - Create project at supabase.com
   - Copy URL and anon key to `.env.local`
   - Initialize Supabase CLI: `npx supabase init`

4. Create database schema
   - Write migration files in `supabase/migrations/`
   - Run migrations: `npx supabase db push`
   - Generate TypeScript types: `npx supabase gen types typescript --local > src/types/database.ts`

5. Configure Supabase Auth
   - Enable email/password
   - Add Google OAuth provider
   - Add Apple OAuth provider (if available)
   - Configure email templates
   - Set redirect URLs

6. Set up Vercel deployment
   - Push to GitHub
   - Connect to Vercel
   - Add environment variables
   - Deploy preview environment

7. Configure environment variables
   ```
   # .env.local
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
   STRIPE_SECRET_KEY=
   STRIPE_WEBHOOK_SECRET=
   
   ZOOM_API_KEY=
   ZOOM_API_SECRET=
   
   RESEND_API_KEY=
   
   OPENAI_API_KEY=
   ```

**Deliverables:**
- [ ] Next.js project initialized with TypeScript
- [ ] All dependencies installed
- [ ] Supabase project created and configured
- [ ] Database tables created with RLS policies
- [ ] TypeScript types generated from database
- [ ] Vercel connected with preview deployment
- [ ] Environment variables configured (dev + prod)
- [ ] shadcn/ui initialized

**Acceptance Criteria:**
- `npm run dev` starts development server without errors
- Can connect to Supabase (test query works)
- Vercel preview URL accessible
- All environment variables properly set

---

### Phase 1: Public Marketing Pages + SEO (Days 3-4)

**Objective:** Build public-facing pages with SEO optimization

**Tasks:**
1. Create site configuration
   ```typescript
   // src/config/site.ts
   export const siteConfig = {
     name: 'MedUni',
     description: 'Professional medical education platform',
     url: 'https://meduni.co.uk',
     ogImage: 'https://meduni.co.uk/og-image.jpg',
     links: {
       twitter: 'https://twitter.com/meduni',
       linkedin: 'https://linkedin.com/company/meduni',
     },
   }
   ```

2. Build Navbar component (Server Component)
3. Build Footer component
4. Create Homepage
   - Hero section with CTA
   - Features grid
   - Upcoming webinars preview
   - Testimonials
   - Final CTA

5. Create About page
6. Create Pricing page (if needed)
7. Create Contact page with form
8. Build webinar catalogue page (`/webinars`)
   - Fetch published webinars
   - Grid layout
   - Filters (client component)

9. Build webinar detail page (`/webinars/[slug]`)
   - Server Component fetches webinar by slug
   - Show full details, expert bio, date/time
   - "Buy Now" button (if not owned)
   - Check if user owns webinar

10. Add SEO metadata to all pages
11. Implement structured data (JSON-LD)
12. Set up sitemap generation

**Files to Create:**
- `src/app/(marketing)/layout.tsx`
- `src/app/(marketing)/page.tsx` (homepage)
- `src/app/(marketing)/about/page.tsx`
- `src/app/(marketing)/contact/page.tsx`
- `src/app/(marketing)/pricing/page.tsx`
- `src/app/(marketing)/webinars/page.tsx`
- `src/app/(marketing)/webinars/[slug]/page.tsx`
- `src/components/layout/navbar.tsx`
- `src/components/layout/footer.tsx`
- `src/components/webinars/webinar-card.tsx`
- `src/components/webinars/webinar-list.tsx`
- `src/components/webinars/webinar-filters.tsx`
- `src/components/webinars/webinar-details.tsx`
- `src/components/forms/contact-form.tsx`
- `src/lib/seo/metadata.ts`
- `src/lib/seo/structured-data.ts`

**Acceptance Criteria:**
- [ ] All marketing pages render with proper layouts
- [ ] Navbar shows correct nav links and auth state
- [ ] Footer displays with all links
- [ ] Homepage hero section is visually appealing
- [ ] Webinar catalogue fetches and displays published webinars
- [ ] Webinar filters work (topic, search)
- [ ] Webinar detail page shows full information
- [ ] Contact form submits and sends email via Resend
- [ ] SEO metadata present on all pages (title, description, OG tags)
- [ ] Structured data for webinars (Event schema) validates
- [ ] Mobile-responsive design confirmed
- [ ] Lighthouse score >90 for performance, SEO, accessibility

---

### Phase 2: Authentication & Dashboard Shell (Days 5-6)

**Objective:** Implement user authentication and protected dashboard layout

**Tasks:**
1. Create auth pages
   - Sign-in page with email/password and OAuth
   - Sign-up page with validation
   - Password reset flow
   - Email verification page

2. Build auth forms (Client Components)
   - Sign-in form with Supabase Auth
   - Sign-up form with validation (Zod)
   - Reset password form

3. Implement middleware for protected routes
   ```typescript
   // src/middleware.ts
   import { createServerClient } from '@/lib/supabase/middleware'
   import { NextResponse } from 'next/server'
   
   export async function middleware(request) {
     const { supabase, response } = createServerClient(request)
     const { data: { session } } = await supabase.auth.getSession()
     
     // Protect /dashboard and /admin routes
     if (request.nextUrl.pathname.startsWith('/dashboard') && !session) {
       return NextResponse.redirect(new URL('/sign-in', request.url))
     }
     
     // Protect /admin routes (check role)
     if (request.nextUrl.pathname.startsWith('/admin')) {
       if (!session) {
         return NextResponse.redirect(new URL('/sign-in', request.url))
       }

       ```markdown
       // Check if user is admin
       const { data: profile } = await supabase
         .from('profiles')
         .select('role')
         .eq('id', session.user.id)
         .single()
       
       if (profile?.role !== 'admin') {
         return NextResponse.redirect(new URL('/dashboard', request.url))
       }
     }
     
     return response
   }
   
   export const config = {
     matcher: ['/dashboard/:path*', '/admin/:path*'],
   }
   ```

4. Build dashboard layout
   - DashboardShell component
   - Sidebar with navigation
   - Header with breadcrumbs and user menu
   - Mobile-responsive (sidebar drawer)

5. Create dashboard home page
   - Stats cards (webinars purchased, upcoming, watched)
   - Upcoming webinars widget
   - Recent learning content

6. Build user settings page
   - Profile information form
   - Avatar upload
   - Password change
   - Email preferences

7. Implement logout functionality

**Files to Create:**
- `src/app/(auth)/layout.tsx`
- `src/app/(auth)/sign-in/page.tsx`
- `src/app/(auth)/sign-up/page.tsx`
- `src/app/(auth)/reset-password/page.tsx`
- `src/app/(auth)/verify-email/page.tsx`
- `src/components/forms/sign-in-form.tsx`
- `src/components/forms/sign-up-form.tsx`
- `src/components/forms/reset-password-form.tsx`
- `src/lib/auth/session.ts`
- `src/lib/auth/actions.ts`
- `src/lib/validations/auth.ts`
- `src/middleware.ts`
- `src/app/dashboard/layout.tsx`
- `src/app/dashboard/page.tsx`
- `src/app/dashboard/settings/page.tsx`
- `src/components/layout/dashboard-shell.tsx`
- `src/components/layout/sidebar.tsx`
- `src/components/layout/user-menu.tsx`
- `src/components/dashboard/stats-card.tsx`
- `src/components/dashboard/upcoming-webinars.tsx`

**Acceptance Criteria:**
- [ ] Users can sign up with email/password
- [ ] Email verification sends and works
- [ ] Users can sign in with email/password
- [ ] OAuth (Google, Apple) sign-in works
- [ ] Password reset flow sends email and updates password
- [ ] Middleware redirects unauthenticated users to /sign-in
- [ ] Dashboard layout renders with sidebar and header
- [ ] User menu shows profile and logout option
- [ ] User can update profile in settings
- [ ] Logout clears session and redirects to homepage
- [ ] Profile automatically created on signup (via database trigger)
- [ ] All forms have proper validation and error messages

---

### Phase 3: Webinar Catalogue + Detail Enhancement (Days 7-8)

**Objective:** Enhance webinar browsing with filters, search, and user-specific views

**Tasks:**
1. Enhance webinar catalogue page
   - Add WebinarFilters component (Client)
   - Implement search functionality
   - Add sorting options (date, price, popularity)
   - Sync filters with URL params (shareable links)
   - Add pagination (20 webinars per page)

2. Create "My Webinars" dashboard page
   - Query webinars where user has access
   - Show upcoming vs. past webinars
   - Display "Join Live" button for upcoming
   - Show "Watch Replay" for completed webinars

3. Enhance webinar detail page
   - Check if user owns webinar (hide buy button)
   - Show "Join Live" button if upcoming and owned
   - Show countdown timer until start time
   - Display expert bio and credentials
   - Related webinars section

4. Create server actions for webinar queries
   ```typescript
   // src/lib/actions/webinars.ts
   'use server'
   
   export async function getUserWebinars() {
     const supabase = createServerClient()
     const { data: { user } } = await supabase.auth.getUser()
     
     if (!user) throw new Error('Unauthorized')
     
     const { data, error } = await supabase
       .from('webinar_access')
       .select(`
         *,
         webinars (*)
       `)
       .eq('user_id', user.id)
       .order('purchased_at', { ascending: false })
     
     if (error) throw error
     return data
   }
   ```

**Files to Create:**
- `src/app/dashboard/webinars/page.tsx`
- `src/app/dashboard/webinars/[slug]/page.tsx`
- `src/lib/actions/webinars.ts`
- `src/components/webinars/webinar-countdown.tsx`
- `src/components/webinars/join-webinar-button.tsx`

**Acceptance Criteria:**
- [ ] Webinar catalogue has working filters (topic, date range)
- [ ] Search bar filters webinars by title/expert name
- [ ] Sort options work (upcoming first, price, popularity)
- [ ] URL params update when filters change
- [ ] Pagination works (20 per page)
- [ ] "My Webinars" shows only user's purchased webinars
- [ ] Upcoming vs. past webinars separated
- [ ] Webinar detail page hides "Buy" if user owns it
- [ ] Countdown timer shows time until webinar starts
- [ ] "Join Live" button appears 15min before start time

---

### Phase 4: Payments & Checkout (Days 9-11)

**Objective:** Implement payment processing with Stripe

**Tasks:**
1. Set up Stripe
   - Create Stripe account
   - Get API keys (test mode)
   - Configure webhook endpoint in Stripe dashboard

2. Create checkout page
   - Display webinar details
   - Show price
   - Load Stripe Elements
   - Handle payment submission

3. Build CheckoutForm component (Client)
   - Stripe CardElement
   - Billing details fields
   - Loading states
   - Error handling

4. Implement payment Server Action
   ```typescript
   // src/lib/payments/actions.ts
   'use server'
   
   export async function createPaymentIntent(webinarId: string) {
     const supabase = createServerClient()
     const { data: { user } } = await supabase.auth.getUser()
     
     if (!user) throw new Error('Unauthorized')
     
     // Get webinar price
     const { data: webinar } = await supabase
       .from('webinars')
       .select('price_gbp')
       .eq('id', webinarId)
       .single()
     
     if (!webinar) throw new Error('Webinar not found')
     
     // Check if already purchased
     const { data: existing } = await supabase
       .from('webinar_access')
       .select('id')
       .eq('user_id', user.id)
       .eq('webinar_id', webinarId)
       .single()
     
     if (existing) throw new Error('Already purchased')
     
     // Create Stripe Payment Intent
     const paymentIntent = await stripe.paymentIntents.create({
       amount: Math.round(webinar.price_gbp * 100),
       currency: 'gbp',
       metadata: {
         user_id: user.id,
         webinar_id: webinarId,
       },
     })
     
     return { clientSecret: paymentIntent.client_secret }
   }
   ```

5. Build Stripe webhook handler
   - Verify webhook signature
   - Handle `payment_intent.succeeded`
   - Create `webinar_access` record
   - Log to `payment_events`
   - Send confirmation email

6. Create success page
   - Show payment confirmation
   - Display webinar details
   - Link to dashboard
   - Show next steps

7. Add email confirmation
   - Payment success email template
   - Include Zoom link (if available)
   - Add to calendar button (.ics file)

**Files to Create:**
- `src/app/checkout/[webinarId]/page.tsx`
- `src/app/checkout/[webinarId]/success/page.tsx`
- `src/components/forms/checkout-form.tsx`
- `src/lib/payments/stripe.ts`
- `src/lib/payments/actions.ts`
- `src/app/api/webhooks/stripe/route.ts`
- `src/lib/email/templates/payment-success.tsx`

**Acceptance Criteria:**
- [ ] Checkout page displays correct webinar and price
- [ ] Stripe payment form renders and accepts test cards
- [ ] Payment processes successfully (Stripe test mode)
- [ ] Webhook receives and validates payment
- [ ] `webinar_access` record created on success
- [ ] User redirected to success page
- [ ] Confirmation email sent with purchase details
- [ ] User sees purchased webinar in dashboard immediately
- [ ] Webhook validates signature (prevents replay attacks)
- [ ] Error handling for failed payments (clear messages)
- [ ] Duplicate purchase prevention works

---

### Phase 5: Live Webinar Access (Zoom Integration) (Days 12-13)

**Objective:** Enable users to join live webinars via Zoom

**Tasks:**
1. Set up Zoom integration
   - Create Zoom OAuth app or JWT app
   - Get API credentials
   - Test connection

2. Create Zoom meeting Server Action
   ```typescript
   // src/lib/zoom/actions.ts
   'use server'
   
   export async function createZoomMeeting(webinarId: string) {
     const supabase = createAdminClient()
     
     const { data: webinar } = await supabase
       .from('webinars')
       .select('*')
       .eq('id', webinarId)
       .single()
     
     if (!webinar) throw new Error('Webinar not found')
     
     const meeting = await zoomClient.post('/users/me/meetings', {
       topic: webinar.title,
       type: 2,
       start_time: webinar.scheduled_at,
       duration: webinar.duration_minutes,
       settings: {
         host_video: true,
         participant_video: true,
         auto_recording: 'cloud',
       },
     })
     
     await supabase
       .from('webinars')
       .update({
         zoom_meeting_id: meeting.data.id,
         zoom_join_url: meeting.data.join_url,
       })
       .eq('id', webinarId)
     
     return { success: true }
   }
   ```

3. Build JoinWebinarButton component
   - Show countdown until webinar
   - Enable 15 minutes before start
   - Trigger Server Action on click
   - Mark attendance

4. Implement join webinar Server Action
   ```typescript
   'use server'
   
   export async function joinWebinar(webinarId: string) {
     const supabase = createServerClient()
     const { data: { user } } = await supabase.auth.getUser()
     
     // Verify access
     const { data: access } = await supabase
       .from('webinar_access')
       .select('*')
       .eq('user_id', user.id)
       .eq('webinar_id', webinarId)
       .single()
     
     if (!access) throw new Error('No access')
     
     // Get Zoom URL
     const { data: webinar } = await supabase
       .from('webinars')
       .select('zoom_join_url')
       .eq('id', webinarId)
       .single()
     
     // Mark attendance
     await supabase
       .from('webinar_access')
       .update({ attended_live: true })
       .eq('id', access.id)
     
     return { zoomUrl: webinar.zoom_join_url }
   }
   ```

5. Set up email reminder system
   - Create Vercel Cron job (`/api/cron/reminders`)
   - Query webinars in next 24 hours
   - Send reminder emails to attendees
   - Include join instructions

6. Build post-webinar email flow
   - Detect when webinar ends
   - Send thank-you email
   - Include feedback survey link
   - Notify about replay availability

**Files to Create:**
- `src/lib/zoom/client.ts`
- `src/lib/zoom/actions.ts`
- `src/components/webinars/join-webinar-button.tsx`
- `src/app/api/cron/reminders/route.ts`
- `src/lib/email/templates/webinar-reminder.tsx`
- `src/lib/email/templates/webinar-thankyou.tsx`
- `vercel.json` (for cron configuration)

**Acceptance Criteria:**
- [ ] Admin can create Zoom meeting for webinar
- [ ] Zoom meeting ID and URL stored in database
- [ ] "Join Live" button shows countdown timer
- [ ] Button enables 15 minutes before start
- [ ] Only users with access see button
- [ ] Clicking button marks attendance
- [ ] User redirected to Zoom with join URL
- [ ] Reminder email sent 24h before webinar
- [ ] Post-webinar thank-you email sent
- [ ] Cron job runs reliably on schedule

---

### Phase 6: Replays & Content Library (Days 14-15)

**Objective:** Enable replay viewing and learning materials access

**Tasks:**
1. Build admin upload interface
   - File picker with drag-drop
   - Upload to Supabase Storage
   - Progress indicator
   - Video preview after upload

2. Implement replay upload Server Action
   ```typescript
   'use server'
   
   export async function uploadReplay(webinarId: string, file: File) {
     const supabase = createAdminClient()
     
     // Upload to Supabase Storage
     const fileName = `${webinarId}-${Date.now()}.mp4`
     const { data, error } = await supabase.storage
       .from('webinar-replays')
       .upload(fileName, file)
     
     if (error) throw error
     
     // Update webinar
     await supabase
       .from('webinars')
       .update({ replay_url: data.path })
       .eq('id', webinarId)
     
     return { success: true }
   }
   ```

3. Create replay page with video player
   - Generate signed URL (1 hour expiry)
   - Load WebinarPlayer component
   - Track viewing progress
   - Save position every 30 seconds

4. Build WebinarPlayer component
   - HTML5 video with custom controls
   - Play/pause, seek, volume, speed
   - Fullscreen support
   - Resume from last position
   - Keyboard shortcuts

5. Implement progress tracking
   ```typescript
   'use server'
   
   export async function updateReplayProgress(
     webinarId: string,
     seconds: number
   ) {
     const supabase = createServerClient()
     const { data: { user } } = await supabase.auth.getUser()
     
     await supabase
       .from('webinar_access')
       .update({ replay_watched_seconds: seconds })
       .eq('user_id', user.id)
       .eq('webinar_id', webinarId)
   }
   ```

6. Create "My Learning" section
   - Display all published content items
   - Filter by topic and type
   - Show case studies, articles, PDFs

7. Build content detail page
   - Render markdown content
   - Embed videos if available
   - Download PDFs
   - Related content suggestions

**Files to Create:**
- `src/app/admin/webinars/[id]/upload/page.tsx`
- `src/components/admin/upload-replay.tsx`
- `src/app/dashboard/webinars/[slug]/replay/page.tsx`
- `src/components/webinars/webinar-player.tsx`
- `src/lib/actions/replays.ts`
- `src/app/dashboard/learning/page.tsx`
- `src/app/dashboard/learning/[id]/page.tsx`
- `src/components/dashboard/recent-content.tsx`

**Acceptance Criteria:**
- [ ] Admin can upload video files to Supabase Storage
- [ ] Upload shows progress bar
- [ ] Replay URL saved to database
- [ ] Video player loads and plays replay
- [ ] Signed URLs expire after 1 hour
- [ ] Progress tracking saves every 30 seconds
- [ ] Video resumes from last position
- [ ] Custom controls work (play, seek, speed, fullscreen)
- [ ] "My Learning" displays all content items
- [ ] Content detail page renders properly
- [ ] PDFs can be downloaded

---

### Phase 7: Admin Panel (Days 16-18)

**Objective:** Build comprehensive admin interface for content management

**Tasks:**
1. Create admin dashboard
   - Key metrics (revenue, users, webinars, attendance)
   - Charts (revenue over time, popular topics)
   - Recent activity feed
   - Quick actions

2. Build webinar management
   - List all webinars (with filters)
   - Create new webinar form
   - Edit existing webinar
   - Delete/cancel webinar
   - Upload replay
   - View attendees

3. Implement WebinarForm component
   - All fields with validation
   - Image upload for thumbnail
   - Rich text editor for description
   - Date/time picker
   - Zoom meeting creation button
   - Draft/publish toggle

4. Build user management
   - List all users with search
   - View user details
   - Edit user role
   - Manually grant webinar access
   - View user's purchase history

5. Create content management
   - List all learning content
   - Create new content (case study, article, etc.)
   - Edit content with rich text editor
   - Upload files (PDFs, videos)
   - Publish/unpublish content

6. Build analytics dashboard
   - Revenue reports (daily, monthly, yearly)
   - Attendance rates by webinar
   - Popular topics
   - User growth metrics
   - Export data to CSV

7. Implement admin permissions check
   ```typescript
   // src/lib/auth/permissions.ts
   export async function requireAdmin() {
     const supabase = createServerClient()
     const { data: { user } } = await supabase.auth.getUser()
     
     if (!user) throw new Error('Unauthorized')
     
     const { data: profile } = await supabase
       .from('profiles')
       .select('role')
       .eq('id', user.id)
       .single()
     
     if (profile?.role !== 'admin') {
       throw new Error('Forbidden')
     }
     
     return user
   }
   ```

**Files to Create:**
- `src/app/admin/layout.tsx`
- `src/app/admin/page.tsx`
- `src/app/admin/webinars/page.tsx`
- `src/app/admin/webinars/new/page.tsx`
- `src/app/admin/webinars/[id]/page.tsx`
- `src/app/admin/webinars/[id]/attendees/page.tsx`
- `src/app/admin/content/page.tsx`
- `src/app/admin/content/new/page.tsx`
- `src/app/admin/content/[id]/page.tsx`
- `src/app/admin/users/page.tsx`
- `src/app/admin/users/[id]/page.tsx`
- `src/app/admin/analytics/page.tsx`
- `src/components/admin/webinar-form.tsx`
- `src/components/admin/content-editor.tsx`
- `src/components/admin/user-table.tsx`
- `src/components/admin/admin-stats.tsx`
- `src/components/admin/analytics-chart.tsx`
- `src/lib/auth/permissions.ts`

**Acceptance Criteria:**
- [ ] Only users with role='admin' can access /admin
- [ ] Admin dashboard shows key metrics
- [ ] Admin can create new webinars with all fields
- [ ] Admin can edit existing webinars
- [ ] Admin can create Zoom meetings from admin panel
- [ ] Admin can upload replay videos
- [ ] Admin can view list of all users
- [ ] Admin can change user roles
- [ ] Admin can manually grant webinar access
- [ ] Admin can create/edit learning content
- [ ] Rich text editor works for content body
- [ ] Analytics dashboard shows charts
- [ ] All admin actions validated and logged

---

### Phase 8: AI Chatbot Integration (Days 19-20)

**Objective:** Implement AI-powered support chatbot

**Tasks:**
1. Set up OpenAI integration
   - Get API key
   - Test connection
   - Configure rate limiting

2. Build ChatbotWidget component
   - Floating button (bottom-right)
   - Badge with notification dot
   - Opens chat window on click

3. Build ChatbotWindow component
   - Message list with auto-scroll
   - Input field with send button
   - Typing indicator
   - Quick action buttons
   - Close/minimize controls

4. Create chatbot API route
   - Rate limiting (10 req/min per user)
   - Fetch user context
   - Load FAQ knowledge base
   - Stream OpenAI response
   - Log interaction

5. Build knowledge base
   - Common FAQs about MedUni
   - Platform usage instructions
   - Technical troubleshooting
   - Pricing and refund info

6. Implement conversation logging
   - Store all interactions
   - Track tokens used
   - Allow user feedback (helpful/not)

7. Add quick actions
   - "View webinars"
   - "Reset password"
   - "Contact support"
   - Context-aware suggestions

**Files to Create:**
- `src/lib/ai/openai.ts`
- `src/lib/ai/prompts.ts`
- `src/lib/ai/knowledge-base.ts`
- `src/app/api/chatbot/route.ts`
- `src/components/chatbot/chatbot-widget.tsx`
- `src/components/chatbot/chatbot-window.tsx`
- `src/components/chatbot/message-list.tsx`
- `src/components/chatbot/quick-actions.tsx`

**Acceptance Criteria:**
- [ ] Chatbot widget visible on all pages
- [ ] Clicking opens chat window
- [ ] User can type and receive responses
- [ ] Responses stream in real-time
- [ ] Chatbot has context about user
- [ ] Chatbot answers FAQs accurately
- [ ] Quick actions work and insert prompts
- [ ] Rate limiting prevents abuse
- [ ] Conversations logged to database
- [ ] Error handling for API failures
- [ ] Chat window mobile-responsive

---

### Phase 9: Email Automation & Notifications (Day 21)

**Objective:** Implement automated email flows

**Tasks:**
1. Create all email templates
   - Welcome email
   - Payment success
   - Webinar reminder (24h before)
   - Post-webinar thank you
   - Subscription renewal (if applicable)

2. Set up Resend
   - Verify sending domain
   - Configure DNS (SPF, DKIM)
   - Test email delivery

3. Implement email sending helper
   - Template rendering
   - Error handling
   - Logging to database

4. Set up Vercel Cron jobs
   ```json
   // vercel.json
   {
     "crons": [
       {
         "path": "/api/cron/reminders",
         "schedule": "0 9 * * *"
       },
       {
         "path": "/api/cron/post-webinar",
         "schedule": "0 * * * *"
       }
     ]
   }
   ```

5. Build reminder email cron job
   - Query webinars in next 24 hours
   - Get all attendees
   - Send reminder emails
   - Log sent emails

6. Build post-webinar email cron job
   - Query webinars that ended 1h ago
   - Send thank-you emails
   - Include feedback survey
   - Notify about replay

7. Add welcome email on signup
   - Triggered by auth hook or Server Action
   - Include getting started guide
   - Dashboard link

**Files to Create:**
- `src/lib/email/templates/welcome.tsx`
- `src/lib/email/templates/payment-success.tsx`
- `src/lib/email/templates/webinar-reminder.tsx`
- `src/lib/email/templates/webinar-thankyou.tsx`
- `src/lib/email/send.ts`
- `src/app/api/cron/reminders/route.ts`
- `src/app/api/cron/post-webinar/route.ts`
- `vercel.json`

**Acceptance Criteria:**
- [ ] Welcome email sends on user signup
- [ ] Payment success email includes all details
- [ ] Reminder emails send 24h before webinar
- [ ] Thank-you emails send after webinar
- [ ] All emails use branded templates
- [ ] Emails sent from verified domain
- [ ] Email logs saved to database
- [ ] Cron jobs run on schedule
- [ ] Failed emails logged with errors
- [ ] Email delivery tested in production

---

### Phase 10: Testing, Optimization & Hardening (Days 22-24)

**Objective:** Comprehensive testing and optimization before launch

**Tasks:**
1. Cross-browser testing
   - Chrome, Firefox, Safari, Edge
   - Test all critical flows
   - Fix browser-specific issues

2. Mobile testing
   - Test on iOS (Safari)
   - Test on Android (Chrome)
   - Verify responsive design
   - Test touch interactions

3. Performance optimization
   - Run Lighthouse audits
   - Optimize images (WebP format)
   - Analyze bundle size
   - Implement code splitting
   - Add loading states everywhere

4. Accessibility audit
   - Use axe DevTools
   - Test with screen reader
   - Fix contrast issues
   - Add ARIA labels
   - Test keyboard navigation

5. Security review
   - Test RLS policies
   - Verify webhook signatures
   - Check input validation
   - Test rate limiting
   - Review environment variables

6. Error handling
   - Add global error boundary
   - Create custom 404 page
   - Implement error logging
   - Add user-friendly error messages

7. SEO final audit
   - Verify all metadata
   - Test structured data
   - Check robots.txt and sitemap
   - Validate Open Graph tags
   - Test social sharing

8. Load testing
   - Simulate 100+ concurrent users
   - Test database performance
   - Monitor API response times
   - Check Supabase limits

9. Documentation
   - Admin user guide
   - Deployment instructions
   - Environment variables list
   - API documentation
   - Troubleshooting guide

**Files to Create:**
- `src/app/error.tsx`
- `src/app/not-found.tsx`
- `src/lib/logger.ts`
- `DEPLOYMENT.md`
- `ADMIN_GUIDE.md`
- `TROUBLESHOOTING.md`

**Acceptance Criteria:**
- [ ] All pages tested on major browsers
- [ ] Mobile testing complete (iOS + Android)
- [ ] Lighthouse scores >90 all metrics
- [ ] Bundle size optimized (<200KB main)
- [ ] WCAG 2.1 AA compliance verified
- [ ] All forms have validation
- [ ] Loading states shown everywhere
- [ ] Error pages render correctly
- [ ] Analytics tracking works
- [ ] Error logging captures issues
- [ ] RLS policies tested
- [ ] Security headers configured
- [ ] Documentation complete

---

### Phase 11: Launch & Post-Launch Support (Days 25-28)

**Objective:** Deploy to production and monitor

**Tasks:**
1. Production environment setup
   - Create production Supabase project (if separate)
   - Add production environment variables to Vercel
   - Configure custom domain
   - Set up SSL certificate

2. Domain configuration
   - Point domain to Vercel
   - Configure DNS records
   - Set up email DNS (SPF, DKIM, DMARC)
   - Verify domain propagation

3. Production Stripe setup
   - Switch to live API keys
   - Update webhook endpoint
   - Test payment flow with real card

4. Production Zoom setup
   - Use production Zoom account
   - Update API credentials
   - Test meeting creation

5. Final pre-launch checklist
   - Review all environment variables
   - Test all critical user flows
   - Verify email sending
   - Check analytics tracking
   - Test error logging

6. Database seed (if needed)
   - Add initial webinars
   - Create admin account
   - Add sample content

7. Launch
   - Deploy to production
   - Monitor for 24-48 hours
   - Watch error logs
   - Check performance metrics

8. Post-launch monitoring
   - Daily error log review
   - Performance monitoring
   - User feedback collection
   - Bug fixes and patches

9. Client handover
   - Training session for admin panel
   - Transfer credentials
   - Provide documentation
   - Set up support channel

**Deliverables:**
- [ ] Production site live at meduni.co.uk
- [ ] All features working in production
- [ ] No critical bugs
- [ ] Performance metrics meet targets
- [ ] Client has admin access
- [ ] Documentation delivered
- [ ] Support period active (1 week)
- [ ] Project handover complete

**Acceptance Criteria:**
- [ ] Custom domain configured and working
- [ ] SSL certificate active
- [ ] All payment flows work with live Stripe
- [ ] Emails delivering to inbox (not spam)
- [ ] Zoom meetings create successfully
- [ ] Admin can manage all content
- [ ] Monitoring and alerts set up
- [ ] Client trained on admin panel
- [ ] All credentials transferred

---

## Performance, Security & SEO

### Performance Optimization

#### Server vs Client Components

**Rules:**
1. **Default to Server Components** - Everything is a Server Component unless it needs interactivity
2. **Use Client Components for:**
   - Forms with validation
   - Event handlers (onClick, onChange)
   - Browser APIs (window, localStorage)
   - React hooks (useState, useEffect, useContext)
   - Real-time features

3. **Keep Client boundary low** - Wrap only the interactive part in Client Component

**Example:**
```typescript
// ❌ Wrong - Entire card is Client Component
'use client'
export function WebinarCard({ webinar }) {
  const [liked, setLiked] = useState(false)
  return (
    <Card>
      <Image src={webinar.thumbnail} />
      <h3>{webinar.title}</h3>
      <Button onClick={() => setLiked(!liked)}>Like</Button>
    </Card>
  )
}

// ✅ Correct - Only button is Client Component
// WebinarCard (Server Component)
export function WebinarCard({ webinar }) {
  return (
    <Card>
      <Image src={webinar.thumbnail} />
      <h3>{webinar.title}</h3>
      <LikeButton webinarId={webinar.id} />
    </Card>
  )
}

// LikeButton (Client Component)
'use client'
export function LikeButton({ webinarId }) {
  const [liked, setLiked] = useState(false)
  return <Button onClick={() => setLiked(!liked)}>Like</Button>
}
```

#### Bundle Size Optimization

1. **Lazy load heavy components**
   ```typescript
   const VideoPlayer = dynamic(() => import('./video-player'), {
     loading: () => <Skeleton />
   })
   ```

2. **Analyze bundle**
   ```bash
   npm run build
   # Review .next/analyze/
   ```

3. **Keep main bundle under 200KB gzipped**

4. **Use `next/image` for all images**
   ```typescript
   <Image
     src="/hero.jpg"
     width={1200}
     height={600}
     alt="Hero"
     priority // For above-fold images
   />
   ```

#### Caching Strategy

```typescript
// Page-level caching
export const revalidate = 300 // 5 minutes

// Fetch-level caching
fetch(url, {
  next: {
    revalidate: 60,
    tags: ['webinars']
  }
})

// Invalidate after mutation
revalidateTag('webinars')
revalidatePath('/webinars')
```

#### Database Query Optimization

1. **Use indexes** on frequently queried columns
2. **Avoid N+1 queries** - use joins or batch queries
3. **Implement pagination** - limit 20-50 items per page
4. **Use database functions** for complex queries

---

### Security Best Practices

#### Authentication & Authorization

```typescript
// Always verify auth in Server Components/Actions
const supabase = createServerClient()
const { data: { user } } = await supabase.auth.getUser()

```markdown
if (!user) {
  redirect('/sign-in')
}

// Check permissions
const { data: profile } = await supabase
  .from('profiles')
  .select('role')
  .eq('id', user.id)
  .single()

if (profile?.role !== 'admin') {
  throw new Error('Forbidden')
}
```

#### Input Validation

**Always validate with Zod:**

```typescript
// src/lib/validations/webinar.ts
import { z } from 'zod'

export const createWebinarSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(20).max(5000),
  expert_name: z.string().min(2).max(100),
  topic: z.string().min(2).max(50),
  scheduled_at: z.string().datetime(),
  duration_minutes: z.number().int().min(15).max(480),
  price_gbp: z.number().positive().max(10000),
})

// In Server Action
'use server'
export async function createWebinar(formData: FormData) {
  const data = Object.fromEntries(formData)
  
  // Validate
  const parsed = createWebinarSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.flatten() }
  }
  
  // Proceed with validated data
  const result = await supabase.from('webinars').insert(parsed.data)
  return { success: true }
}
```

#### Row-Level Security (RLS)

**Always enable RLS:**

```sql
-- Enable RLS on all tables
ALTER TABLE webinars ENABLE ROW LEVEL SECURITY;

-- Example policy
CREATE POLICY "Users can view own webinars"
  ON webinar_access FOR SELECT
  USING (auth.uid() = user_id);
```

**Test RLS policies:**
```typescript
// Test as different users
const { data, error } = await supabase
  .from('webinar_access')
  .select('*')

// Should only return current user's records
```

#### Webhook Security

**Always verify signatures:**

```typescript
// Stripe webhook
import { headers } from 'next/headers'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')
  
  let event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    return new Response('Invalid signature', { status: 400 })
  }
  
  // Process event
}
```

#### Environment Variables

**Never commit secrets:**

```bash
# .env.local (gitignored)
SUPABASE_SERVICE_ROLE_KEY=xxx
STRIPE_SECRET_KEY=sk_live_xxx
OPENAI_API_KEY=sk-xxx

# Use NEXT_PUBLIC_ only for client-side values
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
```

#### Rate Limiting

**Implement on API routes:**

```typescript
// Simple in-memory rate limiter
const limits = new Map<string, number[]>()

function rateLimit(userId: string, maxRequests = 10, windowMs = 60000) {
  const now = Date.now()
  const userRequests = limits.get(userId) || []
  const recentRequests = userRequests.filter(time => now - time < windowMs)
  
  if (recentRequests.length >= maxRequests) {
    return false
  }
  
  recentRequests.push(now)
  limits.set(userId, recentRequests)
  return true
}

// In API route
if (!rateLimit(user.id, 10, 60000)) {
  return new Response('Too many requests', { status: 429 })
}
```

#### SQL Injection Prevention

**Supabase automatically prevents SQL injection with parameterized queries:**

```typescript
// ✅ Safe - Supabase uses parameterized queries
const { data } = await supabase
  .from('webinars')
  .select('*')
  .eq('slug', userInput)

// ❌ Never do raw SQL with user input
// await supabase.rpc('raw_sql', { query: `SELECT * FROM webinars WHERE slug = '${userInput}'` })
```

#### XSS Prevention

**Sanitize user input in rich text:**

```typescript
import DOMPurify from 'isomorphic-dompurify'

export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  })
}
```

---

### SEO Optimization

#### Metadata for Every Page

```typescript
// src/app/webinars/[slug]/page.tsx
import type { Metadata } from 'next'

export async function generateMetadata({ params }): Promise<Metadata> {
  const webinar = await getWebinar(params.slug)
  
  return {
    title: `${webinar.title} | MedUni`,
    description: webinar.description.substring(0, 160),
    openGraph: {
      title: webinar.title,
      description: webinar.description.substring(0, 160),
      type: 'website',
      url: `https://meduni.co.uk/webinars/${webinar.slug}`,
      images: [
        {
          url: webinar.thumbnail_url,
          width: 1200,
          height: 630,
          alt: webinar.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: webinar.title,
      description: webinar.description.substring(0, 160),
      images: [webinar.thumbnail_url],
    },
  }
}
```

#### Structured Data (JSON-LD)

```typescript
// src/lib/seo/structured-data.ts
export function generateWebinarSchema(webinar: Webinar) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: webinar.title,
    description: webinar.description,
    startDate: webinar.scheduled_at,
    endDate: new Date(
      new Date(webinar.scheduled_at).getTime() + 
      webinar.duration_minutes * 60000
    ).toISOString(),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    location: {
      '@type': 'VirtualLocation',
      url: 'https://meduni.co.uk',
    },
    organizer: {
      '@type': 'Organization',
      name: 'MedUni',
      url: 'https://meduni.co.uk',
    },
    performer: {
      '@type': 'Person',
      name: webinar.expert_name,
    },
    offers: {
      '@type': 'Offer',
      price: webinar.price_gbp,
      priceCurrency: 'GBP',
      availability: 'https://schema.org/InStock',
      url: `https://meduni.co.uk/webinars/${webinar.slug}`,
    },
  }
}

// In page component
export default function WebinarPage({ webinar }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateWebinarSchema(webinar)),
        }}
      />
      {/* Page content */}
    </>
  )
}
```

#### Sitemap Generation

```typescript
// src/app/sitemap.ts
import { createServerClient } from '@/lib/supabase/server'

export default async function sitemap() {
  const supabase = createServerClient()
  
  // Get all published webinars
  const { data: webinars } = await supabase
    .from('webinars')
    .select('slug, updated_at')
    .eq('status', 'published')
  
  const webinarUrls = webinars?.map((webinar) => ({
    url: `https://meduni.co.uk/webinars/${webinar.slug}`,
    lastModified: webinar.updated_at,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  })) || []
  
  return [
    {
      url: 'https://meduni.co.uk',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: 'https://meduni.co.uk/about',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: 'https://meduni.co.uk/webinars',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    ...webinarUrls,
  ]
}
```

#### Robots.txt

```typescript
// src/app/robots.ts
export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/dashboard/', '/api/'],
      },
    ],
    sitemap: 'https://meduni.co.uk/sitemap.xml',
  }
}
```

#### Image Optimization

```typescript
// Always use next/image
import Image from 'next/image'

<Image
  src={webinar.thumbnail_url}
  alt={webinar.title}
  width={400}
  height={225}
  className="rounded-lg"
  loading="lazy" // Below fold images
  placeholder="blur" // Optional: with blurDataURL
/>
```

#### Core Web Vitals

**Optimize for:**
1. **LCP (Largest Contentful Paint)** < 2.5s
   - Optimize hero images
   - Use `priority` for above-fold images
   - Reduce server response time

2. **FID (First Input Delay)** < 100ms
   - Minimize JavaScript
   - Use Server Components
   - Code-split large bundles

3. **CLS (Cumulative Layout Shift)** < 0.1
   - Set width/height on images
   - Reserve space for dynamic content
   - Avoid inserting content above existing content

---

## Testing & Quality Assurance

### Manual Testing Checklist

#### Authentication Flow
- [ ] Sign up with email/password
- [ ] Sign up with Google OAuth
- [ ] Sign up with Apple OAuth
- [ ] Email verification works
- [ ] Sign in with email/password
- [ ] Sign in with OAuth
- [ ] Password reset sends email
- [ ] Password reset link works
- [ ] Logout clears session

#### Webinar Purchase Flow
- [ ] Browse webinar catalogue
- [ ] Filter by topic works
- [ ] Search by title/expert works
- [ ] Sort options work
- [ ] Click webinar shows detail page
- [ ] "Buy Now" button shows checkout
- [ ] Stripe payment form loads
- [ ] Test card payment succeeds
- [ ] Webhook creates access record
- [ ] Confirmation email received
- [ ] Webinar appears in dashboard

#### Live Webinar Flow
- [ ] Reminder email sent 24h before
- [ ] "Join Live" button disabled until 15min before
- [ ] "Join Live" button enables at correct time
- [ ] Clicking button marks attendance
- [ ] Zoom link opens correctly
- [ ] Post-webinar email sent

#### Replay Flow
- [ ] Admin can upload replay video
- [ ] Upload shows progress
- [ ] Replay appears in dashboard
- [ ] Video player loads correctly
- [ ] Progress tracking works
- [ ] Resume from last position works

#### Admin Panel
- [ ] Only admins can access /admin
- [ ] Create new webinar works
- [ ] Edit webinar works
- [ ] Create Zoom meeting works
- [ ] Upload replay works
- [ ] View users list works
- [ ] Change user role works
- [ ] Create learning content works

#### Chatbot
- [ ] Chatbot widget appears
- [ ] Chat window opens
- [ ] User can send messages
- [ ] AI responds correctly
- [ ] Streaming works
- [ ] Quick actions work
- [ ] Rate limiting works

### Browser Testing

Test on:
- Chrome (Windows, Mac, Android)
- Firefox (Windows, Mac)
- Safari (Mac, iOS)
- Edge (Windows)

**Test these features:**
- All forms submit correctly
- Images load properly
- Videos play correctly
- Layout is responsive
- Navigation works
- Payments process

### Mobile Testing

**iOS Testing:**
- Safari on iPhone (multiple sizes)
- Test touch interactions
- Test video playback
- Test payment forms
- Test navigation

**Android Testing:**
- Chrome on Android device
- Test all interactive features
- Verify responsive design

### Performance Testing

**Lighthouse Audit:**
```bash
# Run Lighthouse
npx lighthouse https://meduni.co.uk --view

# Targets:
# Performance: >90
# Accessibility: >90
# Best Practices: >90
# SEO: >90
```

**Load Testing:**
```bash
# Simulate 100 concurrent users
npx artillery quick --count 100 --num 10 https://meduni.co.uk/webinars
```

### Accessibility Testing

**Tools:**
- axe DevTools browser extension
- WAVE browser extension
- Lighthouse accessibility audit

**Manual Testing:**
- Keyboard navigation (Tab, Enter, Escape)
- Screen reader (NVDA, JAWS, VoiceOver)
- Zoom to 200% (readable?)
- Color contrast (4.5:1 minimum)

**Checklist:**
- [ ] All images have alt text
- [ ] All forms have labels
- [ ] Focus indicators visible
- [ ] Keyboard navigation works
- [ ] Screen reader announces correctly
- [ ] Color not sole indicator
- [ ] Readable at 200% zoom

---

## Deployment & Maintenance

### Environment Variables

**Required in Vercel:**

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxx (secret)

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx (secret)
STRIPE_WEBHOOK_SECRET=whsec_xxx (secret)

# Zoom
ZOOM_API_KEY=xxx (secret)
ZOOM_API_SECRET=xxx (secret)

# Resend
RESEND_API_KEY=re_xxx (secret)

# OpenAI
OPENAI_API_KEY=sk-xxx (secret)

# App
NEXT_PUBLIC_APP_URL=https://meduni.co.uk
```

### Deployment Process

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "feat: complete feature"
   git push origin main
   ```

2. **Vercel auto-deploys**
   - Preview deployment created
   - Run checks
   - Deploy to production (if main branch)

3. **Verify deployment**
   - Check production URL
   - Test critical flows
   - Monitor error logs

### Monitoring & Alerts

**Vercel Analytics:**
- Track Core Web Vitals
- Monitor errors
- View traffic patterns

**Supabase Dashboard:**
- Database usage
- API requests
- Storage usage
- Auth activity

**Error Logging:**
```typescript
// src/lib/logger.ts
export function logError(error: Error, context?: any) {
  console.error('Error:', error, context)
  
  // Send to error tracking service (e.g., Sentry)
  // sentry.captureException(error, { extra: context })
}
```

### Backup Strategy

**Database:**
- Supabase automatic daily backups (7 days)
- Manual backups before major changes
- Export via Supabase CLI

**Files:**
- Supabase Storage has built-in redundancy
- Consider periodic exports for critical files

### Maintenance Tasks

**Weekly:**
- Review error logs
- Monitor performance metrics
- Check payment success rates
- Review chatbot conversations
- Update weekly learning content

**Monthly:**
- Update dependencies (`npm update`)
- Security audit
- Database maintenance (Supabase handles)
- Performance optimization review
- User feedback analysis

**Quarterly:**
- Comprehensive security audit
- Accessibility review
- UX improvements
- Feature planning
- Cost optimization

### Support & Troubleshooting

**Common Issues:**

1. **Payments not creating access**
   - Check webhook endpoint configured
   - Verify webhook secret
   - Check webhook logs in Stripe dashboard
   - Verify RLS policies allow inserts

2. **Emails not delivering**
   - Check Resend dashboard for errors
   - Verify DNS records (SPF, DKIM)
   - Check spam folder
   - Review email_events table

3. **Videos not playing**
   - Verify signed URL not expired
   - Check Supabase Storage permissions
   - Verify file format (MP4)
   - Check CORS settings

4. **Zoom links not working**
   - Verify Zoom API credentials
   - Check meeting creation logs
   - Verify scheduled_at is future
   - Check user has webinar_access

---

## Conclusion

This architecture document provides a comprehensive blueprint for building the MedUni educational webinar platform. The design prioritizes:

1. **Security** - RLS policies, input validation, authentication checks at every layer
2. **Performance** - Server Components, efficient caching, optimized queries
3. **Scalability** - Supabase + Vercel can handle growth from 10 to 10,000+ users
4. **Maintainability** - Clear structure, reusable components, comprehensive documentation
5. **User Experience** - Fast loading, intuitive navigation, mobile-friendly

**Key Success Metrics:**
- Lighthouse scores >90 across all metrics
- Page load time <2 seconds
- Zero security vulnerabilities
- 99.9% uptime
- Payment success rate >95%
- User satisfaction score >4.5/5

**Next Steps:**
1. Begin with Phase 0 (Setup)
2. Follow implementation phases sequentially
3. Test thoroughly at each phase
4. Deploy to production
5. Monitor and iterate based on user feedback

---

**Document Version:** 1.0  
**Last Updated:** November 20, 2025  
**Maintained by:** DevBeam Digital

For questions or updates to this architecture, please contact the development team.
```

END ARCHITECTURE.md
============

This completes the comprehensive ARCHITECTURE.md file. The document includes:

✅ **Complete Tech Stack** with explanations
✅ **Architectural principles** (Server-first, caching, security layers)
✅ **Detailed user flows** with sequence diagrams
✅ **Full folder structure** with all files
✅ **Complete database schema** with all 7 tables, columns, RLS policies
✅ **Comprehensive component inventory** (40+ components documented)
✅ **API integration flows** (Stripe, Zoom, Resend, OpenAI) with code examples
✅ **11 implementation phases** with tasks, files, and acceptance criteria
✅ **Performance, security, and SEO checklists** with examples
✅ **Testing strategies** and quality assurance
✅ **Deployment and maintenance** guidelines

The document is exhaustive (over 15,000 words) and serves as the single source of truth for the entire project. Combined with the concise PROJECT_INSTRUCTIONS.txt, Cursor will have everything needed to build the MedUni platform following best practices.
