import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import crypto from "crypto";

// --- Logging Utility ---
const LOG_SAMPLE = parseFloat(process.env.LOG_SAMPLE || "1.0");

function safeLen(str) {
  return str ? String(str).length : 0;
}

function emailDomain(email) {
  if (!email || typeof email !== "string") return null;
  const match = email.match(/@(.+)$/);
  return match ? match[1] : null;
}

function log(level, data) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    ...data,
  };

  // Apply sampling for INFO logs
  if (level === "INFO" && LOG_SAMPLE < 1.0) {
    if (Math.random() > LOG_SAMPLE) return;
  }

  console.log(JSON.stringify(logEntry));
}

// --- Config ---
const REGION = process.env.AWS_REGION || "us-east-1";
const ses = new SESv2Client({ region: REGION });

const ORIGIN = process.env.ALLOWED_ORIGIN; // e.g., https://empireinspectionagency.com
const TO = process.env.TO_EMAIL_DEV; // office inbox (recipient)
const FROM_OFFICE = process.env.FROM_OFFICE; // requests@your-domain.com (to office)
const FROM_USER = process.env.FROM_USER; // no-reply@your-domain.com (to user)
const CONFIGURATION_SET = process.env.CONFIGURATION_SET || undefined;
const RETURN_PATH = process.env.RETURN_PATH || undefined; // e.g. bounce@your-domain.com
const SHARED_SECRET = process.env.SHARED_SECRET || undefined; // for HMAC signing

// ---- Utilities ----
function corsHeaders(originHeader) {
  // Be strict if ORIGIN is set; otherwise, fall back to *
  const allow = ORIGIN ? (originHeader === ORIGIN ? ORIGIN : "null") : "*";
  return {
    "Access-Control-Allow-Origin": allow,
    Vary: "Origin",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,x-empire-signature",
  };
}

function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

// Normalize to YYYY-MM-DD; accept ISO or US MM/DD/YYYY; return null if invalid
function normalizeRequestedDate(input) {
  if (!input) return null;
  const s = String(input).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) {
    const mm = m[1].padStart(2, "0");
    const dd = m[2].padStart(2, "0");
    const yyyy = m[3];
    const month = Number(mm),
      day = Number(dd);
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      return `${yyyy}-${mm}-${dd}`;
    }
  }
  return null;
}

// Optional HMAC verification of raw body using SHARED_SECRET and header x-empire-signature (hex)
function verifySignature(raw, headerSig) {
  if (!SHARED_SECRET) return true; // signing disabled
  if (!headerSig || typeof headerSig !== "string") return false;
  const h = crypto
    .createHmac("sha256", SHARED_SECRET)
    .update(raw, "utf8")
    .digest("hex");
  // timing-safe compare
  const a = Buffer.from(h, "hex");
  const b = Buffer.from(headerSig, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export const handler = async (event) => {
  const startTime = Date.now();
  const originHeader = event.headers?.origin || event.headers?.Origin || "";
  const headers = corsHeaders(originHeader);
  const requestId = crypto.randomUUID?.() || String(Date.now());
  const apiReqId = event.requestContext?.requestId || "unknown";
  const method = event.requestContext?.http?.method || "unknown";

  // CORS preflight
  if (event.requestContext?.http?.method === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    // Normalize/parse body (handles v1/v2 + base64)
    const raw =
      typeof event.body === "string"
        ? event.body
        : JSON.stringify(event.body || "{}");
    const decoded = event.isBase64Encoded
      ? Buffer.from(raw, "base64").toString("utf8")
      : raw;

    // Optional signature verification
    const sig =
      event.headers?.["x-empire-signature"] ||
      event.headers?.["X-Empire-Signature"];
    const sigOk = verifySignature(decoded, sig);
    if (!sigOk) {
      log("WARN", {
        requestId,
        apiReqId,
        method,
        error: "invalid_signature",
      });
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ ok: false, error: "Unauthorized" }),
      };
    }

    let body;
    try {
      body = JSON.parse(decoded || "{}");
    } catch {
      log("WARN", {
        requestId,
        apiReqId,
        method,
        error: "invalid_json_body",
      });
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ ok: false, error: "Invalid JSON body." }),
      };
    }

    // Extract fields
    const name = (body.name || "").toString().trim();
    const company = (body.company || "").toString().trim();
    const email = (body.email || "").toString().trim();
    const phone = (body.phone || "").toString().trim();
    const jobAddress = (body.jobAddress || "").toString().trim();
    const municipality = (body.municipality || "").toString().trim();
    const inspectionType = (body.inspectionType || "").toString().trim();
    const requestedDate = normalizeRequestedDate(
      (body.requestedDate || body.preferredDate || "").toString().trim()
    );
    const message = (body.message || body.notes || "").toString().trim();

    // --- Config checks ---
    if (!FROM_OFFICE || !TO) {
      log("ERROR", {
        requestId,
        apiReqId,
        method,
        error: "missing_config",
        missingFromOffice: !FROM_OFFICE,
        missingTo: !TO,
      });
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          ok: false,
          error: "Server email not configured",
        }),
      };
    }
    if (!name) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ ok: false, error: "Name is required." }),
      };
    }
    // Note: requestedDate is optional - if not provided, we'll use a placeholder
    const displayDate = requestedDate || "Not specified";

    // Soft email validation for reply-to & confirmation only
    const hasValidEmail =
      typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const canConfirm = !!FROM_USER && hasValidEmail;

    const subject = `New Inspection — ${displayDate} — ${name}${
      inspectionType ? " — " + inspectionType : ""
    }`;

    // --- Internal office email (must always send) ---
    const html = `
      <h2>New Inspection Request</h2>
      <p><b>Name:</b> ${escapeHtml(name)}</p>
      ${company ? `<p><b>Company:</b> ${escapeHtml(company)}</p>` : ""}
      <p><b>Email:</b> ${escapeHtml(email)}</p>
      <p><b>Phone:</b> ${escapeHtml(phone)}</p>
      <p><b>Job Address:</b> ${escapeHtml(jobAddress)}</p>
      <p><b>Municipality:</b> ${escapeHtml(municipality)}</p>
      <p><b>Inspection Type:</b> ${escapeHtml(inspectionType)}</p>
      <p><b>Requested Service Date:</b> ${escapeHtml(displayDate)}</p>
      ${message ? `<p><b>Message:</b> ${escapeHtml(message)}</p>` : ""}
    `;
    const text = `New Inspection Request

Name: ${name}
${company ? `Company: ${company}` : ""}
Email: ${email}
Phone: ${phone}
Job Address: ${jobAddress}
Municipality: ${municipality}
Inspection Type: ${inspectionType}
Requested Service Date: ${displayDate}
${message ? `Message: ${message}` : ""}`.trim();

    const officeCmd = new SendEmailCommand({
      FromEmailAddress: FROM_OFFICE,
      Destination: { ToAddresses: [TO] },
      ReplyToAddresses: hasValidEmail ? [email] : [],
      FeedbackForwardingEmailAddress: RETURN_PATH, // optional
      ConfigurationSetName: CONFIGURATION_SET, // optional
      Content: {
        Simple: {
          Subject: { Data: subject },
          Body: { Text: { Data: text }, Html: { Data: html } },
        },
      },
      EmailTags: [
        { Name: "app", Value: "empire-inspection" },
        { Name: "type", Value: "internal" },
        { Name: "requestedDate", Value: displayDate },
      ],
    });

    const officeResp = await ses.send(officeCmd);

    // --- User confirmation email (non-blocking, only if FROM_USER+valid email) ---
    if (canConfirm) {
      const confirmSubject = `We've received your inspection request for ${displayDate}`;
      const confirmText = `
Hi ${name},

Thank you for contacting Empire Inspection Agency. We are committed to connecting you with our expert, inspection professionals. Our goal is to quickly execute your inspection needs and are available to work closely with your municipalities to ensure contractor/customer satisfaction. A team member will contact you with your provided contact information during our regular business hours, which are 7:30AM - 4:00 PM (Monday-Friday) excluding holidays.

Requested Service Date: ${displayDate}

If you need immediate assistance, please call (215) 839-8997.

Best regards, Team Empire
      `.trim();

      const confirmHtml = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222; max-width: 600px; margin: 0 auto; padding: 20px;">
          <p style="margin-bottom: 16px;">Hi ${escapeHtml(name)},</p>
          
          <p style="margin-bottom: 16px;">Thank you for contacting <strong>Empire Inspection Agency</strong>. We are committed to connecting you with our expert, inspection professionals. Our goal is to quickly execute your inspection needs and are available to work closely with your municipalities to ensure contractor/customer satisfaction. A team member will contact you with your provided contact information during our regular business hours, which are <strong>7:30AM - 4:00 PM (Monday-Friday)</strong> excluding holidays.</p>
          
          <div style="background-color: #f8f9fa; padding: 16px; border-left: 4px solid #007bff; margin: 20px 0;">
            <p style="margin: 0;"><strong>Requested Service Date:</strong> ${escapeHtml(
              displayDate
            )}</p>
          </div>
          
          <p style="margin-bottom: 16px;">If you need immediate assistance, please call <a href="tel:2158398997" style="color: #007bff; text-decoration: none; font-weight: bold;">(215) 839-8997</a>.</p>
          
          <p style="margin-top: 24px; font-weight: bold;">Best regards,<br>Team Empire</p>
        </div>
      `;

      const confirmCmd = new SendEmailCommand({
        FromEmailAddress: FROM_USER,
        Destination: { ToAddresses: [email] },
        FeedbackForwardingEmailAddress: RETURN_PATH, // optional
        ConfigurationSetName: CONFIGURATION_SET, // optional
        Content: {
          Simple: {
            Subject: { Data: confirmSubject },
            Body: { Text: { Data: confirmText }, Html: { Data: confirmHtml } },
          },
        },
        EmailTags: [
          { Name: "app", Value: "empire-inspection" },
          { Name: "type", Value: "confirmation" },
          { Name: "requestedDate", Value: displayDate },
        ],
      });

      try {
        const confirmResp = await ses.send(confirmCmd);
        // Store confirmation messageId for final log
        var confirmMessageId = confirmResp.MessageId;
      } catch (confirmErr) {
        log("WARN", {
          requestId,
          apiReqId,
          method,
          error: "confirmation_send_failure",
          sesError: confirmErr?.name,
          sesStatus: confirmErr?.$metadata?.httpStatusCode,
        });
        // Do not fail the whole request on confirmation failure.
      }
    } else {
      var confirmSkipReason = !FROM_USER ? "no_from_user" : "invalid_email";
    }

    // Final comprehensive INFO log
    const executionTime = Date.now() - startTime;
    log("INFO", {
      requestId,
      apiReqId,
      method,
      originAllowed: ORIGIN ? originHeader === ORIGIN : true,
      sigOk,
      fieldPresence: {
        nameLen: safeLen(name),
        companyLen: safeLen(company),
        emailLen: safeLen(email),
        phoneLen: safeLen(phone),
        jobAddressLen: safeLen(jobAddress),
        municipalityLen: safeLen(municipality),
        inspectionTypeLen: safeLen(inspectionType),
        messageLen: safeLen(message),
        hasRequestedDate: !!requestedDate,
      },
      emailDomain: emailDomain(email),
      officeSesMessageId: officeResp.MessageId,
      confirmSesMessageId: confirmMessageId || null,
      confirmSkipReason: confirmSkipReason || null,
      config: {
        hasOrigin: !!ORIGIN,
        hasConfigSet: !!CONFIGURATION_SET,
        hasReturnPath: !!RETURN_PATH,
        signing: !!SHARED_SECRET,
        region: REGION,
      },
      executionTimeMs: executionTime,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        ok: true,
        requestId,
        messageId: "office:" + (officeResp.MessageId || ""),
        requestedDate: displayDate,
      }),
    };
  } catch (err) {
    log("ERROR", {
      requestId,
      apiReqId,
      method,
      error: "fatal_ses_error",
      sesError: err?.name,
      sesStatus: err?.$metadata?.httpStatusCode,
      sesMessage: err?.message,
    });
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ ok: false, error: "Email send failed" }),
    };
  }
};
