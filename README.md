This is a Next.js 14 (App Router) + TypeScript project for Empire Home Inspections.

## Getting Started

Quick start

1. Create `.env.local` and add the following environment variables:
   ```bash
   # Contact Form Proxy Configuration
   CONTACT_API_URL="https://<apiId>.execute-api.us-east-1.amazonaws.com/prod/contact"
   CONTACT_SHARED_SECRET="<optional-strong-random-string>"
   ```
2. Install deps: `npm install`
3. Run dev server: `npm run dev`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Notes

- Plausible only loads if `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is set.
- Contact API uses DEV MODE if `CONTACT_API_URL` is not set and will not block local dev.
- AWS credentials and email configuration are now handled by the Lambda function, not the web app.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
