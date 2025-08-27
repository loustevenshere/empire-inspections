import type { Metadata } from "next";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Services",
  description: "Detailed inspection services and pricing overview.",
};

const faqs = [
  { q: "How fast is the report?", a: "Typically within 24–48 hours." },
  { q: "Are you insured?", a: "Yes, fully licensed and insured." },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-8">
      <h1 className="text-2xl font-bold">Our Services</h1>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[
          {
            title: "Rough-In Electrical Inspection",
            description:
              "Verify conductor sizes, box fills, grounding/bonding, and GFCI/AFCI locations before walls close.",
          },
          {
            title: "Final Electrical Inspection",
            description:
              "Receptacles, fixtures, panel labeling, breakers, and device testing for certificate sign-off.",
          },
          {
            title: "Service Upgrade Inspection",
            description:
              "Meter, mast, grounding electrode system, bonding jumpers, clearances, and labeling.",
          },
          {
            title: "Commercial TI / Fit-Out",
            description:
              "Load calcs spot-check, panel schedules, equipment disconnects, and emergency egress power.",
          },
        ].map((service) => (
          <li key={service.title} className="rounded-lg border p-4">
            <p className="font-medium">{service.title}</p>
            <p className="text-sm text-muted-foreground">{service.description}</p>
          </li>
        ))}
      </ul>
      <div>
        <h2 className="text-xl font-semibold mb-2">FAQs</h2>
        <Accordion type="single" collapsible>
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}

