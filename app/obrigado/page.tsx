import type { Metadata } from "next";

export const metadata: Metadata = { title: "Tudo certo — Alerta de Convocação" };

export default function ObrigadoPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-20 text-center">
      <p className="text-5xl">🎉</p>
      <h1 className="mt-4 text-3xl font-bold">Tudo certo por aqui!</h1>
      <p className="mt-4 text-lg text-gray-700">
        Seu lugar na lista está confirmado. Quando o produto abrir, você fica sabendo primeiro.
      </p>
      <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-6 text-left">
        <p className="font-semibold">Um pedido rápido (vale ouro pra gente):</p>
        <p className="mt-2 text-gray-700">
          Responde o e-mail de confirmação contando{" "}
          <strong>qual concurso você está esperando</strong> e em qual cidade. É essa resposta
          que decide quais municípios entram primeiro na cobertura — e de quebra ensina sua
          caixa de entrada que nossos e-mails não são spam.
        </p>
      </div>
    </main>
  );
}
