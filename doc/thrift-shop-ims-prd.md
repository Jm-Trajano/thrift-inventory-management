# Thrift Shop Inventory Management System — PRD

**Version:** 1.0  
**Date:** April 10, 2026  
**Stack:** Next.js · Supabase · Vercel  

---

## 1. Overview

A lightweight, web-based inventory management system built specifically for a thrift shop. The system allows the owner (or staff) to track items from intake to sale, monitor profitability, and get a real-time picture of shop performance — all from any device with a browser.

---

## 2. Problem Statement

Thrift shops deal with a high volume of diverse, one-of-a-kind items at low price points. Manual tracking (spreadsheets, pen and paper) creates blind spots: it's hard to know what's in stock, what's sold, what's earning profit, and what's just sitting. This system solves that with a purpose-built, easy-to-use digital inventory tool.

---

## 3. Goals

- Reduce time spent on manual inventory tracking
- Give the owner clear visibility into profitability per item and overall
- Make it easy for non-technical staff to add, update, and sell items
- Be accessible from any device (mobile-friendly)
- Keep infrastructure cost near zero (Vercel free tier + Supabase free tier)

---

## 4. Target Users

| User | Description |
|---|---|
| Shop Owner | Primary user. Needs full access to all features including analytics and settings. |
| Staff / Volunteer | Adds items, marks items as sold. Limited access to financial data (configurable). |

---

## 5. MVP Feature Set

These are the features to build and ship in v1.0.

### 5.1 Item Management

| # | Feature | Details |
|---|---|---|
| F-01 | **Add Item** | Form with: Item Name, Brand, Size, Condition (Good / Very Good / Excellent / Like New), Category (Tops / Bottoms / Dresses / Outerwear / Shoes / Accessories / Others), Cost Price (what shop paid), Selling Price (listed price), Notes (optional), Photo upload (optional) |
| F-02 | **Edit Item** | Update any field on an existing item |
| F-03 | **Delete Item** | Soft delete (mark as archived, not permanently removed) with confirmation prompt |
| F-04 | **Item Status Toggle** | Mark item as **Available** or **Sold**. When marked Sold, capture the actual Sale Price (defaults to Selling Price but can be adjusted for discounts) and Date Sold |
| F-05 | **Item Detail View** | Full detail page/modal for each item showing all fields, photo, and profit breakdown |

### 5.2 Inventory Browsing

| # | Feature | Details |
|---|---|---|
| F-06 | **Search** | Full-text search across Item Name, Brand, Notes |
| F-07 | **Filter** | Filter by: Status (Available / Sold / All), Category, Condition, Date Added range |
| F-08 | **Sort** | Sort by: Date Added, Selling Price, Profit, Name (A–Z) |
| F-09 | **Paginated Table / Grid View** | Toggle between table view and card/grid view. Show key info at a glance (name, brand, size, price, status) |

### 5.3 Financials & Profit

| # | Feature | Details |
|---|---|---|
| F-10 | **Automatic Profit Calculation** | Per item: `Profit = Sale Price − Cost Price`. Displayed on item card and detail view |
| F-11 | **Profit Margin %** | Per item: `Margin = (Profit / Sale Price) × 100` |
| F-12 | **Inventory Summary Dashboard** | Cards showing: Total Items, Available Items, Sold Items, Total Revenue (sum of all sale prices), Total Cost (sum of all cost prices), Total Profit, Average Profit Margin |
| F-13 | **Sales Over Time Chart** | Simple bar or line chart: number of items sold per week/month |
| F-14 | **Top Performing Categories** | Which category generates the most profit |

### 5.4 Data & Export

| # | Feature | Details |
|---|---|---|
| F-15 | **CSV Export** | Export current filtered view (or full inventory) as CSV |
| F-16 | **Restock / Reopen Item** | Change a Sold item back to Available (e.g., buyer backed out) |

### 5.5 Auth & Access

| # | Feature | Details |
|---|---|---|
| F-17 | **Authentication** | Email + password login via Supabase Auth. Single shop / single account for MVP |
| F-18 | **Protected Routes** | All inventory pages require login. Public pages: login only |

---

## 6. Out of Scope for MVP (Post-v1 Backlog)

- Multi-user roles with granular permissions
- Barcode / QR code scanning
- POS (Point of Sale) integration
- Customer-facing storefront or online shop sync
- Consignment tracking (items sold on behalf of third parties)
- Tax calculation / receipts
- Low-stock alerts / reorder reminders
- Bulk CSV import
- Mobile native app

---

## 7. Data Model

### `items` table

```sql
id              uuid          PRIMARY KEY DEFAULT gen_random_uuid()
created_at      timestamptz   DEFAULT now()
updated_at      timestamptz   DEFAULT now()
name            text          NOT NULL
brand           text
size            text
condition       text          -- 'Good' | 'Very Good' | 'Excellent' | 'Like New'
category        text          -- 'Tops' | 'Bottoms' | 'Dresses' | 'Outerwear' | 'Shoes' | 'Accessories' | 'Others'
cost_price      numeric(10,2) NOT NULL
selling_price   numeric(10,2) NOT NULL
sale_price      numeric(10,2)            -- actual price it sold for (may differ)
status          text          DEFAULT 'Available'  -- 'Available' | 'Sold' | 'Archived'
date_sold       date
notes           text
photo_url       text
user_id         uuid          REFERENCES auth.users(id)
```

### Derived / computed (no separate table needed)

```
profit        = sale_price - cost_price      (only when status = 'Sold')
margin_pct    = (profit / sale_price) * 100
```

---

## 8. Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Frontend | Next.js 14 (App Router) | SSR + client components, easy Vercel deploy |
| Styling | Tailwind CSS + shadcn/ui | Fast, accessible component library |
| Database | Supabase (PostgreSQL) | Free tier, built-in Auth, real-time, Storage for photos |
| Auth | Supabase Auth | Email/password, easy session management |
| File Storage | Supabase Storage | Item photo uploads |
| Charts | Recharts | Lightweight, React-native charting |
| Deployment | Vercel | Zero-config Next.js hosting |
| State | React Query (TanStack Query) | Server state management + caching |
| Forms | React Hook Form + Zod | Validation, type-safe schemas |

---

## 9. Pages & Routes

```
/                   → Redirect to /dashboard or /login
/login              → Login page
/dashboard          → Summary cards + charts
/inventory          → Full inventory table with search/filter/sort
/inventory/new      → Add new item form
/inventory/[id]     → Item detail view
/inventory/[id]/edit → Edit item form
/settings           → (Post-MVP) account/shop settings
```

---

## 10. UI/UX Requirements

- **Mobile-first responsive layout** — shop owner may be using a phone on the floor
- **Status badges** — clear color-coded chips: green = Available, gray = Sold, red = Archived
- **Inline profit display** — every item card shows profit/loss at a glance
- **Confirmation dialogs** — for delete and "mark as sold" actions
- **Toast notifications** — success/error feedback on all mutations
- **Loading skeletons** — for table and dashboard while data fetches
- **Empty states** — friendly message and CTA when no items match a filter

---

## 11. Supabase Setup Checklist

- [ ] Create project on supabase.com
- [ ] Run `items` table migration
- [ ] Enable Row Level Security (RLS): users can only see/edit their own items
- [ ] Create Storage bucket `item-photos` (public read, authenticated write)
- [ ] Copy `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Vercel env vars

---

## 12. Vercel Deployment Checklist

- [ ] Connect GitHub repo to Vercel
- [ ] Set environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Set `NEXTAUTH_URL` (or Supabase redirect URLs) to production domain
- [ ] Enable automatic deployments on `main` branch

---

## 13. Success Metrics (v1.0)

| Metric | Target |
|---|---|
| Time to add a new item | < 60 seconds |
| Dashboard load time | < 2 seconds |
| Mobile usability | Fully functional on 375px viewport |
| Uptime | 99%+ (Vercel + Supabase SLA) |

---

## 14. Development Phases

### Phase 1 — Foundation (Week 1–2)
- Project setup: Next.js + Tailwind + shadcn/ui + Supabase client
- Supabase schema + RLS policies
- Auth: login/logout flow
- Basic inventory CRUD (add, edit, delete, list)

### Phase 2 — Core Features (Week 3–4)
- Status toggle (Available → Sold) with sale price capture
- Search, filter, sort
- Profit calculation display per item
- Photo upload via Supabase Storage

### Phase 3 — Analytics & Polish (Week 5)
- Dashboard with summary cards
- Sales over time chart
- Category breakdown
- CSV export
- Mobile responsiveness pass
- Empty states, loading skeletons, toast notifications

### Phase 4 — Deploy & Test (Week 6)
- Deploy to Vercel
- End-to-end testing on real device
- Bug fixes and UX polish
- Soft launch

---

*Document owner: Shop Owner / Developer*  
*Next review: After Phase 2 completion*
