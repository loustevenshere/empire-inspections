"use client";

import React from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { BUSINESS_PHONE, toTelHref, formatPhone } from "@/config/contact";

// Payment identifiers (stored without $ or @)
const CASH_TAG = "empiresolutions21";
const VENMO_USERNAME = "empiresolutions-21";
const ZELLE_PHONE = "267-979-9613";
// Office phone will be imported from config

// Enhanced environment detection hook (client-only to prevent SSR mismatches)
function useEnv() {
  const [env, setEnv] = React.useState<{
    isMobile: boolean | null;
    isIOS: boolean | null;
    inApp: boolean | null;
  }>({
    isMobile: null,
    isIOS: null,
    inApp: null,
  });
  
  React.useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor || "";
    
    // Mobile detection
    const mobileRegex = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
    const isMobile = mobileRegex.test(ua);
    
    // iOS detection
    const isIOS = /iphone|ipad|ipod/i.test(ua);
    
    // In-app browser detection (Instagram, Facebook, TikTok, etc.)
    const inAppRegex = /instagram|fban|fbav|fbsv|fba|fbi|fbios|fb_iab|fb_ios|fb_android|tiktok|snapchat|line|wechat|whatsapp/i;
    const inApp = inAppRegex.test(ua) || 
                  ((window.navigator as Navigator & { standalone?: boolean }).standalone === false && isIOS) || // iOS web app mode
                  (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches === false && isMobile);
    
    setEnv({ isMobile, isIOS, inApp });
  }, []);
  
  return env;
}

// Payment deep link utilities with universal links and custom schemes
interface PaymentOptions {
  amount?: string;
  note?: string;
}

function createVenmoLinks(options: PaymentOptions = {}) {
  const { amount, note } = options;
  const params = new URLSearchParams();
  
  // Sanitize amount to always be a number with two decimals
  if (amount) {
    const numAmount = parseFloat(amount.toString());
    if (!isNaN(numAmount)) {
      params.set('amount', numAmount.toFixed(2));
    }
  }
  
  // Encode note safely
  if (note) {
    params.set('note', encodeURIComponent(note));
  }
  
  const queryString = params.toString();
  const universalLink = `https://venmo.com/${VENMO_USERNAME}?txn=pay${queryString ? `&${queryString}` : ''}`;
  const customScheme = `venmo://paycharge?txn=pay&recipients=${VENMO_USERNAME}${queryString ? `&${queryString}` : ''}`;
  
  return { universalLink, customScheme };
}

function createCashAppLinks(options: PaymentOptions = {}) {
  const { amount, note } = options;
  const params = new URLSearchParams();
  
  // Sanitize amount to always be a number with two decimals
  if (amount) {
    const numAmount = parseFloat(amount.toString());
    if (!isNaN(numAmount)) {
      params.set('amount', numAmount.toFixed(2));
    }
  }
  
  // Encode note safely
  if (note) {
    params.set('note', encodeURIComponent(note));
  }
  
  const queryString = params.toString();
  // Use the official universal link format
  const universalLink = `https://cash.app/$${CASH_TAG}${queryString ? `?${queryString}` : ''}`;
  const customScheme = `cashapp://pay?recipient=$${CASH_TAG}${queryString ? `&${queryString}` : ''}`;
  
  return { universalLink, customScheme };
}

// Enhanced payment handler with platform-specific logic
function usePaymentHandler() {
  const { isMobile, isIOS, inApp } = useEnv();
  
  const handlePayment = React.useCallback((paymentType: 'venmo' | 'cashapp', options: PaymentOptions = {}) => {
    if (isMobile === null || isIOS === null || inApp === null) return; // Wait for environment detection
    
    let links;
    if (paymentType === 'venmo') {
      links = createVenmoLinks(options);
    } else {
      links = createCashAppLinks(options);
    }
    
    // If mobile and in-app browser, always use universal link
    if (isMobile && inApp) {
      window.open(links.universalLink, '_blank');
      return;
    }
    
    // iOS Safari/Chrome
    if (isMobile && isIOS) {
      try {
        // Try to open the app using window.location.href
        window.location.href = links.customScheme;
        
        // Set up visibility change listener and timeout fallback
        let hasReturned = false;
        
        const handleVisibilityChange = () => {
          if (document.visibilityState === 'visible' && !hasReturned) {
            hasReturned = true;
            clearTimeout(fallbackTimeout);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
          }
        };
        
        const fallbackToUniversal = () => {
          if (!hasReturned) {
            hasReturned = true;
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.open(links.universalLink, '_blank');
          }
        };
        
        document.addEventListener('visibilitychange', handleVisibilityChange);
        const fallbackTimeout = setTimeout(fallbackToUniversal, 2000);
        
      } catch (error) {
        console.warn('Payment app error:', error);
        window.open(links.universalLink, '_blank');
      }
      return;
    }
    
    // Android
    if (isMobile && !isIOS) {
      try {
        const appWindow = window.open(links.customScheme, '_blank');
        
        // Fallback to universal link after 1.5 seconds if app didn't open
        setTimeout(() => {
          try {
            if (appWindow && !appWindow.closed) {
              // App opened successfully, close the fallback
              appWindow.close();
            } else {
              // App didn't open, use universal link
              window.open(links.universalLink, '_blank');
            }
          } catch (error) {
            console.warn('Payment fallback error:', error);
            window.open(links.universalLink, '_blank');
          }
        }, 1500);
      } catch (error) {
        console.warn('Payment app error:', error);
        window.open(links.universalLink, '_blank');
      }
      return;
    }
    
    // Desktop: Always open universal link in new tab
    window.open(links.universalLink, '_blank');
  }, [isMobile, isIOS, inApp]);
  
  return { handlePayment, isMobile };
}

// Helper functions for common payment scenarios
export const paymentHelpers = {
  // Create a payment link with amount and note
  createPaymentLink: (type: 'venmo' | 'cashapp', amount?: string, note?: string) => {
    const options: PaymentOptions = {};
    if (amount) options.amount = amount;
    if (note) options.note = note;
    
    if (type === 'venmo') {
      return createVenmoLinks(options);
    } else {
      return createCashAppLinks(options);
    }
  },
  
  // Format amount for display
  formatAmount: (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return isNaN(num) ? amount.toString() : `$${num.toFixed(2)}`;
  },
  
  // Create a note with inspection details
  createInspectionNote: (address: string, permitNumber?: string) => {
    let note = `Inspection - ${address}`;
    if (permitNumber) {
      note += ` (Permit #${permitNumber})`;
    }
    return note;
  }
};

// CopyPill component
function CopyPill({ value, ariaLabel, testId }: { value: string; ariaLabel: string; testId?: string }) {
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
        data-testid={testId}
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
  const { handlePayment, isMobile } = usePaymentHandler();

  return (
    <main className="min-h-screen py-8 px-4" data-testid="payments-page">
      <div className="container mx-auto max-w-3xl px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Pay
          </h1>
          <p className="text-lg text-slate-600">
            Choose the option that works best for you.
          </p>
        </div>

        {/* Section A - Quick Pay Apps */}
        <section className="mt-6">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Quick Pay Apps</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Venmo Card */}
            <div className="bg-blue-100 rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-slate-900 mb-2">💸 Venmo</h3>
              <div className="mb-2">
                <CopyPill value={`@${VENMO_USERNAME}`} ariaLabel="Copy Venmo username" testId="copy-venmo" />
                <span data-testid="venmo-handle" className="sr-only">@{VENMO_USERNAME}</span>
              </div>
              <p className="text-sm text-slate-600 mb-4">Include address or permit # when making payments.</p>
              
              <div className="space-y-2">
                <button
                  onClick={() => handlePayment('venmo')}
                  disabled={isMobile === null}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Open Venmo"
                  data-testid="open-venmo"
                >
                  {isMobile === null ? 'Loading...' : 'Open Venmo'}
                </button>
              </div>
            </div>

            {/* Cash App Card */}
            <div className="bg-green-100 rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-slate-900 mb-2">💵 Cash App</h3>
              <div className="mb-2">
                <CopyPill value={`$${CASH_TAG}`} ariaLabel="Copy Cash App tag" testId="copy-cash" />
                <span data-testid="cash-handle" className="sr-only">${CASH_TAG}</span>
              </div>
              <p className="text-sm text-slate-600 mb-4">Include address or permit # when making payments.</p>
              
              <div className="space-y-2">
                <button
                  onClick={() => handlePayment('cashapp')}
                  disabled={isMobile === null}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Open Cash App"
                  data-testid="open-cashapp"
                >
                  {isMobile === null ? 'Loading...' : 'Open Cash App'}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Section B - Cards & Zelle */}
        <section className="mt-8" aria-labelledby="cards-zelle-heading">
          <h2 id="cards-zelle-heading" className="text-2xl font-semibold text-slate-900 mb-6">More Ways To Pay</h2>
          
          {/* Payment Badges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 place-items-center">
            {/* Visa */}
            <div className="rounded-2xl shadow-sm ring-1 ring-gray-200 p-3 bg-white w-full max-w-[200px] h-[120px] flex items-center justify-center">
              <Image
                src="/payment-badges/visa.png"
                alt="Visa"
                width={200}
                height={120}
                sizes="(max-width: 768px) 33vw, 200px"
                priority={false}
                loading="lazy"
                decoding="async"
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Mastercard */}
            <div className="rounded-2xl shadow-sm ring-1 ring-gray-200 p-3 bg-white w-full max-w-[200px] h-[120px] flex items-center justify-center">
              <Image
                src="/payment-badges/mastercard.png"
                alt="Mastercard"
                width={200}
                height={120}
                sizes="(max-width: 768px) 33vw, 200px"
                priority={false}
                loading="lazy"
                decoding="async"
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* American Express */}
            <div className="rounded-2xl shadow-sm ring-1 ring-gray-200 p-3 bg-white w-full max-w-[200px] h-[120px] flex items-center justify-center">
              <Image
                src="/payment-badges/amex.png"
                alt="American Express"
                width={200}
                height={120}
                sizes="(max-width: 768px) 33vw, 200px"
                priority={false}
                loading="lazy"
                decoding="async"
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Discover */}
            <div className="rounded-2xl shadow-sm ring-1 ring-gray-200 p-3 bg-white w-full max-w-[200px] h-[120px] flex items-center justify-center">
              <Image
                src="/payment-badges/discover.png"
                alt="Discover"
                width={200}
                height={120}
                sizes="(max-width: 768px) 33vw, 200px"
                priority={false}
                loading="lazy"
                decoding="async"
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Zelle */}
            <div className="rounded-2xl shadow-sm ring-1 ring-gray-200 p-3 bg-white w-full max-w-[200px] h-[120px] flex items-center justify-center">
              <Image
                src="/payment-badges/zelle.png"
                alt="Zelle"
                width={200}
                height={120}
                sizes="(max-width: 768px) 33vw, 200px"
                priority={false}
                loading="lazy"
                decoding="async"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>

          {/* Call-to-Pay Line */}
          <div className="mt-4 text-sm text-gray-600 text-center">
            Prefer to pay by card or Zelle?{" "}
            <a
              href={toTelHref(BUSINESS_PHONE)}
              className="underline underline-offset-2 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
              aria-label="Call our office"
              role="link"
            >
              Call our office
            </a>
            .
          </div>
        </section>
      </div>
    </main>
  );
}