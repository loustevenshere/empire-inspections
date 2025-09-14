// src/app/page.tsx
import Link from "next/link";
import Image from "next/image";
import { ClipboardCheck, ListChecks, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="font-sans">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <Image
          src="/lightbulb.jpg"
          alt="Electrical inspection background"
          fill
          className="object-cover"
          priority
        />
        
        {/* Dark Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30" />
        
        {/* Content */}
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center text-white">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Empire Inspection Agency
          </h1>
          
          <p className="text-xl sm:text-2xl md:text-3xl italic mb-4 text-gray-200">
            We Do What We Say
          </p>
          
          <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            PA Licensed and Insured Inspection Agency — License # A000501
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-lg font-bold text-black hover:bg-gray-100 transition-colors shadow-lg"
            >
              Schedule an Inspection
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg border-2 border-white px-8 py-4 text-lg font-medium text-white hover:bg-white hover:text-black transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Quick benefits */}
      <section className="mx-auto grid max-w-5xl gap-4 px-6 py-10 sm:grid-cols-3">
        {[
          {
            title: "Code-first reviews",
            desc: "Grounding/bonding, box fill, conductor sizing, and device locations checked against NEC.",
            icon: <ClipboardCheck size={28} className="opacity-80" />,
          },
          {
            title: "Clear punch-lists",
            desc: "Actionable items grouped by priority so crews can close issues quickly.",
            icon: <ListChecks size={28} className="opacity-80" />,
          },
          {
            title: "Fast scheduling",
            desc: "Rough-in and finals scheduled quickly; prelim results often the same day.",
            icon: <Zap size={28} className="opacity-80" />,
          },
        ].map((b) => (
          <div
            key={b.title}
            className="rounded-xl border bg-background p-5 shadow-sm"
          >
            <div className="flex items-start gap-3">
              {b.icon}
              <div>
                <h3 className="font-medium">{b.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{b.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Services */}
      <section className="mx-auto max-w-5xl px-6 py-10">
        <h2 className="text-2xl font-bold">Services</h2>
        <p className="mt-4 text-muted-foreground">
          Full Service Electrical Inspection Agency — Offering same day or next day inspections.
        </p>
        <div className="mt-6">
          <Link
            href="/services"
            className="text-sm font-medium underline underline-offset-4 hover:no-underline"
          >
            View all service details →
          </Link>
        </div>
      </section>

      {/* Systems Covered */}
      <section className="mx-auto max-w-5xl px-6 pb-6">
        <h2 className="text-2xl font-bold">Systems Covered</h2>
        <ul className="mt-4 list-disc pl-6 text-muted-foreground space-y-1">
          <li>Residential Additions and Alterations</li>
          <li>Commercial Projects</li>
          <li>PA Pools</li>
          <li>Private Pools</li>
          <li>Solar Installations</li>
          <li>Low Voltage Applications</li>
          <li>Utility Services</li>
          <li>And more...</li>
        </ul>
      </section>

      {/* Staff & Experience */}
      <section className="mx-auto max-w-5xl px-6 pb-6">
        <h2 className="text-2xl font-bold">Staff & Experience</h2>
        <p className="mt-4 text-muted-foreground">
          With over two decades of experience as a Commercial and Residential Electrician, our full staff is committed to ensuring each project meets the highest standards of safety and compliance.
        </p>
      </section>


    </div>
  );
}