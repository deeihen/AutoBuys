# AutoBuys

A beginner-friendly school project: Nuxt 3, JavaScript, plain CSS, Pinia and Supabase. Checkout saves a mock order. It never collects payment or ships products.

## Install

Install Node.js 22 or newer, then run in this folder:

```sh
npm install
```

On Windows PowerShell, use `npm.cmd` if execution policy blocks `npm.ps1`.

## Create the Supabase project

1. Create a project at https://supabase.com and wait for its database to start.
2. Open **SQL Editor**. Paste and run `supabase/schema.sql` once.
3. Paste and run `supabase/seed.sql`. This adds 12 sample products with PHP prices.
4. Find the project URL and **publishable** key (or legacy **anon** key) in the project Connect dialog/API settings. Never use a secret or service-role key in this app.
5. Copy `.env.example` to `.env`. Replace both placeholders:

```dotenv
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_KEY=YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY
```

`.env` is ignored by Git. The public key is intended for the browser; row-level security protects database access.

In **Authentication → URL Configuration**, set Site URL to `http://localhost:3000` while developing. Add `http://localhost:3000/login` to Redirect URLs. Keep email/password login enabled. Registration asks users to confirm their email when email confirmation is enabled. The form requires at least six password characters; Supabase may enforce a stronger password policy.

## Run

```sh
npm run dev
```

Open http://localhost:3000. Sign-up and login use Supabase email/password Auth. Guests can also check out.

```sh
npm test
npm run build
npm run preview
```

`npm test` checks saved cart validation, quantity limits, count, money totals and PHP formatting without extra dependencies.

## Deploy to Vercel

1. Push this project to your group's Git repository. Do not commit `.env` or real credentials.
2. Import the repository in Vercel and select the **Nuxt.js** framework preset.
3. Add `SUPABASE_URL` and `SUPABASE_KEY` under **Settings → Environment Variables** for the environments you use.
4. Use `npm run build` as the build command. Leave the preset's output settings unchanged. Nuxt automatically selects Vercel's Nitro deployment preset.
5. Deploy. In Supabase, change Site URL to your deployed HTTPS URL and add `https://YOUR_SITE.vercel.app/login` to Redirect URLs. Add preview URLs individually if you need authentication on previews.
6. Redeploy whenever environment variables change.

## How the app works

- `pages/` provides home, shop, product detail, cart, checkout, login, registration and order history routes.
- `components/` splits the approved markup into reusable header, footer, cards, filters, art and cart rows.
- `assets/css/main.css` contains the original CSS verbatim followed by styles for new pages. Fonts, faction colors, chamfered corners, spacing, focus states and transforming SVG art come from the approved HTML.
- `composables/useProducts.js` loads products with `useAsyncData`. Shop filters run on this small catalog in the browser.
- `stores/cart.js` provides add, remove, quantity, total and count. `plugins/cart.client.js` restores the cart after hydration and saves changes to localStorage. Saved data is validated. The cart is local to each browser, not an account cart.
- The theme button cycles system, light and dark. System follows `prefers-color-scheme`; explicit choices use `data-theme` and localStorage.
- Product photos use `image_url`. Empty or broken URLs show the approved abstract art. Sample art is not a real product photograph.
- `place_order` inserts an order and its items in one database transaction, attaches the authenticated user ID, reads database prices, and reduces stock. A failure rolls back everything and retains the cart. Confirmation uses the saved database total.
- A random checkout request ID prevents duplicate orders when retrying within the same checkout page. Keep guest receipt IDs private. Guest orders cannot be listed or read through table queries; the function returns only that request's ID and total.
- RLS allows everyone to read products and only authenticated owners to read their orders/items. Insert policies cover guests and users, but direct table writes are revoked: everyone inserts through `place_order`. This prevents clients from inventing totals or attaching items to another order. Do not loosen the grants.
- No update/delete policies are exposed to customers. Administrators manage products through SQL Editor.
- Guest orders do not appear after registration. Sign in before checkout to attach an order to your account.

The original dollar-based shipping claims, mock reviews and newsletter form were replaced with accurate school-demo content. Existing visual styling is retained. Sample prices and product details need review before real use.

## Manual checks with your Supabase project

1. Browse home/shop, filter factions/categories, search an absent term, and sort both price directions.
2. Open a product; add items, change quantities, remove items and reload. Confirm header count and localStorage persistence. A sold-out product cannot be added.
3. Submit guest checkout. Confirm one order and its items in SQL Editor, and an empty cart after success.
4. Register, confirm email, log in and place an order. Confirm it appears in Orders. Log out and sign in as another user to confirm it is hidden.
5. Try an out-of-stock checkout. Confirm the cart remains and no partial order is saved.
6. Inspect desktop, tablet and phone widths; tab through controls; check themes and reduced-motion settings.

No Supabase credentials are bundled. Live authentication, SQL execution and checkout require your project setup. This public school demo has no payment, email receipts, shipping, admin UI or anti-spam service.

Dependency audit on October 14, 2026 reported 14 transitive findings (12 high, 2 critical). A normal `npm audit fix` did not resolve them; the forced fix proposes a breaking Nuxt downgrade. DevTools is disabled. Review upstream patches before using this school demo as a real store.

Official setup references: [Nuxt Supabase](https://supabase.nuxtjs.org/getting-started/introduction), [Nuxt deployment](https://nuxt.com/deploy).

## Validation performed

- Three automated cart tests passed; all 16 Vue templates compiled.
- Standard production build and Nitro's Vercel build passed. Windows dependency tracing needed access beyond the execution sandbox.
- Browser checks used a temporary local mock Supabase endpoint: product detail, faction/category filters, empty search, ascending price sort, cart quantity, reload persistence, and guest checkout confirmation/clear-cart behavior passed.
- Home screenshots were checked at 390, 768 and 1280 pixel widths, including light and dark themes. Original CSS was verified unchanged.
- Live Supabase Auth, SQL/RLS execution, database checkout and Vercel deployment were not performed. Follow the manual checklist after configuring your project.
- Graphify was requested, but its CLI/Python runtime was unavailable in this environment. No knowledge graph was generated.
