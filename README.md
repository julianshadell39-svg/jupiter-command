# jupiter-command

Donation website MVP for **AROHM Foundation**.

## What is included

- Donation goal and audience definition (cause, donor types, supported regions/currencies)
- MVP pages:
  - Home
  - About Cause
  - Donate
  - Impact/Updates
  - Contact
  - FAQ
- Multi-step donation flow:
  - Amount selection
  - Donor information
  - Payment provider selection (Stripe/PayPal placeholders)
  - Confirmation and receipt message
- Trust essentials:
  - Transparent fund usage split
  - Organization details
  - Privacy policy and terms
  - Secure payment indicators
- Admin basics:
  - Donation records table
  - CSV export
  - Campaign metrics (conversion, average donation, recurring rate, funnel drop-off)
  - Publish impact updates
- Mobile-first responsive layout with semantic and accessible HTML structure

## Running locally

Open `/home/runner/work/jupiter-command/jupiter-command/index.html` in a browser.

## Notes

- Data is stored in browser `localStorage` for MVP/demo purposes.
- Payment links are configured in `/home/runner/work/jupiter-command/jupiter-command/script.js` (`PAYMENT_LINKS`) and can be replaced with real checkout URLs.
