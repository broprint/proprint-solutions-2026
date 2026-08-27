# ProPrint Solutions 2026 Prototype

Management-ready Next.js prototype for the ProPrint Solutions 2026 digital platform.

## Main prototype routes

- `/` — Corporate homepage
- `/shop` — E-commerce catalog prototype
- `/products/[slug]` — Product detail pages
- `/cart` — Prototype cart / future Shopify checkout handoff
- `/service` — ProPrint Service Center with request submission
- `/amc` — Annual Maintenance Contracts
- `/enterprise` — Enterprise IT & Field Services
- `/quote` — Business, AMC and enterprise quotation workflow
- `/api/requests` — Service / quote request API

## Development workflow

Current catalog and request-workflow development is maintained on the `v7-real-catalog` branch and reviewed through Pull Request #2 before merging into `main`.

For local branch testing:

```bash
git fetch origin
git checkout v7-real-catalog
git pull origin v7-real-catalog
npm install
npm run dev
```

## Request delivery

The Service Center and Quote forms now submit through `/api/requests`, validate required data and generate references such as `PP-SRV-...` and `PP-QTE-...`.

For a production Vercel deployment, configure either a webhook or email delivery.

### Option A — generic webhook

Set:

```text
PROPRINT_REQUEST_WEBHOOK_URL=https://your-approved-endpoint.example/...
```

This can later point to an approved CRM, automation workflow or service desk endpoint.

### Option B — email through Resend

Set:

```text
RESEND_API_KEY=...
PROPRINT_REQUEST_EMAIL=service-or-sales-inbox@example.com
PROPRINT_FROM_EMAIL=ProPrint Website <website@your-verified-domain.example>
```

If neither option is configured, submissions run in clearly identified demo mode so the user journey and generated reference number can still be tested without pretending the request was delivered to ProPrint.

The production roadmap keeps the corporate website and service workflows under ProPrint while allowing the future store to connect to Shopify at `shop.proprintsolutions.net`.

## Notes

Product pricing and catalog data in this prototype are demonstration values only. Product photography should be manufacturer/distributor-approved or otherwise licensed for ProPrint use. Client/service-partner names should only be displayed publicly where branding permission is confirmed.
