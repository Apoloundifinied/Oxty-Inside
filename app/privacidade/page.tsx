import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacidade — Alerta de Convocação" };

export default function PrivacidadePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">Política de Privacidade</h1>
      <div className="mt-6 space-y-4 text-gray-700 leading-relaxed">
        <p>
          Coletamos o mínimo necessário: seu e-mail e, se você quiser, o município do seu
          concurso. Não usamos cookies de rastreamento e nosso analítico é próprio e anônimo
          (contagem de visitas e cliques, sem perfil individual).
        </p>
        <p>
          Quando o produto completo abrir, usaremos seu nome completo apenas para buscar
          publicações nos diários, e CPF apenas em formato parcial (3 primeiros e 2 últimos
          dígitos), como já é publicado nos próprios diários. Nunca guardamos CPF completo.
        </p>
        <p>
          Você pode pedir a exclusão dos seus dados a qualquer momento, conforme a LGPD
          (Lei 13.709/2018): basta responder qualquer e-mail nosso pedindo a remoção.
        </p>
        <p>
          Dados de publicações vêm da API pública do Querido Diário (Open Knowledge Brasil),
          que reúne Diários Oficiais já públicos por natureza.
        </p>
      </div>
    </main>
  );
}
