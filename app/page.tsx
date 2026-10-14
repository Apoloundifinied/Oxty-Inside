import Link from "next/link";
import { CityCheck } from "@/components/CityCheck";
import { WaitlistForm } from "@/components/WaitlistForm";
import { trackEvent } from "@/app/actions/waitlist";
import { CONFIG } from "@/lib/config";

export default async function LandingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  await trackEvent({
    kind: "page_view",
    meta: {
      page: "/",
      utm: Object.fromEntries(
        Object.entries(sp).filter(([k]) => k.startsWith("utm_"))
      ),
    },
  });

  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-b from-green-50 to-white">
        <div className="mx-auto max-w-4xl px-4 pb-14 pt-16 sm:pt-24">
          <p className="mb-4 inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
            Para aprovados em concurso público
          </p>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Passou no concurso? Sua nomeação pode sair num diário que você nunca vai ler.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-700">
            A gente lê o Diário Oficial do seu município todos os dias e te avisa no
            Telegram e no e-mail na hora que seu nome aparecer.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Hoje monitoramos ~{CONFIG.COVERAGE_COUNT_APPROX} municípios —{" "}
            <a href="#cidade" className="underline">confira o seu 👇</a>
          </p>

          <div id="cidade" className="mt-8 grid gap-6 lg:grid-cols-2">
            <CityCheck />
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="mb-3 font-semibold">Ou entre direto na lista de espera:</p>
              <WaitlistForm compact />
            </div>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="mx-auto max-w-4xl px-4 py-14">
        <h2 className="text-2xl font-bold">Como funciona</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {[
            {
              n: "1",
              t: "Você cadastra seu nome",
              d: "Aquele nome completo que sai no diário, o órgão e a cidade do seu concurso.",
            },
            {
              n: "2",
              t: "A gente lê o diário todo dia",
              d: "Varrer diário oficial é chato. Por isso a gente faz isso por você, todo santo dia, de madrugada.",
            },
            {
              n: "3",
              t: "Seu nome apareceu? Você fica sabendo",
              d: "Chega um alerta no seu Telegram e no seu e-mail, com o trecho e o link do diário oficial.",
            },
          ].map((s) => (
            <div key={s.n} className="rounded-xl border border-gray-200 p-5">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-100 font-bold text-green-800">
                {s.n}
              </span>
              <h3 className="mt-3 font-semibold">{s.t}</h3>
              <p className="mt-1 text-sm text-gray-600">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Prova real */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 py-14">
          <h2 className="text-2xl font-bold">Isso é real</h2>
          <p className="mt-2 text-gray-700">
            Nomeações assim saem toda semana em diários municipais — e quem perde o prazo
            pode perder a vaga.
          </p>
          <figure className="mt-6 rounded-xl border border-gray-300 bg-white p-5 shadow-sm">
            <span className="mb-3 inline-block rounded bg-amber-100 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800">
              Exemplo real de publicação
            </span>
            <blockquote className="border-l-4 border-gray-300 pl-4 font-mono text-sm leading-relaxed text-gray-800">
              “…RESOLVE <strong>convocar</strong> o candidato aprovado no Concurso Público…
              <strong> MARIVALDO BITTENCOURT DA SILVA</strong> … para comparecer no prazo de
              30 (trinta) dias…”
            </blockquote>
            <figcaption className="mt-3 text-sm text-gray-500">
              Diário Oficial de Ipiaú (BA), 08/10/2026 — encontrado pela mesma busca que usamos.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Preco-ancora */}
      <section className="mx-auto max-w-4xl px-4 py-14 text-center">
        <p className="text-xl font-semibold">
          Vai custar menos que um lanche por mês.
        </p>
        <p className="mt-2 text-gray-600">A lista de espera é de graça.</p>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-4 pb-16">
        <h2 className="text-2xl font-bold">Perguntas de quem está esperando nomeação</h2>
        <div className="mt-6 space-y-4">
          {[
            {
              q: "Cobre o meu município?",
              a: (
                <>
                  Confere no campo lá de cima ou na página{" "}
                  <Link href="/cobertura" className="underline">O que cobrimos</Link>. Se ainda
                  não cobrimos, sua cidade entra na nossa fila de expansão e você é avisado.
                </>
              ),
            },
            {
              q: "E se eu for nomeado e quiser cancelar?",
              a: "Ótimo, é exatamente esse o objetivo. Cancele quando quiser, sem multa e sem conversa fiada.",
            },
            {
              q: "Isso é garantia de que vou ser avisado?",
              a: "É leitura automatizada com alerta, não garantia legal nem assessoria jurídica. O que vale é sempre o Diário Oficial — a gente te entrega o link oficial em cada alerta pra você conferir.",
            },
          ].map((f) => (
            <details key={f.q} className="rounded-xl border border-gray-200 p-4">
              <summary className="cursor-pointer font-medium">{f.q}</summary>
              <p className="mt-2 text-gray-700">{f.a}</p>
            </details>
          ))}
        </div>
        <div className="mt-10 rounded-xl bg-green-600 p-6 text-center text-white">
          <p className="text-xl font-bold">Nunca perca sua nomeação porque o diário saiu numa sexta-feira.</p>
          <div className="mx-auto mt-4 max-w-xl">
            <WaitlistForm compact />
          </div>
        </div>
      </section>
    </main>
  );
}
