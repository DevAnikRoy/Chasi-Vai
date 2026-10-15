# Chashi Vai

Bengali homepage built with Next.js App Router, React, TypeScript, Tailwind CSS v4 and self-hosted Noto Sans Bengali.

## Local development

Run `npm install` then `npm run dev`. Open http://localhost:3000.

In VS Code, use **Shift+Alt+F** to format the current file. The workspace recommends the Prettier extension and formats files on save. You can also format all source files with `npm run format`.

## Checks

- `npm run lint`
- `npm run format:check`
- `npm run build`
- `npm audit --omit=dev`

## Current scope

Responsive homepage, product search/category filters, accessible native product dialog, YouTube channel links. No checkout, authentication, payment processing, database or customer data collection has been added.

## Before launch

- Supply verified business phone, WhatsApp, address and delivery/payment policies.
- Verify product names, packaging, descriptions and permissions with the owner.
- Replace the AI-generated illustrative pond photograph with an authentic business photograph when available.
- Search indexing is disabled in metadata until launch.
- CSP permits inline scripts for the current static Next.js rendering. Add a per-request nonce policy if adding authentication/checkout; review payment provider origins and all server-side authorization and input validation at that stage.
- Production dependency audit passed with zero reported vulnerabilities on 2026-10-15. Full audit reports five high development-tool findings in the eslint-config-next / fast-glob / micromatch / braces dependency chain. Latest braces was 3.0.3 with no patched registry release available at setup; do not force-downgrade Next.js to silence this. Review updates before launch.

## Assets

Product images and logo supplied by the owner. Pond image AI-generated for this prototype. Noto Sans Bengali uses SIL OFL; license is in public/fonts/OFL.txt.

## Expansion

Extract the product data from src/app/page.tsx to a typed catalog module and connect a CMS/database when catalog pages are added. Commerce requires trusted server-side pricing, inventory validation, order storage, secure admin access and verified payment webhooks.
