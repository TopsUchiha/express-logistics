# Backend setup

## 1. Database (Neon)
1. Create a free project at neon.tech and copy the connection string into `DATABASE_URL`.
2. Tables are created automatically on the first request. There is nothing to migrate.

## 2. Environment variables
Copy `.env.example` to `.env.local` for local work. On Vercel add the same names under Project → Settings → Environment Variables.
- `DATABASE_URL`, `ADMIN_PATH`, `ADMIN_SETUP_KEY` are required.
- `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` turns on the tracking map.
- `RESEND_API_KEY`, `MAIL_FROM`, `ADMIN_NOTIFY_EMAIL` turn on email alerts. Resend only sends to other people once you verify a domain.

## 3. First run
```
pnpm install
pnpm dev
```
Open `http://localhost:3000/<ADMIN_PATH>` (locally, if `ADMIN_PATH` is empty, the panel is at `/logistix/control/panel`).
When `pnpm dev` starts, the terminal prints `[admin] panel is at /<your path>`. If it says the panel is OFF, `ADMIN_PATH` was not read (save `.env.local`, then fully stop and restart the server).
The first visit asks for the setup key, an email and a password of 12+ characters. That creates the admin account.

## 4. Day to day
1. **Shipments → New shipment.** Enter sender and receiver (add at least one email, because that email is the chat password), origin and destination as `City, Country`, and the packages. Save, then open **Receipt** to print it. The receipt carries the tracking number.
2. **Add an update** on the shipment page whenever it moves. The public tracking page and map follow it.
3. **Chats.** A customer opens the chat, enters the tracking number, then the email on file. Their messages appear under **Chats**. Reply there.
4. **Enquiries** holds messages from the contact form.

## Notes
- Built for Vercel. It trusts `x-real-ip` / `x-forwarded-for` for rate limiting, which Vercel sets itself. Behind another proxy, check `clientIp` in `lib/security.ts`.
- Place names are looked up on OpenStreetMap Nominatim (fair-use limits apply, which is plenty for admin use).
- To sign everyone out, delete the rows in `admin_sessions`.
