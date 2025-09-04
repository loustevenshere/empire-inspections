"use client";

import React from "react";

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

export default function PayPage() {
  const isMobile = useIsMobile();
  const [copyStates, setCopyStates] = React.useState<Record<string, boolean>>({});

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStates(prev => ({ ...prev, [key]: true }));
      setTimeout(() => {
        setCopyStates(prev => ({ ...prev, [key]: false }));
      }, 1200);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

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
            <p className="text-slate-900 font-medium mb-2">@{VENMO_USERNAME}</p>
            <p className="text-sm text-slate-600 mb-4">Include address or permit # when making payments.</p>
            
            <div className="space-y-2">
              {isMobile ? (
                <button
                  onClick={() => window.open(venmoAppLink(), "_blank")}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  aria-label="Open Venmo app"
                >
                  Open in App
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleCopy(`@${VENMO_USERNAME}`, "venmo-username")}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    aria-label="Copy Venmo username"
                  >
                    {copyStates["venmo-username"] ? "Copied!" : "Copy Handle"}
                  </button>
                  <a
                    href={venmoWebLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center text-blue-600 hover:text-blue-800 text-sm underline"
                    aria-label="Open Venmo web profile"
                  >
                    Open Web
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Cash App Card */}
          <div className="bg-green-100 rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">💵 Cash App</h3>
            <p className="text-slate-900 font-medium mb-2">${CASH_TAG}</p>
            <p className="text-sm text-slate-600 mb-4">Include address or permit # when making payments.</p>
            
            <div className="space-y-2">
              {isMobile ? (
                <button
                  onClick={() => window.open(cashAppLink(), "_blank")}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                  aria-label="Open Cash App"
                >
                  Open in App
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleCopy(`$${CASH_TAG}`, "cashapp-tag")}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                    aria-label="Copy Cash App tag"
                  >
                    {copyStates["cashapp-tag"] ? "Copied!" : "Copy Handle"}
                  </button>
                  <a
                    href={cashWebLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center text-green-600 hover:text-green-800 text-sm underline"
                    aria-label="Open Cash App web profile"
                  >
                    Open Web
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Zelle Card */}
          <div className="bg-purple-100 rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">🏦 Zelle</h3>
            <p className="text-slate-900 font-medium mb-2">{ZELLE_PHONE}</p>
            <p className="text-sm text-slate-600 mb-4">Include address or permit # when making payments.</p>
            
            <div className="space-y-2">
              <button
                onClick={() => handleCopy(ZELLE_PHONE, "zelle-phone")}
                className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                aria-label="Copy Zelle phone number"
              >
                {copyStates["zelle-phone"] ? "Copied!" : "Copy Number"}
              </button>
              <a
                href="https://www.zellepay.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center text-purple-600 hover:text-purple-800 text-sm underline"
                aria-label="Learn about Zelle"
              >
                What is Zelle?
              </a>
            </div>
          </div>

          {/* Square Card */}
          <div className="bg-gray-100 rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">💳 Square</h3>
            <p className="text-slate-900 font-medium mb-2">Call the office</p>
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