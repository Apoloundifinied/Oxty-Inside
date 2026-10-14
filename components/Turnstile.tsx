"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (widgetId: string) => void;
    };
  }
}

// Widget do Cloudflare Turnstile. Sem site key (dev), renderiza nada e o server
// pula a verificacao com aviso no log.
export function Turnstile({ onToken }: { onToken: (token: string | null) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  const render = () => {
    if (ref.current && window.turnstile && siteKey) {
      window.turnstile.render(ref.current, {
        sitekey: siteKey,
        callback: (token: string) => onToken(token),
        "expired-callback": () => onToken(null),
        language: "pt-BR",
      });
    }
  };

  useEffect(() => {
    if (window.turnstile) render();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteKey]);

  if (!siteKey) return null;

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        onLoad={render}
        strategy="afterInteractive"
      />
      <div ref={ref} className="my-2" />
    </>
  );
}
