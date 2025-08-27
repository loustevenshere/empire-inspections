import type { Metadata } from "next";
import Link from "next/link";
import { CTAButton } from "@/components/cta-button";

export const metadata: Metadata = {
  title: "Certified Home Inspections",
  description: "Licensed, insured, and thorough inspections serving the region.",
};

export default function Page() {
  return (
    <div className="space-y-16">
      <section className="mx-auto max-w-6xl px-4 pt-8 pb-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Confidence for your next move.
        </h1>
        <p className="mt-2 max-w-prose text-muted-foreground">
          Empire delivers professional, comprehensive home inspections with rapid reporting.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <CTAButton href="tel:+16103068497" intent="primary">Call Now</CTAButton>
          <CTAButton href="/contact" intent="secondary">Request Inspection</CTAButton>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4">
        <h2 className="text-xl font-semibold">Services</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {["General Home", "Radon", "Mold", "Termite"].map((s) => (
            <div key={s} className="rounded-lg border p-4">
              <p className="font-medium">{s} Inspection</p>
              <p className="text-sm text-muted-foreground">Thorough, standards-based reporting.</p>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Link className="underline" href="/services">See all services →</Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4">
        <h2 className="text-xl font-semibold">Why choose us</h2>
        <ul className="mt-2 list-disc pl-6 text-muted-foreground">
          <li>Licensed and insured</li>
          <li>Fast 24–48h turnaround</li>
          <li>Clear, visual reports</li>
        </ul>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24">
        <div className="rounded-md bg-secondary/40 p-4">
          <h2 className="text-xl font-semibold">Ready to book?</h2>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <CTAButton href="/contact" intent="primary">Request Inspection</CTAButton>
            <CTAButton href="tel:+16103068497" intent="ghost">Call (610) 306-8497</CTAButton>
          </div>
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Empire Electrical Solutions",
            telephone: "+1-610-306-8497",
            address: {
              "@type": "PostalAddress",
              streetAddress: "6901 Germantown Avenue, Suite 200",
              addressLocality: "Philadelphia",
              addressRegion: "PA",
              postalCode: "19119",
              addressCountry: "US",
            },
            url: "https://www.empire-inspections.example",
          }),
        }}
      />
    </div>
  );
}

