# ProPrint Solutions 2026 Prototype

Management-ready Next.js prototype for the ProPrint Solutions 2026 digital platform.

## Main prototype routes

- `/` — Corporate homepage
- `/shop` — E-commerce catalog prototype
- `/products/[slug]` — Product detail pages
- `/cart` — Prototype cart / future Shopify checkout handoff
- `/service` — ProPrint Service Center
- `/amc` — Annual Maintenance Contracts
- `/enterprise` — Enterprise IT & Field Services
- `/quote` — Business, AMC and enterprise quotation workflow

## Development workflow

The current V6 work is maintained on the `v6-ecommerce` branch and reviewed through Pull Request #1 before merging into `main`.

For local branch testing:

```bash
git fetch origin
git checkout v6-ecommerce
git pull origin v6-ecommerce
npm install
npm run dev
```

The production roadmap keeps the corporate website and service workflows under ProPrint while allowing the future store to connect to Shopify at `shop.proprintsolutions.net`.

## Notes

Product pricing and catalog data in this prototype are demonstration values only. Client/service-partner names should only be displayed publicly where branding permission is confirmed.
