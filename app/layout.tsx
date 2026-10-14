import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alerta de Convocação — seu nome no Diário Oficial, sem você precisar ler",
  description:
    "A gente lê o Diário Oficial do seu município todos os dias e te avisa no Telegram e no e-mail quando seu nome aparecer. Entre na lista de espera.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        {children}
        <footer className="border-t border-gray-200 bg-gray-50">
          <div className="mx-auto max-w-4xl px-4 py-8 text-sm text-gray-600">
            <p className="mb-3">
              O Alerta de Convocação faz leitura automatizada e envia alertas. Não somos
              assessoria jurídica e nada aqui é aconselhamento legal. O que vale é sempre o
              Diário Oficial publicado pelo ente público.
            </p>
            <p className="mb-3">
              Feito com dados do{" "}
              <a
                href="https://queridodiario.org.br"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-gray-900"
              >
                Querido Diário
              </a>
              , projeto da Open Knowledge Brasil.
            </p>
            <nav className="flex gap-4">
              <Link href="/cobertura" className="underline hover:text-gray-900">O que cobrimos</Link>
              <Link href="/termos" className="underline hover:text-gray-900">Termos</Link>
              <Link href="/privacidade" className="underline hover:text-gray-900">Privacidade</Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
