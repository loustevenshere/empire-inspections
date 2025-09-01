import Link from "next/link";
import { CopyButton } from "./copy-button";

interface CTACardProps {
  title: string;
  icon: React.ReactNode;
  description: string;
  primaryLabel: string;
  primaryHref?: string;
  copyText?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export function CTACard({
  title,
  icon,
  description,
  primaryLabel,
  primaryHref,
  copyText,
  secondaryLabel,
  secondaryHref,
}: CTACardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0" aria-hidden="true">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600 mb-4">{description}</p>
          
          <div className="flex flex-col gap-2">
            {primaryHref ? (
              <Link
                href={primaryHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                {primaryLabel}
              </Link>
            ) : copyText ? (
              <CopyButton text={copyText} ariaLabel={`Copy ${title} details`} />
            ) : (
              <span className="text-sm text-gray-500">{primaryLabel}</span>
            )}
            
            {secondaryLabel && secondaryHref && (
              <Link
                href={secondaryHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                {secondaryLabel}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
