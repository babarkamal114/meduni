============
BEGIN PROJECT_INSTRUCTIONS.txt

```
# MedUni Platform - Cursor Project Instructions

## Core Architecture Rules

1. **ALWAYS check ARCHITECTURE.md first** before generating any code
2. Follow the exact folder structure defined in ARCHITECTURE.md
3. Use TypeScript strict mode for all files
4. Never use JavaScript - TypeScript only

## Tech Stack (MEMORIZE THIS)

- Next.js 15 App Router with React Server Components
- Supabase (PostgreSQL + Auth + Storage + RLS)
- TypeScript 5.x (strict mode)
- Tailwind CSS + shadcn/ui
- Stripe for payments, Zoom API for webinars
- Resend for emails, OpenAI for chatbot
- Deploy on Vercel

## Server vs Client Components

### DEFAULT TO SERVER COMPONENTS
- All components are Server Components unless marked "use client"
- Server Components for: data fetching, static content, layouts, SEO-critical pages
- NO useState, useEffect, onClick in Server Components

### Use Client Components ONLY for:
- Forms with interactivity (onClick, onChange, onSubmit)
- Browser APIs (window, localStorage, document)
- React hooks (useState, useEffect, useContext)
- Event handlers
- Real-time features (chatbot, video player)

### Rules:
- Keep "use client" boundary as LOW in tree as possible
- Fetch data in Server Components, pass to Client as props
- Never fetch data in Client Components if Server Component can do it

## File Generation Protocol

### ALWAYS follow this order:
1. State the FULL file path first
2. Explain what the file does
3. List dependencies it needs
4. Generate the complete code
5. Mention which other files might need updates

### Example:
```
Creating: src/app/dashboard/webinars/page.tsx
Purpose: Display user's purchased webinars
Dependencies: Supabase client, WebinarCard component
Type: Server Component (fetches data)

[CODE HERE]

Related files to update:
- src/components/webinars/webinar-card.tsx (might need new props)
```

## Folder Structure (SHORT VERSION)

```
src/
├── app/                    # Next.js routes
│   ├── (marketing)/        # Public pages
│   ├── (auth)/             # Sign in/up
│   ├── dashboard/          # Student area (protected)
│   ├── admin/              # Admin panel (protected)
│   ├── checkout/           # Payment flow
│   └── api/                # API routes (webhooks only)
├── components/
│   ├── ui/                 # shadcn/ui primitives
│   ├── layout/             # Navbar, Footer, Sidebar
│   ├── webinars/           # Webinar components
│   ├── dashboard/          # Dashboard widgets
│   ├── admin/              # Admin components
│   ├── forms/              # Form components
│   └── chatbot/            # AI chat
├── lib/
│   ├── supabase/           # DB clients (client, server, admin)
│   ├── actions/            # Server Actions
│   ├── auth/               # Auth helpers
│   ├── payments/           # Stripe/PayPal
│   ├── zoom/               # Zoom API
│   ├── email/              # Resend + templates
│   ├── ai/                 # OpenAI chatbot
│   ├── validations/        # Zod schemas
│   └── utils/              # Helpers
├── types/                  # TypeScript types
└── config/                 # Constants
```

## Data Fetching Rules

### Server Components (DEFAULT):
```typescript
// Fetch directly in component
async function WebinarList() {
  const supabase = createServerClient()
  const { data } = await supabase.from('webinars').select('*')
  return <div>...</div>
}
```

### Server Actions (for mutations):
```typescript
// src/lib/actions/webinars.ts
'use server'

export async function purchaseWebinar(id: string) {
  const supabase = createServerClient()
  // mutation logic
  revalidatePath('/dashboard')
}
```

### API Routes (ONLY for):
- Webhooks (Stripe, PayPal, Zoom)
- Third-party integrations with secrets
- Rate-limited operations (chatbot)

### NEVER:
- Don't use API routes for internal data fetching
- Don't fetch in Client Components if Server Component can do it
- Don't use useEffect for data fetching

## Database Tables (QUICK REFERENCE)

Main tables:
- `profiles` (user data, extends auth.users)
- `webinars` (webinar details)
- `webinar_access` (purchase records)
- `content_items` (learning materials)
- `payment_events` (audit log)
- `email_events` (email log)
- `chatbot_interactions` (AI logs)

**See ARCHITECTURE.md for full schema with columns and RLS rules**

## Component Naming Convention

### File names: kebab-case
- `webinar-card.tsx`
- `user-menu.tsx`

### Component names: PascalCase
- `WebinarCard`
- `UserMenu`

### Functions: camelCase
- `getUserWebinars`
- `sendEmail`

## Import Order (enforce this):
```typescript
// 1. React/Next
import { useState } from 'react'
import Link from 'next/link'

// 2. Third-party
import { Button } from '@/components/ui/button'

// 3. Internal (absolute imports with @/)
import { createServerClient } from '@/lib/supabase/server'
import { WebinarCard } from '@/components/webinars/webinar-card'

// 4. Types
import type { Webinar } from '@/types/webinar'

// 5. Relative imports (avoid if possible)
```

## TypeScript Rules

1. **Use explicit return types** for functions
2. **Never use `any`** - use `unknown` then narrow
3. **Use Zod for runtime validation**, infer types
4. **Import types with `type` keyword**:
   ```typescript
   import type { User } from '@/types/user'
   ```
5. **All props must be typed**:
   ```typescript
   interface WebinarCardProps {
     webinar: Webinar
     userHasAccess: boolean
   }
   ```

## Tailwind CSS Rules

1. Use Tailwind utility classes (no custom CSS unless necessary)
2. Use `cn()` helper for conditional classes:
   ```typescript
   import { cn } from '@/lib/utils/cn'
   className={cn('base-class', condition && 'conditional-class')}
   ```
3. Mobile-first responsive design:
   ```typescript
   className="text-sm md:text-base lg:text-lg"
   ```
4. Use shadcn/ui components (never rebuild from scratch)

## Authentication Flow

1. **Middleware** checks auth on protected routes (`src/middleware.ts`)
2. **RLS policies** enforce permissions at database level
3. **Server Actions** validate user permissions
4. Use `createServerClient()` for auth-aware queries

```typescript
// In Server Component or Server Action
const supabase = createServerClient()
const { data: { user } } = await supabase.auth.getUser()
if (!user) redirect('/sign-in')
```

## Error Handling

```typescript
// Server Actions
try {
  const result = await someOperation()
  return { success: true, data: result }
} catch (error) {
  console.error('Operation failed:', error)
  return { success: false, error: 'User-friendly message' }
}

// Client Components
try {
  const response = await serverAction()
  if (!response.success) {
    toast.error(response.error)
  }
} catch (error) {
  toast.error('Something went wrong')
}
```

## Performance Rules

1. **Images**: Always use `next/image` with width/height
2. **Caching**: Use `revalidate` in fetch or page config
   ```typescript
   export const revalidate = 300 // 5 minutes
   ```
3. **Dynamic imports** for heavy components:
   ```typescript
   const VideoPlayer = dynamic(() => import('./video-player'))
   ```
4. **Loading states**: Always show skeleton/spinner during async ops

## Security Checklist

- ✅ All user inputs validated with Zod
- ✅ RLS enabled on all tables
- ✅ Service key ONLY in server-side code
- ✅ Webhook signatures verified (Stripe, PayPal)
- ✅ Rate limiting on API routes
- ✅ No secrets in client-side code
- ✅ CSRF protection (Next.js handles)

## SEO Requirements

For every page:
```typescript
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Page Title - MedUni',
    description: 'Page description under 160 chars',
    openGraph: {
      title: 'Page Title',
      description: 'Description',
      images: ['/og-image.jpg'],
    },
  }
}
```

## Component Creation Rules

### Before creating ANY component:
1. Check if it exists in `src/components/`
2. Check if shadcn/ui has it (`npx shadcn-ui@latest add [component]`)
3. If creating new, decide: Server or Client Component?
4. Place in correct subfolder (ui, layout, webinars, etc.)

### Component template:
```typescript
// Server Component (default)
import type { ComponentProps } from '@/types/component'

export async function ComponentName({ prop1, prop2 }: ComponentProps) {
  // Fetch data if needed
  return <div>...</div>
}

// OR Client Component
'use client'

import { useState } from 'react'
import type { ComponentProps } from '@/types/component'

export function ComponentName({ prop1, prop2 }: ComponentProps) {
  const [state, setState] = useState()
  return <div>...</div>
}
```

## Implementation Phases (FOLLOW IN ORDER)

Phase 0: Setup (Next.js, Supabase, Vercel)
Phase 1: Marketing pages + SEO
Phase 2: Auth + Dashboard shell
Phase 3: Webinar catalogue
Phase 4: Payments (Stripe)
Phase 5: Live webinars (Zoom)
Phase 6: Replays + content
Phase 7: Admin panel
Phase 8: AI chatbot
Phase 9: Email automation
Phase 10: Testing + optimization

**See ARCHITECTURE.md for detailed phase breakdown**

## When You Don't Know Something

1. Say "Let me check ARCHITECTURE.md for [topic]"
2. Ask user: "Should I reference the architecture doc?"
3. NEVER guess the folder structure
4. NEVER invent new patterns without asking

## Code Style

- **Indentation**: 2 spaces
- **Quotes**: Single quotes for strings
- **Semicolons**: Yes, always
- **Max line length**: 100 characters
- **Comments**: Explain WHY, not WHAT
- **Async/await**: Prefer over .then()

## Git Commit Convention

- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting
- refactor: Code restructuring
- test: Tests
- chore: Maintenance

Example: `feat: add webinar purchase flow`

## Environment Variables (NEVER COMMIT)

Required in `.env.local`:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY (server-only)
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- ZOOM_API_KEY
- ZOOM_API_SECRET
- RESEND_API_KEY
- OPENAI_API_KEY

## Supabase Client Usage

```typescript
// Browser (Client Components)
import { createBrowserClient } from '@/lib/supabase/client'

// Server (Server Components, Server Actions, API Routes)
import { createServerClient } from '@/lib/supabase/server'

// Admin (bypass RLS, server-only)
import { createAdminClient } from '@/lib/supabase/admin'
```

## Common Patterns

### Protected page:
```typescript
// src/app/dashboard/page.tsx
import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect('/sign-in')
  
  return <div>Dashboard</div>
}
```

### Form with Server Action:
```typescript
// Client Component (form)
'use client'
export function MyForm() {
  async function handleSubmit(formData: FormData) {
    const result = await myServerAction(formData)
    if (result.success) toast.success('Done!')
  }
  
  return <form action={handleSubmit}>...</form>
}

// Server Action
'use server'
export async function myServerAction(formData: FormData) {
  const data = Object.fromEntries(formData)
  // validate, process, save
  revalidatePath('/dashboard')
  return { success: true }
}
```

## CRITICAL REMINDERS

1. **ARCHITECTURE.md is the source of truth** - check it constantly
2. **Default to Server Components** - only use Client when necessary
3. **Never bypass RLS** - use correct Supabase client for context
4. **Validate all inputs** - use Zod schemas
5. **Type everything** - no implicit any
6. **Mobile-first** - test responsive design
7. **Performance matters** - optimize images, code-split, cache
8. **Security first** - never trust client, validate on server

## Questions to Ask Before Coding

- Is this a Server or Client Component?
- Does this component already exist?
- What data does it need? (fetch in Server Component or pass as props?)
- What's the file path according to ARCHITECTURE.md?
- Does this need validation? (create Zod schema)
- Does this affect other files? (list them)

---

**When in doubt, ask the user or check ARCHITECTURE.md.**
**Never make assumptions about structure, always verify first.**
```

END PROJECT_INSTRUCTIONS.txt
============

✅ **Core rules** Cursor must follow
✅ **Server vs Client Component guidelines** (when to use each)
✅ **File generation protocol** (always state path first)
✅ **Folder structure summary** (condensed version)
✅ **Data fetching patterns** (Server Components, Server Actions, API routes)
✅ **TypeScript and coding style rules**
✅ **Import order conventions**
✅ **Component creation checklist**
✅ **Common patterns** (protected pages, forms with Server Actions)
✅ **Security and performance rules**
✅ **Phase implementation order**
✅ **Critical reminders** to always check ARCHITECTURE.md
