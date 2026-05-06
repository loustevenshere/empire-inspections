import type { Metadata } from "next";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Electrical Inspection Services in Philadelphia PA",
  description:
    "Residential, commercial, pool, solar, and low voltage electrical inspections in Philadelphia PA and surrounding counties. Same-day or next-day scheduling. PA License #A000501.",
};

const faqs = [
  {
    q: "How do I schedule inspections?",
    a: "You can schedule online using the contact form on this website, or reach us directly by phone or text. We aim to respond to all requests the same business day.",
  },
  {
    q: "Will inspection reports be available?",
    a: "Yes. You will receive a detailed, code-referenced inspection report. Reports are available after the inspection is complete and all fees are paid.",
  },
  {
    q: "Does the agency upload inspection reports to the municipality?",
    a: "Yes — uploads are done immediately after the inspection is finalized. You do not need to coordinate this step yourself.",
  },
  {
    q: "Do I or the electrical contractor have to be present at the time of inspection?",
    a: "It is strongly encouraged that the electrical contractor be present. Their presence allows the inspector to address questions on the spot and helps crews understand any punch-list items directly.",
  },
  {
    q: "What happens if I fail inspection?",
    a: "If the work does not pass, we provide a clear punch-list of items that need correction. A re-inspection fee of ½ the original inspection fee applies once you are ready for re-inspection.",
  },
  {
    q: "How quickly will I receive my final certification?",
    a: "Once all inspection fees are paid and the work has passed, certificates are uploaded immediately. There is no delay on our end.",
  },
  {
    q: "Does the inspector call to confirm inspection appointments?",
    a: "Yes. You will receive a confirmation call the morning of your scheduled appointment so you know the inspector is on the way.",
  },
  {
    q: "How do I cancel or reschedule appointments?",
    a: "Please call the office at least 2 hours before your scheduled appointment time. Early notice helps us accommodate other clients and avoid a cancellation fee.",
  },
  {
    q: "Are evening or weekend appointments available?",
    a: "We currently offer inspections Monday through Friday, 8 AM – 4 PM. We do not offer evening or weekend appointments at this time.",
  },
  {
    q: "How long does an inspection take?",
    a: "Most inspections take between 20 minutes and 1 hour depending on the scope and complexity of the project. Larger commercial jobs may take longer.",
  },
];

export default function Page() {
  return (
    <div className="font-sans">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <Image
          src="/website-images/iStock-electric-inspection.webp"
          alt="Professional electrical inspection"
          fill
          sizes="100vw"
          quality={70}
          className="object-cover"
          priority
        />
        
        {/* Dark Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30" />
        
        {/* Content */}
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center text-white">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Our Services
          </h1>
          
          <p className="text-xl sm:text-2xl md:text-3xl text-gray-200">
            Professional Electrical Inspections
          </p>
        </div>
      </section>

      {/* Content Section */}
      <div className="mx-auto max-w-6xl px-4 py-8 space-y-8">
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
    </div>
  );
}

