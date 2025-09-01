import type { Metadata } from "next";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Services",
  description: "Detailed inspection services and pricing overview.",
};

const faqs = [
  { q: "How do I schedule inspections?", a: "Online via the website, or by phone/text." },
  { q: "Will inspection reports be available?", a: "Yes." },
  { q: "Does the agency upload inspection reports to the municipality?", a: "Yes, uploads are done immediately." },
  { q: "Do I or the electrical contractor have to be present at the time of inspection?", a: "It is strongly encouraged that the contractor be present." },
  { q: "What happens if I fail inspection?", a: "We apply a re-inspection fee of ½ of the original fee." },
  { q: "How quickly will I receive my final certification?", a: "Once all inspection fees are paid, we upload all certificates." },
  { q: "Does the inspector call to confirm inspection appointments?", a: "Yes, you will receive a call the morning of your appointment." },
  { q: "How do I cancel or reschedule appointments?", a: "Call the office at least 2 hours before your scheduled appointment." },
  { q: "Are evening or weekend appointments available?", a: "No. We offer services Monday through Friday, 8 AM – 4 PM." },
  { q: "How long does an inspection take?", a: "Inspections typically range from 20 minutes to 1 hour." },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-8">
      <h1 className="text-2xl font-bold">Our Services</h1>
      <p className="text-muted-foreground">
        Empire Electrical Solutions provides complete electrical inspections — from rough-in to final sign-off. Below are some of the inspection types we perform regularly.
      </p>
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
        <h2 className="text-xl font-semibold">Systems Covered</h2>
        <ul className="mt-2 list-disc pl-6 text-muted-foreground">
          <li>Residential Additions and Alterations</li>
          <li>Commercial Projects</li>
          <li>PA Pools</li>
          <li>Private Pools</li>
          <li>Solar Installations</li>
          <li>Low Voltage Applications</li>
          <li>Utility Services</li>
          <li>And more...</li>
        </ul>
      </div>
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

