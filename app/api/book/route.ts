import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { site } from "@/lib/data";

export const runtime = "nodejs";

// Sends each booking to your inbox, plus a confirmation to the visitor.
// Needs SMTP_USER and SMTP_PASS in .env.local (see README). Without them it
// returns ok:false and the site falls back to the WhatsApp button.

const clean = (v: unknown, max = 2000) => String(v ?? "").replace(/[\r\n]+/g, (m) => (max > 200 ? m : " ")).trim().slice(0, max);
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 }); }

  // Spam trap
  if (clean(body.company)) return NextResponse.json({ ok: true });

  const d = {
    name: clean(body.name, 120),
    email: clean(body.email, 200),
    phone: clean(body.phone, 40),
    when: clean(body.when, 120),
    project: clean(body.project, 80),
    budget: clean(body.budget, 80),
    mode: clean(body.mode, 40),
    message: clean(body.message, 3000),
  };
  if (!d.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email) || !d.when) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) return NextResponse.json({ ok: false, error: "not_configured" });

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 465),
    secure: Number(process.env.SMTP_PORT || 465) === 465,
    auth: { user, pass },
  });

  const to = process.env.BOOKING_TO || site.email;
  const rows: [string, string][] = [
    ["When", d.when], ["Name", d.name], ["Email", d.email], ["Phone", d.phone || "-"],
    ["Project", d.project], ["Budget", d.budget], ["Call on", d.mode],
  ];
  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;color:#111">
    <h2 style="margin:0 0 12px">New call booking</h2>
    <table cellpadding="6" style="border-collapse:collapse">${rows.map(([k, v]) => `<tr><td style="color:#666">${k}</td><td><b>${esc(v)}</b></td></tr>`).join("")}</table>
    <p style="margin-top:16px;color:#666">Idea</p><p style="white-space:pre-wrap">${esc(d.message || "-")}</p></div>`;

  try {
    await transporter.sendMail({
      from: `"LeadCapp website" <${user}>`,
      to,
      replyTo: `"${d.name}" <${d.email}>`,
      subject: `New call booking: ${d.name} · ${d.when}`,
      text: rows.map(([k, v]) => `${k}: ${v}`).join("\n") + `\n\nIdea:\n${d.message || "-"}`,
      html,
    });
    // Confirmation to the visitor (failure here doesn't fail the booking)
    await transporter.sendMail({
      from: `"LeadCapp" <${user}>`,
      to: d.email,
      replyTo: to,
      subject: `Your call with LeadCapp · ${d.when}`,
      text: `Hi ${d.name},\n\nThanks for booking a call with LeadCapp for ${d.when}. We'll send the meeting link shortly.\n\nIf you need to change the time, just reply to this email or message us on WhatsApp at ${site.phone}.\n\nTeam LeadCapp`,
    }).catch(() => {});
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Booking email failed", e);
    return NextResponse.json({ ok: false, error: "send_failed" });
  }
}
