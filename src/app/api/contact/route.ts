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

function createEmailContent(data: {
  name: string;
  company?: string | null;
  phone: string;
  email: string;
  jobAddress: string;
  municipality: string;
  inspectionType: string;
  preferredDate?: string;
  preferredTime?: string;
  preferredDateTime?: string;
  notes?: string | null;
}) {
  const preferredTimeText = data.preferredDate && data.preferredTime 
    ? `${data.preferredDate} at ${data.preferredTime}` 
    : "Not specified";
  
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.jobAddress)}`;
  
  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .header h1 { margin: 0; color: #2c3e50; font-size: 24px; }
    .header p { margin: 5px 0 0 0; color: #666; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background-color: #f8f9fa; font-weight: bold; width: 30%; }
    .actions { margin: 20px 0; }
    .actions a { display: inline-block; margin-right: 15px; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; }
    .actions a:hover { background-color: #0056b3; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <h1>New Inspection Request</h1>
    <p>${data.inspectionType || "General"} inspection requested by ${data.name}</p>
  </div>
  
  <table>
    <tr><th>Name</th><td>${data.name}</td></tr>
    ${data.company ? `<tr><th>Company</th><td>${data.company}</td></tr>` : ''}
    <tr><th>Email</th><td>${data.email}</td></tr>
    <tr><th>Phone</th><td>${data.phone}</td></tr>
    <tr><th>Job Address</th><td>${data.jobAddress}</td></tr>
    <tr><th>Municipality</th><td>${data.municipality}</td></tr>
    <tr><th>Inspection Type</th><td>${data.inspectionType}</td></tr>
    <tr><th>Preferred Time</th><td>${preferredTimeText}</td></tr>
    ${data.preferredDateTime ? `<tr><th>ISO DateTime</th><td>${data.preferredDateTime}</td></tr>` : ''}
    ${data.notes ? `<tr><th>Notes</th><td>${data.notes.replace(/\n/g, '<br>')}</td></tr>` : ''}
  </table>
  
  <div class="actions">
    <a href="tel:${data.phone}">Call Now</a>
    <a href="${mapsUrl}" target="_blank">Open Address in Maps</a>
  </div>
  
  <div class="footer">
    Sent from empireinspectionagency.com
  </div>
</body>
</html>`;

  const textBody = `New Inspection Request
${data.inspectionType || "General"} inspection requested by ${data.name}

Name: ${data.name}
${data.company ? `Company: ${data.company}` : ''}
Email: ${data.email}
Phone: ${data.phone}
Job Address: ${data.jobAddress}
Municipality: ${data.municipality}
Inspection Type: ${data.inspectionType}
Preferred Time: ${preferredTimeText}
${data.preferredDateTime ? `ISO DateTime: ${data.preferredDateTime}` : ''}
${data.notes ? `Notes: ${data.notes}` : ''}

Call now: ${data.phone}
Open address in Maps: ${mapsUrl}

Sent from empireinspectionagency.com`;

  return { htmlBody, textBody };
}

function createCustomerReceiptContent(data: {
  name: string;
  inspectionType: string;
}) {
  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center; }
    .header h1 { margin: 0; color: #2c3e50; }
    .content { margin: 20px 0; }
    .contact-info { background-color: #e9ecef; padding: 15px; border-radius: 5px; margin: 20px 0; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Thank You for Your Inspection Request</h1>
  </div>
  
  <div class="content">
    <p>Dear ${data.name},</p>
    
    <p>Thank you for requesting an inspection with Empire Electrical Solutions. We have received your request and will contact you shortly to confirm the details and schedule your ${data.inspectionType} inspection.</p>
    
    <div class="contact-info">
      <strong>Our Contact Information:</strong><br>
      Phone: <a href="tel:+16103068497">(610) 306-8497</a><br>
      Email: info@empiresolutionsinspectionagency.com
    </div>
    
    <p>We look forward to serving you!</p>
    
    <p>Best regards,<br>
    Empire Electrical Solutions Team</p>
  </div>
  
  <div class="footer">
    Empire Electrical Solutions<br>
    6901 Germantown Avenue, Suite 200<br>
    Philadelphia, PA 19119
  </div>
</body>
</html>`;

  const textBody = `Thank You for Your Inspection Request

Dear ${data.name},

Thank you for requesting an inspection with Empire Electrical Solutions. We have received your request and will contact you shortly to confirm the details and schedule your ${data.inspectionType} inspection.

Our Contact Information:
Phone: (610) 306-8497
Email: info@empiresolutionsinspectionagency.com

We look forward to serving you!

Best regards,
Empire Electrical Solutions Team

Empire Electrical Solutions
6901 Germantown Avenue, Suite 200
Philadelphia, PA 19119`;

  return { htmlBody, textBody };
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json().catch(() => ({}));
    const parsed = contactSchema.safeParse(json);
    
    if (!parsed.success) {
      return NextResponse.json({ 
        ok: false, 
        error: "Validation failed",
        details: parsed.error.flatten() 
      }, { status: 400 });
    }
    
    const data = parsed.data;
    
    // Honeypot check
    if (data._hp) {
      return NextResponse.json({ ok: true });
    }
    
    // Rate limiting
    const ip = getIp(req);
    if (!allow(ip)) {
      return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
    }

    // Environment variables
    const { 
      AWS_REGION, 
      AWS_ACCESS_KEY_ID, 
      AWS_SECRET_ACCESS_KEY,
      MAIL_FROM,
      CLIENT_TO_EMAIL,
      ARCHIVE_BCC,
      SEND_RECEIPT
    } = process.env as Record<string, string | undefined>;
    
    const haveEnv = AWS_REGION && MAIL_FROM && CLIENT_TO_EMAIL && AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY;

    if (!haveEnv) {
      console.log("[DEV CONTACT]", { ip, data });
      return NextResponse.json({ ok: true, dev: true });
    }

    const ses = createSesClient();
    
    // Create email content
    const { htmlBody, textBody } = createEmailContent(data);
    
    // Parse BCC addresses
    const bccAddresses = ARCHIVE_BCC ? ARCHIVE_BCC.split(',').map(email => email.trim()).filter(Boolean) : [];
    
    // Send main email to client
    const subject = `New Inspection Request — ${data.inspectionType || "General"} — ${data.name}`;
    const command = new SendEmailCommand({
      Destination: { 
        ToAddresses: [CLIENT_TO_EMAIL!],
        BccAddresses: bccAddresses.length > 0 ? bccAddresses : undefined
      },
      Source: MAIL_FROM!,
      ReplyToAddresses: [data.email],
      Message: { 
        Subject: { Data: subject }, 
        Body: { 
          Html: { Data: htmlBody },
          Text: { Data: textBody }
        } 
      },
    });
    
    await ses.send(command);
    
    // Send customer receipt if enabled
    if (SEND_RECEIPT === 'true') {
      const { htmlBody: receiptHtml, textBody: receiptText } = createCustomerReceiptContent(data);
      const receiptCommand = new SendEmailCommand({
        Destination: { ToAddresses: [data.email] },
        Source: MAIL_FROM!,
        Message: { 
          Subject: { Data: "Thank you for your inspection request - Empire Electrical Solutions" }, 
          Body: { 
            Html: { Data: receiptHtml },
            Text: { Data: receiptText }
          } 
        },
      });
      
      await ses.send(receiptCommand);
    }
    
    return NextResponse.json({ ok: true });
    
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ 
      ok: false, 
      error: "Internal server error" 
    }, { status: 500 });
  }
}