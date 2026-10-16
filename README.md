# LeadCapp website

The LeadCapp agency site, built with Next.js 15 (App Router), React 19 and TypeScript.

## Run it locally

You need Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Edit the content

Almost everything you'll want to change is in **`lib/data.ts`**:

| What | Where in `lib/data.ts` |
|---|---|
| Email, phone, WhatsApp number, Instagram | `site` |
| Booking hours, days ahead, closed days | `booking` |
| Projects and their case study pages | `projects` |
| Questions section | `faqs` |
| Package prices | `packages` |
| "How we work" steps | `flow` |

To add a project, add an entry to `projects` and put its screenshots in `public/work/`. Its page at `/work/<slug>` is created automatically.

Styles are in `app/globals.css`. Components are in `components/`.

## Booking emails

When a visitor books a call, `app/api/book/route.ts` emails the booking to you and sends the visitor a confirmation. It uses Gmail.

1. Turn on 2-Step Verification for leadcapp@gmail.com.
2. Go to Google Account → Security → **App passwords**, create one for "Mail", and copy the 16-character password.
3. Copy `.env.example` to `.env.local` and fill in:
   ```
   SMTP_USER=leadcapp@gmail.com
   SMTP_PASS=your 16-character app password
   BOOKING_TO=leadcapp@gmail.com
   ```
4. Restart `npm run dev`.

If these aren't set, the booking pop-up still works and ends with a "Send on WhatsApp" button instead.

## Put it live on Vercel (free)

1. Push this folder to a GitHub repository.
2. On vercel.com, click **Add New → Project** and import the repository. Keep the default settings.
3. In the project's **Settings → Environment Variables**, add `SMTP_USER`, `SMTP_PASS` and `BOOKING_TO`.
4. Click **Deploy**.
5. To use leadcapp.com, go to **Settings → Domains**, add it and follow the DNS steps shown.

## Pages

- `/` home page
- `/work/cravitty`, `/work/purvaj`, `/work/quick-supermarket` case studies
- `/api/book` booking endpoint (POST)
