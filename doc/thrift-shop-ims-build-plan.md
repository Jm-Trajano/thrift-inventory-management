# Thrift Shop IMS — Detailed Step-by-Step Build Plan

**Stack:** Next.js 14 (App Router) · Supabase · Tailwind CSS · shadcn/ui · Vercel  
**Design Philosophy:** Open, editorial, typographically-led. No default card grids. Whitespace as structure.  
**Estimated Total Time:** 5–6 weeks solo developer

---

## Build Status

Implementation note: the live scaffold is using the current Next.js generator output, which produced a Next.js 16 + Tailwind CSS 4 base. The build sequence in this plan still applies, and completed setup steps are being tracked here as the implementation moves forward.

### Completed
- [x] Step 0.1 - Initialize the Next.js project in the repository root
- [x] Step 0.2 - Install core dependencies
- [x] Step 0.3 - Install the initial shadcn/ui component set
- [x] Step 0.4 - Configure the root layout fonts
- [x] Step 0.5 - Configure design tokens and Tailwind v4 theme variables
- [x] Step 0.6 - Apply the global CSS foundation
- [x] Step 1.5 - Add a local environment template for Supabase credentials
- [x] Step 1.6 - Create Supabase client helper modules
- [x] Step 1.7 - Create shared TypeScript item types
- [x] Repo prep - Add the initial tracked Supabase migration in `supabase/migrations`
- [x] Step 1.1 - Supabase project credentials are present in `.env.local`
- [x] Step 2.2 - Build the login page UI
- [x] Step 2.3 - Add auth server actions
- [x] Step 2.4 - Add the app auth/query provider
- [x] Step 2.1 - Protected route handling is active with live Supabase credentials
- [x] Step 3.1 - Add the authenticated route group layout
- [x] Step 3.2 - Add the sidebar navigation shell
- [x] Step 3.3 - Add the top bar shell
- [x] Step 3.4 - Add the reusable page shell component
- [x] Step 4.1 - Add the centralized item service module
- [x] Step 4.2 - Implement filtered item querying
- [x] Step 4.3 - Implement item stats aggregation
- [x] Step 4.4 - Add React Query hooks for items and stats
- [x] Step 5.1 - Add the dashboard stats section
- [x] Step 6.1 - Add the inventory page header
- [x] Step 6.2 - Add the search and filter bar
- [x] Step 6.3 - Add the inventory table
- [x] Step 6.4 - Add the status badge component
- [x] Step 6.5 - Add the profit cell component
- [x] Step 6.6 - Add the row actions dropdown
- [x] Step 6.7 - Add the loading skeleton
- [x] Step 6.8 - Add the empty state
- [x] Step 5.2 - Add the sales chart section
- [x] Step 5.3 - Add the category breakdown
- [x] Step 5.4 - Add the recent activity section
- [x] Step 7.1 - Add the item form schema

### Up Next
- [ ] Step 1.2 - Run the database migration
- [ ] Step 1.3 - Enable row level security
- [ ] Step 1.4 - Create the storage bucket
- [ ] Step 7.2 - Build the add/edit item form page layout
- [ ] Step 7.3 - Finish the underline field form primitives
- [ ] Step 7.4 - Add the live profit preview

## Design System Decisions (Decide Before Writing Code)

Before touching the terminal, lock these in. Every component you build should reference this.

### Color Palette
```
Background:     #FAFAF8   (warm off-white, never pure white)
Surface:        #F2F1EE   (subtle tone shift for functional containers only)
Ink Primary:    #141413   (near-black for headlines)
Ink Secondary:  #6B6A65   (warm gray for secondary labels)
Ink Muted:      #A8A79F   (timestamps, placeholders)
Accent:         #C8A96E   (muted gold — thrift/vintage warmth)
Accent Dark:    #8B6F3E   (pressed state, active links)
Status Green:   #3D7A5E   (Available)
Status Gray:    #8F8F8F   (Sold)
Status Red:     #A84444   (Archived)
Border Subtle:  #E2E0DA   (only when functionally required)
```

### Typography
```
Display / Headlines:   "Playfair Display" — editorial, has personality
Body / UI:             "DM Sans" — clean, warm, readable at small sizes
Monospace (prices):    "DM Mono" — for currency figures
```

### Spacing Scale (use multiples of 8px)
```
xs:   4px    sm:   8px    md:   16px
lg:   24px   xl:   40px   2xl:  64px
3xl:  96px   4xl:  128px
```

### Layout Rules
- Max content width: `1280px`
- Main content column: `720px` for reading content, full width for tables
- Sidebar (if used): `280px`
- Section vertical padding minimum: `64px`
- **No card grids for browsable lists** — use horizontal table rows with generous spacing
- **No boxes around stats** — use large type and thin underlines only
- **Only use `Surface` background + `Border Subtle`** for: forms, modals, the data table itself

---

## Phase 0 — Environment Setup

### Step 0.1 — Initialize the Next.js Project

```bash
npx create-next-app@latest thrift-ims \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"
cd thrift-ims
```

### Step 0.2 — Install Core Dependencies

```bash
# UI components
npx shadcn@latest init
# Select: Default style, Neutral base color, CSS variables = yes

# Supabase
npm install @supabase/supabase-js @supabase/ssr

# Forms & Validation
npm install react-hook-form zod @hookform/resolvers

# Data fetching
npm install @tanstack/react-query

# Charts
npm install recharts

# Utilities
npm install date-fns clsx tailwind-merge lucide-react

# CSV export
npm install papaparse
npm install --save-dev @types/papaparse
```

### Step 0.3 — Install shadcn Components

```bash
npx shadcn@latest add button input label select textarea dialog
npx shadcn@latest add dropdown-menu table badge toast sonner
npx shadcn@latest add separator skeleton avatar
```

### Step 0.4 — Configure Fonts

In `src/app/layout.tsx`:
```tsx
import { Playfair_Display, DM_Sans, DM_Mono } from 'next/font/google'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})
const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})
const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})
```

Apply variables to `<html className={`${playfair.variable} ${dmSans.variable} ${dmMono.variable}`}>`.

### Step 0.5 — Configure Tailwind

Extend `tailwind.config.ts`:
```ts
theme: {
  extend: {
    fontFamily: {
      display: ['var(--font-display)', 'Georgia', 'serif'],
      body:    ['var(--font-body)', 'sans-serif'],
      mono:    ['var(--font-mono)', 'monospace'],
    },
    colors: {
      ink: {
        primary:   '#141413',
        secondary: '#6B6A65',
        muted:     '#A8A79F',
      },
      canvas: {
        DEFAULT: '#FAFAF8',
        surface: '#F2F1EE',
      },
      accent: {
        DEFAULT: '#C8A96E',
        dark:    '#8B6F3E',
      },
      status: {
        available: '#3D7A5E',
        sold:      '#8F8F8F',
        archived:  '#A84444',
      },
      border: { subtle: '#E2E0DA' },
    },
    spacing: {
      // Extend with named semantic spacing if preferred
    },
  },
}
```

### Step 0.6 — Global CSS

In `src/app/globals.css`, set the base body styles:
```css
body {
  background-color: #FAFAF8;
  color: #141413;
  font-family: var(--font-body), sans-serif;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3 {
  font-family: var(--font-display), serif;
}

/* Subtle scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #E2E0DA; border-radius: 3px; }
```

---

## Phase 1 — Supabase Setup

### Step 1.1 — Create Supabase Project

1. Go to [supabase.com](https://supabase.com) → New Project
2. Name it `thrift-ims`, choose a strong database password, select nearest region
3. Wait for provisioning (~2 minutes)

### Step 1.2 — Run Database Migrations

Go to **SQL Editor** in Supabase dashboard and run the following:

```sql
-- Enable UUID extension (usually already enabled)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Items table
CREATE TABLE items (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id       UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  name          TEXT        NOT NULL,
  brand         TEXT,
  size          TEXT,
  condition     TEXT        CHECK (condition IN ('Good','Very Good','Excellent','Like New')),
  category      TEXT        CHECK (category IN (
                              'Tops','Bottoms','Dresses','Outerwear',
                              'Shoes','Accessories','Others'
                            )),
  cost_price    NUMERIC(10,2) NOT NULL CHECK (cost_price >= 0),
  selling_price NUMERIC(10,2) NOT NULL CHECK (selling_price >= 0),
  sale_price    NUMERIC(10,2) CHECK (sale_price >= 0),

  status        TEXT        NOT NULL DEFAULT 'Available'
                            CHECK (status IN ('Available','Sold','Archived')),
  date_sold     DATE,
  notes         TEXT,
  photo_url     TEXT
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER items_updated_at
BEFORE UPDATE ON items
FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### Step 1.3 — Enable Row Level Security

```sql
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- Users can only access their own items
CREATE POLICY "Users own their items"
ON items
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

### Step 1.4 — Create Storage Bucket

In Supabase Dashboard → Storage → New Bucket:
- Name: `item-photos`
- Public bucket: **Yes** (so photo URLs work without auth headers)

Then add a storage policy:
```sql
-- Allow authenticated users to upload to their own folder
CREATE POLICY "Authenticated users can upload photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'item-photos');

-- Allow authenticated users to update/delete their own photos
CREATE POLICY "Users can manage their photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'item-photos');
```

### Step 1.5 — Configure Environment Variables

Create `.env.local` in project root:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Find these values in Supabase → Settings → API.

### Step 1.6 — Create Supabase Client Helpers

Create `src/lib/supabase/client.ts`:
```ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

Create `src/lib/supabase/server.ts`:
```ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options))
          } catch {}
        },
      },
    }
  )
}
```

### Step 1.7 — Create TypeScript Types

Create `src/types/item.ts`:
```ts
export type ItemStatus = 'Available' | 'Sold' | 'Archived'
export type ItemCondition = 'Good' | 'Very Good' | 'Excellent' | 'Like New'
export type ItemCategory =
  | 'Tops' | 'Bottoms' | 'Dresses' | 'Outerwear'
  | 'Shoes' | 'Accessories' | 'Others'

export interface Item {
  id: string
  created_at: string
  updated_at: string
  user_id: string
  name: string
  brand: string | null
  size: string | null
  condition: ItemCondition | null
  category: ItemCategory | null
  cost_price: number
  selling_price: number
  sale_price: number | null
  status: ItemStatus
  date_sold: string | null
  notes: string | null
  photo_url: string | null
}

export type NewItem = Omit<Item, 'id' | 'created_at' | 'updated_at' | 'user_id'>

export interface ItemStats {
  totalItems: number
  availableItems: number
  soldItems: number
  totalRevenue: number
  totalCost: number
  totalProfit: number
  avgMargin: number
}
```

---

## Phase 2 — Authentication

### Step 2.1 — Middleware for Route Protection

Create `src/middleware.ts`:
```ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options))
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  if (!user && !pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (user && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
```

### Step 2.2 — Login Page Design

Route: `src/app/login/page.tsx`

**Visual design intent:** Full-height split layout. Left half: large editorial headline + shop name + a thin tagline. Right half: the login form, minimal, no box — just the form fields floating in generous whitespace. On mobile, stacks vertically with headline above form.

```tsx
// Key layout structure (implement fully):
<main className="min-h-screen grid lg:grid-cols-2">
  {/* Left — Brand */}
  <div className="hidden lg:flex flex-col justify-between p-16 bg-ink-primary text-canvas">
    <span className="font-display text-sm tracking-widest uppercase text-accent">
      Your Shop Name
    </span>
    <div>
      <h1 className="font-display text-6xl leading-tight mb-6">
        Every piece<br />has a story.
      </h1>
      <p className="text-ink-secondary text-lg max-w-xs">
        Track it from rack to receipt.
      </p>
    </div>
    <p className="text-ink-muted text-xs">Inventory Management System</p>
  </div>

  {/* Right — Form */}
  <div className="flex flex-col justify-center px-8 lg:px-24">
    <h2 className="font-display text-3xl mb-2">Welcome back</h2>
    <p className="text-ink-secondary mb-10 text-sm">Sign in to your shop account</p>
    {/* Email + Password fields, no wrapper box */}
    {/* Login button: full width, bg-ink-primary text-canvas */}
  </div>
</main>
```

### Step 2.3 — Auth Server Action

Create `src/app/login/actions.ts`:
```ts
'use server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })
  if (error) return { error: error.message }
  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
```

### Step 2.4 — Auth Provider (Client Context)

Create `src/components/providers/AuthProvider.tsx` — wraps the app in a `QueryClientProvider` and exposes the Supabase session via context. This is the standard pattern for Supabase + Next.js App Router.

---

## Phase 3 — App Shell & Navigation

### Step 3.1 — Root Layout

`src/app/(app)/layout.tsx` — all authenticated routes live under this group.

```
src/app/
  (app)/
    layout.tsx        ← sidebar + topbar shell
    dashboard/
      page.tsx
    inventory/
      page.tsx
      new/
        page.tsx
      [id]/
        page.tsx
        edit/
          page.tsx
  login/
    page.tsx
  page.tsx            ← redirects to /dashboard
```

### Step 3.2 — Sidebar Navigation Design

**Visual intent:** Narrow, minimal sidebar (`240px`). No background — just the left edge of the canvas. Navigation items are plain text links, not pills or highlighted rows. Active state: a thin `2px` left border in `accent` color + text shifts to `ink-primary`. Logo/shop name at top in small `font-display`. Bottom: user email in `ink-muted` + a logout link.

```tsx
// Sidebar structure
<nav className="w-60 min-h-screen flex flex-col py-10 px-8 border-r border-border-subtle">
  <div className="mb-12">
    <span className="font-display text-lg text-ink-primary">Shop Name</span>
    <span className="block text-xs text-ink-muted mt-0.5 tracking-widest uppercase">IMS</span>
  </div>

  <ul className="space-y-1 flex-1">
    {navLinks.map(link => (
      <li key={link.href}>
        <Link
          href={link.href}
          className={cn(
            "flex items-center gap-3 py-2 pl-3 text-sm transition-colors",
            "border-l-2",
            isActive
              ? "border-accent text-ink-primary font-medium"
              : "border-transparent text-ink-secondary hover:text-ink-primary"
          )}
        >
          <link.Icon size={15} />
          {link.label}
        </Link>
      </li>
    ))}
  </ul>

  <div className="mt-auto">
    <p className="text-xs text-ink-muted truncate mb-3">{user.email}</p>
    <button onClick={logout} className="text-xs text-ink-muted hover:text-ink-primary transition-colors">
      Sign out
    </button>
  </div>
</nav>
```

### Step 3.3 — Top Bar

Simple `<header>` — full width, `48px` tall. Page title on the left in `font-display text-xl`. Context actions on the right (e.g., "Add Item" button on inventory page). No background — just the canvas. A single `1px border-b border-border-subtle` separates it from content.

### Step 3.4 — Page Wrapper Component

Create `src/components/layout/PageShell.tsx`:
```tsx
interface PageShellProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
  children: React.ReactNode
}
// Renders the page title section + children
// Title: font-display text-2xl, subtitle: text-ink-secondary text-sm
// Top padding: pt-12, bottom of title section: pb-8 with a thin divider
```

---

## Phase 4 — Item Data Layer

### Step 4.1 — Item Service Functions

Create `src/lib/items.ts` — all Supabase calls centralized here:

```ts
// Functions to implement:
export async function getItems(filters: ItemFilters): Promise<Item[]>
export async function getItemById(id: string): Promise<Item | null>
export async function createItem(data: NewItem): Promise<Item>
export async function updateItem(id: string, data: Partial<NewItem>): Promise<Item>
export async function softDeleteItem(id: string): Promise<void>   // sets status = 'Archived'
export async function markAsSold(id: string, salePrice: number, dateSold: string): Promise<Item>
export async function restoreItem(id: string): Promise<Item>      // sets status back to 'Available'
export async function getItemStats(): Promise<ItemStats>
export async function uploadItemPhoto(file: File, itemId: string): Promise<string>
```

### Step 4.2 — getItems with Filters

```ts
export interface ItemFilters {
  search?: string
  status?: ItemStatus | 'All'
  category?: ItemCategory | 'All'
  condition?: ItemCondition | 'All'
  sortBy?: 'created_at' | 'selling_price' | 'name' | 'profit'
  sortOrder?: 'asc' | 'desc'
  dateFrom?: string
  dateTo?: string
}

export async function getItems(filters: ItemFilters = {}): Promise<Item[]> {
  const supabase = createClient()
  let query = supabase
    .from('items')
    .select('*')
    .neq('status', 'Archived') // exclude archived by default

  if (filters.search) {
    query = query.or(`name.ilike.%${filters.search}%,brand.ilike.%${filters.search}%,notes.ilike.%${filters.search}%`)
  }
  if (filters.status && filters.status !== 'All') {
    query = query.eq('status', filters.status)
  }
  if (filters.category && filters.category !== 'All') {
    query = query.eq('category', filters.category)
  }
  // ... add remaining filters
  // Handle profit sort client-side (computed field)
  const { data, error } = await query.order(
    filters.sortBy === 'profit' ? 'sale_price' : (filters.sortBy ?? 'created_at'),
    { ascending: filters.sortOrder === 'asc' }
  )
  if (error) throw error
  return data ?? []
}
```

### Step 4.3 — getItemStats

```ts
export async function getItemStats(): Promise<ItemStats> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('items')
    .select('status, cost_price, selling_price, sale_price')
    .neq('status', 'Archived')

  if (error) throw error

  const sold = data.filter(i => i.status === 'Sold')
  const totalRevenue = sold.reduce((sum, i) => sum + (i.sale_price ?? i.selling_price), 0)
  const totalCost = sold.reduce((sum, i) => sum + i.cost_price, 0)
  const totalProfit = totalRevenue - totalCost
  const margins = sold.map(i => {
    const sp = i.sale_price ?? i.selling_price
    return sp > 0 ? ((sp - i.cost_price) / sp) * 100 : 0
  })
  const avgMargin = margins.length > 0
    ? margins.reduce((a, b) => a + b, 0) / margins.length
    : 0

  return {
    totalItems: data.length,
    availableItems: data.filter(i => i.status === 'Available').length,
    soldItems: sold.length,
    totalRevenue,
    totalCost,
    totalProfit,
    avgMargin,
  }
}
```

### Step 4.4 — React Query Hooks

Create `src/hooks/useItems.ts`:
```ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export function useItems(filters: ItemFilters) {
  return useQuery({
    queryKey: ['items', filters],
    queryFn: () => getItems(filters),
    staleTime: 30_000,
  })
}

export function useItemStats() {
  return useQuery({
    queryKey: ['item-stats'],
    queryFn: getItemStats,
    staleTime: 60_000,
  })
}

export function useCreateItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['items'] })
      qc.invalidateQueries({ queryKey: ['item-stats'] })
    },
  })
}

// Implement useUpdateItem, useDeleteItem, useMarkAsSold similarly
```

---

## Phase 5 — Dashboard Page

Route: `/dashboard`

### Step 5.1 — Stats Section

**Visual design intent:** No stat cards. Five large numbers arranged in a horizontal row separated by thin vertical dividers (`1px border-border-subtle`). Each stat: a small all-caps label in `ink-muted text-xs tracking-widest` above a large number in `font-display text-4xl`. The Total Profit number is colored `status-available` if positive, `status-archived` if negative.

```tsx
// Stats row structure
<section className="py-12 border-b border-border-subtle">
  <div className="flex items-start divide-x divide-border-subtle">
    {stats.map(stat => (
      <div key={stat.label} className="flex-1 px-8 first:pl-0">
        <p className="text-xs text-ink-muted tracking-widest uppercase mb-2">{stat.label}</p>
        <p className={cn("font-display text-4xl", stat.colorClass)}>{stat.value}</p>
      </div>
    ))}
  </div>
</section>
```

Stats to show: `Total Items` · `Available` · `Sold` · `Revenue` · `Profit`

### Step 5.2 — Sales Chart Section

**Visual design intent:** Full-width chart section with a left-aligned section label. Chart is a clean `BarChart` from Recharts — no grid lines on X axis, subtle dashed Y axis lines, bars in `accent` color. A small toggle above the chart for `Weekly / Monthly` view. Chart height `240px`.

```tsx
<section className="py-12">
  <div className="flex items-center justify-between mb-8">
    <h2 className="font-display text-xl">Sales over time</h2>
    <div className="flex gap-1">
      {/* Toggle buttons: text only, underline on active */}
      <button className={view === 'weekly' ? 'text-ink-primary underline' : 'text-ink-muted'}>
        Weekly
      </button>
      <span className="text-ink-muted">/</span>
      <button className={view === 'monthly' ? 'text-ink-primary underline' : 'text-ink-muted'}>
        Monthly
      </button>
    </div>
  </div>
  {/* Recharts BarChart here */}
</section>
```

### Step 5.3 — Category Breakdown

**Visual design intent:** Horizontal stacked bar or a simple table-like list. Each category: name on the left, a thin inline bar (just a `div` with `bg-accent` and dynamic width %), profit figure on the right. No boxes. Section title in `font-display`.

```tsx
<section className="py-12 border-t border-border-subtle">
  <h2 className="font-display text-xl mb-8">By category</h2>
  <div className="space-y-4 max-w-lg">
    {categories.map(cat => (
      <div key={cat.name} className="flex items-center gap-4">
        <span className="text-sm text-ink-secondary w-24 flex-shrink-0">{cat.name}</span>
        <div className="flex-1 h-px bg-border-subtle relative">
          <div
            className="absolute top-0 left-0 h-px bg-accent"
            style={{ width: `${cat.pct}%` }}
          />
        </div>
        <span className="font-mono text-sm text-ink-primary w-20 text-right">
          ₱{cat.profit.toFixed(2)}
        </span>
      </div>
    ))}
  </div>
</section>
```

### Step 5.4 — Recent Activity

A simple list of the 5 most recently sold items. No cards — just rows with item name, brand, date sold, and profit. A "View all" text link at the bottom.

---

## Phase 6 — Inventory Page

Route: `/inventory`

### Step 6.1 — Page Header

```tsx
<PageShell title="Inventory">
  <div slot="action">
    <Link href="/inventory/new">
      <Button className="bg-ink-primary text-canvas hover:bg-ink-secondary">
        + Add Item
      </Button>
    </Link>
  </div>
</PageShell>
```

### Step 6.2 — Search & Filter Bar

**Visual design intent:** A single horizontal row, no container box. Search input on the left (no border radius — just a bottom border `border-b border-ink-primary` like an editorial underline field). Filter dropdowns in a row to the right — plain text with a small chevron, no button styling.

```tsx
<div className="flex items-end gap-6 pb-6 border-b border-border-subtle">
  {/* Search — underline style */}
  <div className="flex-1 max-w-xs relative">
    <input
      placeholder="Search items..."
      className="w-full bg-transparent border-b border-ink-secondary pb-1
                 text-sm text-ink-primary placeholder:text-ink-muted
                 focus:outline-none focus:border-ink-primary transition-colors"
    />
  </div>

  {/* Filters — text selects */}
  <select className="bg-transparent text-sm text-ink-secondary border-none
                     focus:outline-none cursor-pointer">
    <option>All Status</option>
    <option>Available</option>
    <option>Sold</option>
  </select>

  {/* Category, Condition, Sort — same pattern */}

  {/* Result count */}
  <span className="text-xs text-ink-muted ml-auto">
    {count} items
  </span>
</div>
```

### Step 6.3 — Inventory Table

**Visual design intent:** Not a traditional bordered table. Think editorial content list. Each row: generous `py-4`, items separated by a thin `border-b border-border-subtle`. No row hover background — instead, a subtle `→` appears or the row text shifts to `ink-primary`. Columns are defined by alignment and spacing alone, not borders.

Column layout (desktop):
```
[Photo 40px] [Name + Brand flex-1] [Category 100px] [Size 60px] [Condition 90px] [Cost 80px] [Sell Price 80px] [Profit 80px] [Status 90px] [Actions 40px]
```

On mobile: collapse to `[Photo] [Name+Status] [Profit]` + expand on tap.

```tsx
// Table header — small uppercase labels
<div className="grid grid-cols-[40px_1fr_100px_60px_80px_80px_80px_90px_40px]
                gap-4 px-0 py-3 text-xs text-ink-muted tracking-widest uppercase
                border-b border-border-subtle">
  <span></span>
  <span>Item</span>
  <span>Category</span>
  <span>Size</span>
  <span className="text-right">Cost</span>
  <span className="text-right">Price</span>
  <span className="text-right">Profit</span>
  <span>Status</span>
  <span></span>
</div>

// Each row
<div className="grid grid-cols-[40px_1fr_100px_60px_80px_80px_80px_90px_40px]
                gap-4 px-0 py-4 border-b border-border-subtle
                group hover:bg-canvas-surface transition-colors cursor-pointer"
     onClick={() => router.push(`/inventory/${item.id}`)}>

  {/* Thumbnail */}
  <div className="w-10 h-10 rounded-sm overflow-hidden bg-canvas-surface flex-shrink-0">
    {item.photo_url
      ? <img src={item.photo_url} className="w-full h-full object-cover" />
      : <div className="w-full h-full flex items-center justify-center text-ink-muted">
          <Shirt size={14} />
        </div>}
  </div>

  {/* Name + Brand */}
  <div>
    <p className="text-sm font-medium text-ink-primary leading-tight">{item.name}</p>
    <p className="text-xs text-ink-muted mt-0.5">{item.brand ?? '—'}</p>
  </div>

  <span className="text-sm text-ink-secondary self-center">{item.category ?? '—'}</span>
  <span className="text-sm text-ink-secondary self-center">{item.size ?? '—'}</span>

  {/* Prices — monospace */}
  <span className="font-mono text-sm text-ink-secondary text-right self-center">
    ₱{item.cost_price.toFixed(2)}
  </span>
  <span className="font-mono text-sm text-ink-primary text-right self-center">
    ₱{item.selling_price.toFixed(2)}
  </span>

  {/* Profit */}
  <ProfitCell item={item} />

  {/* Status badge */}
  <StatusBadge status={item.status} />

  {/* Actions menu */}
  <ActionsDropdown item={item} />
</div>
```

### Step 6.4 — Status Badge Component

```tsx
// src/components/ui/StatusBadge.tsx
// Not a pill — just colored text with a small dot prefix
const config = {
  Available: { dot: 'bg-status-available', text: 'text-status-available' },
  Sold:      { dot: 'bg-status-sold',      text: 'text-status-sold' },
  Archived:  { dot: 'bg-status-archived',  text: 'text-status-archived' },
}

<span className={cn("flex items-center gap-1.5 text-xs font-medium", config[status].text)}>
  <span className={cn("w-1.5 h-1.5 rounded-full", config[status].dot)} />
  {status}
</span>
```

### Step 6.5 — Profit Cell Component

```tsx
// src/components/inventory/ProfitCell.tsx
// Shows profit if sold, shows potential profit if available
function ProfitCell({ item }: { item: Item }) {
  if (item.status === 'Sold' && item.sale_price != null) {
    const profit = item.sale_price - item.cost_price
    return (
      <span className={cn(
        "font-mono text-sm text-right self-center",
        profit >= 0 ? "text-status-available" : "text-status-archived"
      )}>
        {profit >= 0 ? '+' : ''}₱{profit.toFixed(2)}
      </span>
    )
  }
  // Potential profit for available items
  const potential = item.selling_price - item.cost_price
  return (
    <span className="font-mono text-sm text-ink-muted text-right self-center">
      ₱{potential.toFixed(2)}
    </span>
  )
}
```

### Step 6.6 — Row Actions Dropdown

On each row, a `⋮` icon opens a `DropdownMenu` with: View, Edit, Mark as Sold (if Available) / Restore (if Sold), Delete. Keep the dropdown minimal — plain text items, no icons.

### Step 6.7 — Loading Skeleton

When `isLoading` is true, render 8 skeleton rows using `<Skeleton>` from shadcn, matching the grid columns of the real rows.

### Step 6.8 — Empty State

When no items match the filters:
```tsx
<div className="py-24 text-center">
  <p className="font-display text-2xl text-ink-muted mb-3">Nothing here yet.</p>
  <p className="text-sm text-ink-muted mb-8">Add your first item to get started.</p>
  <Link href="/inventory/new">
    <Button variant="outline">+ Add Item</Button>
  </Link>
</div>
```

---

## Phase 7 — Add / Edit Item Form

### Step 7.1 — Form Schema (Zod)

Create `src/lib/validations/item.ts`:
```ts
import { z } from 'zod'

export const itemSchema = z.object({
  name:          z.string().min(1, 'Item name is required'),
  brand:         z.string().optional(),
  size:          z.string().optional(),
  condition:     z.enum(['Good','Very Good','Excellent','Like New']).optional(),
  category:      z.enum(['Tops','Bottoms','Dresses','Outerwear','Shoes','Accessories','Others']).optional(),
  cost_price:    z.coerce.number().min(0, 'Cost must be 0 or more'),
  selling_price: z.coerce.number().min(0, 'Price must be 0 or more'),
  notes:         z.string().optional(),
})

export type ItemFormData = z.infer<typeof itemSchema>
```

### Step 7.2 — Form Page Design

Route: `/inventory/new` and `/inventory/[id]/edit`

**Visual design intent:** Two-column layout on desktop. Left column (`400px` fixed): large editorial headline ("Add a new piece." or "Edit item."), a short contextual note, and the photo upload zone. Right column: the form fields. No form wrapper box. Labels are small uppercase tracking-widest text above each input. Inputs: underline style only (no border-radius box inputs).

```tsx
<div className="max-w-5xl mx-auto py-12 grid lg:grid-cols-[380px_1fr] gap-16">
  {/* Left — Context */}
  <div className="lg:sticky lg:top-8 lg:self-start">
    <h1 className="font-display text-4xl leading-tight mb-4">
      Add a new<br />piece.
    </h1>
    <p className="text-ink-secondary text-sm max-w-xs mb-10">
      Fill in what you know. Brand, size, and condition help you find items faster later.
    </p>

    {/* Photo upload zone */}
    <PhotoUpload value={photoUrl} onChange={setPhotoUrl} />
  </div>

  {/* Right — Form fields */}
  <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
    <UnderlineField label="Item Name *" {...register('name')} error={errors.name} />
    <div className="grid grid-cols-2 gap-6">
      <UnderlineField label="Brand" {...register('brand')} />
      <UnderlineField label="Size" {...register('size')} />
    </div>
    <div className="grid grid-cols-2 gap-6">
      <UnderlineSelect label="Condition" options={CONDITIONS} {...register('condition')} />
      <UnderlineSelect label="Category" options={CATEGORIES} {...register('category')} />
    </div>
    <div className="grid grid-cols-2 gap-6">
      <UnderlineField label="Cost Price (₱) *" type="number" {...register('cost_price')} />
      <UnderlineField label="Selling Price (₱) *" type="number" {...register('selling_price')} />
    </div>
    <UnderlineField label="Notes" as="textarea" {...register('notes')} />

    {/* Profit preview */}
    <ProfitPreview cost={watch('cost_price')} price={watch('selling_price')} />

    <div className="flex gap-4 pt-4">
      <Button type="submit" className="bg-ink-primary text-canvas px-8">
        {isEditing ? 'Save changes' : 'Add to inventory'}
      </Button>
      <Button type="button" variant="ghost" onClick={() => router.back()}>
        Cancel
      </Button>
    </div>
  </form>
</div>
```

### Step 7.3 — Underline Input Component

Create `src/components/ui/UnderlineField.tsx` — reusable input that renders with bottom-border only styling:
```tsx
<div className="space-y-1.5">
  <label className="text-xs text-ink-muted tracking-widest uppercase">{label}</label>
  <input
    className="w-full bg-transparent border-b border-ink-secondary pb-2
               text-sm text-ink-primary placeholder:text-ink-muted
               focus:outline-none focus:border-ink-primary transition-colors"
    {...props}
  />
  {error && <p className="text-xs text-status-archived">{error.message}</p>}
</div>
```

### Step 7.4 — Live Profit Preview

A small inline section below the price fields:
```tsx
function ProfitPreview({ cost, price }: { cost: number, price: number }) {
  const profit = (price || 0) - (cost || 0)
  const margin = price > 0 ? (profit / price) * 100 : 0
  return (
    <div className="flex gap-8 py-4 border-t border-border-subtle">
      <div>
        <p className="text-xs text-ink-muted tracking-widest uppercase mb-1">Estimated Profit</p>
        <p className={cn("font-display text-2xl", profit >= 0 ? "text-status-available" : "text-status-archived")}>
          ₱{profit.toFixed(2)}
        </p>
      </div>
      <div>
        <p className="text-xs text-ink-muted tracking-widest uppercase mb-1">Margin</p>
        <p className="font-display text-2xl text-ink-primary">{margin.toFixed(1)}%</p>
      </div>
    </div>
  )
}
```

### Step 7.5 — Photo Upload Component

Create `src/components/inventory/PhotoUpload.tsx`:
- Drag-and-drop zone: `200px × 200px`, dashed border `border-2 border-dashed border-border-subtle`, center-aligned upload icon + "Drop photo here"
- On file select: show preview image, replace icon with the image
- On submit: upload to Supabase Storage via `uploadItemPhoto()`, store returned URL

### Step 7.6 — Mark as Sold Dialog

Triggered from the row actions dropdown. A minimal `Dialog` component:
- Title: "Mark as sold"
- Sale Price field (prefilled with `selling_price`, editable)
- Date Sold field (defaults to today)
- Confirm button: "Mark as sold"
- No big modal — small, centered, clean

---

## Phase 8 — Item Detail Page

Route: `/inventory/[id]`

**Visual design intent:** Clean article-like layout. Large item name as a headline. Photo (if present) on the right as a `320px × 320px` square, left-floated or right-floated editorial style. Details arranged in a definition list pattern — small label + value pairs. Profit displayed prominently below the prices. Action buttons (Edit, Mark as Sold, Archive) at the bottom of the left column as plain text links.

```tsx
<div className="max-w-4xl mx-auto py-12">
  {/* Breadcrumb */}
  <nav className="text-xs text-ink-muted mb-8">
    <Link href="/inventory" className="hover:text-ink-primary">Inventory</Link>
    <span className="mx-2">/</span>
    <span>{item.name}</span>
  </nav>

  <div className="grid lg:grid-cols-[1fr_320px] gap-16">
    {/* Left */}
    <div>
      <StatusBadge status={item.status} />
      <h1 className="font-display text-5xl mt-3 mb-1">{item.name}</h1>
      <p className="text-ink-secondary text-lg mb-10">{item.brand}</p>

      {/* Detail rows */}
      <dl className="space-y-5">
        {details.map(d => (
          <div key={d.label} className="flex border-b border-border-subtle pb-5">
            <dt className="w-32 text-xs text-ink-muted tracking-widest uppercase self-center">{d.label}</dt>
            <dd className="text-sm text-ink-primary">{d.value}</dd>
          </div>
        ))}
      </dl>

      {/* Profit */}
      <div className="mt-10 flex gap-12">
        <div>
          <p className="text-xs text-ink-muted tracking-widest uppercase mb-1">Cost</p>
          <p className="font-display text-3xl">₱{item.cost_price}</p>
        </div>
        <div>
          <p className="text-xs text-ink-muted tracking-widest uppercase mb-1">
            {item.status === 'Sold' ? 'Sold For' : 'Listed At'}
          </p>
          <p className="font-display text-3xl">
            ₱{item.status === 'Sold' ? item.sale_price : item.selling_price}
          </p>
        </div>
        <div>
          <p className="text-xs text-ink-muted tracking-widest uppercase mb-1">Profit</p>
          <p className={cn("font-display text-3xl", profit >= 0 ? "text-status-available" : "text-status-archived")}>
            {profit >= 0 ? '+' : ''}₱{profit.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-6 mt-10">
        <Link href={`/inventory/${item.id}/edit`} className="text-sm text-ink-secondary hover:text-ink-primary underline">
          Edit
        </Link>
        {item.status === 'Available' && (
          <button onClick={openSoldDialog} className="text-sm text-status-available hover:underline">
            Mark as sold
          </button>
        )}
        <button onClick={handleArchive} className="text-sm text-status-archived hover:underline">
          Archive
        </button>
      </div>
    </div>

    {/* Right — Photo */}
    <div className="w-full aspect-square rounded-sm overflow-hidden bg-canvas-surface">
      {item.photo_url
        ? <img src={item.photo_url} className="w-full h-full object-cover" />
        : <div className="w-full h-full flex items-center justify-center text-ink-muted">
            <ImageIcon size={32} />
          </div>}
    </div>
  </div>
</div>
```

---

## Phase 9 — CSV Export

### Step 9.1 — Export Function

Create `src/lib/export.ts`:
```ts
import Papa from 'papaparse'

export function exportItemsToCSV(items: Item[]) {
  const rows = items.map(item => ({
    'Name':          item.name,
    'Brand':         item.brand ?? '',
    'Size':          item.size ?? '',
    'Category':      item.category ?? '',
    'Condition':     item.condition ?? '',
    'Cost Price':    item.cost_price,
    'Selling Price': item.selling_price,
    'Sale Price':    item.sale_price ?? '',
    'Status':        item.status,
    'Date Sold':     item.date_sold ?? '',
    'Profit':        item.status === 'Sold' && item.sale_price != null
                       ? (item.sale_price - item.cost_price).toFixed(2)
                       : '',
    'Notes':         item.notes ?? '',
    'Date Added':    new Date(item.created_at).toLocaleDateString(),
  }))

  const csv = Papa.unparse(rows)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `inventory-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
```

### Step 9.2 — Export Button

Add to the inventory page header area: a plain text `Export CSV` button (no button styling — just a text link with a download icon). Calls `exportItemsToCSV(items)` with the currently filtered items.

---

## Phase 10 — Toast Notifications

### Step 10.1 — Setup Sonner

In `src/app/(app)/layout.tsx`:
```tsx
import { Toaster } from 'sonner'
// Add inside the layout:
<Toaster
  position="bottom-right"
  toastOptions={{
    style: {
      background: '#141413',
      color: '#FAFAF8',
      border: 'none',
      borderRadius: '2px',
      fontFamily: 'var(--font-body)',
      fontSize: '13px',
    },
  }}
/>
```

### Step 10.2 — Use Toast in Mutations

```ts
import { toast } from 'sonner'

// In mutation onSuccess:
toast.success('Item added to inventory.')
toast.success('Item marked as sold.')
toast.error('Something went wrong. Try again.')
```

---

## Phase 11 — Deployment

### Step 11.1 — Prepare for Production

1. Push code to GitHub (public or private repo)
2. Review `.env.local` — make sure it's in `.gitignore`
3. Run `npm run build` locally to catch type errors and build failures

### Step 11.2 — Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) → Add New Project
2. Import from GitHub, select the `thrift-ims` repository
3. Framework preset: **Next.js** (auto-detected)
4. Add Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click **Deploy**. First deploy takes ~2 minutes.

### Step 11.3 — Configure Supabase Auth Redirect URLs

In Supabase → Authentication → URL Configuration:
- Site URL: `https://your-app.vercel.app`
- Redirect URLs: `https://your-app.vercel.app/**`

### Step 11.4 — Create Your Account

1. Go to your deployed URL → `/login`
2. Use Supabase Dashboard → Authentication → Users → Invite User (or create via sign-up)
3. Log in, add your first item, verify the end-to-end flow

### Step 11.5 — Set Up Automatic Deploys

Vercel auto-deploys on every push to `main` by default. Use a `dev` or `feature/*` branch for development, merge to `main` when ready to deploy.

---

## Phase 12 — Polish & QA

### Step 12.1 — Mobile Responsiveness Audit

Test on 375px (iPhone SE), 390px (iPhone 14), 768px (iPad):
- Sidebar: becomes a bottom tab bar or a hamburger drawer on mobile
- Inventory table: collapses to a stacked card-like list on mobile (not a horizontal scroll)
- Forms: single column on mobile
- Dashboard stats: 2×3 grid on mobile instead of a single row

### Step 12.2 — Accessibility Checklist

- All form inputs have associated `<label>` elements
- Buttons have descriptive `aria-label` where icon-only
- Color is never the only way to convey information (status has both dot + text)
- Keyboard navigation works through the inventory table and forms
- Focus styles are visible (add `focus-visible:ring-2 ring-accent` globally)

### Step 12.3 — Performance Checklist

- Images: use Next.js `<Image>` component for optimized loading
- React Query: stale times set appropriately (30s for items, 60s for stats)
- Avoid fetching all items at once when inventory grows large — add Supabase `.range()` pagination (page size: 50)
- Lighthouse score target: Performance > 85, Accessibility > 90

### Step 12.4 — Final UX Review

Walk through each user story end-to-end:
- [ ] Add a new item with a photo → appears in inventory
- [ ] Edit the item → changes saved
- [ ] Mark it as sold → status updates, profit appears
- [ ] Dashboard stats reflect the sale
- [ ] Export CSV → file downloads with correct data
- [ ] Search for the item → found
- [ ] Archive the item → disappears from main list
- [ ] Log out → redirected to login
- [ ] Log back in → data still there

---

## File Structure Reference

```
thrift-ims/
├── src/
│   ├── app/
│   │   ├── (app)/
│   │   │   ├── layout.tsx              ← App shell, sidebar, topbar
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   └── inventory/
│   │   │       ├── page.tsx
│   │   │       ├── new/page.tsx
│   │   │       └── [id]/
│   │   │           ├── page.tsx
│   │   │           └── edit/page.tsx
│   │   ├── login/
│   │   │   ├── page.tsx
│   │   │   └── actions.ts
│   │   ├── globals.css
│   │   └── layout.tsx                  ← Root layout (fonts, providers)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── TopBar.tsx
│   │   │   └── PageShell.tsx
│   │   ├── inventory/
│   │   │   ├── InventoryTable.tsx
│   │   │   ├── InventoryRow.tsx
│   │   │   ├── FilterBar.tsx
│   │   │   ├── ItemForm.tsx
│   │   │   ├── PhotoUpload.tsx
│   │   │   ├── ProfitCell.tsx
│   │   │   ├── ProfitPreview.tsx
│   │   │   └── MarkAsSoldDialog.tsx
│   │   ├── dashboard/
│   │   │   ├── StatsRow.tsx
│   │   │   ├── SalesChart.tsx
│   │   │   └── CategoryBreakdown.tsx
│   │   └── ui/
│   │       ├── StatusBadge.tsx
│   │       ├── UnderlineField.tsx
│   │       └── UnderlineSelect.tsx
│   ├── hooks/
│   │   ├── useItems.ts
│   │   └── useItemStats.ts
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   └── server.ts
│   │   ├── items.ts
│   │   ├── export.ts
│   │   └── validations/
│   │       └── item.ts
│   └── types/
│       └── item.ts
├── middleware.ts
├── .env.local
├── tailwind.config.ts
└── next.config.ts
```

---

## Quick Reference — Key Commands

```bash
# Development
npm run dev

# Type check
npx tsc --noEmit

# Production build (run before deploying)
npm run build

# Lint
npm run lint
```

---

*Build plan version 1.0 — April 2026*  
*Follow phases in order. Each phase produces working, deployable code.*
