import type { Metadata } from "next";
import Image from "next/image";
import BadgeRow from "@/components/BadgeRow";

export const metadata: Metadata = {
  title: "About",
  description: "Meet the owner and learn our coverage area.",
};

export default function Page() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:py-8 space-y-6 md:space-y-8">
      <h1 className="text-2xl md:text-3xl font-bold">About Empire Inspection Agency</h1>
      
      {/* Main content with image */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-start">
        <div className="space-y-4 md:space-y-6">
          <p className="text-muted-foreground max-w-prose text-sm md:text-base leading-relaxed">
            With over two decades of experience as a Commercial and Residential Electrician, our full staff is committed to ensuring each project meets the highest standards of safety and compliance.
          </p>
          
          <div className="space-y-2">
            <h2 className="text-lg md:text-xl font-semibold">Credentials</h2>
            <ul className="list-disc pl-5 md:pl-6 text-muted-foreground text-sm md:text-base space-y-1">
              <li>PA Licensed and Insured Inspection Agency</li>
              <li>PA License # A000501</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-lg md:text-xl font-semibold">Service Area</h2>
            <p className="text-muted-foreground text-sm md:text-base">Philadelphia and surrounding municipalities.</p>
          </div>
        </div>
        
        <div className="relative order-first lg:order-last">
          <Image
            src="/website-images/philly.jpg"
            alt="Philadelphia skyline"
            width={600}
            height={400}
            className="w-full h-auto rounded-lg shadow-lg object-cover aspect-[3/2]"
            priority
          />
        </div>
      </div>
      
      <BadgeRow />
    </div>
  );
}

