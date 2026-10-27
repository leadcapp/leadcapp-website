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

## Analytics and ad tracking

Tracking is on by default with LeadCapp's own IDs, built into `lib/analytics.ts`:

| Tool | ID | What it's for |
|---|---|---|
| Google Analytics 4 | `G-B2JM70KHJ8` | Visitors, sources, events, conversions |
| Meta Pixel | `1328622259276746` | Instagram/Facebook ad tracking and optimisation |
| Microsoft Clarity | `z43opatrgz` | Heatmaps, scroll maps and session recordings |

To use a different ID, set `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_META_PIXEL_ID` or `NEXT_PUBLIC_CLARITY_ID` in Vercel → Settings → Environment Variables and redeploy. Set one to `off` to switch that tool off. Every event below is also sent to Clarity, so you can filter recordings by it (for example, sessions with `booking_abandon`).

All tracking code is in `lib/analytics.ts` and `components/Analytics.tsx`.

### Events sent

| Event | When it fires | Useful details |
|---|---|---|
| `page_view` | Every page visit (automatic) | page, source |
| `scroll_depth` | At 25, 50, 75, 90, 100% of a page | percent |
| `scrolled_to_bottom` | Reached the very end of a page | page |
| `section_view` | A section reaches the middle of the screen | questions, work, pricing, flow, services, contact |
| `engaged_time` | Still on the page after 30s, 60s, 3 min | seconds |
| `booking_open` | Clicked any "Let's Build / Book a call" button | location: nav, hero, status_pill, package_mvp, package_growth, package_scale, contact_section, case_study_… |
| `booking_date_select` | Picked a date | weekday |
| `booking_time_select` | Picked a time slot | weekday, hour |
| `booking_form_start` | Started typing their details | location |
| `booking_form_error` | Tried to submit with a missing name/email | field |
| `booking_abandon` | Closed the pop-up without finishing | step: choosing_time / filling_details |
| `generate_lead` | Submitted a booking (the main conversion) | project, budget, call_on, source, method |
| `booking_whatsapp_click` | Tapped the WhatsApp button after booking | sent |
| `project_click`, `project_view` | Opened a case study | project |
| `projects_carousel` | Used the project arrows | direction |
| `instagram_click`, `figma_click`, `email_click`, `whatsapp_click` | Outbound clicks | location |
| `see_how_we_build_click` | Hero secondary button | |

Meta receives `PageView`, `InitiateCheckout` (booking opened), `Lead` (booking sent), `ViewContent` (case study), `Contact` (WhatsApp), plus `scrolled_to_bottom`, `booking_time_select`, `booking_form_start` and `engaged_time`.

### Where each lead came from

The first ad/source a visitor arrived from (`utm_source`, `utm_medium`, `utm_campaign`, `gclid`, `fbclid`, referrer) is remembered in the browser and added to every booking email as **Came from**. Always add UTM tags to ad links, for example:

```
https://www.leadcapp.com/?utm_source=instagram&utm_medium=paid_social&utm_campaign=oct_launch
```
