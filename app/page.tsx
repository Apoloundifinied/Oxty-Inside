import Link from "next/link";
import { SignupForm } from "@/components/SignupForm";
import { HeroScene } from "@/components/HeroScene";
import { Reveal } from "@/components/Reveal";
import { Tilt } from "@/components/Tilt";
import { trackEvent } from "@/app/actions/waitlist";
import { coveredCityCount, marqueeCities } from "@/app/actions/coverage";
import { CONFIG } from "@/lib/config";

export const dynamic = "force-dynamic";

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
      utm: Object.fromEntries(Object.entries(sp).filter(([k]) => k.startsWith("utm_"))),
    },
  });

  const coveredCount = (await coveredCityCount()) ?? CONFIG.COVERAGE_COUNT_APPROX;
  const fitaCidades = await marqueeCities();
  const fitaItens = [...fitaCidades, ...fitaCidades, ...fitaCidades, ...fitaCidades];

  return (
    <>
      {/* ===== Hero ===== */}
      <header className="hero" id="cidade">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-center gap-3 font-extrabold text-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/oxty-inside.png" alt="Oxty Inside" width="36" height="20" />
            Oxty Inside
          </div>
          <div className="grid items-center gap-8 pt-11 lg:grid-cols-2">
            <div>
              <h1 className="text-[clamp(2.2rem,4.8vw,3.6rem)]">
                Passou no concurso? Sua nomeação pode sair num diário que você nunca vai ler.
              </h1>
              <p className="mt-4 max-w-[30em] text-lg" style={{ color: "#dce4ff" }}>
                A gente lê o Diário Oficial do seu município todos os dias e te avisa por
                e-mail na hora que seu nome aparecer.
              </p>
              <p className="mt-2 text-[0.95rem]" style={{ color: "#b8c6f5" }}>
                Hoje monitoramos <b>{coveredCount.toLocaleString("pt-BR")}</b> municípios.
              </p>
              <SignupForm />
            </div>
            <HeroScene />
          </div>
        </div>
      </header>

      {/* ===== Fita de cidades ===== */}
      <div className="fita" aria-hidden="true">
        <div>
          {fitaItens.map((c, i) => (
            <span key={i}>Lido hoje: {c}</span>
          ))}
        </div>
      </div>

      <main>
        {/* ===== Como funciona ===== */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <Reveal>
            <h2 className="max-w-[18em] text-[clamp(1.7rem,3.6vw,2.6rem)]">
              Nomeações assim saem toda semana. Quem perde o prazo pode perder a vaga.
            </h2>
            <p className="mt-3 max-w-[34em]" style={{ color: "var(--color-mudo)" }}>
              Ninguém lê diário oficial todo dia. Nós lemos, e o trecho real é esse que você
              viu ali em cima.
            </p>
          </Reveal>
          <Reveal className="mt-10">
            <div className="cards-3col">
              {[
                {
                  n: "1",
                  t: "Escolha a cidade",
                  d: "Diga o município do concurso e confirme seu e-mail.",
                },
                {
                  n: "2",
                  t: "Nós lemos os diários",
                  d: "Todos os dias, em todos os municípios monitorados.",
                },
                {
                  n: "3",
                  t: "Você é avisado",
                  d: "Se seu nome aparecer numa convocação, o alerta chega na hora, com o trecho do diário.",
                },
              ].map((s) => (
                <Tilt key={s.n} className="card-tilt" max={10}>
                  <div className="card-num">{s.n}</div>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                </Tilt>
              ))}
            </div>
          </Reveal>
        </section>

        {/* ===== Seção: a cobertura cresce sozinha ===== */}
        <section style={{ background: "#fff", padding: "84px 0" }}>
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 lg:grid-cols-2">
            <Reveal>
              <h2 className="max-w-[16em] text-[clamp(1.7rem,3.6vw,2.6rem)]">
                Esse número não para de crescer.
              </h2>
              <p className="mt-4 max-w-[34em]" style={{ color: "var(--color-mudo)" }}>
                Os {coveredCount.toLocaleString("pt-BR")} municípios de hoje não são um teto.
                São o retrato de agora.
              </p>
              <p className="mt-4 max-w-[34em]" style={{ color: "var(--color-mudo)" }}>
                Nossa leitura é feita sobre o Querido Diário, projeto da Open Knowledge
                Brasil que liga coletores novos de diário oficial toda semana. A cada cidade
                que entra lá, ela entra aqui automaticamente — sem você precisar pedir, sem
                a gente precisar mexer em nada.
              </p>
              <p className="mt-4 max-w-[34em]" style={{ color: "var(--color-mudo)" }}>
                E se a sua cidade ainda não tem coletor, isso não é um beco sem saída: sua
                entrada na lista vira prioridade real na fila de expansão. As cidades mais
                pedidas são as primeiras que a gente corre atrás.
              </p>
            </Reveal>
            <Reveal>
              <div
                className="rounded-2xl p-8"
                style={{ background: "var(--color-az)", color: "#fff", boxShadow: "0 24px 50px rgba(10,31,102,.25)" }}
              >
                <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: "#b8c6f5" }}>
                  Municípios monitorados hoje
                </p>
                <p className="mt-2 text-[3.6rem] font-extrabold leading-none tabular-nums">
                  {coveredCount.toLocaleString("pt-BR")}
                </p>
                <p className="mt-3 text-sm" style={{ color: "#dce4ff" }}>
                  Atualizado automaticamente a cada semana. Na semana passada eram menos —
                  e na próxima, provavelmente serão mais.
                </p>
                <Link
                  href="/cobertura"
                  className="mt-6 inline-block rounded-[10px] px-5 py-3 font-bold"
                  style={{ background: "var(--color-am)", color: "var(--color-tx)" }}
                >
                  Ver a lista completa
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ===== Preco-ancora ===== */}
        <section className="preco">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <h2 className="text-[clamp(1.7rem,3.6vw,2.6rem)]">Menos que um lanche por mês.</h2>
            </Reveal>
            <Reveal className="mt-9">
              <div className="grid max-w-[760px] gap-6 sm:grid-cols-2" style={{ perspective: "900px" }}>
                <Tilt className="plano" max={8}>
                  <small className="block font-semibold opacity-80">Mensal</small>
                  <div className="v">R$ 9,90<span>/mês</span></div>
                  <p className="mt-2 text-[0.95rem] opacity-85">Cancele quando quiser.</p>
                </Tilt>
                <Tilt className="plano dark" max={8}>
                  <small className="block font-semibold opacity-80">Anual</small>
                  <div className="v">R$ 49<span>/ano</span></div>
                  <p className="mt-2 text-[0.95rem] opacity-85">Equivale a R$ 4,08 por mês.</p>
                </Tilt>
              </div>
            </Reveal>
            <p className="mt-6 font-semibold">
              Entrar na lista é grátis, sem cartão. Você só paga se decidir assinar.
            </p>
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <section className="mx-auto max-w-3xl px-6 py-20">
          <Reveal>
            <h2 className="mb-6 text-[clamp(1.7rem,3.6vw,2.6rem)]">
              Perguntas de quem está esperando nomeação
            </h2>
            {[
              {
                q: "Cobre o meu município?",
                a: `Hoje monitoramos ${coveredCount.toLocaleString("pt-BR")} municípios. Digite o seu no formulário lá em cima: se ainda não estiver na lista, você entra na fila e avisamos quando ele for incluído. A lista completa está em “O que cobrimos”.`,
              },
              {
                q: "Funciona para concurso estadual ou federal?",
                a: "Por enquanto lemos apenas diários oficiais municipais.",
              },
              {
                q: "Isso é garantia de que vou ser avisado?",
                a: "Não. Avisamos quando encontramos seu nome nos diários que lemos, mas falhas de publicação, de digitalização ou de grafia do nome podem acontecer. Use o alerta como reforço e continue acompanhando o site oficial do seu concurso.",
              },
              {
                q: "E se eu for nomeado e quiser cancelar?",
                a: "Ótimo, é exatamente esse o objetivo. Você cancela quando quiser, sem multa e sem conversa fiada.",
              },
              {
                q: "O que acontece depois que eu entro na lista?",
                a: "Você recebe um e-mail para confirmar o cadastro. Quando abrirmos as assinaturas, avisamos você primeiro.",
              },
            ].map((f) => (
              <details
                key={f.q}
                className="mb-2.5 rounded-xl bg-white"
                style={{ boxShadow: "0 4px 14px rgba(10,31,102,.08)" }}
              >
                <summary className="cursor-pointer px-5 py-4 font-semibold">{f.q}</summary>
                <p className="px-5 pb-4" style={{ color: "var(--color-mudo)" }}>
                  {f.a}
                </p>
              </details>
            ))}
          </Reveal>
        </section>

        {/* ===== CTA final ===== */}
        <section className="mx-auto max-w-6xl px-6 pb-20">
          <Reveal>
            <div className="final">
              <h2 className="mx-auto max-w-[18em] text-[clamp(1.7rem,3.6vw,2.6rem)]">
                Nunca perca sua nomeação porque o diário saiu numa sexta-feira.
              </h2>
              <div className="mx-auto mt-7 max-w-[440px] text-left">
                <SignupForm />
              </div>
            </div>
          </Reveal>
        </section>
      </main>
    </>
  );
}
