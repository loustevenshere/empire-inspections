// src/app/page.tsx
import Link from "next/link";
import { ClipboardCheck, ListChecks, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="font-sans">
      {/* Hero */}
      <section className="min-h-[60vh] grid place-items-center px-6 py-16 sm:py-24 bg-gradient-to-b from-background to-muted/30">
        <div className="mx-auto max-w-3xl text-center sm:text-left">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            NEC-focused • Independent • Fast turnaround
          </div>
          <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight">
            Electrical inspections that help you pass the first time.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Independent electrical inspections for contractors and builders in
            Philadelphia, PA. Fast scheduling, clear punch-lists, and same-day
            preliminary findings on most jobs.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Request Inspection
            </Link>
            <a
              href="tel:+16103068497"
              className="inline-flex items-center justify-center rounded-lg border px-5 py-3 text-sm font-medium hover:bg-muted"
            >
              Call (610) 306-8497
            </a>
          </div>

          {/* quick trust line */}
          <div className="mt-6 text-sm text-muted-foreground">
            InterNACHI-certified • PA State licensed • Insured
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

      {/* Services preview */}
      <section className="mx-auto max-w-5xl px-6 pb-6">
        <h2 className="text-2xl font-bold">Our Services</h2>
        <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            {
              title: "Rough-In Electrical Inspection",
              desc: "Verify conductor sizes, box fills, grounding/bonding, and GFCI/AFCI locations before walls close.",
            },
            {
              title: "Final Electrical Inspection",
              desc: "Receptacles, fixtures, panel labeling, breakers, and device testing for certificate sign-off.",
            },
            {
              title: "Service Upgrade Inspection",
              desc: "Meter, mast, grounding electrode system, bonding jumpers, clearances, and labeling.",
            },
            {
              title: "Commercial TI / Fit-Out",
              desc: "Load calcs spot-check, panel schedules, equipment disconnects, and emergency egress power.",
            },
          ].map((s) => (
            <li key={s.title} className="rounded-lg border p-4">
              <p className="font-medium">{s.title}</p>
              <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <Link
            href="/services"
            className="text-sm font-medium underline underline-offset-4 hover:no-underline"
          >
            View all service details →
          </Link>
        </div>
      </section>

        {/* Footer */}
      <footer className="mt-10 border-t bg-muted/30">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 py-6 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Empire Electrical Solutions. All rights
            reserved.
          </p>
          <div className="text-sm text-muted-foreground text-center sm:text-right">
            Empire Electrical Solutions • 6901 Germantown Avenue, Suite 200, Philadelphia, PA 19119 • <a className="hover:underline" href="tel:+16103068497">(610) 306-8497</a>
          </div>
        </div>
      </footer>
    </div>
  );
}