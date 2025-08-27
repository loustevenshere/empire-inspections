import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  intent?: "primary" | "secondary" | "ghost";
  className?: string;
  children: React.ReactNode;
};

export function CTAButton({ href, intent = "primary", className, children }: Props) {
  const base = "inline-flex items-center justify-center rounded-md px-4 py-3 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
  const variants: Record<NonNullable<Props["intent"]>, string> = {
    primary: "bg-primary text-primary-foreground hover:opacity-95 focus-visible:outline-ring",
    secondary: "bg-secondary text-secondary-foreground hover:opacity-95 focus-visible:outline-ring",
    ghost: "bg-transparent border border-input text-foreground hover:bg-accent",
  };
  return (
    <Link href={href} className={cn(base, variants[intent], className)}>
      {children}
    </Link>
  );
}

