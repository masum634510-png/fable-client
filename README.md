# Fable Ebook Sharing Platform - Client

This is the Next.js frontend for the Fable Ebook Sharing Platform.

## Live URL
[https://fable-client-eight-delta.vercel.app](https://fable-client-eight-delta.vercel.app)

## Purpose
Fable connects ebook lovers with writers in a premium, modern digital platform.

## Key Features
- **Modern UI**: Built with Next.js, Framer Motion, and a custom CSS variable design system avoiding generic templates.
- **Dark Mode**: Fully supports Light/Dark theme toggling using next-themes.
- **Authentication**: JWT based AuthContext, role-based dashboards.
- **Browsing**: Search, Filter by Genre, Price Range, and Pagination.
- **Payments**: Integrated with Stripe Checkout.
- **Dashboards**: Separate dashboards for Users (readers), Writers (publishers), and Admins.

## Packages Used
- next (16.2.9)
- react (19.2.4)
- react-dom (19.2.4)
- framer-motion (12.40.0)
- next-themes (0.4.6)
- @heroui/react
- tailwindcss
- postcss
- autoprefixer

## Setup
1. `npm install`
2. Configure `.env.local` with `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_IMGBB_API_KEY`.
3. `npm run dev`