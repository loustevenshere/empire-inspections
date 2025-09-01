"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContactForm, contactSchema, inspectionTypeEnum } from "@/lib/validation";
import { useState } from "react";


export default function Page() {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(data: ContactForm) {
    const resp = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (resp.ok) setSubmitted(true);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold">Request Inspection</h1>
      
      {/* Business Information */}
      <div className="mt-4 p-4 bg-muted/30 rounded-lg">
        <h2 className="font-medium mb-2">Empire Electrical Solutions</h2>
        <p className="text-sm text-muted-foreground mb-1">6901 Germantown Avenue, Suite 200</p>
        <p className="text-sm text-muted-foreground mb-2">Philadelphia, PA 19119</p>
        <p className="text-sm">
          <a href="tel:+16103068497" className="text-primary hover:underline">(610) 306-8497</a>
        </p>
      </div>
      
      {submitted ? (
        <p className="mt-4">Thanks! We&apos;ll be in touch shortly.</p>
      ) : (
        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <input type="text" className="hidden" aria-hidden="true" tabIndex={-1} {...register("_hp")} />
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input className="mt-1 w-full rounded-md border px-3 py-2" {...register("name")} />
            {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Company (optional)</label>
            <input className="mt-1 w-full rounded-md border px-3 py-2" {...register("company")} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium">Phone</label>
              <input type="tel" className="mt-1 w-full rounded-md border px-3 py-2" {...register("phone")} />
              {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input type="email" className="mt-1 w-full rounded-md border px-3 py-2" {...register("email")} />
              {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Job Address</label>
            <input className="mt-1 w-full rounded-md border px-3 py-2" {...register("jobAddress")} />
            {errors.jobAddress && <p className="text-sm text-red-600">{errors.jobAddress.message}</p>}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium">Municipality</label>
              <input className="mt-1 w-full rounded-md border px-3 py-2" {...register("municipality")} />
              {errors.municipality && <p className="text-sm text-red-600">{errors.municipality.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Inspection Type</label>
              <select className="mt-1 w-full rounded-md border px-3 py-2" {...register("inspectionType")}>
                {inspectionTypeEnum.options.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Preferred Time</label>
            <input className="mt-1 w-full rounded-md border px-3 py-2" {...register("preferred")} />
            {errors.preferred && <p className="text-sm text-red-600">{errors.preferred.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Notes</label>
            <textarea rows={4} className="mt-1 w-full rounded-md border px-3 py-2" {...register("notes")} />
          </div>
          <button disabled={isSubmitting} className="w-full rounded-md bg-primary px-4 py-3 font-semibold text-primary-foreground disabled:opacity-60">
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      )}
    </div>
  );
}

