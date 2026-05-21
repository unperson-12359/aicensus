const RESEND_API = "https://api.resend.com/emails";

export async function sendContactNotification(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_NOTIFY_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL || "AiCensus <onboarding@resend.dev>";

  if (!apiKey || !to) return;

  const body = [
    `New contact message on AiCensus`,
    ``,
    `From: ${input.name} <${input.email}>`,
    `Subject: ${input.subject}`,
    ``,
    input.message,
  ].join("\n");

  const response = await fetch(RESEND_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: input.email,
      subject: `[AiCensus contact] ${input.subject} — ${input.name}`,
      text: body,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Resend failed (${response.status}): ${detail}`);
  }
}
