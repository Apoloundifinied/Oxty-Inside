// Resend via API REST, sem SDK (doc 05 §2). Falhas nunca quebram o fluxo do usuario.
export async function sendEmail(input: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) {
    console.warn("[resend] sem RESEND_API_KEY/EMAIL_FROM — e-mail nao enviado (somente dev)", input.subject);
    return { ok: false, error: "not_configured" };
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
      body: JSON.stringify({ from, to: input.to, subject: input.subject, html: input.html }),
    });
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "unknown" };
  }
}

export function waitlistConfirmEmail(confirmUrl: string): { subject: string; html: string } {
  return {
    subject: "Confirma seu lugar na lista de espera ✅",
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; line-height: 1.6; color: #1f2937">
        <p>Oi! Recebemos seu pedido pra entrar na lista de espera do <strong>Oxty Inside</strong>.</p>
        <p>Falta só um clique pra confirmar seu e-mail:</p>
        <p style="text-align: center; margin: 32px 0">
          <a href="${confirmUrl}" style="background: #0a1f66; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600">Confirmar meu e-mail</a>
        </p>
        <p style="color: #6b7280; font-size: 14px">Se não foi você, pode ignorar este e-mail.</p>
      </div>
    `,
  };
}
