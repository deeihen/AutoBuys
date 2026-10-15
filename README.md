# AutoBuys

School demo store for Transformers figures. React + Vite + Supabase. Checkout saves a mock order; no payment, no shipping.

## Run

Needs Node.js 20 or newer.

```sh
npm install
npm run dev
```

Open http://localhost:3000.

On Windows PowerShell, use `npm.cmd` if execution policy blocks `npm.ps1`.

## Supabase setup (once per project)

1. In Supabase **SQL Editor**, run `supabase/schema.sql`, then `supabase/seed.sql`.
2. Copy `.env.example` to `.env` and fill in the project URL and the **publishable/anon** key. Never use the service-role key.
3. In **Authentication → URL Configuration**, set Site URL to `http://localhost:3000` and add `http://localhost:3000/login` to Redirect URLs.

## Other commands

```sh
npm test         # cart logic tests, no extra dependencies
npm run build    # production build into dist/
npm run preview  # serve the build
```

## Where things are

- `src/pages/Home.jsx` — hero, faction tiles, shop with search, filters and sort.
- `src/pages/Auth.jsx` — login and register (same form).
- `src/pages/Orders.jsx` — signed-in user's order history.
- `src/components/CartDrawer.jsx` — cart, checkout and confirmation. Checkout calls the `place_order` database function, which re-reads prices and stock in one transaction.
- `src/store.jsx` — products, cart (saved in localStorage), signed-in user.
- `src/cart.js` — pure cart helpers, covered by `tests/cart.test.js`.
- `src/styles.css` — the reference HTML's CSS, plus a few page styles at the end.

## Product photos

Set `image_url` on a product row in Supabase. Empty or broken URLs show the abstract art.

## Deploy to Vercel

Import the repo, framework preset **Vite**. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_KEY` as environment variables. `vercel.json` already makes routes like `/orders` work on refresh. Then update Supabase Site URL and Redirect URLs to the deployed address.
