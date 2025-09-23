import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { trackPageview } from "@/lib/analytics";
import Script from "next/script";
import Image from "next/image";
import { BUSINESS_PHONE, toTelHref } from "@/config/contact";
import MobileNavigation from "@/components/MobileNavigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Empire Inspection Agency — Electrical Inspections, Philadelphia PA",
  description:
    "Independent electrical inspections for contractors and builders in Philadelphia. Fast scheduling, clear reports, and NEC-compliant guidance.",
  metadataBase: new URL("https://example.com"), // replace after deploying
  icons: {
    icon: "/website-images/empireinspectionlogo.webp",
    apple: "/website-images/empireinspectionlogo.webp",
  },
  openGraph: {
    title: "Empire Inspection Agency",
    description:
      "Independent electrical inspections for contractors and builders in Philadelphia.",
    url: "https://example.com",
    siteName: "Empire Inspection Agency",
    type: "website",
    images: [
      {
        url: "/website-images/empireinspectionlogo.webp",
        width: 1200,
        height: 630,
        alt: "Empire Inspection Agency Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/website-images/empireinspectionlogo.webp"],
  },
  other: {
    "msapplication-TileImage": "/website-images/empireinspectionlogo.webp",
    "msapplication-TileColor": "#ffffff",
  },
  robots: { index: true, follow: true },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <head>
        {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ? (
          <Script
            defer
            data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
            src="https://plausible.io/js/script.js"
          />
        ) : null}
        <Script id="org-jsonld" type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Empire Inspection Agency",
            "telephone": `+1${BUSINESS_PHONE.replace(/\D/g, "")}`,
            "contactPoint": [
              {
                "@type": "ContactPoint",
                "contactType": "customer support",
                "telephone": `+1${BUSINESS_PHONE.replace(/\D/g, "")}`,
                "areaServed": "US"
              }
            ]
          })}
        </Script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-3">
              <Image 
                src="/website-images/logo-empire.jpeg" 
                alt="Empire Electrical Solutions" 
                width={140} 
                height={48} 
                priority 
                className="h-8 sm:h-10 w-auto"
              />
              <span className="font-semibold tracking-tight">Empire Inspection Agency</span>
            </Link>
            <nav className="hidden gap-6 md:flex">
              <Link href="/services">Services</Link>
              <Link href="/about">About</Link>
              <Link href="/pay">Pay</Link>
              <Link href="/contact">Contact</Link>
            </nav>
            <MobileNavigation />
          </div>
        </header>
        <main className="min-h-[80svh]">{children}</main>
        <footer className="border-t bg-secondary/20">
          <div className="mx-auto max-w-6xl px-4 py-6 text-sm">
            <p className="font-medium">Empire Inspection Agency</p>
            <p>6901 Germantown Avenue, Suite 200, Philadelphia, PA 19119</p>
        <div className="space-y-1 text-sm">
          <div>
            <a
              href={toTelHref(BUSINESS_PHONE)}
              aria-label={`Call Empire Inspection Agency at ${BUSINESS_PHONE}`}
              className="underline underline-offset-4 font-semibold"
            >
              {BUSINESS_PHONE}
            </a>
          </div>
        </div>
            <p className="mt-2">
              <a href="mailto:info@empireinspectionagency.com" className="underline">info@empireinspectionagency.com</a>
            </p>
            <p className="mt-2 text-muted-foreground">© {new Date().getFullYear()} Empire Inspection Agency</p>
          </div>
        </footer>
        <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background p-2 md:hidden">
          <a
            href={toTelHref(BUSINESS_PHONE)}
            aria-label={`Call Empire Inspection Agency at ${BUSINESS_PHONE}`}
            className="block rounded-md bg-primary px-4 py-3 text-center font-semibold text-primary-foreground"
          >
            Call Now
          </a>
        </div>
        <Script id="pageview" strategy="afterInteractive">
          {`window.addEventListener('load',function(){(${trackPageview.toString()})()})`}
        </Script>
      </body>
    </html>
  );
}
