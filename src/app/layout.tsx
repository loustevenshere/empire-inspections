import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { trackPageview } from "@/lib/analytics";
import Script from "next/script";
import Image from "next/image";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Empire Electrical Solutions — Electrical Inspections, Philadelphia PA",
  description:
    "Independent electrical inspections for contractors and builders in Philadelphia. Fast scheduling, clear reports, and NEC-compliant guidance.",
  metadataBase: new URL("https://example.com"), // replace after deploying
  openGraph: {
    title: "Empire Electrical Solutions",
    description:
      "Independent electrical inspections for contractors and builders in Philadelphia.",
    url: "https://example.com",
    siteName: "Empire Electrical Solutions",
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
            <Link href="/" className="flex items-center gap-3">
              <Image 
                src="/logo-empire.jpeg" 
                alt="Empire Electrical Solutions" 
                width={140} 
                height={48} 
                priority 
                className="h-8 sm:h-10 w-auto"
              />
              <span className="font-semibold tracking-tight">Empire Electrical Solutions</span>
            </Link>
            <nav className="hidden gap-6 md:flex">
              <Link href="/services">Services</Link>
              <Link href="/about">About</Link>
              <Link href="/contact">Contact</Link>
              <Link href="/payments">Pay</Link>
            </nav>
          </div>
        </header>
        <main className="min-h-[80svh]">{children}</main>
        <footer className="border-t bg-secondary/20">
          <div className="mx-auto max-w-6xl px-4 py-6 text-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="font-medium">Empire Electrical Solutions</p>
                <p>6901 Germantown Avenue, Suite 200, Philadelphia, PA 19119</p>
                <p>
                  <a href="tel:+16103068497" className="underline">(610) 306-8497</a> ·
                  <a href="mailto:info@empireinspections.com" className="underline ml-1">info@empireinspections.com</a>
                </p>
              </div>
              <nav className="flex gap-4 text-sm">
                <Link href="/services" className="underline hover:no-underline">Services</Link>
                <Link href="/about" className="underline hover:no-underline">About</Link>
                <Link href="/contact" className="underline hover:no-underline">Contact</Link>
                <Link href="/payments" className="underline hover:no-underline">Pay</Link>
              </nav>
            </div>
            <p className="mt-4 text-muted-foreground">© {new Date().getFullYear()} Empire Electrical Solutions</p>
          </div>
        </footer>
        <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background p-2 md:hidden">
          <a
            href="tel:+16103068497"
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
