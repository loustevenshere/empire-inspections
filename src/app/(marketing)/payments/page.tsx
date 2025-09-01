import { Banknote, Wallet, Send, Phone, BadgeDollarSign } from "lucide-react";
import { CTACard } from "@/components/cta-card";

export const metadata = {
  title: "Pay Inspection Fees - Empire Electrical Solutions",
  description: "Pay your electrical inspection fees using Cash App, Venmo, Zelle, Apple Pay, or cash/check.",
};

export default function PaymentsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Pay Inspection Fees
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose a payment method. Include your address and permit number in the memo.
          </p>
        </div>

        {/* Payment Options Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {/* Cash App */}
          <CTACard
            title="Cash App"
            icon={<Banknote size={32} className="text-green-600" />}
            description={process.env.NEXT_PUBLIC_CASH_APP_HANDLE || "$EESHandle"}
            primaryLabel="Open Cash App"
            primaryHref={process.env.NEXT_PUBLIC_CASH_APP_URL}
            copyText={process.env.NEXT_PUBLIC_CASH_APP_HANDLE || "$EESHandle"}
            secondaryLabel="Copy handle"
          />

          {/* Venmo */}
          <CTACard
            title="Venmo"
            icon={<Wallet size={32} className="text-blue-600" />}
            description={process.env.NEXT_PUBLIC_VENMO_HANDLE || "@EESHandle"}
            primaryLabel="Open Venmo"
            primaryHref={process.env.NEXT_PUBLIC_VENMO_URL}
            copyText={process.env.NEXT_PUBLIC_VENMO_HANDLE || "@EESHandle"}
            secondaryLabel="Copy handle"
          />

          {/* Zelle */}
          <CTACard
            title="Zelle"
            icon={<Send size={32} className="text-purple-600" />}
            description={process.env.NEXT_PUBLIC_ZELLE_INSTRUCTIONS || "Send to 610-000-0000 (Empire Electrical Solutions)"}
            primaryLabel="Copy Zelle details"
            copyText={process.env.NEXT_PUBLIC_ZELLE_INSTRUCTIONS || "Send to 610-000-0000 (Empire Electrical Solutions)"}
          />

          {/* Apple Pay */}
          <CTACard
            title="Apple Pay"
            icon={<Phone size={32} className="text-gray-600" />}
            description={process.env.NEXT_PUBLIC_APPLE_PAY_NOTE || "Request an Apple Pay invoice"}
            primaryLabel="Text us"
            primaryHref={`tel:${process.env.NEXT_PUBLIC_BILLING_CONTACT || "610-306-8497"}`}
          />

          {/* Cash / Check */}
          <CTACard
            title="Cash / Check"
            icon={<BadgeDollarSign size={32} className="text-green-700" />}
            description="Accepted at inspection. Ask your inspector if unsure."
            primaryLabel="Accepted at inspection"
          />
        </div>

        {/* Notices */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="text-sm text-yellow-800">
            <p className="mb-2">
              <strong>Re-inspection fee is 1/2 of the original fee.</strong>
            </p>
            <p>
              Questions about your fee? Call or text{" "}
              <a
                href={`tel:${process.env.NEXT_PUBLIC_BILLING_CONTACT || "610-306-8497"}`}
                className="font-medium underline hover:no-underline"
              >
                {process.env.NEXT_PUBLIC_BILLING_CONTACT || "610-306-8497"}
              </a>{" "}
              before paying.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
