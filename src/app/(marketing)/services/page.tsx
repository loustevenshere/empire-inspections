import type { Metadata } from "next";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Image from "next/image";

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
    <div className="font-sans">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <Image
          src="/website-images/iStock-electric-inspection.webp"
          alt="Professional electrical inspection"
          fill
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

