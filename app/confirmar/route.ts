import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase/server";

// Double opt-in: clique no link do e-mail preenche confirmed_at (doc 06 §3.4).
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin;

  if (token) {
    const db = getServiceClient();
    if (db) {
      const { error } = await db
        .from("waitlist")
        .update({ confirmed_at: new Date().toISOString() })
        .eq("confirm_token", token)
        .is("confirmed_at", null);
      if (error) console.error("[confirmar] update falhou:", error.message);
    }
  }

  return NextResponse.redirect(`${siteUrl}/obrigado`);
}
