// Validacao server-side do Cloudflare Turnstile (doc 05 §4).
export async function verifyTurnstile(token: string | null | undefined): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    // dev sem chave: nao bloqueia, mas deixa rastro
    console.warn("[turnstile] TURNSTILE_SECRET_KEY ausente — verificacao pulada (somente dev)");
    return true;
  }
  if (!token) return false;
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token }),
  });
  if (!res.ok) return false;
  const data = (await res.json()) as { success?: boolean };
  return data.success === true;
}
