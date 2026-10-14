import type { Metadata } from "next";

export const metadata: Metadata = { title: "Termos de Uso — Oxty Inside" };

export default function TermosPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">Termos de Uso</h1>
      <div className="mt-6 space-y-4 text-gray-700 leading-relaxed">
        <p>
          O Oxty Inside monitora publicações em Diários Oficiais municipais e envia
          alertas quando termos relacionados ao seu nome aparecem. É uma ferramenta de leitura
          automatizada e notificação.
        </p>
        <p>
          <strong>Não somos assessoria jurídica.</strong> Nenhum conteúdo deste site ou dos
          alertas constitui aconselhamento legal. O que produz efeitos é exclusivamente o
          Diário Oficial publicado pelo ente público. Confira sempre a publicação original no
          link oficial que acompanha cada alerta.
        </p>
        <p>
          A cobertura depende da disponibilidade dos diários na base do Querido Diário e é
          declarada com transparência na página "O que cobrimos". Não garantimos cobertura
          total dos municípios brasileiros.
        </p>
        <p>
          Cadastro na lista de espera é gratuito. Ao entrar, você concorda em receber e-mails
          transacionais sobre o produto (confirmação, abertura de vagas, avisos de cobertura).
        </p>
      </div>
    </main>
  );
}
