# Gentleman - Luxury E-Commerce

Full-stack luxury e-commerce website built with SvelteKit 5 and Supabase.

## Features

- **Modern UI**: Luxury black-on-white design with dark/light mode toggle
- **Multilingual**: French (default), English, and Arabic with RTL support
- **Product Catalog**: Browse perfumes, watches, and sunglasses with advanced filtering
- **Shopping Cart**: LocalStorage-based cart with coupon support
- **Checkout**: Complete order placement with Supabase backend
- **Admin Dashboard**: Full CRUD for products, brands, orders, and coupons
- **SEO Optimized**: Meta tags, sitemap, robots.txt, structured data
- **Responsive**: Mobile-first design with smooth animations

## Tech Stack

- **Frontend**: SvelteKit 5 (TypeScript)
- **Backend**: Supabase (PostgreSQL)
- **Styling**: Vanilla CSS (no frameworks)
- **Auth**: Supabase Auth
- **Storage**: Images stored as bytea in database

## Setup

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Configure environment variables**:
   - Copy `.env.example` to `.env`
   - Add your Supabase URL and anon key

3. **Set up Supabase**:
   - Run the SQL schema in `supabase-schema.sql` in your Supabase project
   - Enable authentication in Supabase dashboard

4. **Run development server**:
   ```bash
   pnpm dev
   ```

5. **Build for production**:
   ```bash
   pnpm build
   ```

## Project Structure

```
src/
├── lib/
│   ├── assets/          # Logo and static assets
│   ├── components/      # Reusable Svelte components
│   ├── i18n/           # Translations and language store
│   ├── stores/         # Svelte stores (cart, theme)
│   ├── styles/         # Global CSS
│   ├── types/          # TypeScript type definitions
│   └── supabase.ts     # Supabase client
├── routes/
│   ├── admin/          # Admin dashboard
│   ├── cart/           # Shopping cart
│   ├── checkout/       # Checkout flow
│   ├── products/       # Product catalog
│   └── +layout.svelte  # Main layout
└── app.html            # HTML template
```

## Database Schema

- **products**: Product catalog with images as bytea
- **brands**: Brand information with logos
- **orders**: Customer orders with status tracking
- **coupons**: Discount coupons with validation

## Admin Access

Navigate to `/admin/login` and use Supabase authentication credentials.

## License

Proprietary - All rights reserved
