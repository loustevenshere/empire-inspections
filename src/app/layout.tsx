import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { trackPageview } from "@/lib/analytics";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Empire Inspections — Electrical & Code Compliance",
  description:
    "Independent electrical inspections for contractors and builders. Fast scheduling, clear reports, and NEC-compliant guidance in Greater Albany.",
  metadataBase: new URL("https://example.com"), // replace after deploying
  openGraph: {
    title: "Empire Inspections",
    description:
      "Independent electrical inspections for contractors and builders.",
    url: "https://example.com",
    siteName: "Empire Inspections",
    type: "website",
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
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="font-semibold tracking-tight">Empire Inspections</Link>
            <nav className="hidden gap-6 md:flex">
              <Link href="/services">Services</Link>
              <Link href="/about">About</Link>
              <Link href="/contact">Contact</Link>
            </nav>
          </div>
        </header>
        <main className="min-h-[80svh]">{children}</main>
        <footer className="border-t bg-secondary/20">
          <div className="mx-auto max-w-6xl px-4 py-6 text-sm">
            <p className="font-medium">Empire Home Inspections</p>
            <p>123 Main St, Anytown, NY 12345</p>
            <p>
              <a href="tel:+15551234567" className="underline">(555) 123-4567</a> ·
              <a href="mailto:info@example.com" className="underline ml-1">info@example.com</a>
            </p>
            <p className="mt-2 text-muted-foreground">© {new Date().getFullYear()} Empire Inspections</p>
          </div>
        </footer>
        <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background p-2 md:hidden">
          <a
            href="tel:+15551234567"
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
