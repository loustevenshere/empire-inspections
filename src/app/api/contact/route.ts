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
const DEV_MODE = process.env.DEV_MODE === "true";

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
        { ok: false, error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const data = parsed.data;

      console.log("[Contact Route] Env config:", {
      DEV_MODE,
      CONTACT_API_URL: CONTACT_API_URL ?? "undefined",
      CONTACT_SHARED_SECRET_PRESENT: Boolean(CONTACT_SHARED_SECRET),
    });

    if (DEV_MODE) {
      console.log("[Contact Route] DEV_MODE request payload:", data);
      return NextResponse.json({ ok: true, dev: true });
    }

    if (!CONTACT_API_URL) {
      console.error("[Contact Route] Missing CONTACT_API_URL in non-dev mode.");
      return NextResponse.json(
        { ok: false, error: "Contact service misconfigured. Please try again." },
        { status: 500 }
      );
    }

    if ('_hp' in data && data._hp) return NextResponse.json({ ok: true });

    const ip = getIp(req);
    if (!allow(ip)) {
      return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
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

    const upstream = await fetch(CONTACT_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(sig ? { "x-empire-signature": sig } : {}),
      },
      body,
      cache: "no-store",
    });

    if (!upstream.ok) {
      const text = await upstream.text().catch(() => "");
      console.error("[LAMBDA ERROR] Upstream contact error:", upstream.status, text);
      return NextResponse.json({ ok: false, error: `Error sending email - please try again or call us at ${formatPhone(BUSINESS_PHONE)}.` }, { status: 502 });
    }

    const out = await upstream.json().catch(() => ({ ok: true }));
    
    // Log the successful response
    
    return NextResponse.json(out, { status: 200 });
  } catch (err) {
    console.error("Contact proxy error:", err);
    return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500 });
  }
}