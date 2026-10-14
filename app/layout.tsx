import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Oxty Inside — seu nome no diário, no seu e-mail",
  description:
    "A gente lê o Diário Oficial do seu município todos os dias e te avisa por e-mail quando seu nome aparecer. Entre na lista de espera.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;800&family=Newsreader:wght@400;600&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/oxty-inside.svg" type="image/svg+xml" />
        <script
          dangerouslySetInnerHTML={{ __html: 'document.documentElement.classList.add("js")' }}
        />
      </head>
      <body className="min-h-screen antialiased">
        {children}
        <footer style={{ borderTop: "1px solid #dfe4f0", background: "#fff" }}>
          <div className="mx-auto max-w-4xl px-6 py-10 text-sm" style={{ color: "var(--color-mudo)" }}>
            <p className="mb-3">
              O Oxty Inside faz leitura automatizada de diários oficiais e envia alertas por
              e-mail. Não somos assessoria jurídica e nada aqui é aconselhamento legal. Vale
              sempre a publicação oficial do ente público.
            </p>
            <p className="mb-3">
              Feito com dados do{" "}
              <a
                href="https://queridodiario.org.br"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Querido Diário
              </a>
              , projeto da Open Knowledge Brasil.
            </p>
            <nav className="flex gap-4">
              <Link href="/cobertura" className="underline">O que cobrimos</Link>
              <Link href="/termos" className="underline">Termos</Link>
              <Link href="/privacidade" className="underline">Privacidade</Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
