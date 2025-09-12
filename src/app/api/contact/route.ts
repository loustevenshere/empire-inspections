import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation";
import { allow } from "@/lib/rateLimit";
import { getPrimaryPhone } from "@/config/contact";
import crypto from "crypto";

function getIp(req: NextRequest) {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "local";
}

const CONTACT_API_URL = process.env.CONTACT_API_URL!; // e.g., https://<apiId>.execute-api.us-east-1.amazonaws.com/prod/contact
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
      preferredDate: data.preferredDate ?? null,
      preferredTime: data.preferredTime ?? null,
      preferredDateTime: data.preferredDateTime ?? null,
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
      console.error("Upstream contact error:", upstream.status, text);
      const primary = getPrimaryPhone();
      return NextResponse.json({ ok: false, error: `Error sending email - please try again or call us at ${primary.human}.` }, { status: 502 });
    }

    const out = await upstream.json().catch(() => ({ ok: true }));
    return NextResponse.json(out, { status: 200 });
  } catch (err) {
    console.error("Contact proxy error:", err);
    return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500 });
  }
}