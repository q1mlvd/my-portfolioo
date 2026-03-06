import { NextRequest, NextResponse } from "next/server";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const ALLOWED_CHAT_ID = process.env.TELEGRAM_CHAT_ID!;

export async function POST(req: NextRequest) {
  try {
    const { name, contact, message } = await req.json();

    if (!name || !contact || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const text =
      `📩 *Нова заявка з сайту*\n\n` +
      `👤 *Ім'я:* ${name}\n` +
      `📲 *Зв'язок:* ${contact}\n` +
      `💬 *Повідомлення:* ${message}`;

    const res = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: ALLOWED_CHAT_ID,
          text,
          parse_mode: "Markdown",
        }),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      console.error("Telegram API error:", err);
      return NextResponse.json({ error: "Telegram error" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("send-lead error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
