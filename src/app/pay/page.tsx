"use client";

import React from "react";
import { Check } from "lucide-react";

// Payment identifiers
const CASH_TAG = "empiresolutions21";           // no '$'
const VENMO_USERNAME = "empiresolutions-21";   // no '@'
const ZELLE_PHONE = "267-979-9613";            // as displayed
const OFFICE_PHONE = "610-306-8497";           // used for Square 'call the office'

// Mobile detector hook
function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor || "";
    setIsMobile(/android|iphone|ipad|ipod/i.test(ua));
  }, []);
  return isMobile;
}

// Deep link and web fallback utilities
const venmoAppLink = () => `venmo://paycharge?txn=pay&recipients=${VENMO_USERNAME}`;
const venmoWebLink = () => `https://venmo.com/${VENMO_USERNAME}?txn=pay`;
const cashAppLink = () => `cashapp://pay?recipient=$${CASH_TAG}`;
const cashWebLink = () => `https://cash.app/$${CASH_TAG}`;

// CopyPill component
function CopyPill({ value, ariaLabel }: { value: string; ariaLabel: string }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div className="inline-flex items-center gap-2 rounded-lg bg-white/60 px-3 py-1 font-mono text-sm shadow-sm">
      {copied && <Check className="w-3 h-3 text-green-600" />}
      <span className="truncate">{value}</span>
      <button
        type="button"
        className="rounded-full border px-2 py-0.5 text-xs hover:bg-black/10 transition"
        aria-label={ariaLabel}
        onClick={handleCopy}
      >
        Copy
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </div>
  );
}

export default function PayPage() {
  const isMobile = useIsMobile();

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Pay Empire Electrical Solutions
          </h1>
          <p className="text-lg text-slate-600">
            Choose your preferred payment method below.
          </p>
        </div>

        {/* Payment Method Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Venmo Card */}
          <div className="bg-blue-100 rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">💸 Venmo</h3>
            <div className="mb-2">
              <CopyPill value={`@${VENMO_USERNAME}`} ariaLabel="Copy Venmo username" />
            </div>
            <p className="text-sm text-slate-600 mb-4">Include address or permit # when making payments.</p>
            
            <div className="space-y-2">
              {isMobile ? (
                <button
                  onClick={() => window.open(venmoAppLink(), "_blank")}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  aria-label="Open Venmo app"
                >
                  Open Venmo
                </button>
              ) : (
                <a
                  href={venmoWebLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 underline-offset-2 hover:underline text-blue-600 hover:text-blue-800 text-sm"
                  aria-label="Open Venmo web profile"
                >
                  Open Venmo
                </a>
              )}
            </div>
          </div>

          {/* Cash App Card */}
          <div className="bg-green-100 rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">💵 Cash App</h3>
            <div className="mb-2">
              <CopyPill value={`$${CASH_TAG}`} ariaLabel="Copy Cash App tag" />
            </div>
            <p className="text-sm text-slate-600 mb-4">Include address or permit # when making payments.</p>
            
            <div className="space-y-2">
              {isMobile ? (
                <button
                  onClick={() => window.open(cashAppLink(), "_blank")}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                  aria-label="Open Cash App"
                >
                  Open Cash App
                </button>
              ) : (
                <a
                  href={cashWebLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 underline-offset-2 hover:underline text-green-600 hover:text-green-800 text-sm"
                  aria-label="Open Cash App web profile"
                >
                  Open Cash App
                </a>
              )}
            </div>
          </div>

          {/* Zelle Card */}
          <div className="bg-purple-100 rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">🏦 Zelle</h3>
            <div className="mb-2">
              <CopyPill value={ZELLE_PHONE} ariaLabel="Copy Zelle phone number" />
            </div>
            <p className="text-sm text-slate-600 mb-4">Include address or permit # when making payments.</p>
          </div>

          {/* Square Card */}
          <div className="bg-gray-100 rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">💳 Square</h3>
            <p className="font-mono mb-2">{OFFICE_PHONE}</p>
            <p className="text-sm text-slate-600 mb-4">Include address or permit # when making payments.</p>
            
            <div className="space-y-2">
              <a
                href={`tel:${OFFICE_PHONE}`}
                className="block w-full bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors text-center"
                aria-label="Call the office"
              >
                Call the Office
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}