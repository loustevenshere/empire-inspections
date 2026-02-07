# Empire Inspections — Code Review

## Project Overview

Empire Inspection Agency is a professional website for a licensed electrical inspection company based in Philadelphia, PA. The application allows contractors and builders to schedule electrical inspections online and pay for services through multiple payment methods.

**Business Details:**
- Company: Empire Inspection Agency
- Location: 6901 Germantown Avenue, Suite 200, Philadelphia, PA 19119
- Phone: (215) 839-8997
- License: PA License #A000501
- Services: Residential and commercial electrical inspections

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15.5.2 (App Router) |
| UI Library | React 19.1.0 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 with OKLch color system |
| Components | Radix UI (Accordion, Dialog, Button, Label) |
| Forms | React Hook Form + Zod validation |
| Icons | Lucide React |
| Analytics | Plausible (optional, privacy-focused) |
| Serverless | AWS Lambda (Node.js 20) |
| Email | AWS SES v2 |
| Hosting | AWS Amplify |
| CI/CD | GitHub Actions |

---

## Directory Structure

```
empire-inspections/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── (marketing)/            # Route group for marketing pages
│   │   │   ├── about/              # About page with credentials
│   │   │   ├── services/           # Services list and FAQ accordion
│   │   │   └── contact/            # Inspection request form
│   │   ├── api/contact/            # POST endpoint for form submissions
│   │   ├── pay/                    # Payment methods page
│   │   ├── layout.tsx              # Root layout (header, footer, nav)
│   │   ├── page.tsx                # Homepage
│   │   ├── globals.css             # Theme colors and base styles
│   │   ├── robots.ts               # SEO robots.txt generation
│   │   └── sitemap.ts              # SEO sitemap generation
│   ├── components/
│   │   ├── ui/                     # Radix UI wrapper components
│   │   ├── BadgeRow.tsx            # Trust badges (experience, license)
│   │   ├── MobileNavigation.tsx    # Hamburger menu trigger
│   │   └── MobileMenuDrawer.tsx    # Slide-in mobile nav drawer
│   ├── config/
│   │   └── contact.ts              # Business phone number config
│   └── lib/
│       ├── validation.ts           # Zod schemas and inspection types
│       ├── rateLimit.ts            # Token bucket rate limiter
│       ├── analytics.ts            # Plausible analytics wrapper
│       ├── phone.ts                # Phone formatting utilities
│       ├── utils.ts                # Tailwind class merge helper
│       └── payment-examples.ts     # Payment deep link helpers
├── aws/
│   ├── lambda/
│   │   ├── src/index.mjs           # Lambda handler (email sending)
│   │   ├── package.json            # Lambda dependencies
│   │   └── deploy/                 # Manual deployment script
│   ├── scripts/                    # Legacy AWS CLI scripts
│   └── terraform/                  # Infrastructure as code (in progress)
├── public/
│   ├── website-images/             # Product and hero images
│   ├── badges/                     # Trust badge images
│   └── payment-badges/             # Payment method logos
├── .github/workflows/
│   └── deploy-lambda.yml           # CI/CD for Lambda deployment
├── amplify.yml                     # AWS Amplify build configuration
├── next.config.ts                  # Next.js settings (image formats, bundle optimization)
└── package.json                    # Frontend dependencies and scripts
```

---

## Pages & Routes

### `/` — Homepage
The landing page presents the company's value proposition with a full-width hero section, three benefit cards (code reviews, punch lists, fast scheduling), a services overview, and information about staff experience.

### `/services` — Services & FAQs
Lists all systems covered by inspections (residential additions, commercial projects, solar installations, pools, low voltage, utility services) and an accordion with 10 frequently asked questions.

### `/about` — About
Displays company credentials (20+ years experience, PA License #A000501), service area (Philadelphia and surrounding municipalities), and trust badges.

### `/contact` — Inspection Request Form
A client-side form built with React Hook Form and validated by Zod. Fields include:
- Name, Company (optional), Phone, Email
- Job address (street, city, state dropdown, ZIP)
- Inspection type: Rough, Final, Above Ceiling, Service, Re Intro, Pool, PA Pool
- Requested service date (date picker, minimum = today)
- Notes (optional, max 2000 characters)
- Hidden honeypot field for bot detection

On submit the form POSTs to `/api/contact`. The page shows loading, success, and error states.

### `/pay` — Payment Options
Offers multiple payment methods with platform-aware behavior:
- **Venmo** — Deep links to the Venmo app on mobile, falls back to the web URL on desktop
- **Cash App** — Same deep-link-to-fallback pattern
- **Credit/Debit Cards** — Visa, Mastercard, Amex, Discover (requires phone call)
- **Zelle** — Requires phone call

Includes copy-to-clipboard buttons for payment handles and detects mobile, iOS, and in-app browser environments to choose the best link strategy.

---

## Contact Form Flow

The form submission follows a multi-step pipeline:

```
User fills form
      │
      ▼
Client-side validation (Zod schema via React Hook Form)
      │
      ▼
POST /api/contact (Next.js API route)
      │
      ├── Validates body against Zod schema again
      ├── Checks honeypot field (_hp) — if filled, returns silent success
      ├── Rate limits by IP (5 requests per 10 minutes)
      ├── Composes full job address from structured fields
      ├── Signs request body with HMAC-SHA256 (if CONTACT_SHARED_SECRET is set)
      │
      ▼
Forwards to AWS Lambda (CONTACT_API_URL)
      │
      ├── Verifies HMAC signature
      ├── Validates CORS origin
      ├── Renders HTML and plain-text email templates
      │
      ▼
AWS SES sends two emails:
      ├── Office notification → office inbox with full request details
      └── User confirmation → customer email with acknowledgment
```

In development mode (`ENVIRONMENT=DEV`), the API route returns a mock success response without calling Lambda.

---

## AWS Lambda — `empire-contact-sender`

Located at `aws/lambda/src/index.mjs`, this Node.js 20 function handles:

1. **CORS** — Validates requests against `ALLOWED_ORIGIN`
2. **Signature verification** — Compares HMAC-SHA256 signatures using timing-safe comparison
3. **Request parsing** — Handles API Gateway v1/v2 formats and base64-encoded bodies
4. **Email rendering** — Generates both HTML and plain-text versions of two emails:
   - **Office email**: Contains all form fields, sets Reply-To to the customer's email
   - **User confirmation**: Personalized acknowledgment with business hours and contact info
5. **HTML escaping** — All user input is escaped before insertion into HTML templates
6. **Structured logging** — JSON-formatted logs with request IDs for CloudWatch
7. **Email tagging** — Tags messages with `app`, `type`, and `requestedDate` for SES tracking

The confirmation email is sent non-blocking — if it fails, the main request still succeeds.

---

## Security

| Measure | Implementation |
|---------|----------------|
| Input validation | Zod schemas enforce field types, lengths, and formats on both client and server |
| Rate limiting | Token bucket algorithm — 5 requests per IP per 10-minute window (in-memory) |
| Request signing | HMAC-SHA256 signature added by API route, verified by Lambda with timing-safe comparison |
| CORS | Lambda validates `Origin` header against `ALLOWED_ORIGIN` |
| Spam prevention | Honeypot field (`_hp`) — bots that fill it get a silent success response |
| XSS prevention | All user input is HTML-escaped in email templates |
| Secret management | No secrets in code — injected via Amplify env vars and GitHub Secrets |

---

## Deployment

### Frontend — AWS Amplify

Configured in `amplify.yml`:
1. **Pre-build**: `npm ci`, TypeScript type checking, ESLint
2. **Build**: Injects environment variables into `.env.production`, runs `npm run build`
3. **Artifacts**: `.next` directory
4. **Cache**: `node_modules` and `.next/cache`

### Lambda — GitHub Actions

Configured in `.github/workflows/deploy-lambda.yml`:
- **Trigger**: Push to `main` with changes in `aws/lambda/**`, or manual dispatch
- **Test job**: Installs dependencies, runs linter and tests
- **Deploy job** (main branch only): Packages the function as a zip, updates Lambda code and environment variables via AWS CLI, configures the function URL and CORS

### Environment Variables

**Frontend** (injected by Amplify):
- `CONTACT_API_URL` — Lambda endpoint
- `CONTACT_SHARED_SECRET` — HMAC signing key
- `ENVIRONMENT` — DEV or PROD
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` — Analytics domain (optional)

**Lambda** (injected by GitHub Secrets):
- `FROM_OFFICE` / `FROM_USER` — SES sender addresses
- `TO_EMAIL_DEV` — Office inbox recipient
- `ALLOWED_ORIGIN` — CORS origin
- `SHARED_SECRET` — HMAC verification key
- `CONFIGURATION_SET` / `RETURN_PATH` — SES delivery config

---

## Architecture Diagram

```
┌──────────────────────────────────────────────────────────┐
│                      User's Browser                      │
│                                                          │
│   Contact Form ──► Client Validation (Zod + RHF)        │
│        │                                                 │
│        ▼                                                 │
│   POST /api/contact                                      │
└────────┬─────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────┐
│              Next.js API Route (Amplify)                  │
│                                                          │
│   Zod validation → Rate limit → Honeypot check          │
│   → Address composition → HMAC signing                   │
│        │                                                 │
│        ▼                                                 │
│   Forward to Lambda                                      │
└────────┬─────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────┐
│           AWS Lambda (empire-contact-sender)              │
│                                                          │
│   CORS check → Signature verify → Parse body            │
│   → Render email templates → Send via SES               │
│        │                          │                      │
│        ▼                          ▼                      │
│   Office Email              User Confirmation            │
│   (request details)         (acknowledgment)             │
└──────────────────────────────────────────────────────────┘

Deployment:
  Frontend ──► AWS Amplify (auto-deploy from main)
  Lambda   ──► GitHub Actions → AWS CLI update
```
