import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation";
import { allow } from "@/lib/rateLimit";
import { BUSINESS_PHONE, formatPhone } from "@/config/contact";
import crypto from "crypto";

function getIp(req: NextRequest) {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "local";
}

const CONTACT_API_URL = process.env.CONTACT_API_URL; // e.g., https://<apiId>.execute-api.us-east-1.amazonaws.com/prod/contact  
const CONTACT_SHARED_SECRET = process.env.CONTACT_SHARED_SECRET; // optional

function signBody(body: string): string | undefined {
  if (!CONTACT_SHARED_SECRET) return undefined;
  return crypto.createHmac("sha256", CONTACT_SHARED_SECRET).update(body).digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json().catch(() => ({}));
    const parsed = contactSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Honeypot
    if ('_hp' in data && data._hp) return NextResponse.json({ ok: true });

    // Rate limit
    const ip = getIp(req);
    if (!allow(ip)) {
      return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
    }

    if (!CONTACT_API_URL) {
      console.log("[DEV CONTACT] would forward:", { ip, data });
      return NextResponse.json({ ok: true, dev: true });
    }

    // Only forward whitelisted fields
    const forward = {
      name: data.name,
      company: data.company ?? null,
      email: data.email,
      phone: data.phone,
      jobAddress: data.jobAddress,
      municipality: data.municipality,
      inspectionType: data.inspectionType,
      requestedDate: data.requestedDate ?? null,
      notes: data.notes ?? null,
    };
    const body = JSON.stringify(forward);
    const sig = signBody(body);

    // Log the request being sent to lambda
    console.log("[LAMBDA REQUEST] URL:", CONTACT_API_URL);
    console.log("[LAMBDA REQUEST] Headers:", {
      "Content-Type": "application/json",
      ...(sig ? { "x-empire-signature": sig } : {}),
    });
    console.log("[LAMBDA REQUEST] Body:", body);

    const upstream = await fetch(CONTACT_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(sig ? { "x-empire-signature": sig } : {}),
      },
      body,
      cache: "no-store",
    });

    // Log response status and headers
    console.log("[LAMBDA RESPONSE] Status:", upstream.status);
    console.log("[LAMBDA RESPONSE] Status Text:", upstream.statusText);
    console.log("[LAMBDA RESPONSE] Headers:", Object.fromEntries(upstream.headers.entries()));

    if (!upstream.ok) {
      const text = await upstream.text().catch(() => "");
      console.error("[LAMBDA ERROR] Upstream contact error:", upstream.status, text);
      return NextResponse.json({ ok: false, error: `Error sending email - please try again or call us at ${formatPhone(BUSINESS_PHONE)}.` }, { status: 502 });
    }

    const out = await upstream.json().catch(() => ({ ok: true }));
    
    // Log the successful response
    console.log("[LAMBDA SUCCESS] Response body:", JSON.stringify(out, null, 2));
    
    return NextResponse.json(out, { status: 200 });
  } catch (err) {
    console.error("Contact proxy error:", err);
    return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500 });
  }
}