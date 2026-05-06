// src/app/page.tsx
import Link from "next/link";
import Image from "next/image";
import { ClipboardCheck, ListChecks, Zap, Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "We've used Empire on a dozen jobs across Philly and Montgomery County. They're always on time, the reports are clean, and they upload to the municipality same day. Makes our closeouts a lot smoother.",
    author: "Tony Ferraro",
    role: "Owner, Ferraro Electric — Philadelphia, PA",
  },
  {
    quote:
      "Had a rough-in inspection on a commercial build in Cheltenham that another agency kept pushing back. Empire got us scheduled next day. Inspector knew the NEC cold — no surprises.",
    author: "Brendan Walsh",
    role: "Project Superintendent, Walsh Construction Group",
  },
  {
    quote:
      "The punch-list they gave us after a failed rough-in was the most useful inspection document I've seen. Itemized by priority, referenced to code. My guys knocked it out in half a day.",
    author: "Luis Medina",
    role: "Master Electrician, LM Electric LLC — Norristown, PA",
  },
];

const serviceArea = [
  "Philadelphia",
  "Bucks County",
  "Montgomery County",
  "Delaware County",
  "Chester County",
  "Lower Merion",
  "Abington",
  "Cheltenham",
  "Springfield",
  "Norristown",
];

export default function Home() {
  return (
    <div className="font-sans">
      {/* Hero */}
      <section className="relative min-h-[60vh] sm:min-h-[75vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/website-images/lightbulb.webp"
          alt="Electrical inspection background"
          fill
          sizes="100vw"
          quality={70}
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30" />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center text-white">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Empire Inspection Agency
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl italic mb-4 text-gray-200">
            We Do What We Say
          </p>
          <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            PA Licensed &amp; Insured Electrical Inspection Agency — License # A000501
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-lg font-bold text-black hover:bg-gray-100 transition-colors shadow-lg"
          >
            Schedule an Inspection
          </Link>
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

      {/* Testimonials */}
      <section className="bg-secondary/20 py-12">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-2xl font-bold mb-8 text-center">What Contractors Say</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.author} className="rounded-xl border bg-background p-6 shadow-sm flex flex-col gap-3">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-auto">
                  <p className="text-sm font-semibold">{t.author}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
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
        <h2 className="text-2xl font-bold">Staff &amp; Experience</h2>
        <p className="mt-4 text-muted-foreground">
          With over two decades of experience as a Commercial and Residential Electrician, our full staff is committed to ensuring each project meets the highest standards of safety and compliance.
        </p>
      </section>

      {/* Service Area */}
      <section className="border-t bg-secondary/10 py-10">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-2xl font-bold mb-4">Service Area</h2>
          <p className="text-muted-foreground mb-6">
            We serve Philadelphia and the surrounding Pennsylvania municipalities, including:
          </p>
          <div className="flex flex-wrap gap-2">
            {serviceArea.map((area) => (
              <span
                key={area}
                className="rounded-full border px-3 py-1 text-sm text-muted-foreground bg-background"
              >
                {area}
              </span>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Don&apos;t see your area?{" "}
            <Link href="/contact" className="underline underline-offset-4 hover:no-underline">
              Contact us
            </Link>{" "}
            — we cover many additional municipalities throughout southeastern PA.
          </p>
        </div>
      </section>
    </div>
  );
}
