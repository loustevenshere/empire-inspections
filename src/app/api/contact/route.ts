import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation";
import { allow } from "@/lib/rateLimit";
import { SendEmailCommand, createSesClient } from "@/lib/ses";

function getIp(req: NextRequest) {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "local";
}

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => ({}));
  const parsed = contactSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;
  if (data._hp) {
    return NextResponse.json({ ok: true });
  }
  const ip = getIp(req);
  if (!allow(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  const { AWS_REGION, AWS_SES_SENDER, AWS_SES_TO } = process.env as Record<string, string | undefined>;
  const haveEnv = AWS_REGION && AWS_SES_SENDER && AWS_SES_TO && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY;

  if (!haveEnv) {
    console.log("[DEV CONTACT]", { ip, data });
    return NextResponse.json({ ok: true, dev: true });
  }

  const ses = createSesClient();
  const subject = `New Inspection Request: ${data.name}`;
  const text = `Name: ${data.name}\nCompany: ${data.company ?? "-"}\nPhone: ${data.phone}\nEmail: ${data.email}\nAddress: ${data.jobAddress}\nMunicipality: ${data.municipality}\nType: ${data.inspectionType}\nPreferred: ${data.preferred}\nNotes: ${data.notes ?? "-"}`;
  const command = new SendEmailCommand({
    Destination: { ToAddresses: [AWS_SES_TO!] },
    Source: AWS_SES_SENDER!,
    ReplyToAddresses: [data.email],
    Message: { Subject: { Data: subject }, Body: { Text: { Data: text } } },
  });
  await ses.send(command);
  return NextResponse.json({ ok: true });
}

