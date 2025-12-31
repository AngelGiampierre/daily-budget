# Expense Tracker

Personal expense tracking app with dynamic daily budget. Daily limit recalculates based on remaining budget divided by remaining days in the month.

## Features

- Simple password auth (localStorage)
- Quick expense entry with bank-style number input
- 8 default categories with icons
- Real-time budget projection (7-day forecast)
- Visual impact: see how today's spending affects future daily limits
- PWA ready
- Light/dark theme (Desert Mirage palette)

## Stack

Next.js 15 • TypeScript • Supabase • Tailwind • shadcn/ui • Recharts • next-pwa

## Setup

1. Create Supabase project and run `supabase-schema.sql`
2. Copy `.env.example` to `.env.local` and add credentials
3. `npm install && npm run dev`

## Supabase Schema

Database uses multi-user structure (currently single user: `user_id = 1`). Easy to extend for multiple users later.

## License

MIT
