import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Meet the owner and learn our coverage area.",
};

export default function Page() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold">About Empire</h1>
      <p className="text-muted-foreground max-w-prose">
        Owner John Doe is an InterNACHI-certified inspector with a decade of experience.
      </p>
      <div>
        <h2 className="text-xl font-semibold">Credentials</h2>
        <ul className="list-disc pl-6 text-muted-foreground">
          <li>InterNACHI Certified Professional Inspector</li>
          <li>New York State Licensed</li>
        </ul>
      </div>
      <div>
        <h2 className="text-xl font-semibold">Service Area</h2>
        <p className="text-muted-foreground">Greater Albany and surrounding municipalities.</p>
      </div>
    </div>
  );
}

