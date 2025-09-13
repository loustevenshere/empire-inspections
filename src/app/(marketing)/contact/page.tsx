"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContactForm, contactSchema, inspectionTypeEnum, combineDateTime, getTodayString } from "@/lib/validation";
import { getPrimaryPhone, getSecondaryPhones } from "@/config/contact";
import { toTelHref } from "@/lib/phone";


// Custom hook to handle hydration safely
function useHydrationSafe() {
  const [isHydrated, setIsHydrated] = useState(false);
  
  React.useEffect(() => {
    setIsHydrated(true);
  }, []);
  
  return isHydrated;
}

export default function Page() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const isHydrated = useHydrationSafe();
  const primary = getPrimaryPhone();
  const secondary = getSecondaryPhones();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(data: ContactForm) {
    try {
      setSubmitError(null);
      
      // Combine date and time into ISO string
      const preferredDateTime = data.preferredDate && data.preferredTime 
        ? combineDateTime(data.preferredDate, data.preferredTime)
        : undefined;

      const payload = {
        ...data,
        preferredDateTime,
      };

      const resp = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await resp.json();

      if (resp.ok && result.ok) {
        setSubmitted(true);
      } else {
        // Handle different error types
        if (resp.status === 400) {
          setSubmitError(result.details?.fieldErrors ? 
            "Please check the form for errors and try again." : 
            result.error || "Invalid form data. Please check your inputs.");
        } else if (resp.status === 429) {
          setSubmitError("Too many requests. Please wait a moment and try again.");
        } else {
          setSubmitError(result.error || `Something went wrong. Please try again or call us at ${primary.human}.`);
        }
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitError("Network error. Please check your connection and try again.");
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8" data-testid="contact-page">
      <h1 className="text-2xl font-bold">Request Inspection</h1>
      
      {/* Business Information */}
      <div className="mt-4 p-4 bg-muted/30 rounded-lg">
        <h2 className="font-medium mb-2">Empire Electrical Solutions</h2>
        <p className="text-sm text-muted-foreground mb-1">6901 Germantown Avenue, Suite 200</p>
        <p className="text-sm text-muted-foreground mb-2">Philadelphia, PA 19119</p>
        <div className="space-y-1 text-sm">
          <p className="text-xs md:text-sm text-muted-foreground md:hidden">Tap a number to call</p>
          <div>
            <span className="font-semibold">{primary.label}:</span>{" "}
            <a
              href={toTelHref(primary.e164)}
              aria-label={`Call Empire Solutions at ${primary.human}`}
              className="text-primary hover:underline underline-offset-4"
            >
              {primary.human}
            </a>
          </div>
          <div>
            <span className="font-semibold">{secondary[0].label}:</span>{" "}
            <a
              href={toTelHref(secondary[0].e164)}
              aria-label={`Call Empire Solutions at ${secondary[0].human}`}
              className="text-primary hover:underline underline-offset-4"
            >
              {secondary[0].human}
            </a>
          </div>
        </div>
      </div>
      
      {submitted ? (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg" data-testid="contact-success">
          <h3 className="text-green-800 font-medium">Thank you!</h3>
          <p className="text-green-700 mt-1">We&apos;ve received your inspection request and will contact you shortly to confirm the details.</p>
        </div>
      ) : !isHydrated ? (
        <div className="mt-6 space-y-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded mb-4"></div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate suppressHydrationWarning>
          {submitError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg" data-testid="contact-error">
              <h3 className="text-red-800 font-medium">Error</h3>
              <p className="text-red-700 mt-1">{submitError}</p>
            </div>
          )}
          <input type="text" className="hidden" aria-hidden="true" tabIndex={-1} {...register("_hp")} suppressHydrationWarning />
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input className="mt-1 w-full rounded-md border px-3 py-2" {...register("name")} data-testid="name" suppressHydrationWarning />
            {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Company (optional)</label>
            <input className="mt-1 w-full rounded-md border px-3 py-2" {...register("company")} suppressHydrationWarning />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium">Phone</label>
              <input className="mt-1 w-full rounded-md border px-3 py-2" {...register("phone")} data-testid="phone" suppressHydrationWarning />
              {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input type="email" className="mt-1 w-full rounded-md border px-3 py-2" {...register("email")} data-testid="email" suppressHydrationWarning />
              {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Job Address</label>
            <input className="mt-1 w-full rounded-md border px-3 py-2" {...register("jobAddress")} data-testid="jobAddress" suppressHydrationWarning />
            {errors.jobAddress && <p className="text-sm text-red-600">{errors.jobAddress.message}</p>}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium">Municipality</label>
              <input className="mt-1 w-full rounded-md border px-3 py-2" {...register("municipality")} data-testid="municipality" suppressHydrationWarning />
              {errors.municipality && <p className="text-sm text-red-600">{errors.municipality.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Inspection Type</label>
              <select className="mt-1 w-full rounded-md border px-3 py-2" {...register("inspectionType")} data-testid="inspectionType" suppressHydrationWarning>
                <option value="" disabled>
                  Select inspection type...
                </option>
                {inspectionTypeEnum.options.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              {errors.inspectionType && <p className="text-sm text-red-600">{errors.inspectionType.message}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Preferred Time</label>
            <div className="mt-1 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="preferredDate" className="sr-only">Preferred Date</label>
                <input 
                  id="preferredDate"
                  type="date" 
                  className="w-full rounded-md border px-3 py-2" 
                  min={getTodayString()}
                  aria-invalid={errors.preferredDate ? "true" : "false"}
                  {...register("preferredDate")} 
                  data-testid="preferredDate"
                  suppressHydrationWarning
                />
                {errors.preferredDate && <p className="text-sm text-red-600">{errors.preferredDate.message}</p>}
              </div>
              <div>
                <label htmlFor="preferredTime" className="sr-only">Preferred Time</label>
                <input 
                  id="preferredTime"
                  type="time" 
                  step="900"
                  className="w-full rounded-md border px-3 py-2" 
                  aria-invalid={errors.preferredTime ? "true" : "false"}
                  {...register("preferredTime")} 
                  data-testid="preferredTime"
                  suppressHydrationWarning
                />
                {errors.preferredTime && <p className="text-sm text-red-600">{errors.preferredTime.message}</p>}
                <p className="text-xs text-muted-foreground mt-1">Times are scheduled in your local timezone.</p>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Notes</label>
            <textarea 
              rows={4} 
              className="mt-1 w-full rounded-md border px-3 py-2" 
              {...register("notes")} 
              placeholder="Please provide your permit # if applicable"
              data-testid="notes"
              suppressHydrationWarning
            />
          </div>
          <button 
            disabled={isSubmitting} 
            className="w-full rounded-md bg-primary px-4 py-3 font-semibold text-primary-foreground disabled:opacity-60 disabled:cursor-not-allowed"
            data-testid="contact-submit"
          >
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      )}
    </div>
  );
}

