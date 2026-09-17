import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import nodemailer from "nodemailer";

async function generateDigestAndSend(customMessage?: string, customRecipient?: string | string[], customDisplayTime?: string) {
  // 1. Fetch recent active issues, todos, metrics, and headlines from Supabase
  const { data: issues } = await supabase.from("issues").select("*").eq("status", "open");
  const { data: todos } = await supabase.from("todos").select("*").eq("status", "pending");
  const { data: headlines } = await supabase.from("headlines").select("*").order("created_at", { ascending: false }).limit(5);
  const { data: metrics } = await supabase.from("metrics").select("*").eq("is_active", true);

  const openIssuesCount = issues ? issues.length : 0;
  const pendingTodosCount = todos ? todos.length : 0;
  const activeMetricsCount = metrics ? metrics.length : 0;
  const recentHeadlinesCount = headlines ? headlines.length : 0;

  const gmailUser = process.env.GMAIL_USER || "databasegerilya@gmail.com";
  const gmailPass = process.env.GMAIL_PASS || "pydnehmwaadjzdsy";
  const resendApiKey = process.env.RESEND_API_KEY;

  let recipientEmails: string[] = ["haryswork06@gmail.com"];
  if (customRecipient) {
    recipientEmails = Array.isArray(customRecipient)
      ? customRecipient
      : customRecipient.split(",").map(e => e.trim()).filter(Boolean);
  }

  const isManual = Boolean(customMessage);
  const subject = isManual 
    ? `📤 [Laporan Manual Scoreboard] Rangkuman Operasional & KPI Nasi Gerilya`
    : `⏰ Summary Scoreboard Nasi Gerilya`;

  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f5f7; margin: 0; padding: 24px 12px; color: #0f172a; -webkit-font-smoothing: antialiased; }
        .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.03); }
        .top-bar { height: 4px; background: #dc2626; }
        .header { padding: 24px 28px 18px 28px; border-bottom: 1px solid #f1f5f9; }
        .brand-title { font-size: 13px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; color: #0f172a; margin: 0; }
        .brand-sub { font-size: 11px; color: #64748b; margin: 3px 0 0 0; font-weight: 500; }
        .body { padding: 28px; }
        .report-title { font-size: 18px; font-weight: 800; color: #0f172a; margin: 0 0 4px 0; }
        .report-date { font-size: 12px; color: #64748b; margin: 0 0 20px 0; }
        .stats-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        .stat-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px 12px; text-align: center; }
        .stat-val { font-size: 24px; font-weight: 800; color: #0f172a; line-height: 1; margin-bottom: 6px; }
        .stat-lbl { font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
        .note-card { background: #f8fafc; border: 1px solid #e2e8f0; border-left: 3px solid #0f172a; padding: 14px 16px; border-radius: 8px; font-size: 12px; color: #334155; line-height: 1.6; margin-bottom: 24px; }
        .sec-head { font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.8px; margin: 20px 0 10px 0; }
        .list-item { background: #ffffff; border: 1px solid #e2e8f0; padding: 12px 14px; border-radius: 8px; font-size: 12px; color: #334155; margin-bottom: 8px; }
        .list-item strong { color: #0f172a; }
        .btn-wrap { text-align: center; margin-top: 28px; }
        .btn { display: inline-block; padding: 12px 26px; background: #0f172a; color: #ffffff !important; text-decoration: none; font-size: 12px; font-weight: 700; border-radius: 8px; }
        .footer { padding: 20px 28px; background: #fafafa; font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #f1f5f9; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="top-bar"></div>
        <div class="header">
          <h1 class="brand-title">SCOREBOARD NASI GERILYA</h1>
          <p class="brand-sub">Ringkasan Operasional Perusahaan</p>
        </div>
        <div class="body">
          <h2 class="report-title">${isManual ? "Laporan Rangkuman Operasional" : "Laporan Rangkuman Harian"}</h2>
          <p class="report-date">${isManual ? "Pembaruan On-Demand" : "Laporan Rangkuman Harian"} &bull; ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>

          ${customMessage ? `
            <div class="note-card">
              <strong style="color:#0f172a; display:block; margin-bottom:4px;">Catatan Pengirim:</strong>
              ${customMessage.replace(/\n/g, "<br/>")}
            </div>
          ` : ""}

          <table class="stats-table">
            <tr>
              <td width="32%" style="padding-right: 6px;">
                <div class="stat-card">
                  <div class="stat-val">${activeMetricsCount}</div>
                  <div class="stat-lbl">Metrik KPI</div>
                </div>
              </td>
              <td width="36%" style="padding: 0 3px;">
                <div class="stat-card">
                  <div class="stat-val" style="color: ${openIssuesCount > 0 ? '#e11d48' : '#0f172a'};">${openIssuesCount}</div>
                  <div class="stat-lbl">Issue Terbuka</div>
                </div>
              </td>
              <td width="32%" style="padding-left: 6px;">
                <div class="stat-card">
                  <div class="stat-val">${pendingTodosCount}</div>
                  <div class="stat-lbl">Todo Pending</div>
                </div>
              </td>
            </tr>
          </table>

          <div class="sec-head">Status Kendala Aktif (Issues)</div>
          ${openIssuesCount > 0 
            ? issues?.slice(0, 5).map(i => `<div class="list-item"><strong>${i.title}</strong> &bull; Priority: ${i.priority.toUpperCase()} &bull; PIC: ${i.pic_name}</div>`).join("") 
            : "<div class='list-item' style='color:#64748b;'>Tidak ada kendala aktif saat ini. Semuanya aman.</div>"}

          <div class="sec-head">Daftar Tugas Pending (Todos)</div>
          ${pendingTodosCount > 0 
            ? todos?.slice(0, 5).map(t => `<div class="list-item"><strong>${t.title}</strong> &bull; Deadline: ${t.deadline}</div>`).join("") 
            : "<div class='list-item' style='color:#64748b;'>Seluruh daftar tugas pending telah selesai.</div>"}

          <div class="btn-wrap">
            <a href="https://scoreboardng.vercel.app" class="btn">Buka Scoreboard &rarr;</a>
          </div>
        </div>
        <div class="footer">
          Laporan Rangkuman Otomatis Scoreboard Nasi Gerilya &bull; ${new Date().toLocaleString("id-ID")}
        </div>
      </div>
    </body>
    </html>
  `;

  // 1. Try Gmail SMTP first
  if (gmailUser && gmailPass) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: gmailUser, pass: gmailPass }
      });
      await transporter.sendMail({
        from: `"Scoreboard Nasi Gerilya" <${gmailUser}>`,
        to: recipientEmails.join(", "),
        subject,
        html: htmlBody
      });
      return { success: true, message: `Laporan Rangkuman terkirim via Gmail SMTP ke ${recipientEmails.join(", ")}` };
    } catch (e: any) {
      console.error("Gmail SMTP cron error, falling back to Resend:", e);
    }
  }

  // 2. Fallback to Resend API
  if (resendApiKey) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${resendApiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Nasi Gerilya Scoreboard <onboarding@resend.dev>",
        to: recipientEmails,
        subject,
        html: htmlBody
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Resend API error");
    return { success: true, message: `Laporan Rangkuman terkirim via Resend API ke ${recipientEmails.join(", ")}` };
  }

  throw new Error("Kredensial pengirim email tidak tersedia.");
}

export async function GET(req: Request) {
  try {
    // 1. Fetch system_settings from Supabase for configured schedule
    const { data: settingsData } = await supabase
      .from("system_settings")
      .select("value")
      .eq("key", "email_notif_settings")
      .maybeSingle();

    const notifSettings = settingsData?.value || {
      enabled: true,
      targetEmail: "haryswork06@gmail.com",
      timingMode: "scheduled",
      scheduledTime: "12:00"
    };

    // Check if URL query has ?force=true (for manual testing/overrides)
    const url = new URL(req.url);
    const isForce = url.searchParams.get("force") === "true";

    // 2. If disabled, skip sending
    if (!isForce && notifSettings.enabled === false) {
      return NextResponse.json({
        success: true,
        skipped: true,
        reason: "Notifikasi email sedang dinonaktifkan (DISABLED)."
      });
    }

    // 3. If timingMode is instant, skip automated cron (instant notifications are sent real-time)
    if (!isForce && notifSettings.timingMode === "instant") {
      return NextResponse.json({
        success: true,
        skipped: true,
        reason: "Modus pengiriman diatur ke Instan (Real-time). Cron harian dilewati."
      });
    }

    // 4. Check current hour in WIB (UTC+7)
    const now = new Date();
    const wibHour = (now.getUTCHours() + 7) % 24;
    const wibHourStr = String(wibHour).padStart(2, "0");

    // Extract target hour from scheduledTime (e.g. "11:00" -> "11")
    const targetTime = notifSettings.scheduledTime || "12:00";
    const targetHourStr = targetTime.split(":")[0].padStart(2, "0");

    if (!isForce && wibHourStr !== targetHourStr) {
      return NextResponse.json({
        success: true,
        skipped: true,
        currentWibTime: `${wibHourStr}:00 WIB`,
        targetScheduledTime: `${targetTime} WIB`,
        reason: `Jadwal pengiriman diatur pada ${targetTime} WIB. Jam saat ini (${wibHourStr}:00 WIB) belum sesuai.`
      });
    }

    // Extract recipient emails
    const recipients = notifSettings.targetEmail
      ? notifSettings.targetEmail.split(",").map((e: string) => e.trim()).filter(Boolean)
      : undefined;

    const scheduledDisplayTime = `${targetTime} WIB`;
    const result = await generateDigestAndSend(undefined, recipients, scheduledDisplayTime);
    return NextResponse.json({ ...result, triggeredWibTime: `${wibHourStr}:00 WIB`, scheduledTime: scheduledDisplayTime });
  } catch (err: any) {
    console.error("Daily digest GET cron error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customMessage, customRecipient } = body;
    const result = await generateDigestAndSend(customMessage, customRecipient);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Daily digest POST manual trigger error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
