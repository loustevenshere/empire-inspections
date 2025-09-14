import type { Metadata } from "next";
import Image from "next/image";
import BadgeRow from "@/components/BadgeRow";

export const metadata: Metadata = {
  title: "About",
  description: "Meet the owner and learn our coverage area.",
};

export default function Page() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-8">
      <h1 className="text-2xl font-bold">About Empire Inspection Agency</h1>
      
      {/* Main content with image */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        <div className="space-y-6">
          <p className="text-muted-foreground max-w-prose">
            With over two decades of experience as a Commercial and Residential Electrician, our full staff is committed to ensuring each project meets the highest standards of safety and compliance.
          </p>
          
          <div>
            <h2 className="text-xl font-semibold">Credentials</h2>
            <ul className="list-disc pl-6 text-muted-foreground">
              <li>PA Licensed and Insured Inspection Agency</li>
              <li>PA License # A000501</li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold">Service Area</h2>
            <p className="text-muted-foreground">Philadelphia and surrounding municipalities.</p>
          </div>
        </div>
        
        <div className="relative">
          <Image
            src="/philly.jpg"
            alt="Philadelphia skyline"
            width={600}
            height={400}
            className="w-full h-auto rounded-lg shadow-lg object-cover"
            priority
          />
        </div>
      </div>
      
      <BadgeRow />
    </div>
  );
}

