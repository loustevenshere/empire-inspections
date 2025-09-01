import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Meet the owner and learn our coverage area.",
};

export default function Page() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold">About Empire Electrical Solutions</h1>
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
  );
}

