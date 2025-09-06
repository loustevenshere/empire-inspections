// Example usage of the enhanced payment deep links
// This file demonstrates how to use the payment helpers in other parts of the app

import { paymentHelpers } from '@/app/pay/page';

// Example 1: Basic payment with amount and note
export function createInspectionPayment(amount: string, address: string, permitNumber?: string) {
  const note = paymentHelpers.createInspectionNote(address, permitNumber);
  
  // For Venmo
  const venmoLinks = paymentHelpers.createPaymentLink('venmo', amount, note);
  
  // For Cash App
  const cashAppLinks = paymentHelpers.createPaymentLink('cashapp', amount, note);
  
  return {
    venmo: venmoLinks,
    cashApp: cashAppLinks,
    formattedAmount: paymentHelpers.formatAmount(amount)
  };
}

// Example 2: Quick payment without amount (user enters in app)
export function createQuickPayment(address: string) {
  const note = `Inspection - ${address}`;
  
  return {
    venmo: paymentHelpers.createPaymentLink('venmo', undefined, note),
    cashApp: paymentHelpers.createPaymentLink('cashapp', undefined, note)
  };
}

// Example 3: Payment with specific inspection type
export function createTypedInspectionPayment(
  amount: string, 
  inspectionType: string, 
  address: string, 
  permitNumber?: string
) {
  const note = `${inspectionType} Inspection - ${address}${permitNumber ? ` (Permit #${permitNumber})` : ''}`;
  
  return {
    venmo: paymentHelpers.createPaymentLink('venmo', amount, note),
    cashApp: paymentHelpers.createPaymentLink('cashapp', amount, note),
    formattedAmount: paymentHelpers.formatAmount(amount)
  };
}

// Example 4: Usage in a React component
export function useInspectionPayment() {
  const handlePayment = (type: 'venmo' | 'cashapp', amount?: string, note?: string) => {
    const links = paymentHelpers.createPaymentLink(type, amount, note);
    
    // On mobile, try app first, then fallback to web
    if (window.innerWidth <= 768) {
      const appWindow = window.open(links.customScheme, '_blank');
      setTimeout(() => {
        if (appWindow && !appWindow.closed) {
          appWindow.close();
        } else {
          window.open(links.universalLink, '_blank');
        }
      }, 600);
    } else {
      // On desktop, use web directly
      window.open(links.universalLink, '_blank');
    }
  };
  
  return { handlePayment };
}
