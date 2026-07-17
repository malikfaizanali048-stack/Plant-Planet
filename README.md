# PlantPlanet (by Wah Green Nurseries)

Full-stack nursery e-commerce site. Next.js 14 (App Router) + MongoDB + NextAuth + Stripe + Cash on Delivery.

## 1. First-time setup

```bash
npm install
cp .env.local.example .env.local
```

Fill in `.env.local`:

| Variable | Where to get it |
|---|---|
| `MONGODB_URI` | Free cluster at mongodb.com/cloud/atlas — see step 2 |
| `NEXTAUTH_SECRET` | Run `openssl rand -base64 32` (or any random 32+ char string) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Pick your own — used by the seed script to create your admin login |
| `STRIPE_SECRET_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | dashboard.stripe.com (test mode keys) — see caveat below |

## 2. MongoDB Atlas (5 minutes)

1. mongodb.com/cloud/atlas/register → sign up free
2. Create a free **M0** cluster
3. **Database Access** → add a user + password
4. **Network Access** → add `0.0.0.0/0` (restrict this before real launch)
5. **Connect → Drivers** → copy the connection string, add `plantplanet` as the DB name:
   ```
   mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/plantplanet?retryWrites=true&w=majority
   ```

## 3. Seed sample data (plants + your admin login)

```bash
npm run seed
```
This creates 8 sample plants with real Unsplash images, and your admin account using the email/password from `.env.local`.

## 4. Run it

```bash
npm run dev
```
Visit **http://localhost:3000**. Log into the admin panel at **/admin/login** with the credentials from `.env.local`.

## 5. ⚠️ Important: Stripe + Pakistan

Stripe does not currently support merchant payouts for businesses registered in Pakistan — test-mode keys work fine for development, but you won't be able to receive real card payments through Stripe without a foreign business entity (e.g. via Stripe Atlas). For a Lahore-based nursery, consider swapping the `/api/checkout` route for a Pakistani gateway instead: **JazzCash**, **Easypaisa**, **PayFast**, or **Safepay** are the common local options. The checkout UI, order flow, and everything else works the same either way — only the payment-provider call inside `app/api/checkout/route.ts` and `components/cart/StripeCardForm.tsx` would need swapping.

**Cash on Delivery works fully today with no third-party setup** — for your 2-day launch, ship with COD only and add card payments after.

## 6. Deploy to Vercel

```bash
npm i -g vercel
vercel
```
Then in your Vercel project → **Settings → Environment Variables**, add every variable from `.env.local`, and redeploy. Set `NEXTAUTH_URL` to your live domain (e.g. `https://plantplanet.vercel.app`).

## 7. What's built

- **Home** — hero banner, shop-by-category, featured plants, garden-services CTA
- **Shop** (`/shop`) — search, category filter, price filter, product grid, loading skeletons
- **Product detail** (`/shop/[slug]`) — image, price/discount, add to cart with quantity
- **Cart** (`/cart`) — quantity controls, live total, free delivery threshold
- **Checkout** (`/checkout`) — delivery form, Cash on Delivery or Stripe card, Rs. 500 delivery charge under Rs. 5000
- **Hot Deals** (`/hot-deals`) — discounted products only
- **Garden Services** (`/garden-services`) — 3 service types, quote form, consultant booking, photo upload with mock design suggestion, 4-step process, yearly plan checkbox
- **About Us** (`/about`) — hero, story, mission, vision, why-choose-us
- **Admin panel** (`/admin/login`) — secured with NextAuth, product CRUD with image upload, order list + status updates, service request list
- Sticky header, scrolling free-delivery announcement bar, full footer with your contact info

## 8. Known simplifications (fine for a 2-day MVP, worth revisiting later)

- Product images are stored as base64 in MongoDB (no Cloudinary/S3) — fine for a small catalog, migrate if you add hundreds of products with large images.
- The "AI design suggestion" on the Garden Services page is a mock (randomly picks from a few sample ideas) — swap in a real vision-model API call later if you want.
- No customer-facing accounts/order history yet — only admin login exists. Customers currently check out as guests.
