"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContactForm, contactSchema, inspectionTypeEnum, getTodayString } from "@/lib/validation";
import { BUSINESS_PHONE, toTelHref, formatPhone } from "@/config/contact";


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
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(data: ContactForm) {
    try {
      setSubmitError(null);
      
      const resp = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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
          setSubmitError(result.error || `Something went wrong. Please try again or call us at ${formatPhone(BUSINESS_PHONE)}.`);
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
        <h2 className="font-medium mb-2">Empire Inspection Agency</h2>
        <p className="text-sm text-muted-foreground mb-1">6901 Germantown Avenue, Suite 200</p>
        <p className="text-sm text-muted-foreground mb-2">Philadelphia, PA 19119</p>
        <div className="space-y-1 text-sm">
          <p className="text-xs md:text-sm text-muted-foreground md:hidden">Tap to call</p>
          <div>
            <a
              href={toTelHref(BUSINESS_PHONE)}
              aria-label={`Call Empire Inspection Agency at ${formatPhone(BUSINESS_PHONE)}`}
              className="text-primary hover:underline underline-offset-4 font-semibold"
            >
              {formatPhone(BUSINESS_PHONE)}
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
            <fieldset className="border border-gray-300 rounded-md p-4">
              <legend className="text-sm font-medium px-2">Job Address</legend>
              <p className="text-xs text-gray-600 mb-3">Provide the exact service address where the inspection is needed.</p>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium">Street Address</label>
                  <input 
                    className="mt-1 w-full rounded-md border px-3 py-2" 
                    {...register("street1")} 
                    data-testid="street1" 
                    autoComplete="address-line1"
                    suppressHydrationWarning 
                  />
                  {errors.street1 && <p className="text-sm text-red-600">{errors.street1.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium">Address Line 2 (optional)</label>
                  <input 
                    className="mt-1 w-full rounded-md border px-3 py-2" 
                    {...register("street2")} 
                    data-testid="street2" 
                    autoComplete="address-line2"
                    suppressHydrationWarning 
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium">City</label>
                    <input 
                      className="mt-1 w-full rounded-md border px-3 py-2" 
                      {...register("city")} 
                      data-testid="city" 
                      autoComplete="address-level2"
                      suppressHydrationWarning 
                    />
                    {errors.city && <p className="text-sm text-red-600">{errors.city.message}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium">State</label>
                <select 
                  className="mt-1 w-full rounded-md border px-3 py-2" 
                  {...register("state")} 
                  data-testid="state" 
                  autoComplete="address-level1"
                  suppressHydrationWarning
                >
                  <option value="" disabled>State</option>
                  <option value="PA" selected>PA</option>
                      <option value="AL">AL</option>
                      <option value="AK">AK</option>
                      <option value="AZ">AZ</option>
                      <option value="AR">AR</option>
                      <option value="CA">CA</option>
                      <option value="CO">CO</option>
                      <option value="CT">CT</option>
                      <option value="DE">DE</option>
                      <option value="FL">FL</option>
                      <option value="GA">GA</option>
                      <option value="HI">HI</option>
                      <option value="ID">ID</option>
                      <option value="IL">IL</option>
                      <option value="IN">IN</option>
                      <option value="IA">IA</option>
                      <option value="KS">KS</option>
                      <option value="KY">KY</option>
                      <option value="LA">LA</option>
                      <option value="ME">ME</option>
                      <option value="MD">MD</option>
                      <option value="MA">MA</option>
                      <option value="MI">MI</option>
                      <option value="MN">MN</option>
                      <option value="MS">MS</option>
                      <option value="MO">MO</option>
                      <option value="MT">MT</option>
                      <option value="NE">NE</option>
                      <option value="NV">NV</option>
                      <option value="NH">NH</option>
                      <option value="NJ">NJ</option>
                      <option value="NM">NM</option>
                      <option value="NY">NY</option>
                      <option value="NC">NC</option>
                      <option value="ND">ND</option>
                      <option value="OH">OH</option>
                      <option value="OK">OK</option>
                      <option value="OR">OR</option>
                      <option value="PA">PA</option>
                      <option value="RI">RI</option>
                      <option value="SC">SC</option>
                      <option value="SD">SD</option>
                      <option value="TN">TN</option>
                      <option value="TX">TX</option>
                      <option value="UT">UT</option>
                      <option value="VT">VT</option>
                      <option value="VA">VA</option>
                      <option value="WA">WA</option>
                      <option value="WV">WV</option>
                      <option value="WI">WI</option>
                      <option value="WY">WY</option>
                      <option value="DC">DC</option>
                    </select>
                    {errors.state && <p className="text-sm text-red-600">{errors.state.message}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium">ZIP Code</label>
                    <input 
                      className="mt-1 w-full rounded-md border px-3 py-2" 
                      {...register("zip")} 
                      data-testid="zip" 
                      autoComplete="postal-code"
                      suppressHydrationWarning 
                    />
                    {errors.zip && <p className="text-sm text-red-600">{errors.zip.message}</p>}
                  </div>
                </div>
              </div>
            </fieldset>
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
          <div>
            <label className="block text-sm font-medium">Requested Service Date</label>
            <div className="mt-1">
              <label htmlFor="requestedDate" className="sr-only">Requested Service Date</label>
              <input 
                id="requestedDate"
                type="date" 
                className="w-full rounded-md border px-3 py-2" 
                min={getTodayString()}
                aria-invalid={errors.requestedDate ? "true" : "false"}
                {...register("requestedDate")} 
                data-testid="requestedDate"
                suppressHydrationWarning
              />
              {errors.requestedDate && <p className="text-sm text-red-600">{errors.requestedDate.message}</p>}
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

