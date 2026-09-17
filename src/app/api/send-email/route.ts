import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { to, subject, title, category, departmentName, authorName, details, actionUrl } = body;

    const gmailUser = process.env.GMAIL_USER || "databasegerilya@gmail.com";
    const gmailPass = process.env.GMAIL_PASS || "pydnehmwaadjzdsy";
    const resendApiKey = process.env.RESEND_API_KEY;

    // Target email recipient list
    const recipientEmails = Array.isArray(to) && to.length > 0 
      ? to 
      : (typeof to === "string" && to.trim() !== "" 
          ? to.split(",").map(e => e.trim()).filter(Boolean) 
          : ["haryswork06@gmail.com"]);

    // HTML Email Template with Minimalist Nasi Gerilya Branding
    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f5f7; margin: 0; padding: 24px 12px; color: #0f172a; -webkit-font-smoothing: antialiased; }
          .container { max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.03); }
          .top-bar { height: 4px; background: #dc2626; }
          .header { padding: 24px 28px 16px 28px; border-bottom: 1px solid #f1f5f9; }
          .brand-title { font-size: 13px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; color: #0f172a; margin: 0; }
          .brand-sub { font-size: 11px; color: #64748b; margin: 2px 0 0 0; font-weight: 500; }
          .body { padding: 28px; }
          .tag { display: inline-block; padding: 4px 10px; background: #f1f5f9; color: #475569; border-radius: 6px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 14px; }
          .title { font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 12px 0; line-height: 1.35; }
          .meta-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px 16px; margin-bottom: 20px; font-size: 12px; color: #475569; }
          .meta-item { display: inline-block; margin-right: 16px; }
          .meta-label { color: #94a3b8; font-weight: 500; }
          .meta-val { color: #0f172a; font-weight: 700; }
          .content-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px 20px; font-size: 13px; color: #334155; line-height: 1.6; margin-bottom: 24px; }
          .btn-wrap { text-align: left; margin-top: 24px; }
          .btn { display: inline-block; padding: 11px 22px; background: #0f172a; color: #ffffff !important; text-decoration: none; font-size: 12px; font-weight: 700; border-radius: 8px; }
          .footer { padding: 20px 28px; background: #fafafa; font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #f1f5f9; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="top-bar"></div>
          <div class="header">
            <h1 class="brand-title">SCOREBOARD NASI GERILYA</h1>
            <p class="brand-sub">Sistem Operasional &amp; Monitoring KPI</p>
          </div>
          <div class="body">
            <span class="tag">${category || "NOTIFIKASI SISTEM"}</span>
            <h2 class="title">${title || subject}</h2>
            <div class="meta-box">
              <span class="meta-item"><span class="meta-label">Pengirim:</span> <span class="meta-val">${authorName || "Sistem"}</span></span>
              <span class="meta-item"><span class="meta-label">Divisi:</span> <span class="meta-val">${departmentName || "Global"}</span></span>
            </div>
            <div class="content-card">
              ${details ? details.replace(/\n/g, "<br/>") : "Ada pembaruan aktivitas baru di sistem Scoreboard Nasi Gerilya."}
            </div>
            ${actionUrl ? `
            <div class="btn-wrap">
              <a href="${actionUrl}" class="btn">Buka Scoreboard &rarr;</a>
            </div>
            ` : ""}
          </div>
          <div class="footer">
            Email notifikasi otomatis Scoreboard Nasi Gerilya &bull; Mohon tidak membalas email ini.
          </div>
        </div>
      </body>
      </html>
    `;

    // 1. Try Gmail SMTP first if credentials are set
    if (gmailUser && gmailPass) {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: gmailUser,
            pass: gmailPass
          }
        });

        const mailOptions = {
          from: `"Scoreboard Nasi Gerilya" <${gmailUser}>`,
          to: recipientEmails.join(", "),
          subject: subject || "Notifikasi Baru - Scoreboard Nasi Gerilya",
          html: htmlBody
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Gmail SMTP email sent:", info.messageId);
        return NextResponse.json({ success: true, messageId: info.messageId, provider: "Gmail SMTP" });
      } catch (gmailErr: any) {
        console.error("Gmail SMTP error, falling back to Resend:", gmailErr);
      }
    }

    // 2. Fallback to Resend API if Gmail SMTP is unavailable or fails
    if (resendApiKey) {
      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: "Nasi Gerilya Scoreboard <onboarding@resend.dev>",
          to: recipientEmails,
          subject: subject || "Notifikasi Baru - Scoreboard Nasi Gerilya",
          html: htmlBody
        })
      });

      const resData = await resendResponse.json();

      if (!resendResponse.ok) {
        console.error("Resend API error:", resData);
        return NextResponse.json(
          { success: false, error: resData.message || JSON.stringify(resData) },
          { status: resendResponse.status }
        );
      }

      return NextResponse.json({ success: true, data: resData, provider: "Resend API" });
    }

    return NextResponse.json(
      { success: false, error: "Tidak ada kredensial pengirim email yang valid." },
      { status: 500 }
    );
  } catch (err: any) {
    console.error("Send email route error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
